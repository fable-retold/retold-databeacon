/**
 * Perf harness (not a unit test): how long a beacon takes to start when many
 * dynamic endpoints were left enabled, and whether it answers HTTP while it
 * warms them up.
 *
 *   node test/perf-warmup.js                       # seed 5000 tables, then boot and measure
 *   node test/perf-warmup.js --tables 2000         # a different table count
 *   node test/perf-warmup.js --boot-only           # re-measure against the existing seed
 *   node test/perf-warmup.js --boot-only --cpu-prof  # also write a .cpuprofile for the boot
 *
 * Self-contained (no docker): the "external" database is a SQLite file with N
 * small tables, and the beacon's own SQLite store is seeded with one
 * IntrospectedTable row per table, all EndpointsEnabled=1 — the state a beacon
 * is in after N tables were enabled and the process restarted.
 *
 * The boot runs in a child process so each measurement starts cold. A probe
 * polls /beacon/connections every 500ms with a 2.5s timeout throughout, and the
 * report shows per-batch enable cost, total warm-up time, the worst event-loop
 * stall and how many probes failed.
 */
const libPath = require('path');
const libFs = require('fs');
const libHttp = require('http');
const libChildProcess = require('child_process');
const { DatabaseSync } = require('node:sqlite');
const { monitorEventLoopDelay } = require('perf_hooks');

const TMP = libPath.resolve(__dirname, '..', '.test_perf_warmup');
const EXTERNAL_DB = libPath.join(TMP, 'external.sqlite');
const BEACON_DB = libPath.join(TMP, 'beacon.sqlite');
const TABLE_PREFIX = 'warm_t_';
const PROBE_INTERVAL_MS = 500;
const PROBE_TIMEOUT_MS = 2500;

/**
 * @param {string} pName - Flag name without the leading dashes.
 * @param {string} [pDefault]
 * @return {string|undefined}
 */
function argValue(pName, pDefault)
{
	let tmpIndex = process.argv.indexOf(`--${pName}`);
	if (tmpIndex < 0)
	{
		return pDefault;
	}
	return process.argv[tmpIndex + 1];
}

/**
 * @param {string} pName - Flag name without the leading dashes.
 * @return {boolean}
 */
function hasFlag(pName)
{
	return process.argv.indexOf(`--${pName}`) > -1;
}

/**
 * Boot a beacon against the seeded store.
 *
 * @param {object} pOptions
 * @param {number} [pOptions.Port] - Listen port; omit to skip starting the web server.
 * @param {boolean} [pOptions.WarmUp] - Whether the DynamicEndpointManager group (and so warm-up) is on.
 * @return {Promise<object>} The fable instance once initializeService has called back.
 */
function bootBeacon(pOptions)
{
	const libPict = require('pict');
	const libMeadowConnectionManager = require('meadow-connection-manager');
	const libRetoldDataBeacon = require('../source/Retold-DataBeacon.js');
	return new Promise((fResolve, fReject) =>
	{
		let tmpFable = new libPict(
			{
				Product: 'PerfWarmUp',
				ProductVersion: '0.0.1',
				APIServerPort: pOptions.Port || 0,
				LogStreams: [ { streamtype: 'console', level: process.env.PERF_LOG_LEVEL || 'error' } ],
				SQLite: { SQLiteFilePath: BEACON_DB },
			});
		tmpFable.serviceManager.addServiceType('MeadowConnectionManager', libMeadowConnectionManager);
		tmpFable.serviceManager.instantiateServiceProvider('MeadowConnectionManager');
		tmpFable.MeadowConnectionManager.connect('databeacon', { Type: 'SQLite', SQLiteFilePath: BEACON_DB },
			(pConnectError, pConnection) =>
			{
				if (pConnectError)
				{
					return fReject(pConnectError);
				}
				tmpFable.MeadowSQLiteProvider = pConnection.instance;
				tmpFable.settings.MeadowProvider = 'SQLite';
				tmpFable.serviceManager.addServiceType('RetoldDataBeacon', libRetoldDataBeacon);
				let tmpBeacon = tmpFable.serviceManager.instantiateServiceProvider('RetoldDataBeacon',
					{
						AutoCreateSchema: true,
						AutoStartOrator: !!pOptions.Port,
						FullMeadowSchemaPath: libPath.join(__dirname, '..', 'model') + '/',
						FullMeadowSchemaFilename: 'MeadowModel-DataBeacon.json',
						Endpoints:
							{
								MeadowEndpoints: true,
								ConnectionBridge: true,
								SchemaIntrospector: true,
								DynamicEndpointManager: !!pOptions.WarmUp,
								BeaconProvider: false,
								WebUI: false,
							},
					});
				tmpFable.PerfBeacon = tmpBeacon;
				tmpBeacon.initializeService((pInitError) =>
				{
					if (pInitError)
					{
						return fReject(pInitError);
					}
					return fResolve(tmpFable);
				});
			});
	});
}

