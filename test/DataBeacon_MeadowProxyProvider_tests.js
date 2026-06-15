/**
 * Unit tests for DataBeacon-MeadowProxyProvider
 *
 * Covers:
 *   - Path allowlist compilation and matching
 *   - Method gating (AllowWrites = false rejects writes)
 *   - Loopback request happy path (against a local mock HTTP server)
 *   - Handler logs and returns a proper { Status, Body } envelope
 *
 * @author Steven Velozo <steven@velozo.com>
 * @license MIT
 */
const Chai = require('chai');
const Expect = Chai.expect;
const libHTTP = require('http');

const libMeadowProxy = require('../source/services/DataBeacon-MeadowProxyProvider.js');

// ------------------------------------------------------------------
// Local test HTTP server — stands in for the databeacon's own REST API
// ------------------------------------------------------------------

let _TestServer = null;
let _TestPort = 0;
let _TestRequests = [];
let _TestResponder = null;

const startTestServer = function (fCallback)
{
	_TestRequests = [];
	_TestResponder = null;

	_TestServer = libHTTP.createServer((pRequest, pResponse) =>
	{
		let tmpData = '';
		pRequest.on('data', (pChunk) => { tmpData += pChunk; });
		pRequest.on('end', () =>
		{
			_TestRequests.push({
				method: pRequest.method,
				path: pRequest.url,
				headers: pRequest.headers,
				body: tmpData
			});
			if (_TestResponder)
			{
				_TestResponder(pRequest, pResponse, tmpData);
			}
			else
			{
				pResponse.writeHead(200, { 'Content-Type': 'application/json' });
				pResponse.end(JSON.stringify({ echoed: true }));
			}
		});
	});

	_TestServer.listen(0, '127.0.0.1', () =>
	{
		_TestPort = _TestServer.address().port;
		fCallback(null);
	});
};

const stopTestServer = function (fCallback)
{
	if (_TestServer)
	{
		_TestServer.close(fCallback);
		_TestServer = null;
	}
	else
	{
		fCallback(null);
	}
};

// ------------------------------------------------------------------
// Helpers — fake beacon service and fable to exercise registerMeadowProxyCapability
// ------------------------------------------------------------------

const makeFakeBeaconService = function ()
{
	return {
		_registered: [],
		registerCapability: function (pCapabilitySpec)
		{
			this._registered.push(pCapabilitySpec);
		}
	};
};

const makeFakeFable = function (pPort)
{
	let tmpLogs = [];
	return {
		_logs: tmpLogs,
		settings: { APIServerPort: pPort, APIServerAddress: '127.0.0.1' },
		log: {
			info: (pMsg) => tmpLogs.push({ level: 'info', message: pMsg }),
			warn: (pMsg) => tmpLogs.push({ level: 'warn', message: pMsg }),
			error: (pMsg) => tmpLogs.push({ level: 'error', message: pMsg })
		}
	};
};

// ------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------

