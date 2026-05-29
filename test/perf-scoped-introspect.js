/**
 * Perf sniff test (not a unit test): demonstrates that single-table
 * introspect (Fix A) is ~O(1) while the full-database introspect it
 * replaced is O(N). Runs against the test postgres:
 *
 *   docker compose -f test/docker-compose.yml up -d --wait postgres
 *   node test/perf-scoped-introspect.js
 *
 * Creates a batch of throwaway tables (perf_scoped_t_*), times both
 * introspect paths at two lake sizes, prints the comparison, and drops
 * the throwaway tables again.
 */
const libPath = require('path');
const libFs = require('fs');
const libPict = require('pict');
const libMeadowConnectionManager = require('meadow-connection-manager');
const libRetoldDataBeacon = require('../source/Retold-DataBeacon.js');

const PG_CONFIG =
{
	Server: process.env.POSTGRES_TEST_HOST || '127.0.0.1',
	Host: process.env.POSTGRES_TEST_HOST || '127.0.0.1',
	Port: Number(process.env.POSTGRES_TEST_PORT || 25389),
	User: process.env.POSTGRES_TEST_USER || 'postgres',
	Password: process.env.POSTGRES_TEST_PASSWORD || 'testpassword',
	Database: 'chinook'
};
const TMP = libPath.resolve(__dirname, '..', '.test_perf');
const PREFIX = 'perf_scoped_t_';
const SMALL = 20;
const LARGE = 160;

function ensureCleanDir(pDir)
{
	if (libFs.existsSync(pDir)) { libFs.rmSync(pDir, { recursive: true, force: true }); }
	libFs.mkdirSync(pDir, { recursive: true });
}

function boot(pSqlitePath)
{
	return new Promise((fResolve, fReject) =>
	{
		let tmpFable = new libPict(
			{
				Product: 'PerfScopedIntrospect',
				ProductVersion: '0.0.1',
				LogStreams: [{ streamtype: 'console', level: 'error' }],
				SQLite: { SQLiteFilePath: pSqlitePath }
			});
		tmpFable.serviceManager.addServiceType('MeadowConnectionManager', libMeadowConnectionManager);
		tmpFable.serviceManager.instantiateServiceProvider('MeadowConnectionManager');
		tmpFable.MeadowConnectionManager.connect('databeacon', { Type: 'SQLite', SQLiteFilePath: pSqlitePath },
			(pConnErr, pConnection) =>
			{
				if (pConnErr) { return fReject(pConnErr); }
				tmpFable.MeadowSQLiteProvider = pConnection.instance;
				tmpFable.settings.MeadowProvider = 'SQLite';
				tmpFable.serviceManager.addServiceType('RetoldDataBeacon', libRetoldDataBeacon);
				let tmpBeacon = tmpFable.serviceManager.instantiateServiceProvider('RetoldDataBeacon',
					{
						AutoCreateSchema: true,
						AutoStartOrator: false,
						FullMeadowSchemaPath: libPath.join(__dirname, '..', 'model') + '/',
						FullMeadowSchemaFilename: 'MeadowModel-DataBeacon.json',
						Endpoints: { MeadowEndpoints: true, ConnectionBridge: true, SchemaIntrospector: true, DynamicEndpointManager: false, BeaconProvider: false, WebUI: false }
					});
				tmpBeacon.initializeService((pInitErr) =>
				{
					if (pInitErr) { return fReject(pInitErr); }
					return fResolve(tmpFable);
				});
			});
	});
}

function connect(pFable)
{
	return new Promise((fResolve, fReject) =>
	{
		let tmpRecord = { Name: 'perfpg', Type: 'PostgreSQL', Config: JSON.stringify(PG_CONFIG), Status: 'Untested', AutoConnect: 1, Description: 'perf' };
		let tmpQuery = pFable.DAL.BeaconConnection.query.clone().setIDUser(0).addRecord(tmpRecord);
		pFable.DAL.BeaconConnection.doCreate(tmpQuery, (pErr, pQ, pQR, pInserted) =>
		{
			if (pErr) { return fReject(pErr); }
			pFable.DataBeaconConnectionBridge._connectRuntime(pInserted, (pRunErr) =>
			{
				if (pRunErr) { return fReject(pRunErr); }
				return fResolve(pInserted.IDBeaconConnection);
			});
		});
	});
}