/**
 * Create the external database's tables and the beacon store's rows.
 *
 * @param {number} pTableCount
 * @return {Promise<void>}
 */
async function seed(pTableCount)
{
	libFs.rmSync(TMP, { recursive: true, force: true });
	libFs.mkdirSync(TMP, { recursive: true });

	let tmpStart = Date.now();
	let tmpExternal = new DatabaseSync(EXTERNAL_DB);
	tmpExternal.exec('BEGIN');
	for (let i = 0; i < pTableCount; i++)
	{
		tmpExternal.exec(`CREATE TABLE ${TABLE_PREFIX}${i} (id${TABLE_PREFIX}${i} INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Amount INTEGER, Note TEXT, CreateDate TEXT)`);
	}
	tmpExternal.exec('COMMIT');
	tmpExternal.close();
	console.log(`  seeded ${pTableCount} external tables in ${Date.now() - tmpStart}ms`);

	// Let the beacon introspect one table so the template row carries exactly
	// what the introspector writes, then clone it for every other table.
	let tmpFable = await bootBeacon({ WarmUp: false });
	let tmpIDConnection = await new Promise((fResolve, fReject) =>
	{
		let tmpRecord = { Name: 'perfwarm', Type: 'SQLite', Config: JSON.stringify({ SQLiteFilePath: EXTERNAL_DB }), Status: 'Untested', AutoConnect: 1, Description: 'perf warm-up' };
		let tmpQuery = tmpFable.DAL.BeaconConnection.query.clone().setIDUser(0).addRecord(tmpRecord);
		tmpFable.DAL.BeaconConnection.doCreate(tmpQuery, (pCreateError, pQuery, pQueryRead, pInserted) =>
		{
			if (pCreateError)
			{
				return fReject(pCreateError);
			}
			tmpFable.DataBeaconConnectionBridge._connectRuntime(pInserted, (pConnectError) =>
			{
				if (pConnectError)
				{
					return fReject(pConnectError);
				}
				return fResolve(pInserted.IDBeaconConnection);
			});
		});
	});
	await new Promise((fResolve, fReject) =>
	{
		tmpFable.DataBeaconSchemaIntrospector.introspectTable(tmpIDConnection, `${TABLE_PREFIX}0`, (pError) => (pError ? fReject(pError) : fResolve()));
	});

	let tmpStore = new DatabaseSync(BEACON_DB);
	let tmpTemplate = tmpStore.prepare('SELECT * FROM IntrospectedTable WHERE TableName = ?').get(`${TABLE_PREFIX}0`);
	if (!tmpTemplate)
	{
		throw new Error('The introspector wrote no row for the template table.');
	}
	let tmpTemplateColumns = JSON.parse(tmpTemplate.ColumnDefinitions);
	tmpStore.prepare('UPDATE IntrospectedTable SET EndpointsEnabled = 1 WHERE IDIntrospectedTable = ?').run(tmpTemplate.IDIntrospectedTable);
	let tmpInsert = tmpStore.prepare(`INSERT INTO IntrospectedTable
		(GUIDIntrospectedTable, CreateDate, UpdateDate, Deleted, IDBeaconConnection, DatabaseName, TableName, ColumnDefinitions, LastIntrospectedDate, EndpointsEnabled, RowCountEstimate)
		VALUES (?, ?, ?, 0, ?, ?, ?, ?, ?, 1, 0)`);
	tmpStore.exec('BEGIN');
	for (let i = 1; i < pTableCount; i++)
	{
		let tmpTableName = `${TABLE_PREFIX}${i}`;
		// The identity column carries the table name; keep it consistent.
		let tmpColumns = tmpTemplateColumns.map((pColumn) => Object.assign({}, pColumn,
			{
				Name: String(pColumn.Name || '').replace(`${TABLE_PREFIX}0`, tmpTableName),
				Column: (pColumn.Column !== undefined) ? String(pColumn.Column).replace(`${TABLE_PREFIX}0`, tmpTableName) : pColumn.Column,
			}));
		tmpInsert.run(`perf-warm-${i}`, tmpTemplate.CreateDate, tmpTemplate.UpdateDate, tmpIDConnection, tmpTemplate.DatabaseName, tmpTableName, JSON.stringify(tmpColumns), tmpTemplate.LastIntrospectedDate);
	}
	tmpStore.exec('COMMIT');
	let tmpCount = tmpStore.prepare('SELECT COUNT(*) AS N FROM IntrospectedTable WHERE EndpointsEnabled = 1').get().N;
	tmpStore.close();
	console.log(`  seeded ${tmpCount} enabled IntrospectedTable rows (template columns: ${tmpTemplateColumns.length})`);
	process.exit(0);
}

