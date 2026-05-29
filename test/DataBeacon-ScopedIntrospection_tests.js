/**
 * DataBeacon scoped-introspection tests — Fix A (single-table introspect)
 * and Fix C (scoped EnsureSchema diff).
 *
 * Both fixes collapse the per-table clone cost from O(N) (whole-database
 * introspect) to O(1). These cases run against in-memory SQLite (always
 * available), booting an in-process retold-databeacon the same way
 * DataBeacon-SchemaManager_tests.js does.
 *
 *   npx mocha test/DataBeacon-ScopedIntrospection_tests.js -u tdd --exit --timeout 60000
 *
 * @license MIT
 */

const Chai = require('chai');
const Expect = Chai.expect;

const libPath = require('path');
const libFs = require('fs');

const libPict = require('pict');
const libMeadowConnectionManager = require('meadow-connection-manager');
const libRetoldDataBeacon = require('../source/Retold-DataBeacon.js');
const libDataBeaconSchemaManager = require('../source/services/DataBeacon-SchemaManager.js');

const TEST_DIR = libPath.resolve(__dirname, '..', '.test_scoped_introspection');

function ensureCleanDir(pDir)
{
	if (libFs.existsSync(pDir)) { libFs.rmSync(pDir, { recursive: true, force: true }); }
	libFs.mkdirSync(pDir, { recursive: true });
}

// ── in-process databeacon bootstrap (SQLite; SchemaIntrospector on) ──
function bootDataBeacon(pSqlitePath, fCallback)
{
	let tmpFable = new libPict(
		{
			Product: 'ScopedIntrospectionTest',
			ProductVersion: '0.0.1',
			LogStreams: [{ streamtype: 'console', level: 'error' }],
			SQLite: { SQLiteFilePath: pSqlitePath }
		});

	tmpFable.serviceManager.addServiceType('MeadowConnectionManager', libMeadowConnectionManager);
	tmpFable.serviceManager.instantiateServiceProvider('MeadowConnectionManager');

	tmpFable.MeadowConnectionManager.connect('databeacon',
		{ Type: 'SQLite', SQLiteFilePath: pSqlitePath },
		(pConnErr, pConnection) =>
		{
			if (pConnErr) { return fCallback(pConnErr); }
			tmpFable.MeadowSQLiteProvider = pConnection.instance;
			tmpFable.settings.MeadowProvider = 'SQLite';

			tmpFable.serviceManager.addServiceType('RetoldDataBeacon', libRetoldDataBeacon);
			let tmpBeacon = tmpFable.serviceManager.instantiateServiceProvider('RetoldDataBeacon',
				{
					AutoCreateSchema: true,
					AutoStartOrator: false,
					FullMeadowSchemaPath: libPath.join(__dirname, '..', 'model') + '/',
					FullMeadowSchemaFilename: 'MeadowModel-DataBeacon.json',
					Endpoints:
					{
						MeadowEndpoints: true,
						ConnectionBridge: true,
						SchemaIntrospector: true,
						DynamicEndpointManager: false,
						BeaconProvider: false,
						WebUI: false
					}
				});

			tmpBeacon.initializeService((pInitErr) =>
			{
				if (pInitErr) { return fCallback(pInitErr); }
				tmpFable.serviceManager.addServiceTypeIfNotExists('DataBeaconSchemaManager', libDataBeaconSchemaManager);
				if (!tmpFable.DataBeaconSchemaManager)
				{
					tmpFable.DataBeaconSchemaManager = tmpFable.serviceManager.instantiateServiceProvider('DataBeaconSchemaManager', {});
				}
				return fCallback(null, tmpFable, tmpBeacon);
			});
		});
}

function createAndConnect(pFable, pName, pSqlitePath, fCallback)
{
	let tmpRecord =
	{
		Name: pName,
		Type: 'SQLite',
		Config: JSON.stringify({ Type: 'SQLite', SQLiteFilePath: pSqlitePath }),
		Status: 'Untested',
		AutoConnect: 1,
		Description: 'SQLite scoped-introspection test connection'
	};
	let tmpQuery = pFable.DAL.BeaconConnection.query.clone().setIDUser(0).addRecord(tmpRecord);
	pFable.DAL.BeaconConnection.doCreate(tmpQuery,
		(pCreateErr, pQ, pQR, pInserted) =>
		{
			if (pCreateErr) { return fCallback(pCreateErr); }
			pFable.DataBeaconConnectionBridge._connectRuntime(pInserted,
				(pRunErr) =>
				{
					if (pRunErr) { return fCallback(pRunErr); }
					return fCallback(null, pInserted.IDBeaconConnection);
				});
		});
}

