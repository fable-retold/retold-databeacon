/**
 * DataBeacon -- SQL Emitter for paged INNER JOIN queries
 *
 * Translates a structured join spec into dialect-specific SQL with keyset
 * (cursor) pagination. The OrderBy column must be UNIQUE — typically the
 * source-table primary key. Keyset is O(N) total across the full scan
 * versus LIMIT/OFFSET's O(N²/page_size) (postgres rescans <offset> rows
 * on every page). At 2.5M rows / page_size 5000, that is the difference
 * between ~50 minutes and a few minutes.
 *
 * Spec shape (keyset mode — preferred):
 *   {
 *     Table:        'SalesOrderLineMirror',
 *     RelatedTable: 'SalesOrderMirror',
 *     JoinOn:       { SourceField: 'IDSalesOrder', RelatedField: 'IDSalesOrder' },
 *     Projection:   { IDSalesOrderLine: '{~D:Record.IDSalesOrderLine~}', ... },
 *     OrderBy:      'IDSalesOrderLine',     // required; MUST be UNIQUE on src
 *     Limit:        500,                    // optional; defaults to 500
 *     AfterValue:   <last seen OrderBy>     // null on first page; cursor on next
 *   }
 *
 * Pagination model:
 *   - First page (keyset): pass AfterValue=null. No WHERE clause emitted.
 *   - Subsequent pages (keyset): pass AfterValue=<OrderBy column value of last row>.
 *     Emits "WHERE src.<OrderBy> > <param>" with a dialect-specific placeholder
 *     ($1 / ? / @p1) and returns the value in Params.
 *   - Legacy Offset path is preserved for backward compatibility — emit when
 *     AfterValue is omitted and Offset is provided. Mutually exclusive with
 *     AfterValue. Offset is O(N²) at scale; prefer AfterValue.
 *
 * Cursor column:
 *   In keyset mode the emitter always prepends "src.<OrderBy> AS <CursorField>"
 *   as the FIRST projected column, so the streaming caller can read the cursor
 *   value from the last row of each page without requiring callers to thread
 *   the OrderBy column into Projection. If Projection already includes
 *   {~D:Record.<OrderBy>~} under some target name, that target is reused as
 *   the cursor field — no extra column is added. Otherwise the sentinel name
 *   "_dbkj_cursor" is used. Returned as CursorField in the result.
 *
 * Projection rules — every value must be exactly one of:
 *   - '{~D:Record.<field>~}'   → src."<field>" AS "<targetCol>"
 *   - '{~D:Related.<field>~}'  → rel."<field>" AS "<targetCol>"
 * Anything else (static strings, computed expressions, multiple substitutions)
 * is rejected — those projections can't be pushed down and should run through
 * the in-memory Intersection layout instead.
 *
 * Identifier safety: every Table / RelatedTable / JoinOn field / Projection
 * key / Projection target field / OrderBy must match the simple-identifier
 * regex from the Aggregate emitter. Anything else throws.
 *
 * Returns: { SQL: string, Params: Array, CursorField: string|null }
 *
 * @author Steven Velozo <steven@velozo.com>
 * @license MIT
 */

const { isValidIdentifier, DIALECT_QUOTE } = require('./DataBeacon-SQLEmitter-Aggregate.js');

const RECORD_FIELD_RE  = /^\{~D:Record\.([A-Za-z_][A-Za-z0-9_]*)~\}$/;
const RELATED_FIELD_RE = /^\{~D:Related\.([A-Za-z_][A-Za-z0-9_]*)~\}$/;

const KEYSET_CURSOR_ALIAS = '_dbkj_cursor';

const DIALECT_PARAM_PLACEHOLDER = {
	'PostgreSQL': () => '$1',
	'SQLite':     () => '?',
	'MySQL':      () => '?',
	'MSSQL':      () => '@p1',
	'Oracle':     () => ':1'
};