/**
 * Child-process body: boot with warm-up, report timings to the parent over IPC.
 *
 * @return {Promise<void>}
 */
async function bootChild()
{
	let tmpPort = parseInt(argValue('port'), 10);
	let tmpLoopDelay = monitorEventLoopDelay({ resolution: 10 });
	tmpLoopDelay.enable();

	const libDynamicEndpointManager = require('../source/services/DataBeacon-DynamicEndpointManager.js');
	let tmpMarks = [];
	let tmpEnabled = 0;
	let tmpBatchSize = parseInt(argValue('batch', '500'), 10);
	let tmpStart = process.hrtime.bigint();
	let tmpOriginalEnable = libDynamicEndpointManager.prototype.enableEndpoint;
	libDynamicEndpointManager.prototype.enableEndpoint = function (pIDBeaconConnection, pTableName, fCallback)
	{
		return tmpOriginalEnable.call(this, pIDBeaconConnection, pTableName, (pError, pResult) =>
		{
			tmpEnabled++;
			if (tmpEnabled % tmpBatchSize === 0)
			{
				tmpMarks.push({ Enabled: tmpEnabled, Ms: Number(process.hrtime.bigint() - tmpStart) / 1e6 });
			}
			return fCallback(pError, pResult);
		});
	};

	let tmpFable = await bootBeacon({ Port: tmpPort, WarmUp: true });
	let tmpTotalMs = Number(process.hrtime.bigint() - tmpStart) / 1e6;
	tmpLoopDelay.disable();
	let tmpRoutes = 0;
	try
	{
		let tmpRouter = tmpFable.OratorServiceServer.server.router;
		tmpRoutes = (tmpRouter && tmpRouter.getRoutes) ? Object.keys(tmpRouter.getRoutes()).length : 0;
	}
	catch (pError)
	{
		tmpRoutes = -1;
	}
	process.send(
		{
			TotalMs: tmpTotalMs,
			Enabled: tmpEnabled,
			Marks: tmpMarks,
			MaxLoopStallMs: tmpLoopDelay.max / 1e6,
			RSSMB: Math.round(process.memoryUsage().rss / 1048576),
			Routes: tmpRoutes,
		});
	// Stay up briefly so the parent's probe can confirm the server answers once warm.
	setTimeout(() =>
	{
		process.exit(0);
	}, 1500);
}

/**
 * @param {number} pPort
 * @return {Promise<{ OK: boolean, Ms: number }>}
 */
function probeOnce(pPort)
{
	return new Promise((fResolve) =>
	{
		let tmpStart = Date.now();
		let tmpRequest = libHttp.get({ host: '127.0.0.1', port: pPort, path: '/beacon/connections', timeout: PROBE_TIMEOUT_MS }, (pResponse) =>
		{
			pResponse.resume();
			fResolve({ OK: pResponse.statusCode < 400, Ms: Date.now() - tmpStart });
		});
		tmpRequest.on('timeout', () =>
		{
			tmpRequest.destroy();
			fResolve({ OK: false, Ms: Date.now() - tmpStart, Timeout: true });
		});
		tmpRequest.on('error', () =>
		{
			fResolve({ OK: false, Ms: Date.now() - tmpStart, Refused: true });
		});
	});
}

/**
 * @return {Promise<number>} A free local TCP port.
 */
function freePort()
{
	return new Promise((fResolve) =>
	{
		let tmpServer = require('net').createServer();
		tmpServer.listen(0, '127.0.0.1', () =>
		{
			let tmpPort = tmpServer.address().port;
			tmpServer.close(() =>
			{
				fResolve(tmpPort);
			});
		});
	});
}

/**
 * Parent: fork the boot child, probe it, print the report.
 *
 * @return {Promise<void>}
 */
