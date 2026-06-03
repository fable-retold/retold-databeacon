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
 *     OrderBy: ['PaymentTerms']                      // optional
 *   }
 *
 * Function whitelist: Sum | Count | Mean (alias of Avg) | Avg | Min | Max
 *
 * Identifier safety: every Table / GroupBy / Aggregate.Source / Aggregate.As
 * must match /^[A-Za-z_][A-Za-z0-9_]*$/, with the single exception of '*'
 * (legal only as Aggregate.Source for Count). Anything else throws.
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

const isValidIdentifier = (pId) =>
{
	return typeof(pId) === 'string' && IDENTIFIER_RE.test(pId);
};

const buildAggregateSQL = (pType, pSpec) =>
{
	let tmpQuote = DIALECT_QUOTE[pType];
	if (!tmpQuote)
	{
		throw new Error('Aggregate: unsupported dialect "' + pType + '". Expected PostgreSQL | SQLite | MySQL | MSSQL | Oracle.');
	}

	let tmpSpec = pSpec || {};

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
	}

	let tmpGroupBySQL = tmpGroupBy.map(tmpQuote);
	let tmpSelectSQL = tmpGroupBySQL.concat(tmpAggregateSQLParts).join(', ');

	let tmpSQL = 'SELECT ' + tmpSelectSQL + ' FROM ' + tmpQuote(tmpSpec.Table);

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

	return tmpSQL;
};

module.exports = { buildAggregateSQL, isValidIdentifier, DIALECT_QUOTE, FUNCTION_MAP };