// ── descriptor + promise helpers ──
function tableDescriptor(pScope, pColumns)
{
	return {
		Scope: pScope,
		DefaultIdentifier: 'ID' + pScope,
		Schema: [ { Column: 'ID' + pScope, Type: 'AutoIdentity', Size: 'Default' } ].concat(pColumns || []),
		Indexes: []
	};
}
function schemaJSON(pName, pTables)
{
	return { SchemaName: pName, Version: 1, Tables: pTables };
}
function ensure(pFable, pIDConn, pSchemaJSON)
{
	return new Promise((fResolve, fReject) =>
	{
		pFable.DataBeaconSchemaManager.ensureSchema(
			{ IDBeaconConnection: pIDConn, SchemaName: pSchemaJSON.SchemaName, SchemaJSON: pSchemaJSON },
			(pErr, pResult) => { if (pErr) { return fReject(pErr); } return fResolve(pResult); });
	});
}
function introspectTableP(pFable, pIDConn, pTableName)
{
	return new Promise((fResolve, fReject) =>
	{
		pFable.DataBeaconSchemaIntrospector.introspectTable(pIDConn, pTableName,
			(pErr, pResults) => { if (pErr) { return fReject(pErr); } return fResolve(pResults); });
	});
}
function introspectAllP(pFable, pIDConn)
{
	return new Promise((fResolve, fReject) =>
	{
		pFable.DataBeaconSchemaIntrospector.introspect(pIDConn,
			(pErr, pResults) => { if (pErr) { return fReject(pErr); } return fResolve(pResults); });
	});
}
function cachedTableNames(pFable, pIDConn)
{
	return new Promise((fResolve, fReject) =>
	{
		let tmpQuery = pFable.DAL.IntrospectedTable.query.clone()
			.addFilter('IDBeaconConnection', pIDConn)
			.addFilter('Deleted', 0);
		pFable.DAL.IntrospectedTable.doReads(tmpQuery,
			(pErr, pQ, pRecords) =>
			{
				if (pErr) { return fReject(pErr); }
				return fResolve((pRecords || []).map((pR) => pR.TableName));
			});
	});
}