async function measure()
{
	if (!libFs.existsSync(BEACON_DB))
	{
		throw new Error(`No seed at ${TMP} — run without --boot-only first.`);
	}
	let tmpPort = await freePort();
	let tmpExecArgv = hasFlag('cpu-prof') ? [ '--cpu-prof', `--cpu-prof-dir=${TMP}` ] : [];
	let tmpChild = libChildProcess.fork(__filename, [ '--boot-child', '--port', String(tmpPort), '--batch', argValue('batch', '500') ], { execArgv: tmpExecArgv, stdio: [ 'ignore', 'inherit', 'inherit', 'ipc' ] });

	let tmpProbes = [];
	let tmpReport = null;
	let tmpChildDone = new Promise((fResolve) =>
	{
		tmpChild.on('message', (pMessage) =>
		{
			tmpReport = pMessage;
		});
		tmpChild.on('exit', (pCode) =>
		{
			fResolve(pCode);
		});
	});
	let tmpProbing = true;
	let tmpProbeLoop = (async () =>
	{
		while (tmpProbing)
		{
			let tmpResult = await probeOnce(tmpPort);
			tmpResult.At = Date.now();
			tmpProbes.push(tmpResult);
			await new Promise((fResolve) =>
			{
				setTimeout(fResolve, PROBE_INTERVAL_MS);
			});
		}
	})();
	let tmpExitCode = await tmpChildDone;
	tmpProbing = false;
	await tmpProbeLoop;

	if (!tmpReport)
	{
		throw new Error(`The boot child exited (${tmpExitCode}) without a report.`);
	}
	let tmpPrevious = { Enabled: 0, Ms: 0 };
	console.log('\n  Warm-up enable cost by batch');
	console.log('     enabled |  elapsed |  batch ms | ms/table');
	console.log('  ' + '-'.repeat(46));
	for (let i = 0; i < tmpReport.Marks.length; i++)
	{
		let tmpMark = tmpReport.Marks[i];
		let tmpBatchMs = tmpMark.Ms - tmpPrevious.Ms;
		let tmpPerTable = tmpBatchMs / Math.max(1, tmpMark.Enabled - tmpPrevious.Enabled);
		console.log(`  ${String(tmpMark.Enabled).padStart(10)} | ${(tmpMark.Ms / 1000).toFixed(1).padStart(7)}s | ${tmpBatchMs.toFixed(0).padStart(9)} | ${tmpPerTable.toFixed(2).padStart(8)}`);
		tmpPrevious = tmpMark;
	}
	// Probes refused before the server listens are not warm-up failures.
	let tmpFirstAnswer = tmpProbes.findIndex((pProbe) => !pProbe.Refused);
	let tmpLiveProbes = (tmpFirstAnswer < 0) ? [] : tmpProbes.slice(tmpFirstAnswer);
	let tmpFailed = tmpLiveProbes.filter((pProbe) => !pProbe.OK);
	let tmpWorstProbe = tmpLiveProbes.reduce((pMax, pProbe) => Math.max(pMax, pProbe.Ms), 0);
	console.log('  ' + '-'.repeat(46));
	console.log(`  enabled ${tmpReport.Enabled} endpoints; initializeService finished in ${(tmpReport.TotalMs / 1000).toFixed(2)}s`);
	console.log(`  worst event-loop stall ${tmpReport.MaxLoopStallMs.toFixed(0)}ms; RSS ${tmpReport.RSSMB} MB; restify routes ${tmpReport.Routes}`);
	console.log(`  probes after first answer: ${tmpLiveProbes.length}, failed ${tmpFailed.length}, worst ${tmpWorstProbe}ms`);
	if (hasFlag('cpu-prof'))
	{
		console.log(`  cpu profile written under ${TMP}`);
	}
	let tmpBudgetMs = parseInt(argValue('budget-ms', '10000'), 10);
	let tmpOK = (tmpReport.TotalMs <= tmpBudgetMs) && (tmpFailed.length === 0);
	console.log(tmpOK ? `  [ok] within ${tmpBudgetMs}ms and every probe answered\n` : `  [fail] budget ${tmpBudgetMs}ms / ${tmpFailed.length} failed probe(s)\n`);
	process.exit(tmpOK ? 0 : 2);
}

/**
 * Parent entry: seed (unless --boot-only) in a child, then measure.
 *
 * @return {Promise<void>}
 */
async function main()
{
	if (!hasFlag('boot-only'))
	{
		let tmpTables = parseInt(argValue('tables', '5000'), 10);
		let tmpSeedChild = libChildProcess.fork(__filename, [ '--seed-child', '--tables', String(tmpTables) ], { stdio: 'inherit' });
		let tmpSeedCode = await new Promise((fResolve) =>
		{
			tmpSeedChild.on('exit', fResolve);
		});
		if (tmpSeedCode !== 0)
		{
			throw new Error(`Seeding failed (${tmpSeedCode}).`);
		}
	}
	return measure();
}

let tmpEntry = main;
if (hasFlag('seed-child'))
{
	tmpEntry = () => seed(parseInt(argValue('tables', '5000'), 10));
}
else if (hasFlag('boot-child'))
{
	tmpEntry = bootChild;
}
tmpEntry().catch((pError) =>
{
	console.error('PERF HARNESS ERROR:', (pError && pError.stack) ? pError.stack : pError);
	process.exit(1);
});
