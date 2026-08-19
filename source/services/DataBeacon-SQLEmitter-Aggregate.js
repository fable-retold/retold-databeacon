/**
 * DataBeacon -- SQL Emitter for Aggregate queries
 *
 * Translates a structured aggregate spec into dialect-specific SQL.
 * Used by the DataBeaconAccess.Aggregate capability action and exported
 * for direct unit testing.
 *
 * Spec shape:
 *   {
 *     Table: 'CustomerMirror',                       // identifier
 *     GroupBy: ['PaymentTerms', 'Region'],           // identifiers
 *     Aggregates: [
 *       { Source: 'IDCustomer',    Function: 'Count', As: 'CustomerCount' },
 *       { Source: 'CreditLimit',   Function: 'Sum',   As: 'CreditTotal'   },
 *       { Source: '*',             Function: 'Count', As: 'RowCount'      }
 *     ],
 *     Filter: [                                      // optional; see below
 *       { Column: 'Action', Operator: '!=', Value: 'DELETE' }
 *     ],
 *     OrderBy: ['PaymentTerms']                      // optional
 *   }
 *
 * Function whitelist: Sum | Count | Mean (alias of Avg) | Avg | Min | Max
 *
 * Filter shape — an ordered array of predicate and grouping terms, joined into
 * a WHERE clause that runs BEFORE the GROUP BY (it restricts which source rows
 * enter a group, which is the only thing this emitter can do safely):
 *
 *   { Column: 'Action', Operator: '!=', Value: 'DELETE', Connector: 'AND' }
 *   { Operator: '(' } / { Operator: ')' }            // grouping, Column ignored
 *
 * Operator whitelist (SQL tokens, case-insensitive; '<>' normalizes to '!='):
 *   = != <> > >= < <= LIKE | NOT LIKE | IN | NOT IN | IS NULL | IS NOT NULL
 * Deliberately NOT the meadow-filter mnemonics — meadow's 'IN' means IS NULL
 * while SQL's means a value list, and one token that means two things at a
 * safety boundary is how the wrong rows get aggregated. Callers holding a
 * meadow filter string translate it first (retold-data-mapper's
 * DataMapper-MeadowFilter-Translator does this).
 *
 * IN / NOT IN take an Array Value (or a comma-delimited string); IS NULL and
 * IS NOT NULL take none. Connector defaults to AND and is ignored on the first
 * term and immediately after an open paren.
 *
 * Values are NEVER interpolated — each becomes a positional placeholder
 * ($1 / ? / @p1 / :1 by dialect) and is returned in Params for the driver to
 * bind. Filtering on an Aggregates[].As alias throws: that would be HAVING,
 * which this emitter does not emit.
 *
 * Identifier safety: every Table / GroupBy / Aggregate.Source / Aggregate.As /
 * Filter.Column must match /^[A-Za-z_][A-Za-z0-9_]*$/, with the single
 * exception of '*' (legal only as Aggregate.Source for Count). Anything else
 * throws. Unknown top-level spec keys throw as well, so a caller who guesses a
 * filter key name gets an error instead of silently unfiltered rows.
 *
 * Returns: { SQL: string, Params: Array }
 *
 * @author Steven Velozo <steven@velozo.com>
 * @license MIT
 */

const IDENTIFIER_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;

const FUNCTION_MAP = {
	'sum':   'SUM',
	'count': 'COUNT',
	'mean':  'AVG',
	'avg':   'AVG',
	'min':   'MIN',
	'max':   'MAX'
};

const DIALECT_QUOTE = {
	'PostgreSQL': (pId) => '"' + pId + '"',
	'SQLite':     (pId) => '"' + pId + '"',
	'MySQL':      (pId) => '`' + pId + '`',
	'MSSQL':      (pId) => '[' + pId + ']',
	'Oracle':     (pId) => '"' + pId + '"'
};

// 1-based positional placeholder per dialect. MSSQL's @pN matches the names
// SchemaIntrospector._runQuery binds with (tmpRequest.input('p' + (i + 1))).
const DIALECT_PARAM_PLACEHOLDER = {
	'PostgreSQL': (pIndex) => '$' + pIndex,
	'SQLite':     () => '?',
	'MySQL':      () => '?',
	'MSSQL':      (pIndex) => '@p' + pIndex,
	'Oracle':     (pIndex) => ':' + pIndex
};