const buildJoinPagedSQL = (pType, pSpec) =>
{
	let tmpQuote = DIALECT_QUOTE[pType];
	if (!tmpQuote)
	{
		throw new Error('Join: unsupported dialect "' + pType + '". Expected PostgreSQL | SQLite | MySQL | MSSQL | Oracle.');
	}

	let tmpSpec = pSpec || {};

	if (!isValidIdentifier(tmpSpec.Table))
	{
		throw new Error('Join: Table is required and must be a simple identifier (got ' + JSON.stringify(tmpSpec.Table) + ').');
	}
	if (!isValidIdentifier(tmpSpec.RelatedTable))
	{
		throw new Error('Join: RelatedTable is required and must be a simple identifier (got ' + JSON.stringify(tmpSpec.RelatedTable) + ').');
	}

	let tmpJoinOn = tmpSpec.JoinOn || {};
	if (!isValidIdentifier(tmpJoinOn.SourceField))
	{
		throw new Error('Join: JoinOn.SourceField is required and must be a simple identifier (got ' + JSON.stringify(tmpJoinOn.SourceField) + ').');
	}
	if (!isValidIdentifier(tmpJoinOn.RelatedField))
	{
		throw new Error('Join: JoinOn.RelatedField is required and must be a simple identifier (got ' + JSON.stringify(tmpJoinOn.RelatedField) + ').');
	}

	let tmpProjection = tmpSpec.Projection || {};
	let tmpProjKeys = Object.keys(tmpProjection);
	if (tmpProjKeys.length === 0)
	{
		throw new Error('Join: Projection is required (non-empty object of {targetCol: "{~D:Record.X~}"} or "{~D:Related.X~}").');
	}

	let tmpSelectParts = [];
	for (let i = 0; i < tmpProjKeys.length; i++)
	{
		let tmpTargetCol = tmpProjKeys[i];
		if (!isValidIdentifier(tmpTargetCol))
		{
			throw new Error('Join: Projection key [' + JSON.stringify(tmpTargetCol) + '] must be a simple identifier.');
		}
		let tmpExpr = tmpProjection[tmpTargetCol];
		if (typeof(tmpExpr) !== 'string')
		{
			throw new Error('Join: Projection[' + tmpTargetCol + '] must be a string of the form "{~D:Record.X~}" or "{~D:Related.X~}" (got ' + JSON.stringify(tmpExpr) + ').');
		}
		let tmpRecMatch = tmpExpr.match(RECORD_FIELD_RE);
		let tmpRelMatch = tmpExpr.match(RELATED_FIELD_RE);
		if (tmpRecMatch)
		{
			tmpSelectParts.push('src.' + tmpQuote(tmpRecMatch[1]) + ' AS ' + tmpQuote(tmpTargetCol));
		}
		else if (tmpRelMatch)
		{
			tmpSelectParts.push('rel.' + tmpQuote(tmpRelMatch[1]) + ' AS ' + tmpQuote(tmpTargetCol));
		}
		else
		{
			throw new Error('Join: Projection[' + tmpTargetCol + '] must be exactly "{~D:Record.<field>~}" or "{~D:Related.<field>~}" (got ' + JSON.stringify(tmpExpr) + ').');
		}
	}

	// OrderBy is required — paged JOINs without a stable ORDER BY can return
	// the same row on multiple pages once the planner switches strategies
	// (postgres LIMIT/OFFSET overlap, same bug class we saw at 100x clones).
	// For keyset pagination the column ALSO has to be UNIQUE — typically the
	// source-table primary key. The SQLJoin validator in DataMapper-ConnectionBridge
	// requires OrderBy be a single string to enforce that intent.
	if (tmpSpec.OrderBy === undefined || tmpSpec.OrderBy === null || tmpSpec.OrderBy === '')
	{
		throw new Error('Join: OrderBy is required (a stable, indexed, UNIQUE source-table column for paged ORDER BY).');
	}
	let tmpOrderBy = tmpSpec.OrderBy;
	if (!isValidIdentifier(tmpOrderBy))
	{
		throw new Error('Join: OrderBy must be a simple identifier (got ' + JSON.stringify(tmpOrderBy) + ').');
	}

	let tmpLimit = (tmpSpec.Limit !== undefined) ? Number(tmpSpec.Limit) : 500;
	if (!Number.isInteger(tmpLimit) || tmpLimit < 1 || tmpLimit > 100000)
	{
		throw new Error('Join: Limit must be an integer in [1, 100000] (got ' + tmpLimit + ').');
	}

	// Keyset mode is signaled by AfterValue being present in the spec
	// (including AfterValue: null for the first page).
	let tmpKeysetMode = Object.prototype.hasOwnProperty.call(tmpSpec, 'AfterValue');
	let tmpHasOffset  = (tmpSpec.Offset !== undefined && tmpSpec.Offset !== null);

	if (tmpKeysetMode && tmpHasOffset)
	{
		throw new Error('Join: AfterValue and Offset are mutually exclusive — pass AfterValue (keyset) or Offset (legacy), not both.');
	}

	let tmpCursorField = null;

	if (tmpKeysetMode)
	{
		// Find the OrderBy column in the projection (if any). If found, the
		// streaming caller can read the cursor value from that target column.
		// If not, prepend a sentinel cursor column so the caller can always
		// advance keyset pagination regardless of projection shape.
		let tmpOrderByExpr = '{~D:Record.' + tmpOrderBy + '~}';
		for (let i = 0; i < tmpProjKeys.length; i++)
		{
			if (tmpProjection[tmpProjKeys[i]] === tmpOrderByExpr)
			{
				tmpCursorField = tmpProjKeys[i];
				break;
			}
		}
		if (tmpCursorField === null)
		{
			if (tmpProjKeys.indexOf(KEYSET_CURSOR_ALIAS) >= 0)
			{
				throw new Error('Join: Projection key "' + KEYSET_CURSOR_ALIAS + '" is reserved for keyset pagination.');
			}
			tmpCursorField = KEYSET_CURSOR_ALIAS;
			tmpSelectParts.unshift('src.' + tmpQuote(tmpOrderBy) + ' AS ' + tmpQuote(KEYSET_CURSOR_ALIAS));
		}
	}

	let tmpHasAfterValue = tmpKeysetMode && (tmpSpec.AfterValue !== null);

	let tmpParams = [];
	let tmpWhereSQL = '';

	if (tmpHasAfterValue)
	{
		let tmpPlaceholder = DIALECT_PARAM_PLACEHOLDER[pType]();
		tmpWhereSQL = ' WHERE src.' + tmpQuote(tmpOrderBy) + ' > ' + tmpPlaceholder;
		tmpParams.push(tmpSpec.AfterValue);
	}

	let tmpOffset = tmpHasOffset ? Number(tmpSpec.Offset) : 0;
	if (tmpHasOffset && (!Number.isInteger(tmpOffset) || tmpOffset < 0))
	{
		throw new Error('Join: Offset must be a non-negative integer (got ' + tmpOffset + ').');
	}

	let tmpSQL;

	if (pType === 'MSSQL')
	{
		// MSSQL: SELECT TOP for keyset (no offset), OFFSET/FETCH for legacy.
		if (tmpKeysetMode)
		{
			tmpSQL =
				'SELECT TOP ' + tmpLimit + ' ' + tmpSelectParts.join(', ') +
				' FROM ' + tmpQuote(tmpSpec.Table) + ' src' +
				' INNER JOIN ' + tmpQuote(tmpSpec.RelatedTable) + ' rel' +
				' ON src.' + tmpQuote(tmpJoinOn.SourceField) + ' = rel.' + tmpQuote(tmpJoinOn.RelatedField) +
				tmpWhereSQL +
				' ORDER BY src.' + tmpQuote(tmpOrderBy) + ' ASC';
		}
		else
		{
			tmpSQL =
				'SELECT ' + tmpSelectParts.join(', ') +
				' FROM ' + tmpQuote(tmpSpec.Table) + ' src' +
				' INNER JOIN ' + tmpQuote(tmpSpec.RelatedTable) + ' rel' +
				' ON src.' + tmpQuote(tmpJoinOn.SourceField) + ' = rel.' + tmpQuote(tmpJoinOn.RelatedField) +
				' ORDER BY src.' + tmpQuote(tmpOrderBy) + ' ASC' +
				' OFFSET ' + tmpOffset + ' ROWS FETCH NEXT ' + tmpLimit + ' ROWS ONLY';
		}
	}
	else if (pType === 'Oracle')
	{
		// Oracle 12c+ row-limiting clause (Oracle has no LIMIT keyword).
		// Keyset uses FETCH FIRST (the cursor is supplied by the
		// WHERE src.<OrderBy> > :1 above); the legacy offset path uses
		// OFFSET <n> ROWS FETCH NEXT <m> ROWS ONLY.
		let tmpTail = tmpKeysetMode
			? ' FETCH FIRST ' + tmpLimit + ' ROWS ONLY'
			: ' OFFSET ' + tmpOffset + ' ROWS FETCH NEXT ' + tmpLimit + ' ROWS ONLY';
		tmpSQL =
			'SELECT ' + tmpSelectParts.join(', ') +
			' FROM ' + tmpQuote(tmpSpec.Table) + ' src' +
			' INNER JOIN ' + tmpQuote(tmpSpec.RelatedTable) + ' rel' +
			' ON src.' + tmpQuote(tmpJoinOn.SourceField) + ' = rel.' + tmpQuote(tmpJoinOn.RelatedField) +
			tmpWhereSQL +
			' ORDER BY src.' + tmpQuote(tmpOrderBy) + ' ASC' +
			tmpTail;
	}
	else
	{
		// PostgreSQL / MySQL / SQLite: LIMIT (and OFFSET only on legacy path).
		tmpSQL =
			'SELECT ' + tmpSelectParts.join(', ') +
			' FROM ' + tmpQuote(tmpSpec.Table) + ' src' +
			' INNER JOIN ' + tmpQuote(tmpSpec.RelatedTable) + ' rel' +
			' ON src.' + tmpQuote(tmpJoinOn.SourceField) + ' = rel.' + tmpQuote(tmpJoinOn.RelatedField) +
			tmpWhereSQL +
			' ORDER BY src.' + tmpQuote(tmpOrderBy) + ' ASC' +
			' LIMIT ' + tmpLimit;

		if (tmpHasOffset)
		{
			tmpSQL += ' OFFSET ' + tmpOffset;
		}
	}

	return { SQL: tmpSQL, Params: tmpParams, CursorField: tmpCursorField };
};

module.exports = { buildJoinPagedSQL, KEYSET_CURSOR_ALIAS };
