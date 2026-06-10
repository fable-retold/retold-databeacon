/**
 * DataBeacon MeadowEndpoints introspector tests.
 *
 * A MeadowEndpoints connection has no information_schema — introspection
 * reads the remote API's published extended-schema document (per-table
 * MeadowSchema, meadow types) from Config.SchemaDocumentURL, cached per URL
 * with a TTL and deduplicated across concurrent fetches.
 *
 *   npx mocha test/DataBeacon-MeadowEndpointsIntrospector_tests.js -u tdd --exit
 *
 * @license MIT
 */

const Chai = require('chai');
const libAssert = require('assert');
const Expect = Chai.expect;
const libHttp = require('http');
const libPict = require('pict');

const libSchemaIntrospector = require('../source/services/DataBeacon-SchemaIntrospector.js');

const MINI_DOCUMENT =
{
	Tables:
	{
		Document:
		{
			TableName: 'Document',
			MeadowSchema:
			{
				Scope: 'Document',
				DefaultIdentifier: 'IDDocument',
				Schema:
				[
					{ Column: 'IDDocument', Type: 'AutoIdentity', Size: 'Default' },
					{ Column: 'GUIDDocument', Type: 'AutoGUID', Size: '128' },
					{ Column: 'DocumentType', Type: 'String', Size: '128' },
					{ Column: 'FormDataJSON', Type: 'Text', Size: 'Default' },
					{ Column: 'Deleted', Type: 'Deleted', Size: 'Default' }
				]
			}
		},
		Project:
		{
			TableName: 'Project',
			MeadowSchema: { Scope: 'Project', DefaultIdentifier: 'IDProject', Schema: [ { Column: 'IDProject', Type: 'AutoIdentity', Size: 'Default' } ] }
		}
	}
};

let _Server = null;
let _BaseURL = '';
let _FetchCount = 0;

function startStubAPI()
{
	return new Promise((fResolve) =>
	{
		_Server = libHttp.createServer((pRequest, pResponse) =>
		{
			if (pRequest.url === '/docs/Extended.json')
			{
				_FetchCount++;
				pResponse.writeHead(200, { 'Content-Type': 'application/json' });
				return pResponse.end(JSON.stringify(MINI_DOCUMENT));
			}
			if (pRequest.url === '/docs/NotJson.json')
			{
				pResponse.writeHead(200, { 'Content-Type': 'text/plain' });
				return pResponse.end('this is not json');
			}
			pResponse.writeHead(404, { 'Content-Type': 'application/json' });
			pResponse.end(JSON.stringify({ Error: 'no' }));
		});
		_Server.listen(0, '127.0.0.1', () =>
		{
			_BaseURL = `http://127.0.0.1:${_Server.address().port}`;
			fResolve();
		});
	});
}

function buildIntrospectorService()
{
	let tmpFable = new libPict({ Product: 'MeadowEndpointsIntrospectorTest', LogStreams: [ { streamtype: 'console', level: 'fatal' } ] });
	tmpFable.serviceManager.addServiceType('DataBeaconSchemaIntrospector', libSchemaIntrospector);
	return tmpFable.serviceManager.instantiateServiceProvider('DataBeaconSchemaIntrospector');
}

function getIntrospector(pService, pConfig)
{
	return pService._getIntrospector('MeadowEndpoints', Object.assign({ SchemaDocumentURL: `${_BaseURL}/docs/Extended.json` }, pConfig || {}));
}