const SPEC_KEYS = ['Table', 'GroupBy', 'Aggregates', 'Filter', 'OrderBy'];

const FILTER_OPERATORS = {
	'=':            '=',
	'!=':           '!=',
	'<>':           '!=',
	'>':            '>',
	'>=':           '>=',
	'<':            '<',
	'<=':           '<=',
	'LIKE':         'LIKE',
	'NOT LIKE':     'NOT LIKE',
	'IN':           'IN',
	'NOT IN':       'NOT IN',
	'IS NULL':      'IS NULL',
	'IS NOT NULL':  'IS NOT NULL'
};

const LIST_OPERATORS = { 'IN': true, 'NOT IN': true };
const VALUELESS_OPERATORS = { 'IS NULL': true, 'IS NOT NULL': true };

const isValidIdentifier = (pId) =>
{
	return typeof(pId) === 'string' && IDENTIFIER_RE.test(pId);
};

const normalizeFilterOperator = (pOperator) =>
{
	if (typeof(pOperator) !== 'string')
	{
		return null;
	}
	let tmpTrimmed = pOperator.trim();
	if (tmpTrimmed === '(' || tmpTrimmed === ')')
	{
		return tmpTrimmed;
	}
	// Collapse internal whitespace so 'IS  NOT  NULL' reads the same as
	// 'IS NOT NULL'.
	let tmpKey = tmpTrimmed.toUpperCase().replace(/\s+/g, ' ');
	return FILTER_OPERATORS[tmpKey] || null;
};

const assertScalarFilterValue = (pValue, pIndex) =>
{
	if (pValue === undefined || pValue === null)
	{
		throw new Error('Aggregate: Filter[' + pIndex + '].Value is required — use Operator "IS NULL" / "IS NOT NULL" to test for null.');
	}
	let tmpType = typeof(pValue);
	if (tmpType !== 'string' && tmpType !== 'number' && tmpType !== 'boolean')
	{
		throw new Error('Aggregate: Filter[' + pIndex + '].Value must be a string, number, or boolean (got ' + JSON.stringify(pValue) + ').');
	}
};

/**
 * Translate a structured Filter array into a parameterized WHERE clause.
 *
 * @param {function} pQuote - dialect identifier quoter
 * @param {function} pPlaceholder - dialect positional placeholder generator
 * @param {Array} pFilter - the spec's Filter array
 * @param {Object} pAggregateAliases - map of Aggregates[].As names, for the HAVING guard
 * @param {Array} pParams - collector, appended to in emission order
 *
 * @return {string} the WHERE clause including its leading ' WHERE', or '' when there are no terms
 */
