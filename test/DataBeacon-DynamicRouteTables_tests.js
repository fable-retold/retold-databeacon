/**
 * Retold DataBeacon — namespaced dynamic endpoints routed through per-table
 * route tables: CRUD, list/select/filter/count routes, the 404/405 answers,
 * two tables whose names collide by pluralization, compile-on-first-request,
 * and a cold restart that restores every enabled table through warm-up.
 *
 * Runs over real HTTP against a SQLite "external" database.
 */
const libAssert = require('assert');
const libSuperTest = require('supertest');
const libNet = require('net');
const libPath = require('path');
const libFs = require('fs');
const { DatabaseSync } = require('node:sqlite');

const libPict = require('pict');
const libMeadowConnectionManager = require('meadow-connection-manager');
const libRetoldDataBeacon = require('../source/Retold-DataBeacon.js');

const DATA_DIR = libPath.join(__dirname, '..', 'data', 'route-tables-test');
const STORE_DB_PATH = libPath.join(DATA_DIR, 'store.sqlite');
const EXTERNAL_DB_PATH = libPath.join(DATA_DIR, 'library.sqlite');
const ROUTE_HASH = 'route-table-library';
const BASE = `/1.0/${ROUTE_HASH}`;
const AUDIT_COLUMNS = 'CreateDate TEXT, CreatingIDUser INTEGER DEFAULT 0, UpdateDate TEXT, UpdatingIDUser INTEGER DEFAULT 0, Deleted INTEGER DEFAULT 0, DeleteDate TEXT, DeletingIDUser INTEGER DEFAULT 0';

/**
 * @return {Promise<number>} A free local TCP port.
 */
function freePort()
{
	return new Promise((fResolve) =>
	{
		let tmpServer = libNet.createServer();
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
 * Boot a beacon on the shared store.
 *
 * @param {number} pPort
 * @param {{ WithoutServerBodyParser?: boolean }} [pOptions] - WithoutServerBodyParser skips the
 *   server-wide body parser initializeService installs, so only route-level parsing remains.
 * @return {Promise<{ Fable: object, Beacon: object, Server: object }>}
 */
function bootBeacon(pPort, pOptions)
{
	let tmpOptions = pOptions || {};
	return new Promise((fResolve, fReject) =>
	{
		let tmpFable = new libPict(
			{
				Product: 'DataBeaconRouteTablesTest',
				ProductVersion: '0.0.1',
				APIServerPort: pPort,
				LogStreams: [ { streamtype: 'console', level: 'error' } ],
				SQLite: { SQLiteFilePath: STORE_DB_PATH },
			});
		tmpFable.serviceManager.addServiceType('MeadowConnectionManager', libMeadowConnectionManager);
		tmpFable.serviceManager.instantiateServiceProvider('MeadowConnectionManager');
		tmpFable.MeadowConnectionManager.connect('databeacon', { Type: 'SQLite', SQLiteFilePath: STORE_DB_PATH },
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
						AutoStartOrator: true,
						FullMeadowSchemaPath: libPath.join(__dirname, '..', 'model') + '/',
						FullMeadowSchemaFilename: 'MeadowModel-DataBeacon.json',
						Endpoints:
							{
								MeadowEndpoints: true,
								ConnectionBridge: true,
								SchemaIntrospector: true,
								DynamicEndpointManager: true,
								BeaconProvider: false,
								WebUI: false,
							},
					});
				if (tmpOptions.WithoutServerBodyParser)
				{
					let tmpServer = tmpFable.OratorServiceServer.server;
					let fUse = tmpServer.use.bind(tmpServer);
					tmpServer.use = (...pHandlers) =>
					{
						let tmpFirst = Array.isArray(pHandlers[0]) ? pHandlers[0][0] : pHandlers[0];
						if (tmpFirst && tmpFirst.name === 'readBody')
						{
							return tmpServer;
						}
						return fUse(...pHandlers);
					};
				}
				tmpBeacon.initializeService((pInitError) =>
				{
					if (pInitError)
					{
						return fReject(pInitError);
					}
					return fResolve({ Fable: tmpFable, Beacon: tmpBeacon, Server: tmpFable.OratorServiceServer.server });
				});
			});
	});
}

/**
 * @param {{ Beacon: object }} pBooted
 * @return {Promise<void>}
 */
function stopBeacon(pBooted)
{
	return new Promise((fResolve) =>
	{
		if (!pBooted || !pBooted.Beacon.serviceInitialized)
		{
			return fResolve();
		}
		pBooted.Beacon.stopService(() =>
		{
			fResolve();
		});
	});
}