suite('DataBeacon Scoped Introspection (Fix A + Fix C)', function ()
{
	this.timeout(60000);

	// ── Fix A: single-table introspect ──
	suite('Fix A — single-table introspect', function ()
	{
		let _Fable = null;
		let _IDConn = null;
		let _SqlitePath = '';

		suiteSetup(function (fDone)
		{
			ensureCleanDir(TEST_DIR);
			_SqlitePath = libPath.join(TEST_DIR, 'fixA.sqlite');
			bootDataBeacon(_SqlitePath, (pErr, pFable) =>
			{
				if (pErr) { return fDone(pErr); }
				_Fable = pFable;
				createAndConnect(_Fable, 'fixa', _SqlitePath, (pConnErr, pIDConn) =>
				{
					if (pConnErr) { return fDone(pConnErr); }
					_IDConn = pIDConn;
					ensure(_Fable, _IDConn, schemaJSON('fixa',
						[
							tableDescriptor('IntroAlpha', [ { Column: 'Name', Type: 'String', Size: '64' } ]),
							tableDescriptor('IntroBeta',  [ { Column: 'Name', Type: 'String', Size: '64' } ]),
							tableDescriptor('IntroGamma', [ { Column: 'Name', Type: 'String', Size: '64' } ])
						])).then(() => fDone(), fDone);
				});
			});
		});

		test('introspectTable persists ONLY the named table', function (fDone)
		{
			introspectTableP(_Fable, _IDConn, 'IntroBeta').then((pResults) =>
			{
				Expect(pResults).to.be.an('array').with.length(1);
				Expect(pResults[0].TableName).to.equal('IntroBeta');
				Expect(pResults[0].Columns.length).to.be.greaterThan(0);
				return cachedTableNames(_Fable, _IDConn);
			}).then((pCached) =>
			{
				// EnsureSchema does not populate the introspect cache, so the
				// single introspectTable call is the only thing that wrote to
				// it — proving it did not enumerate the other tables.
				Expect(pCached).to.deep.equal(['IntroBeta']);
				fDone();
			}).catch(fDone);
		});

		test('full introspect still enumerates every table', function (fDone)
		{
			introspectAllP(_Fable, _IDConn).then((pResults) =>
			{
				let tmpNames = pResults.map((pR) => pR.TableName);
				Expect(tmpNames).to.include('IntroAlpha');
				Expect(tmpNames).to.include('IntroBeta');
				Expect(tmpNames).to.include('IntroGamma');
				fDone();
			}).catch(fDone);
		});

		test('introspectTable requires a table name', function (fDone)
		{
			_Fable.DataBeaconSchemaIntrospector.introspectTable(_IDConn, '',
				(pErr) =>
				{
					Expect(pErr).to.be.an('error');
					fDone();
				});
		});

		test('introspectTable errors on a missing table', function (fDone)
		{
			_Fable.DataBeaconSchemaIntrospector.introspectTable(_IDConn, 'NoSuchTableXyz',
				(pErr) =>
				{
					Expect(pErr).to.be.an('error');
					fDone();
				});
		});
	});

	// ── Fix C: scoped EnsureSchema diff ──
	suite('Fix C — scoped EnsureSchema diff', function ()
	{
		let _Fable = null;
		let _IDConn = null;
		let _SqlitePath = '';

		suiteSetup(function (fDone)
		{
			_SqlitePath = libPath.join(TEST_DIR, 'fixC.sqlite');
			bootDataBeacon(_SqlitePath, (pErr, pFable) =>
			{
				if (pErr) { return fDone(pErr); }
				_Fable = pFable;
				createAndConnect(_Fable, 'fixc', _SqlitePath, (pConnErr, pIDConn) =>
				{
					if (pConnErr) { return fDone(pConnErr); }
					_IDConn = pIDConn;
					// A pre-existing, UNRELATED table (absent from every later
					// descriptor). Under the old whole-DB introspect this — and
					// the beacon's own model tables — would surface as
					// destructive drop-table candidates.
					ensure(_Fable, _IDConn, schemaJSON('legacy',
						[ tableDescriptor('UnrelatedLegacy', [ { Column: 'Blob', Type: 'String', Size: '64' } ]) ]))
						.then(() => fDone(), fDone);
				});
			});
		});

		test('creating a new table does not flag unrelated existing tables as destructive', function (fDone)
		{
			ensure(_Fable, _IDConn, schemaJSON('scoped',
				[ tableDescriptor('ScopedNew', [ { Column: 'Name', Type: 'String', Size: '64' } ]) ]))
				.then((pResult) =>
				{
					Expect(pResult.Success).to.equal(true);
					Expect(pResult.TablesCreated).to.include('ScopedNew');
					let tmpDrops = (pResult.SkippedDestructive || []).filter((pS) => (String(pS).indexOf('drop-table:') === 0));
					Expect(tmpDrops, 'unexpected drop-table entries: ' + JSON.stringify(pResult.SkippedDestructive)).to.have.length(0);
					fDone();
				}).catch(fDone);
		});

		test('the unrelated pre-existing table is left intact', function (fDone)
		{
			introspectAllP(_Fable, _IDConn).then((pResults) =>
			{
				let tmpNames = pResults.map((pR) => pR.TableName);
				Expect(tmpNames).to.include('UnrelatedLegacy');
				Expect(tmpNames).to.include('ScopedNew');
				fDone();
			}).catch(fDone);
		});

		test('incremental ADD COLUMN on an existing table still applies', function (fDone)
		{
			ensure(_Fable, _IDConn, schemaJSON('scoped',
				[ tableDescriptor('ScopedNew',
					[
						{ Column: 'Name', Type: 'String', Size: '64' },
						{ Column: 'Extra', Type: 'String', Size: '32' }
					]) ]))
				.then((pResult) =>
				{
					Expect(pResult.ColumnsAdded.join(',')).to.contain('Extra');
					fDone();
				}).catch(fDone);
		});
	});
});