const buildFilterSQL = (pQuote, pPlaceholder, pFilter, pAggregateAliases, pParams) =>
{
	let tmpWhere = '';
	let tmpDepth = 0;
	// True while the next term starts a clause — at the very beginning and
	// straight after an open paren — where a leading AND/OR would be a syntax
	// error rather than a connector.
	let tmpSuppressConnector = true;

	for (let i = 0; i < pFilter.length; i++)
	{
		let tmpTerm = pFilter[i] || {};
		let tmpOperator = normalizeFilterOperator(tmpTerm.Operator);
		if (!tmpOperator)
		{
			throw new Error('Aggregate: Filter[' + i + '].Operator must be one of ' + Object.keys(FILTER_OPERATORS).join(' | ') + ' | ( | ) (got ' + JSON.stringify(tmpTerm.Operator) + ').');
		}

		if (tmpOperator === ')')
		{
			if (tmpDepth < 1)
			{
				throw new Error('Aggregate: Filter[' + i + '] closes a group that was never opened.');
			}
			if (tmpSuppressConnector)
			{
				throw new Error('Aggregate: Filter[' + i + '] closes an empty group.');
			}
			tmpDepth--;
			tmpWhere += ' )';
			tmpSuppressConnector = false;
			continue;
		}

		if (!tmpSuppressConnector)
		{
			let tmpConnector = (tmpTerm.Connector === undefined || tmpTerm.Connector === null || tmpTerm.Connector === '')
				? 'AND'
				: String(tmpTerm.Connector).trim().toUpperCase();
			if (tmpConnector !== 'AND' && tmpConnector !== 'OR')
			{
				throw new Error('Aggregate: Filter[' + i + '].Connector must be AND or OR (got ' + JSON.stringify(tmpTerm.Connector) + ').');
			}
			tmpWhere += ' ' + tmpConnector;
		}

		if (tmpOperator === '(')
		{
			tmpDepth++;
			tmpWhere += ' (';
			tmpSuppressConnector = true;
			continue;
		}

		if (!isValidIdentifier(tmpTerm.Column))
		{
			throw new Error('Aggregate: Filter[' + i + '].Column must be a simple identifier (got ' + JSON.stringify(tmpTerm.Column) + ').');
		}
		if (pAggregateAliases[tmpTerm.Column])
		{
			throw new Error('Aggregate: Filter[' + i + '].Column "' + tmpTerm.Column + '" is an aggregate output alias — filtering it would require HAVING, which this emitter does not support. Filter on a source column instead.');
		}

		let tmpColumnSQL = pQuote(tmpTerm.Column);

		if (VALUELESS_OPERATORS[tmpOperator])
		{
			tmpWhere += ' ' + tmpColumnSQL + ' ' + tmpOperator;
			tmpSuppressConnector = false;
			continue;
		}

		if (LIST_OPERATORS[tmpOperator])
		{
			let tmpValues = tmpTerm.Value;
			if (typeof(tmpValues) === 'string')
			{
				tmpValues = tmpValues.split(',');
			}
			if (!Array.isArray(tmpValues) || tmpValues.length === 0)
			{
				throw new Error('Aggregate: Filter[' + i + '].Value must be a non-empty array (or comma-delimited string) for ' + tmpOperator + ' (got ' + JSON.stringify(tmpTerm.Value) + ').');
			}
			let tmpValuePlaceholders = [];
			for (let v = 0; v < tmpValues.length; v++)
			{
				assertScalarFilterValue(tmpValues[v], i);
				pParams.push(tmpValues[v]);
				tmpValuePlaceholders.push(pPlaceholder(pParams.length));
			}
			tmpWhere += ' ' + tmpColumnSQL + ' ' + tmpOperator + ' (' + tmpValuePlaceholders.join(', ') + ')';
			tmpSuppressConnector = false;
			continue;
		}

		assertScalarFilterValue(tmpTerm.Value, i);
		pParams.push(tmpTerm.Value);
		tmpWhere += ' ' + tmpColumnSQL + ' ' + tmpOperator + ' ' + pPlaceholder(pParams.length);
		tmpSuppressConnector = false;
	}

	if (tmpDepth !== 0)
	{
		throw new Error('Aggregate: Filter has ' + tmpDepth + ' unclosed group(s) — every "(" needs a matching ")".');
	}
	if (tmpWhere === '')
	{
		return '';
	}

	return ' WHERE' + tmpWhere;
};