suite
(
	'DataBeacon dynamic route tables',
	function ()
	{
		this.timeout(20000);

		let _Booted = null;
		let _IDConnection = null;
		let _IDBook = null;

		suiteSetup
		(
			async function ()
			{
				libFs.rmSync(DATA_DIR, { recursive: true, force: true });
				libFs.mkdirSync(DATA_DIR, { recursive: true });

				let tmpLibrary = new DatabaseSync(EXTERNAL_DB_PATH);
				tmpLibrary.exec(`CREATE TABLE Book (IDBook INTEGER PRIMARY KEY AUTOINCREMENT, GUIDBook TEXT, ${AUDIT_COLUMNS}, Title TEXT, Pages INTEGER)`);
				tmpLibrary.exec(`CREATE TABLE Books (IDBooks INTEGER PRIMARY KEY AUTOINCREMENT, GUIDBooks TEXT, ${AUDIT_COLUMNS}, Label TEXT)`);
				tmpLibrary.exec(`CREATE TABLE Author (IDAuthor INTEGER PRIMARY KEY AUTOINCREMENT, GUIDAuthor TEXT, ${AUDIT_COLUMNS}, Name TEXT)`);
				tmpLibrary.exec(`INSERT INTO Books (GUIDBooks, Label, Deleted) VALUES ('shelf-1', 'Shelf one', 0)`);
				tmpLibrary.close();

				_Booted = await bootBeacon(await freePort());
				let tmpCreate = await libSuperTest(_Booted.Server).post('/beacon/connection')
					.send({ Name: 'Route Table Library', Type: 'SQLite', Config: { SQLiteFilePath: EXTERNAL_DB_PATH }, AutoConnect: true });
				libAssert.ok(tmpCreate.body.Success, JSON.stringify(tmpCreate.body));
				_IDConnection = tmpCreate.body.Connection.IDBeaconConnection;
				let tmpConnect = await libSuperTest(_Booted.Server).post(`/beacon/connection/${_IDConnection}/connect`);
				libAssert.ok(tmpConnect.body.Success, JSON.stringify(tmpConnect.body));
				let tmpIntrospect = await libSuperTest(_Booted.Server).post(`/beacon/connection/${_IDConnection}/introspect`);
				libAssert.ok(tmpIntrospect.body.Success, JSON.stringify(tmpIntrospect.body));
				for (let tmpTable of [ 'Book', 'Books', 'Author' ])
				{
					let tmpEnable = await libSuperTest(_Booted.Server).post(`/beacon/endpoint/${_IDConnection}/${tmpTable}/enable`);
					libAssert.ok(tmpEnable.body.Success, `enable ${tmpTable}: ${JSON.stringify(tmpEnable.body)}`);
				}
			}
		);

		suiteTeardown
		(
			async function ()
			{
				await stopBeacon(_Booted);
				libFs.rmSync(DATA_DIR, { recursive: true, force: true });
			}
		);

		test
		(
			'enabling tables adds one dispatch route per verb, not a route set per table',
			function ()
			{
				let tmpTables = _Booted.Fable.DataBeaconDynamicEndpointManager._RouteTables[BASE];
				libAssert.ok(tmpTables, 'the prefix should have route tables');
				libAssert.deepStrictEqual(Array.from(tmpTables.keys()).sort(), [ 'Author', 'Book', 'Books' ]);
				let tmpRoutes = _Booted.Server.router.getRoutes();
				let tmpPrefixRoutes = Object.keys(tmpRoutes).map((pName) => tmpRoutes[pName]).filter((pRoute) => String(pRoute.path || (pRoute.spec && pRoute.spec.path)).indexOf(BASE) === 0);
				libAssert.deepStrictEqual(tmpPrefixRoutes.map((pRoute) => `${pRoute.method} ${pRoute.path || pRoute.spec.path}`).sort(),
					[ 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT' ].map((pMethod) => `${pMethod} ${BASE}/*`));
			}
		);

		test
		(
			'a table\'s routes compile on its first request',
			async function ()
			{
				let tmpAuthor = _Booted.Fable.DataBeaconDynamicEndpointManager._RouteTables[BASE].get('Author');
				libAssert.strictEqual(tmpAuthor.Router, null, 'no request has reached Author yet');
				let tmpResponse = await libSuperTest(_Booted.Server).get(`${BASE}/Authors/0/10`);
				libAssert.strictEqual(tmpResponse.status, 200);
				libAssert.ok(tmpAuthor.Router, 'the first request compiled the router');
			}
		);

		test
		(
			'create, read, update and delete through the route table',
			async function ()
			{
				let tmpCreated = await libSuperTest(_Booted.Server).post(`${BASE}/Book`).send({ Title: 'A Tale of Two Routers', Pages: 320 });
				libAssert.strictEqual(tmpCreated.status, 200, JSON.stringify(tmpCreated.body));
				_IDBook = tmpCreated.body.IDBook;
				libAssert.ok(_IDBook > 0, JSON.stringify(tmpCreated.body));

				let tmpRead = await libSuperTest(_Booted.Server).get(`${BASE}/Book/${_IDBook}`);
				libAssert.strictEqual(tmpRead.status, 200);
				libAssert.strictEqual(tmpRead.body.Title, 'A Tale of Two Routers');

				let tmpUpdated = await libSuperTest(_Booted.Server).put(`${BASE}/Book`).send({ IDBook: _IDBook, Pages: 330 });
				libAssert.strictEqual(tmpUpdated.status, 200, JSON.stringify(tmpUpdated.body));
				libAssert.strictEqual(tmpUpdated.body.Pages, 330);
			}
		);

		test
		(
			'list, select, filter and count routes resolve to the right table',
			async function ()
			{
				let tmpList = await libSuperTest(_Booted.Server).get(`${BASE}/Books/0/10`);
				libAssert.strictEqual(tmpList.status, 200);
				libAssert.ok(Array.isArray(tmpList.body) && tmpList.body.length === 1 && tmpList.body[0].IDBook === _IDBook, `list: ${JSON.stringify(tmpList.body)}`);

				let tmpSelect = await libSuperTest(_Booted.Server).get(`${BASE}/BookSelect`);
				libAssert.strictEqual(tmpSelect.status, 200);
				libAssert.ok(Array.isArray(tmpSelect.body) && tmpSelect.body.length === 1, `select: ${JSON.stringify(tmpSelect.body)}`);

				let tmpFiltered = await libSuperTest(_Booted.Server).get(`${BASE}/Books/FilteredTo/FBV~Pages~EQ~330`);
				libAssert.strictEqual(tmpFiltered.status, 200);
				libAssert.strictEqual(tmpFiltered.body.length, 1);

				let tmpCount = await libSuperTest(_Booted.Server).get(`${BASE}/Books/Count`);
				libAssert.strictEqual(tmpCount.status, 200);
				libAssert.strictEqual(tmpCount.body.Count, 1, 'Books/Count is Book\'s count route, not a read of Books record "Count"');
			}
		);

		test
		(
			'a table named like another table\'s list form keeps its own record routes',
			async function ()
			{
				let tmpShelves = await libSuperTest(_Booted.Server).get(`${BASE}/Bookss/0/10`);
				libAssert.strictEqual(tmpShelves.status, 200);
				libAssert.strictEqual(tmpShelves.body[0].Label, 'Shelf one');

				let tmpShelf = await libSuperTest(_Booted.Server).get(`${BASE}/Books/${tmpShelves.body[0].IDBooks}`);
				libAssert.strictEqual(tmpShelf.status, 200);
				libAssert.strictEqual(tmpShelf.body.Label, 'Shelf one');
			}
		);

		test
		(
			'filters longer than the default 100-character parameter cap still match',
			async function ()
			{
				let tmpFilter = `FBV~Title~EQ~${encodeURIComponent('A Tale of Two Routers')}` + '~FBV~Pages~GT~1'.repeat(10);
				libAssert.ok(tmpFilter.length > 100);
				let tmpResponse = await libSuperTest(_Booted.Server).get(`${BASE}/Books/FilteredTo/${tmpFilter}`);
				libAssert.strictEqual(tmpResponse.status, 200, JSON.stringify(tmpResponse.body));
				libAssert.strictEqual(tmpResponse.body.length, 1);
			}
		);

		test
		(
			'an unknown table answers 404 and a known path with the wrong verb answers 405',
			async function ()
			{
				let tmpMissing = await libSuperTest(_Booted.Server).get(`${BASE}/Magazine/1`);
				libAssert.strictEqual(tmpMissing.status, 404);
				libAssert.strictEqual(tmpMissing.body.code, 'ResourceNotFound');

				let tmpWrongVerb = await libSuperTest(_Booted.Server).delete(`${BASE}/Authors/Count`);
				libAssert.strictEqual(tmpWrongVerb.status, 405);
				libAssert.strictEqual(tmpWrongVerb.body.code, 'MethodNotAllowed');

				for (let tmpMethod of [ 'head', 'options' ])
				{
					let tmpResponse = await libSuperTest(_Booted.Server)[tmpMethod](`${BASE}/Authors/Count`);
					libAssert.strictEqual(tmpResponse.status, 405, `${tmpMethod.toUpperCase()} on a GET-only path`);
				}
			}
		);

		test
		(
			'a re-enable after disable serves the table',
			async function ()
			{
				let tmpDisable = await libSuperTest(_Booted.Server).post(`/beacon/endpoint/${_IDConnection}/Author/disable`);
				libAssert.ok(tmpDisable.body.Success, JSON.stringify(tmpDisable.body));
				let tmpEnable = await libSuperTest(_Booted.Server).post(`/beacon/endpoint/${_IDConnection}/Author/enable`);
				libAssert.ok(tmpEnable.body.Success, JSON.stringify(tmpEnable.body));
				let tmpList = await libSuperTest(_Booted.Server).get(`${BASE}/Authors/0/10`);
				libAssert.strictEqual(tmpList.status, 200);
			}
		);

		test
		(
			'the route-table server takes one handler per route, for every verb and its body-parser form',
			function ()
			{
				let tmpManager = _Booted.Fable.DataBeaconDynamicEndpointManager;
				let tmpRouter = require('find-my-way')();
				let tmpServer = tmpManager._routeTableServer(tmpRouter);
				let fHandler = () => {};
				let tmpVerbs = { get: 'GET', post: 'POST', put: 'PUT', del: 'DELETE', patch: 'PATCH', opts: 'OPTIONS', head: 'HEAD' };
				for (let tmpVerb of Object.keys(tmpVerbs))
				{
					tmpServer[tmpVerb](`/plain/${tmpVerb}`, fHandler);
					tmpServer[`${tmpVerb}WithBodyParser`](`/parsed/${tmpVerb}`, fHandler);
					libAssert.ok(tmpRouter.find(tmpVerbs[tmpVerb], `/plain/${tmpVerb}`), `${tmpVerb} registers ${tmpVerbs[tmpVerb]}`);
					libAssert.ok(tmpRouter.find(tmpVerbs[tmpVerb], `/parsed/${tmpVerb}`), `${tmpVerb}WithBodyParser registers ${tmpVerbs[tmpVerb]}`);
				}
				libAssert.throws(() =>
				{
					tmpServer.post('/two-handlers', fHandler, fHandler);
				}, /exactly one handler/);
			}
		);

		test
		(
			'a cold restart restores every enabled table through warm-up',
			async function ()
			{
				let tmpDelete = await libSuperTest(_Booted.Server).delete(`${BASE}/Book/${_IDBook}`);
				libAssert.strictEqual(tmpDelete.status, 200, JSON.stringify(tmpDelete.body));
				await stopBeacon(_Booted);

				_Booted = await bootBeacon(await freePort());
				libAssert.deepStrictEqual(Array.from(_Booted.Fable.DataBeaconDynamicEndpointManager._RouteTables[BASE].keys()).sort(), [ 'Author', 'Book', 'Books' ]);
				let tmpShelves = await libSuperTest(_Booted.Server).get(`${BASE}/Bookss/0/10`);
				libAssert.strictEqual(tmpShelves.status, 200);
				libAssert.strictEqual(tmpShelves.body.length, 1);
				let tmpBooks = await libSuperTest(_Booted.Server).get(`${BASE}/Books/0/10`);
				libAssert.strictEqual(tmpBooks.status, 200);
				libAssert.strictEqual(tmpBooks.body.length, 0, 'the deleted book stays deleted');
			}
		);

		test
		(
			'write bodies are parsed without the server-wide body parser',
			async function ()
			{
				await stopBeacon(_Booted);
				_Booted = await bootBeacon(await freePort(), { WithoutServerBodyParser: true });

				let tmpCreated = await libSuperTest(_Booted.Server).post(`${BASE}/Book`).send({ Title: 'Parsed at the Door', Pages: 12 });
				libAssert.strictEqual(tmpCreated.status, 200, JSON.stringify(tmpCreated.body));
				libAssert.strictEqual(tmpCreated.body.Title, 'Parsed at the Door', `create saw the body: ${JSON.stringify(tmpCreated.body)}`);

				let tmpUpdated = await libSuperTest(_Booted.Server).put(`${BASE}/Book`).send({ IDBook: tmpCreated.body.IDBook, Pages: 13 });
				libAssert.strictEqual(tmpUpdated.status, 200, JSON.stringify(tmpUpdated.body));
				libAssert.strictEqual(tmpUpdated.body.Pages, 13);
			}
		);
	}
);