suite('DataBeacon-MeadowProxyProvider', () =>
{
	suiteSetup((fDone) => startTestServer(fDone));
	suiteTeardown((fDone) => stopTestServer(fDone));

	setup(() =>
	{
		_TestRequests = [];
		_TestResponder = null;
	});

	// --------------------------------------------------------------
	suite('Path allowlist', () =>
	{
		test('default allowlist permits hash-prefixed /1.0/{hash}/ paths', () =>
		{
			let tmpList = libMeadowProxy._compilePathAllowlist(null);
			Expect(libMeadowProxy._isPathAllowed('/1.0/bookstore-mssql/Book', tmpList)).to.equal(true);
			Expect(libMeadowProxy._isPathAllowed('1.0/analytics/Author/5', tmpList)).to.equal(true);
			Expect(libMeadowProxy._isPathAllowed('/1.0/db-2024/User', tmpList)).to.equal(true);
		});

		test('default allowlist rejects unprefixed /1.0/ paths (internal entities)', () =>
		{
			let tmpList = libMeadowProxy._compilePathAllowlist(null);
			Expect(libMeadowProxy._isPathAllowed('/1.0/User', tmpList)).to.equal(false);
			Expect(libMeadowProxy._isPathAllowed('/1.0/BeaconConnection', tmpList)).to.equal(false);
		});

		test('default allowlist rejects non-REST paths', () =>
		{
			let tmpList = libMeadowProxy._compilePathAllowlist(null);
			Expect(libMeadowProxy._isPathAllowed('/beacon/secret', tmpList)).to.equal(false);
			Expect(libMeadowProxy._isPathAllowed('/internal/debug', tmpList)).to.equal(false);
			Expect(libMeadowProxy._isPathAllowed('', tmpList)).to.equal(false);
		});

		test('custom string patterns are compiled and enforced', () =>
		{
			let tmpList = libMeadowProxy._compilePathAllowlist(['^/api/v2/']);
			Expect(libMeadowProxy._isPathAllowed('/api/v2/users', tmpList)).to.equal(true);
			Expect(libMeadowProxy._isPathAllowed('/1.0/Book', tmpList)).to.equal(false);
		});
	});

	// --------------------------------------------------------------
	suite('Capability registration', () =>
	{
		test('registers MeadowProxy capability with a Request action', () =>
		{
			let tmpService = makeFakeBeaconService();
			let tmpFable = makeFakeFable(_TestPort);
			libMeadowProxy.registerMeadowProxyCapability(tmpService, tmpFable);

			Expect(tmpService._registered).to.have.length(1);
			let tmpSpec = tmpService._registered[0];
			Expect(tmpSpec.Capability).to.equal('MeadowProxy');
			Expect(tmpSpec.actions).to.have.property('Request');
			Expect(tmpSpec.actions.Request.SettingsSchema).to.be.an('array');

			let tmpSchemaNames = tmpSpec.actions.Request.SettingsSchema.map((pS) => pS.Name);
			Expect(tmpSchemaNames).to.include('Method');
			Expect(tmpSchemaNames).to.include('Path');
		});
	});

	// --------------------------------------------------------------
	suite('Request handler', () =>
	{
		test('proxies a GET /1.0/Book request to the loopback server', (fDone) =>
		{
			let tmpService = makeFakeBeaconService();
			let tmpFable = makeFakeFable(_TestPort);
			libMeadowProxy.registerMeadowProxyCapability(tmpService, tmpFable);

			_TestResponder = function (pReq, pRes)
			{
				pRes.writeHead(200, { 'Content-Type': 'application/json' });
				pRes.end(JSON.stringify([{ IDBook: 1 }, { IDBook: 2 }]));
			};

			let tmpHandler = tmpService._registered[0].actions.Request.Handler;
			tmpHandler(
				{ Settings: { Method: 'GET', Path: '/1.0/bookstore-mssql/Book', RemoteUser: 'engineer-alice' } },
				{},
				(pError, pResult) =>
				{
					Expect(pError).to.equal(null);
					Expect(pResult.Outputs).to.be.an('object');
					Expect(pResult.Outputs.Status).to.equal(200);
					let tmpRows = JSON.parse(pResult.Outputs.Body);
					Expect(tmpRows).to.have.length(2);

					Expect(_TestRequests[0].method).to.equal('GET');
					Expect(_TestRequests[0].path).to.equal('/1.0/bookstore-mssql/Book');
					Expect(_TestRequests[0].headers['x-beacon-user']).to.equal('engineer-alice');
					Expect(_TestRequests[0].headers['x-databeacon-meadowproxy']).to.equal('1');
					Expect(_TestRequests[0].headers['x-trusted-session']).to.equal(undefined, 'no Session setting → no forwarded identity');
					fDone();
				});
		});

		test('a forwarded Session object is presented to the loopback as x-trusted-session JSON', (fDone) =>
		{
			let tmpService = makeFakeBeaconService();
			let tmpFable = makeFakeFable(_TestPort);
			libMeadowProxy.registerMeadowProxyCapability(tmpService, tmpFable);

			let tmpHandler = tmpService._registered[0].actions.Request.Handler;
			tmpHandler(
				{ Settings: { Method: 'GET', Path: '/1.0/bookstore-mssql/Book', Session: { SessionID: 'sess-abc', CustomerID: 182, UserID: 5150 } } },
				{},
				(pError) =>
				{
					Expect(pError).to.equal(null);
					let tmpForwarded = JSON.parse(_TestRequests[0].headers['x-trusted-session']);
					Expect(tmpForwarded.SessionID).to.equal('sess-abc');
					Expect(tmpForwarded.CustomerID).to.equal(182);
					Expect(tmpForwarded.UserID).to.equal(5150);
					fDone();
				});
		});

		test('a bare Session string is wrapped as { SessionID }', (fDone) =>
		{
			let tmpService = makeFakeBeaconService();
			let tmpFable = makeFakeFable(_TestPort);
			libMeadowProxy.registerMeadowProxyCapability(tmpService, tmpFable);

			let tmpHandler = tmpService._registered[0].actions.Request.Handler;
			tmpHandler(
				{ Settings: { Method: 'GET', Path: '/1.0/bookstore-mssql/Book', Session: 'sess-bare' } },
				{},
				(pError) =>
				{
					Expect(pError).to.equal(null);
					let tmpForwarded = JSON.parse(_TestRequests[0].headers['x-trusted-session']);
					Expect(tmpForwarded.SessionID).to.equal('sess-bare');
					fDone();
				});
		});

		test('the Request action advertises the Session setting in its schema', () =>
		{
			let tmpService = makeFakeBeaconService();
			let tmpFable = makeFakeFable(_TestPort);
			libMeadowProxy.registerMeadowProxyCapability(tmpService, tmpFable);
			let tmpSchemaNames = tmpService._registered[0].actions.Request.SettingsSchema.map((pS) => pS.Name);
			Expect(tmpSchemaNames).to.include('Session');
		});

		test('forwards POST body to the loopback server', (fDone) =>
		{
			let tmpService = makeFakeBeaconService();
			let tmpFable = makeFakeFable(_TestPort);
			libMeadowProxy.registerMeadowProxyCapability(tmpService, tmpFable);

			_TestResponder = function (pReq, pRes, pBody)
			{
				pRes.writeHead(200, { 'Content-Type': 'application/json' });
				pRes.end(JSON.stringify({ received: JSON.parse(pBody) }));
			};

			let tmpHandler = tmpService._registered[0].actions.Request.Handler;
			tmpHandler(
				{ Settings: { Method: 'POST', Path: '/1.0/bookstore-mssql/Book', Body: JSON.stringify({ Name: 'Test' }) } },
				{},
				(pError, pResult) =>
				{
					Expect(pError).to.equal(null);
					Expect(pResult.Outputs.Status).to.equal(200);
					let tmpParsed = JSON.parse(pResult.Outputs.Body);
					Expect(tmpParsed.received.Name).to.equal('Test');
					fDone();
				});
		});

		test('rejects paths outside the allowlist', (fDone) =>
		{
			let tmpService = makeFakeBeaconService();
			let tmpFable = makeFakeFable(_TestPort);
			libMeadowProxy.registerMeadowProxyCapability(tmpService, tmpFable);

			let tmpHandler = tmpService._registered[0].actions.Request.Handler;
			tmpHandler(
				{ Settings: { Method: 'GET', Path: '/beacon/secret' } },
				{},
				(pError) =>
				{
					Expect(pError).to.be.an('error');
					Expect(pError.message).to.contain('allowlist');
					Expect(_TestRequests).to.have.length(0);
					fDone();
				});
		});

		test('rejects writes when AllowWrites = false', (fDone) =>
		{
			let tmpService = makeFakeBeaconService();
			let tmpFable = makeFakeFable(_TestPort);
			libMeadowProxy.registerMeadowProxyCapability(tmpService, tmpFable, { AllowWrites: false });

			let tmpHandler = tmpService._registered[0].actions.Request.Handler;
			tmpHandler(
				{ Settings: { Method: 'DELETE', Path: '/1.0/bookstore-mssql/Book/5' } },
				{},
				(pError) =>
				{
					Expect(pError).to.be.an('error');
					Expect(pError.message).to.contain('writes are disabled');
					Expect(_TestRequests).to.have.length(0);
					fDone();
				});
		});

		test('permits GET when AllowWrites = false', (fDone) =>
		{
			let tmpService = makeFakeBeaconService();
			let tmpFable = makeFakeFable(_TestPort);
			libMeadowProxy.registerMeadowProxyCapability(tmpService, tmpFable, { AllowWrites: false });

			let tmpHandler = tmpService._registered[0].actions.Request.Handler;
			tmpHandler(
				{ Settings: { Method: 'GET', Path: '/1.0/bookstore-mssql/Book' } },
				{},
				(pError, pResult) =>
				{
					Expect(pError).to.equal(null);
					Expect(pResult.Outputs.Status).to.equal(200);
					fDone();
				});
		});

		test('surfaces loopback server errors as callback errors', (fDone) =>
		{
			let tmpService = makeFakeBeaconService();
			let tmpFable = makeFakeFable(59999); // not listening
			libMeadowProxy.registerMeadowProxyCapability(tmpService, tmpFable);

			let tmpHandler = tmpService._registered[0].actions.Request.Handler;
			tmpHandler(
				{ Settings: { Method: 'GET', Path: '/1.0/bookstore-mssql/Book' } },
				{},
				(pError) =>
				{
					Expect(pError).to.be.an('error');
					fDone();
				});
		});

		test('requires a Method', (fDone) =>
		{
			let tmpService = makeFakeBeaconService();
			let tmpFable = makeFakeFable(_TestPort);
			libMeadowProxy.registerMeadowProxyCapability(tmpService, tmpFable);

			let tmpHandler = tmpService._registered[0].actions.Request.Handler;
			tmpHandler(
				{ Settings: { Path: '/1.0/bookstore-mssql/Book' } },
				{},
				(pError) =>
				{
					Expect(pError).to.be.an('error');
					Expect(pError.message).to.contain('Method');
					fDone();
				});
		});
	});
});