const buildAggregateSQL = (pType, pSpec) =>
{
	let tmpQuote = DIALECT_QUOTE[pType];
	if (!tmpQuote)
	{
		throw new Error('Aggregate: unsupported dialect "' + pType + '". Expected PostgreSQL | SQLite | MySQL | MSSQL | Oracle.');
	}

	let tmpPlaceholder = DIALECT_PARAM_PLACEHOLDER[pType];

	let tmpSpec = pSpec || {};

	// An unrecognized key is almost always a caller reaching for a filter under
	// a name this emitter doesn't read. Silently ignoring it returns every
	// source row under the guise of a restricted aggregate, so it throws.
	let tmpUnknownKeys = Object.keys(tmpSpec).filter((pKey) => SPEC_KEYS.indexOf(pKey) < 0);
	if (tmpUnknownKeys.length > 0)
	{
		throw new Error('Aggregate: unknown spec key(s) [' + tmpUnknownKeys.join(', ') + ']. Expected ' + SPEC_KEYS.join(' | ') + '.');
	}

	if (!isValidIdentifier(tmpSpec.Table))
	{
		throw new Error('Aggregate: Table is required and must be a simple identifier (got ' + JSON.stringify(tmpSpec.Table) + ').');
	}

	let tmpGroupBy = Array.isArray(tmpSpec.GroupBy) ? tmpSpec.GroupBy : [];
	for (let i = 0; i < tmpGroupBy.length; i++)
	{
		if (!isValidIdentifier(tmpGroupBy[i]))
		{
			throw new Error('Aggregate: GroupBy[' + i + '] must be a simple identifier (got ' + JSON.stringify(tmpGroupBy[i]) + ').');
		}
	}

	let tmpAggregates = Array.isArray(tmpSpec.Aggregates) ? tmpSpec.Aggregates : [];
	if (tmpAggregates.length === 0)
	{
		throw new Error('Aggregate: at least one Aggregate is required.');
	}

	let tmpAggregateSQLParts = [];
	let tmpAggregateAliases = {};
	for (let i = 0; i < tmpAggregates.length; i++)
	{
		let tmpA = tmpAggregates[i] || {};
		// Accept both keyings — Function/Source from the explicit spec
		// and Op/Column from the existing in-memory Aggregation config
		// (so the same OperationConfiguration shape works for both
		// OperationType=Aggregation and OperationType=SQLAggregate).
		let tmpFnKey = (tmpA.Function || tmpA.Op || '').toString().toLowerCase();
		let tmpFnSQL = FUNCTION_MAP[tmpFnKey];
		if (!tmpFnSQL)
		{
			throw new Error('Aggregate: Aggregates[' + i + '].Function must be one of Sum|Count|Mean|Avg|Min|Max (got ' + JSON.stringify(tmpA.Function || tmpA.Op) + ').');
		}
		if (!isValidIdentifier(tmpA.As))
		{
			throw new Error('Aggregate: Aggregates[' + i + '].As is required and must be a simple identifier (got ' + JSON.stringify(tmpA.As) + ').');
		}
		let tmpSource = (tmpA.Source !== undefined) ? tmpA.Source : tmpA.Column;
		let tmpSourceSQL;
		if (tmpSource === '*')
		{
			if (tmpFnSQL !== 'COUNT')
			{
				throw new Error('Aggregate: Aggregates[' + i + '].Source="*" is only valid with Function=Count.');
			}
			tmpSourceSQL = '*';
		}
		else
		{
			if (!isValidIdentifier(tmpSource))
			{
				throw new Error('Aggregate: Aggregates[' + i + '].Source must be a simple identifier or "*" (got ' + JSON.stringify(tmpSource) + ').');
			}
			tmpSourceSQL = tmpQuote(tmpSource);
		}
		tmpAggregateSQLParts.push(tmpFnSQL + '(' + tmpSourceSQL + ') AS ' + tmpQuote(tmpA.As));
		tmpAggregateAliases[tmpA.As] = true;
	}

	let tmpGroupBySQL = tmpGroupBy.map(tmpQuote);
	let tmpSelectSQL = tmpGroupBySQL.concat(tmpAggregateSQLParts).join(', ');

	let tmpSQL = 'SELECT ' + tmpSelectSQL + ' FROM ' + tmpQuote(tmpSpec.Table);

	let tmpParams = [];
	if (tmpSpec.Filter !== undefined && tmpSpec.Filter !== null)
	{
		if (!Array.isArray(tmpSpec.Filter))
		{
			throw new Error('Aggregate: Filter must be an array of { Column, Operator, Value } terms (got ' + JSON.stringify(tmpSpec.Filter) + ').');
		}
		if (tmpSpec.Filter.length === 0)
		{
			throw new Error('Aggregate: Filter was supplied but is empty — omit the key entirely to aggregate the whole table.');
		}
		tmpSQL += buildFilterSQL(tmpQuote, tmpPlaceholder, tmpSpec.Filter, tmpAggregateAliases, tmpParams);
	}

	if (tmpGroupBy.length > 0)
	{
		tmpSQL += ' GROUP BY ' + tmpGroupBySQL.join(', ');
	}

	let tmpOrderBy = Array.isArray(tmpSpec.OrderBy) ? tmpSpec.OrderBy : [];
	if (tmpOrderBy.length > 0)
	{
		let tmpOrderParts = [];
		for (let i = 0; i < tmpOrderBy.length; i++)
		{
			if (!isValidIdentifier(tmpOrderBy[i]))
			{
				throw new Error('Aggregate: OrderBy[' + i + '] must be a simple identifier (got ' + JSON.stringify(tmpOrderBy[i]) + ').');
			}
			tmpOrderParts.push(tmpQuote(tmpOrderBy[i]));
		}
		tmpSQL += ' ORDER BY ' + tmpOrderParts.join(', ');
	}

	return { SQL: tmpSQL, Params: tmpParams };
};

module.exports = { buildAggregateSQL, isValidIdentifier, DIALECT_QUOTE, DIALECT_PARAM_PLACEHOLDER, FUNCTION_MAP, FILTER_OPERATORS };