function pgPool(pFable, pIDConn)
{
	let tmpProvider = pFable.DataBeaconConnectionBridge.getConnectionInstance(pIDConn);
	return tmpProvider.pool || tmpProvider._ConnectionPool || tmpProvider;
}
function rawQuery(pFable, pIDConn, pSQL)
{
	return new Promise((fResolve, fReject) =>
	{
		pgPool(pFable, pIDConn).query(pSQL, (pErr, pResult) => (pErr ? fReject(pErr) : fResolve(pResult)));
	});
}
async function createTables(pFable, pIDConn, pFrom, pTo)
{
	for (let i = pFrom; i < pTo; i++)
	{
		await rawQuery(pFable, pIDConn, `CREATE TABLE IF NOT EXISTS ${PREFIX}${i} (id serial primary key, name varchar(64), val integer)`);
	}
}
async function dropPerfTables(pFable, pIDConn)
{
	let tmpRes = await rawQuery(pFable, pIDConn, `SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE '${PREFIX}%'`);
	let tmpRows = tmpRes.rows || tmpRes;
	for (let i = 0; i < tmpRows.length; i++)
	{
		await rawQuery(pFable, pIDConn, `DROP TABLE IF EXISTS "${tmpRows[i].table_name}" CASCADE`);
	}
}
function timeFull(pFable, pIDConn)
{
	return new Promise((fResolve, fReject) =>
	{
		let tmpStart = Date.now();
		pFable.DataBeaconSchemaIntrospector.introspect(pIDConn, (pErr, pResults) => (pErr ? fReject(pErr) : fResolve({ ms: Date.now() - tmpStart, count: pResults.length })));
	});
}
function timeSingle(pFable, pIDConn, pTableName)
{
	return new Promise((fResolve, fReject) =>
	{
		let tmpStart = Date.now();
		pFable.DataBeaconSchemaIntrospector.introspectTable(pIDConn, pTableName, (pErr, pResults) => (pErr ? fReject(pErr) : fResolve({ ms: Date.now() - tmpStart, table: pResults[0] && pResults[0].TableName, cols: pResults[0] && pResults[0].Columns.length })));
	});
}

const CHECKPOINTS = (process.env.PERF_CHECKPOINTS ? process.env.PERF_CHECKPOINTS.split(',').map((pN) => Number(pN.trim())) : [40, 160, 360, 560]);

(async () =>
{
	ensureCleanDir(TMP);
	let tmpFable = await boot(libPath.join(TMP, 'perf.sqlite'));
	let tmpIDConn = await connect(tmpFable);
	await dropPerfTables(tmpFable, tmpIDConn);

	console.log('\n  Scoped introspect perf — Postgres test lake (cumulative)');
	console.log('  lake tables |   FULL introspect |  SINGLE introspect');
	console.log('  ' + '-'.repeat(54));

	let tmpCreated = 0;
	let tmpFirst = null;
	let tmpLast = null;
	for (let c = 0; c < CHECKPOINTS.length; c++)
	{
		await createTables(tmpFable, tmpIDConn, tmpCreated, CHECKPOINTS[c]);
		tmpCreated = CHECKPOINTS[c];
		let tmpFull = await timeFull(tmpFable, tmpIDConn);
		let tmpSingle = await timeSingle(tmpFable, tmpIDConn, PREFIX + '5');
		if (!tmpFirst) { tmpFirst = { full: tmpFull, single: tmpSingle }; }
		tmpLast = { full: tmpFull, single: tmpSingle };
		console.log(`  ${String(tmpFull.count).padStart(11)} | ${String(tmpFull.ms + 'ms').padStart(17)} | ${String(tmpSingle.ms + 'ms').padStart(18)}`);
	}

	await dropPerfTables(tmpFable, tmpIDConn);

	let tmpTableGrowth = (tmpLast.full.count / Math.max(1, tmpFirst.full.count));
	let tmpFullGrowth = (tmpLast.full.ms / Math.max(1, tmpFirst.full.ms));
	let tmpSingleGrowth = (tmpLast.single.ms / Math.max(1, tmpFirst.single.ms));
	console.log('  ' + '-'.repeat(54));
	console.log(`  table count grew ${tmpTableGrowth.toFixed(1)}x  =>  FULL introspect ${tmpFullGrowth.toFixed(1)}x, SINGLE ${tmpSingleGrowth.toFixed(1)}x`);
	console.log(`  single-table result: table=${tmpLast.single.table} cols=${tmpLast.single.cols}`);
	let tmpOK = (tmpSingleGrowth < 2.0) && (tmpLast.single.table === PREFIX + '5') && (tmpLast.single.cols > 0);
	console.log(tmpOK
		? `  [ok] FULL introspect tracks table count; SINGLE stays flat (O(1)). The fix divides the per-table introspect cost by the table count, whatever each query costs.\n`
		: `  [warn] single-table introspect grew ${tmpSingleGrowth.toFixed(1)}x — investigate.\n`);
	process.exit(tmpOK ? 0 : 2);
})().catch((pErr) => { console.error('PERF SCRIPT ERROR:', pErr && pErr.stack ? pErr.stack : pErr); process.exit(1); });
