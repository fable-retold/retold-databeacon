/**
 * DataBeacon-SQLEmitter-Aggregate — pure-function tests.
 *
 * The emitter translates a structured aggregate spec into dialect-specific
 * SQL. These tests cover the happy path per dialect plus every input-
 * validation rejection, since the emitter is the safety boundary between
 * a user-supplied OperationConfiguration and raw SQL hitting the source
 * database pool.
 *
 * @author Steven Velozo <steven@velozo.com>
 * @license MIT
 */

const libChai = require('chai');
const Expect = libChai.expect;

const { buildAggregateSQL, isValidIdentifier } = require('../source/services/DataBeacon-SQLEmitter-Aggregate.js');

// The emitter returns { SQL, Params }; most cases only assert on the statement.
const sql = (pType, pSpec) => buildAggregateSQL(pType, pSpec).SQL;

suite('DataBeacon-SQLEmitter-Aggregate', () =>
{
	suite('isValidIdentifier', () =>
	{
		test('accepts simple identifiers', () =>
		{
			Expect(isValidIdentifier('Customer')).to.equal(true);
			Expect(isValidIdentifier('IDCustomer')).to.equal(true);
			Expect(isValidIdentifier('snake_case')).to.equal(true);
			Expect(isValidIdentifier('_leading')).to.equal(true);
			Expect(isValidIdentifier('a1')).to.equal(true);
		});

		test('rejects non-identifiers', () =>
		{
			Expect(isValidIdentifier('1leading-digit')).to.equal(false);
			Expect(isValidIdentifier('has space')).to.equal(false);
			Expect(isValidIdentifier('quoted"thing')).to.equal(false);
			Expect(isValidIdentifier('drop;table')).to.equal(false);
			Expect(isValidIdentifier('')).to.equal(false);
			Expect(isValidIdentifier(null)).to.equal(false);
			Expect(isValidIdentifier(42)).to.equal(false);
			Expect(isValidIdentifier('*')).to.equal(false);
		});
	});

	suite('buildAggregateSQL — happy path', () =>
	{
		const tmpSpec =
		{
			Table: 'CustomerMirror',
			GroupBy: ['PaymentTerms'],
			Aggregates:
			[
				{ Source: 'IDCustomer',  Function: 'Count', As: 'CustomerCount' },
				{ Source: 'CreditLimit', Function: 'Sum',   As: 'CreditTotal' }
			]
		};

		test('PostgreSQL emits double-quoted identifiers', () =>
		{
			let tmpSQL = sql('PostgreSQL', tmpSpec);
			Expect(tmpSQL).to.equal('SELECT "PaymentTerms", COUNT("IDCustomer") AS "CustomerCount", SUM("CreditLimit") AS "CreditTotal" FROM "CustomerMirror" GROUP BY "PaymentTerms"');
		});

		test('MySQL emits backtick-quoted identifiers', () =>
		{
			let tmpSQL = sql('MySQL', tmpSpec);
			Expect(tmpSQL).to.equal('SELECT `PaymentTerms`, COUNT(`IDCustomer`) AS `CustomerCount`, SUM(`CreditLimit`) AS `CreditTotal` FROM `CustomerMirror` GROUP BY `PaymentTerms`');
		});

		test('SQLite emits double-quoted identifiers', () =>
		{
			let tmpSQL = sql('SQLite', tmpSpec);
			Expect(tmpSQL).to.equal('SELECT "PaymentTerms", COUNT("IDCustomer") AS "CustomerCount", SUM("CreditLimit") AS "CreditTotal" FROM "CustomerMirror" GROUP BY "PaymentTerms"');
		});

		test('MSSQL emits bracket-quoted identifiers', () =>
		{
			let tmpSQL = sql('MSSQL', tmpSpec);
			Expect(tmpSQL).to.equal('SELECT [PaymentTerms], COUNT([IDCustomer]) AS [CustomerCount], SUM([CreditLimit]) AS [CreditTotal] FROM [CustomerMirror] GROUP BY [PaymentTerms]');
		});
	});

	suite('buildAggregateSQL — function aliases and shapes', () =>
	{
		test('Mean is an alias for AVG', () =>
		{
			let tmpSQL = sql('PostgreSQL',
				{
					Table: 'OrderLine',
					GroupBy: ['Status'],
					Aggregates: [ { Source: 'Quantity', Function: 'Mean', As: 'AvgQty' } ]
				});
			Expect(tmpSQL).to.contain('AVG("Quantity") AS "AvgQty"');
			Expect(tmpSQL).to.not.contain('MEAN');
		});

		test('Avg, Min, Max all emit', () =>
		{
			let tmpSQL = sql('PostgreSQL',
				{
					Table: 'OrderLine',
					GroupBy: ['Status'],
					Aggregates:
					[
						{ Source: 'Quantity', Function: 'Avg', As: 'AvgQty' },
						{ Source: 'Quantity', Function: 'Min', As: 'MinQty' },
						{ Source: 'Quantity', Function: 'Max', As: 'MaxQty' }
					]
				});
			Expect(tmpSQL).to.contain('AVG("Quantity") AS "AvgQty"');
			Expect(tmpSQL).to.contain('MIN("Quantity") AS "MinQty"');
			Expect(tmpSQL).to.contain('MAX("Quantity") AS "MaxQty"');
		});

		test('Count(*) is allowed', () =>
		{
			let tmpSQL = sql('PostgreSQL',
				{
					Table: 'OrderLine',
					GroupBy: ['Status'],
					Aggregates: [ { Source: '*', Function: 'Count', As: 'RowCount' } ]
				});
			Expect(tmpSQL).to.contain('COUNT(*) AS "RowCount"');
		});

		test('GroupBy is optional (single-row aggregate)', () =>
		{
			let tmpSQL = sql('PostgreSQL',
				{
					Table: 'OrderLine',
					Aggregates: [ { Source: '*', Function: 'Count', As: 'TotalRows' } ]
				});
			Expect(tmpSQL).to.equal('SELECT COUNT(*) AS "TotalRows" FROM "OrderLine"');
			Expect(tmpSQL).to.not.contain('GROUP BY');
		});

		test('OrderBy is honored', () =>
		{
			let tmpSQL = sql('PostgreSQL',
				{
					Table: 'OrderLine',
					GroupBy: ['Status'],
					Aggregates: [ { Source: '*', Function: 'Count', As: 'RowCount' } ],
					OrderBy: ['Status']
				});
			Expect(tmpSQL).to.contain('ORDER BY "Status"');
		});

		test('Op is accepted as an alias for Function', () =>
		{
			let tmpSQL = sql('PostgreSQL',
				{
					Table: 'OrderLine',
					GroupBy: ['Status'],
					Aggregates: [ { Source: 'Quantity', Op: 'Sum', As: 'TotalQty' } ]
				});
			Expect(tmpSQL).to.contain('SUM("Quantity") AS "TotalQty"');
		});

		test('Column is accepted as an alias for Source (existing Aggregation config shape)', () =>
		{
			let tmpSQL = sql('PostgreSQL',
				{
					Table: 'CustomerMirror',
					GroupBy: ['PaymentTerms'],
					Aggregates:
					[
						{ As: 'CustomerCount',  Op: 'COUNT', Column: '*' },
						{ As: 'TotalCredit',    Op: 'SUM',   Column: 'CreditLimitUSD' }
					]
				});
			Expect(tmpSQL).to.equal('SELECT "PaymentTerms", COUNT(*) AS "CustomerCount", SUM("CreditLimitUSD") AS "TotalCredit" FROM "CustomerMirror" GROUP BY "PaymentTerms"');
		});
	});

	suite('buildAggregateSQL — input validation', () =>
	{
		test('rejects unknown dialect', () =>
		{
			Expect(() => buildAggregateSQL('OracleXX', { Table: 'X', Aggregates: [{ Source: '*', Function: 'Count', As: 'C' }] }))
				.to.throw(/unsupported dialect/);
		});

		test('rejects missing Table', () =>
		{
			Expect(() => buildAggregateSQL('PostgreSQL', { Aggregates: [{ Source: '*', Function: 'Count', As: 'C' }] }))
				.to.throw(/Table is required/);
		});

		test('rejects injection-bearing Table', () =>
		{
			Expect(() => buildAggregateSQL('PostgreSQL',
				{ Table: 'Customer"; DROP TABLE X;--', Aggregates: [{ Source: '*', Function: 'Count', As: 'C' }] }))
				.to.throw(/simple identifier/);
		});

		test('rejects injection-bearing GroupBy', () =>
		{
			Expect(() => buildAggregateSQL('PostgreSQL',
				{
					Table: 'Customer',
					GroupBy: ['ok', 'bad"); DROP--'],
					Aggregates: [{ Source: '*', Function: 'Count', As: 'C' }]
				}))
				.to.throw(/GroupBy\[1\]/);
		});

		test('rejects injection-bearing Aggregate.Source', () =>
		{
			Expect(() => buildAggregateSQL('PostgreSQL',
				{
					Table: 'Customer',
					GroupBy: ['Status'],
					Aggregates: [{ Source: 'Q") FROM X;--', Function: 'Sum', As: 'Total' }]
				}))
				.to.throw(/Aggregates\[0\].Source/);
		});

		test('rejects injection-bearing Aggregate.As', () =>
		{
			Expect(() => buildAggregateSQL('PostgreSQL',
				{
					Table: 'Customer',
					GroupBy: ['Status'],
					Aggregates: [{ Source: 'Q', Function: 'Sum', As: 'Total"; DROP--' }]
				}))
				.to.throw(/Aggregates\[0\].As/);
		});

		test('rejects unknown Function', () =>
		{
			Expect(() => buildAggregateSQL('PostgreSQL',
				{
					Table: 'Customer',
					GroupBy: ['Status'],
					Aggregates: [{ Source: 'Q', Function: 'Median', As: 'Med' }]
				}))
				.to.throw(/Function must be one of/);
		});

		test('rejects empty Aggregates list', () =>
		{
			Expect(() => buildAggregateSQL('PostgreSQL', { Table: 'Customer', Aggregates: [] }))
				.to.throw(/at least one Aggregate/);
		});

		test('rejects Source="*" outside of Count', () =>
		{
			Expect(() => buildAggregateSQL('PostgreSQL',
				{ Table: 'X', Aggregates: [{ Source: '*', Function: 'Sum', As: 'C' }] }))
				.to.throw(/only valid with Function=Count/);
		});

		test('rejects injection-bearing OrderBy', () =>
		{
			Expect(() => buildAggregateSQL('PostgreSQL',
				{
					Table: 'X',
					GroupBy: ['Status'],
					Aggregates: [{ Source: '*', Function: 'Count', As: 'C' }],
					OrderBy: ['ok"; DROP--']
				}))
				.to.throw(/OrderBy\[0\]/);
		});

		test('rejects unknown top-level spec keys', () =>
		{
			// The whole point: a caller guessing a filter key name must get an
			// error, not every row in the table.
			Expect(() => buildAggregateSQL('PostgreSQL',
				{
					Table: 'X',
					GroupBy: ['Status'],
					Aggregates: [{ Source: '*', Function: 'Count', As: 'C' }],
					Where: 'Status <> \'DELETE\''
				}))
				.to.throw(/unknown spec key\(s\) \[Where\]/);
		});
	});

	suite('buildAggregateSQL — Filter emission', () =>
	{
		const filtered = (pType, pFilter) => buildAggregateSQL(pType,
			{
				Table: 'PlanRow',
				GroupBy: ['ItemCode'],
				Aggregates: [{ Source: '*', Function: 'Count', As: 'RowCount' }],
				Filter: pFilter
			});

		test('emits a parameterized WHERE ahead of the GROUP BY', () =>
		{
			let tmpResult = filtered('PostgreSQL', [{ Column: 'Action', Operator: '!=', Value: 'DELETE' }]);
			Expect(tmpResult.SQL).to.equal('SELECT "ItemCode", COUNT(*) AS "RowCount" FROM "PlanRow" WHERE "Action" != $1 GROUP BY "ItemCode"');
			Expect(tmpResult.Params).to.deep.equal(['DELETE']);
		});

		test('numbers the placeholders per dialect', () =>
		{
			let tmpFilter =
			[
				{ Column: 'Action', Operator: '!=', Value: 'DELETE' },
				{ Column: 'Deleted', Operator: '=', Value: 0 }
			];
			Expect(filtered('PostgreSQL', tmpFilter).SQL).to.contain('WHERE "Action" != $1 AND "Deleted" = $2');
			Expect(filtered('MySQL', tmpFilter).SQL).to.contain('WHERE `Action` != ? AND `Deleted` = ?');
			Expect(filtered('SQLite', tmpFilter).SQL).to.contain('WHERE "Action" != ? AND "Deleted" = ?');
			Expect(filtered('MSSQL', tmpFilter).SQL).to.contain('WHERE [Action] != @p1 AND [Deleted] = @p2');
			Expect(filtered('Oracle', tmpFilter).SQL).to.contain('WHERE "Action" != :1 AND "Deleted" = :2');
			Expect(filtered('MSSQL', tmpFilter).Params).to.deep.equal(['DELETE', 0]);
		});

		test('normalizes <> to != and is case-insensitive on word operators', () =>
		{
			Expect(filtered('PostgreSQL', [{ Column: 'Action', Operator: '<>', Value: 'X' }]).SQL).to.contain('"Action" != $1');
			Expect(filtered('PostgreSQL', [{ Column: 'Action', Operator: 'like', Value: 'X%' }]).SQL).to.contain('"Action" LIKE $1');
			Expect(filtered('PostgreSQL', [{ Column: 'Action', Operator: 'is  not  null' }]).SQL).to.contain('"Action" IS NOT NULL');
		});

		test('IN expands one placeholder per element', () =>
		{
			let tmpResult = filtered('PostgreSQL', [{ Column: 'ItemCode', Operator: 'IN', Value: ['A', 'B', 'C'] }]);
			Expect(tmpResult.SQL).to.contain('"ItemCode" IN ($1, $2, $3)');
			Expect(tmpResult.Params).to.deep.equal(['A', 'B', 'C']);
		});

		test('IN accepts a comma-delimited string', () =>
		{
			Expect(filtered('MySQL', [{ Column: 'ItemCode', Operator: 'NOT IN', Value: 'A,B' }]).Params).to.deep.equal(['A', 'B']);
		});

		test('IS NULL / IS NOT NULL consume no parameter', () =>
		{
			let tmpResult = filtered('MySQL', [{ Column: 'Action', Operator: 'IS NULL' }]);
			Expect(tmpResult.SQL).to.contain('WHERE `Action` IS NULL');
			Expect(tmpResult.Params).to.deep.equal([]);
		});

		test('honors OR connectors and paren grouping', () =>
		{
			let tmpResult = filtered('MySQL',
				[
					{ Operator: '(' },
					{ Column: 'Action', Operator: '=', Value: 'ADD' },
					{ Column: 'Action', Operator: '=', Value: 'UPDATE', Connector: 'OR' },
					{ Operator: ')' },
					{ Column: 'Deleted', Operator: '=', Value: 0 }
				]);
			Expect(tmpResult.SQL).to.contain('WHERE ( `Action` = ? OR `Action` = ? ) AND `Deleted` = ?');
			Expect(tmpResult.Params).to.deep.equal(['ADD', 'UPDATE', 0]);
		});

		test('no Filter key emits no WHERE and no params', () =>
		{
			let tmpResult = buildAggregateSQL('PostgreSQL',
				{ Table: 'PlanRow', GroupBy: ['ItemCode'], Aggregates: [{ Source: '*', Function: 'Count', As: 'RowCount' }] });
			Expect(tmpResult.SQL).to.not.contain('WHERE');
			Expect(tmpResult.Params).to.deep.equal([]);
		});

		test('Filter composes with OrderBy in the right clause order', () =>
		{
			let tmpResult = buildAggregateSQL('PostgreSQL',
				{
					Table: 'PlanRow',
					GroupBy: ['ItemCode'],
					Aggregates: [{ Source: '*', Function: 'Count', As: 'RowCount' }],
					Filter: [{ Column: 'Action', Operator: '!=', Value: 'DELETE' }],
					OrderBy: ['ItemCode']
				});
			Expect(tmpResult.SQL).to.equal('SELECT "ItemCode", COUNT(*) AS "RowCount" FROM "PlanRow" WHERE "Action" != $1 GROUP BY "ItemCode" ORDER BY "ItemCode"');
		});
	});

	suite('buildAggregateSQL — Filter validation', () =>
	{
		const rejects = (pFilter) => () => buildAggregateSQL('PostgreSQL',
			{
				Table: 'PlanRow',
				GroupBy: ['ItemCode'],
				Aggregates: [{ Source: '*', Function: 'Count', As: 'RowCount' }],
				Filter: pFilter
			});

		test('rejects an injection-bearing Column', () =>
		{
			Expect(rejects([{ Column: 'Action"; DROP TABLE PlanRow;--', Operator: '=', Value: 'X' }]))
				.to.throw(/Filter\[0\]\.Column must be a simple identifier/);
		});

		test('rejects an operator outside the whitelist', () =>
		{
			Expect(rejects([{ Column: 'Action', Operator: 'REGEXP', Value: 'X' }])).to.throw(/Filter\[0\]\.Operator must be one of/);
			Expect(rejects([{ Column: 'Action', Operator: '= 1 OR 1', Value: 'X' }])).to.throw(/Filter\[0\]\.Operator must be one of/);
		});

		test('rejects the meadow mnemonics, which collide with SQL tokens', () =>
		{
			// meadow's EQ/NE never reach the emitter — the mapper translates
			// them first. 'IN' is the dangerous one: it means IS NULL in the
			// meadow grammar and a value list in SQL.
			Expect(rejects([{ Column: 'Action', Operator: 'NE', Value: 'X' }])).to.throw(/Operator must be one of/);
		});

		test('rejects filtering on an aggregate alias (that would be HAVING)', () =>
		{
			Expect(rejects([{ Column: 'RowCount', Operator: '>', Value: 1 }])).to.throw(/HAVING, which this emitter does not support/);
		});

		test('rejects a non-scalar or missing Value', () =>
		{
			Expect(rejects([{ Column: 'Action', Operator: '=', Value: null }])).to.throw(/use Operator "IS NULL"/);
			Expect(rejects([{ Column: 'Action', Operator: '=' }])).to.throw(/Filter\[0\]\.Value is required/);
			Expect(rejects([{ Column: 'Action', Operator: '=', Value: { Nested: true } }])).to.throw(/must be a string, number, or boolean/);
		});

		test('rejects an empty IN list', () =>
		{
			Expect(rejects([{ Column: 'ItemCode', Operator: 'IN', Value: [] }])).to.throw(/non-empty array/);
		});

		test('rejects a bad connector', () =>
		{
			Expect(rejects(
				[
					{ Column: 'Action', Operator: '=', Value: 'A' },
					{ Column: 'Action', Operator: '=', Value: 'B', Connector: 'AND 1=1 OR' }
				])).to.throw(/Connector must be AND or OR/);
		});

		test('rejects unbalanced or empty groups', () =>
		{
			Expect(rejects([{ Operator: '(' }, { Column: 'Action', Operator: '=', Value: 'A' }])).to.throw(/unclosed group/);
			Expect(rejects([{ Column: 'Action', Operator: '=', Value: 'A' }, { Operator: ')' }])).to.throw(/never opened/);
			Expect(rejects([{ Operator: '(' }, { Operator: ')' }])).to.throw(/closes an empty group/);
		});

		test('rejects a Filter that is not an array, and an empty one', () =>
		{
			Expect(rejects('FBV~Action~NE~DELETE')).to.throw(/Filter must be an array/);
			Expect(rejects([])).to.throw(/Filter was supplied but is empty/);
		});
	});
});