suite('MeadowEndpoints introspector', function ()
{
	suiteSetup(async function () { await startStubAPI(); });
	suiteTeardown(function () { if (_Server) { _Server.close(); } });
	setup(function () { _FetchCount = 0; });

	test('the dispatcher returns an introspector for the MeadowEndpoints type', function ()
	{
		Expect(getIntrospector(buildIntrospectorService())).to.be.an('object');
		Expect(buildIntrospectorService()._getIntrospector('SomethingElse')).to.equal(null);
	});

	test('listTables returns the document table names, sorted', function (fDone)
	{
		getIntrospector(buildIntrospectorService()).listTables(null, (pError, pTables) =>
		{
			Expect(pError).to.equal(null);
			Expect(pTables.map((pTable) => pTable.TableName)).to.deep.equal([ 'Document', 'Project' ]);
			fDone();
		});
	});

	test('describeTable maps the embedded MeadowSchema (identity, sizes, types)', function (fDone)
	{
		getIntrospector(buildIntrospectorService()).describeTable(null, 'Document', (pError, pColumns) =>
		{
			Expect(pError).to.equal(null);
			const tmpByName = Object.fromEntries(pColumns.map((pColumn) => [ pColumn.Name, pColumn ]));
			Expect(tmpByName.IDDocument).to.deep.include({ IsPrimaryKey: true, IsAutoIncrement: true, MeadowType: 'AutoIdentity', Nullable: false });
			Expect(tmpByName.GUIDDocument.MaxLength).to.equal('128');
			Expect(tmpByName.FormDataJSON).to.deep.include({ MeadowType: 'Text', MaxLength: null });
			Expect(tmpByName.Deleted.MeadowType).to.equal('Deleted');
			fDone();
		});
	});

	test('an unknown table is a clear error', function (fDone)
	{
		getIntrospector(buildIntrospectorService()).describeTable(null, 'Nope', (pError) =>
		{
			Expect(pError).to.be.instanceOf(Error);
			Expect(pError.message).to.match(/not present in the remote schema document/);
			fDone();
		});
	});

	test('a missing SchemaDocumentURL is a clear configuration error', function (fDone)
	{
		buildIntrospectorService()._getIntrospector('MeadowEndpoints', {}).listTables(null, (pError) =>
		{
			Expect(pError).to.be.instanceOf(Error);
			Expect(pError.message).to.match(/SchemaDocumentURL/);
			fDone();
		});
	});

	test('the document is cached within the TTL (one fetch for many calls)', function (fDone)
	{
		const tmpService = buildIntrospectorService();
		const tmpIntrospector = getIntrospector(tmpService, { SchemaDocumentTTLSeconds: 300 });
		tmpIntrospector.listTables(null, () =>
		{
			tmpIntrospector.describeTable(null, 'Project', () =>
			{
				tmpIntrospector.listTables(null, () =>
				{
					Expect(_FetchCount).to.equal(1);
					fDone();
				});
			});
		});
	});

	test('concurrent calls share one in-flight fetch', function (fDone)
	{
		const tmpIntrospector = getIntrospector(buildIntrospectorService(), { SchemaDocumentTTLSeconds: 300 });
		let tmpRemaining = 3;
		const fEach = (pError, pTables) =>
		{
			Expect(pError).to.equal(null);
			Expect(pTables.length).to.equal(2);
			if (--tmpRemaining === 0)
			{
				Expect(_FetchCount).to.equal(1, 'parallel callers must share the fetch');
				fDone();
			}
		};
		tmpIntrospector.listTables(null, fEach);
		tmpIntrospector.listTables(null, fEach);
		tmpIntrospector.listTables(null, fEach);
	});

	test('the TTL expires the cache and a later call refetches', function (fDone)
	{
		const tmpService = buildIntrospectorService();
		const tmpIntrospector = getIntrospector(tmpService, { SchemaDocumentTTLSeconds: 0 });
		tmpIntrospector.listTables(null, () =>
		{
			setTimeout(() =>
			{
				tmpIntrospector.listTables(null, () =>
				{
					Expect(_FetchCount).to.equal(2);
					fDone();
				});
			}, 5);
		});
	});

	test('fetch failures surface (HTTP error / invalid JSON) without caching', function (fDone)
	{
		const tmpService = buildIntrospectorService();
		tmpService._getIntrospector('MeadowEndpoints', { SchemaDocumentURL: `${_BaseURL}/docs/Missing.json` }).listTables(null, (pError) =>
		{
			Expect(pError).to.be.instanceOf(Error);
			Expect(pError.message).to.match(/HTTP 404/);
			tmpService._getIntrospector('MeadowEndpoints', { SchemaDocumentURL: `${_BaseURL}/docs/NotJson.json` }).listTables(null, (pError2) =>
			{
				Expect(pError2).to.be.instanceOf(Error);
				Expect(pError2.message).to.match(/not valid JSON/);
				fDone();
			});
		});
	});
});

suite('MeadowEndpoints DAL settings projection', function ()
{
	const libDynamicEndpointManager = require('../source/services/DataBeacon-DynamicEndpointManager.js');

	function buildManager()
	{
		let tmpFable = new libPict({ Product: 'SettingsProjectionTest', LogStreams: [ { streamtype: 'console', level: 'fatal' } ] });
		tmpFable.serviceManager.addServiceType('DataBeaconDynamicEndpointManager', libDynamicEndpointManager);
		return { fable: tmpFable, manager: tmpFable.serviceManager.instantiateServiceProvider('DataBeaconDynamicEndpointManager') };
	}

	test('fills settings.MeadowEndpoints from the connector so the DAL provider can read it', function ()
	{
		const tmpHarness = buildManager();
		const tmpScopedFable = Object.create(tmpHarness.fable);
		const tmpInstanceSettings = { ServerProtocol: 'https', ServerAddress: 'api.qa.example.com', ServerPort: '443', Authentication: { UserName: 'svc' } };
		tmpHarness.manager._projectConnectionSettings(tmpScopedFable, 'MeadowEndpoints', { settings: tmpInstanceSettings });
		// fill deep-copies — assert by value, and via the settings getter the
		// provider walks (works from any fable scope).
		libAssert.deepStrictEqual(tmpScopedFable.settings.MeadowEndpoints, tmpInstanceSettings);
		libAssert.ok(tmpHarness.fable.settings.hasOwnProperty('MeadowEndpoints'), 'the meadow provider hasOwnProperty gate must pass');
	});

	test('explicit boot configuration wins — fill never overwrites', function ()
	{
		const tmpHarness = buildManager();
		tmpHarness.fable.SettingsManager.fill({ MeadowEndpoints: { ServerAddress: 'operator-pinned.example.com' } });
		tmpHarness.manager._projectConnectionSettings(tmpHarness.fable, 'MeadowEndpoints', { settings: { ServerAddress: 'connection.example.com' } });
		libAssert.strictEqual(tmpHarness.fable.settings.MeadowEndpoints.ServerAddress, 'operator-pinned.example.com');
	});

	test('with two connections the first enabled wins (documented limitation)', function ()
	{
		const tmpHarness = buildManager();
		tmpHarness.manager._projectConnectionSettings(tmpHarness.fable, 'MeadowEndpoints', { settings: { ServerAddress: 'a.example.com' } });
		tmpHarness.manager._projectConnectionSettings(tmpHarness.fable, 'MeadowEndpoints', { settings: { ServerAddress: 'b.example.com' } });
		libAssert.strictEqual(tmpHarness.fable.settings.MeadowEndpoints.ServerAddress, 'a.example.com');
	});

	test('non-MeadowEndpoints types are a no-op', function ()
	{
		const tmpHarness = buildManager();
		tmpHarness.manager._projectConnectionSettings(tmpHarness.fable, 'MySQL', { settings: { ServerAddress: 'x' } });
		libAssert.strictEqual(tmpHarness.fable.settings.MeadowEndpoints, undefined);
	});
});
