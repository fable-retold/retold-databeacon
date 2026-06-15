/**
 * DataBeacon -- Meadow Proxy Provider
 *
 * Registers a MeadowProxy beacon capability on a DataBeacon agent. The single
 * `Request` action receives an HTTP request descriptor (Method, Path, Body)
 * from the ultravisor mesh and proxies it to the databeacon's own localhost
 * REST server. This lets a client-mode databeacon drive remote meadow CRUD
 * transparently — the entire REST surface already implemented by the
 * DataBeacon DynamicEndpointManager becomes reachable through the mesh.
 *
 * Safety:
 *   - Path is allowlist-gated. Only /1.0/* (the meadow REST API) is reachable
 *     by default. Extended paths can be added via config.
 *   - DELETE/PUT/POST are gated behind AllowWrites (opt-in per deployment).
 *   - Each request emits an audit log entry including the RemoteUser claim.
 *
 * @author Steven Velozo <steven@velozo.com>
 * @license MIT
 */
const libHTTP = require('http');

// Only hash-prefixed customer routes are reachable through MeadowProxy.
// Internal databeacon entities (at /1.0/User, /1.0/BeaconConnection, etc.)
// stay invisible to mesh clients — they remain reachable only through the
// typed DataBeaconAccess / DataBeaconManagement capabilities.
const DEFAULT_PATH_ALLOWLIST = [/^\/?1\.0\/[a-z0-9][a-z0-9-]{0,63}\//];

const DEFAULT_OPTIONS = {
	// Regexes (as strings — compiled at register time) the Path must match.
	// Defaults allow only the meadow REST API.
	PathAllowlist: null, // falls back to DEFAULT_PATH_ALLOWLIST

	// Gate writes. When false, only GET and HEAD are proxied.
	AllowWrites: true,

	// Internal loopback header — the databeacon's restify layer can short-
	// circuit auth for requests bearing this token (future work).
	InternalHeaderName: 'X-DataBeacon-MeadowProxy',
	InternalHeaderValue: '1'
};

/**
 * Compile the allowlist to RegExp objects.
 *
 * @param {Array<string|RegExp>} pPatterns
 * @returns {Array<RegExp>}
 */
const compilePathAllowlist = function (pPatterns)
{
	let tmpList = pPatterns || DEFAULT_PATH_ALLOWLIST;
	let tmpCompiled = [];
	for (let i = 0; i < tmpList.length; i++)
	{
		let tmpItem = tmpList[i];
		if (tmpItem instanceof RegExp)
		{
			tmpCompiled.push(tmpItem);
		}
		else if (typeof(tmpItem) === 'string')
		{
			tmpCompiled.push(new RegExp(tmpItem));
		}
	}
	return tmpCompiled;
};

/**
 * Test whether a request path is allowlisted.
 *
 * @param {string} pPath
 * @param {Array<RegExp>} pCompiledAllowlist
 * @returns {boolean}
 */
const isPathAllowed = function (pPath, pCompiledAllowlist)
{
	if (typeof(pPath) !== 'string' || pPath.length === 0) { return false; }
	for (let i = 0; i < pCompiledAllowlist.length; i++)
	{
		if (pCompiledAllowlist[i].test(pPath)) { return true; }
	}
	return false;
};

/**
 * Make a loopback HTTP request to the databeacon's own REST server.
 *
 * @param {object} pOptions    - { hostname, port, path, method, headers, body }
 * @param {function} fCallback - function(pError, pResult) where pResult is
 *   { Status, Headers, Body }. Body is the raw response string (the caller
 *   is responsible for deciding whether to parse JSON).
 */
const loopbackRequest = function (pOptions, fCallback)
{
	let tmpCallbackFired = false;
	let tmpComplete = (pError, pResult) =>
	{
		if (tmpCallbackFired) { return; }
		tmpCallbackFired = true;
		return fCallback(pError, pResult);
	};

	let tmpBody = (typeof(pOptions.body) === 'string') ? pOptions.body : '';

	let tmpHeaders = Object.assign({}, pOptions.headers || {},
		{
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(tmpBody)
		});

	let tmpReq = libHTTP.request(
		{
			hostname: pOptions.hostname || '127.0.0.1',
			port: pOptions.port,
			path: pOptions.path,
			method: pOptions.method || 'GET',
			headers: tmpHeaders
		},
		(pResponse) =>
		{
			let tmpData = '';
			pResponse.on('data', (pChunk) => { tmpData += pChunk; });
			pResponse.on('end', () =>
			{
				return tmpComplete(null,
					{
						Status: pResponse.statusCode,
						Headers: pResponse.headers,
						Body: tmpData
					});
			});
			pResponse.on('error', tmpComplete);
		});

	tmpReq.on('error', tmpComplete);
	if (tmpBody.length > 0)
	{
		tmpReq.write(tmpBody);
	}
	tmpReq.end();
};

/**
 * Stash for runtime config mutations. The MeadowProxy capability is
 * registered once (with a closed-over `tmpOptions` and compiled
 * allowlist), but operators sometimes need to extend the allowlist
 * after the fact — e.g. when ultravisor's persistence bridges arrive
 * with their PascalCase `/1.0/UV...` paths. Updates routed through
 * `DataBeaconManagement.UpdateProxyConfig` mutate the entry stored
 * here, which the closure consults on every Request.
 *
 * Single-beacon scope today: one databeacon = one MeadowProxy entry.
 * If we ever support multiple distinct MeadowProxy capabilities on
 * one beacon, this will need to key by capability name.
 */
let _ActiveMeadowProxyConfig = null;

/**
 * Register the MeadowProxy capability on an existing beacon service.
 *
 * @param {object} pBeaconService - An enabled ultravisor-beacon service
 * @param {object} pFable         - The databeacon's fable instance (exposes .settings and .log)
 * @param {object} [pOptions]     - Options overriding DEFAULT_OPTIONS
 */
const registerMeadowProxyCapability = function (pBeaconService, pFable, pOptions)
{
	let tmpOptions = Object.assign({}, DEFAULT_OPTIONS, pOptions || {});
	// State the closure consults on each Request. Mutated through
	// `extendPathAllowlist` / `setPathAllowlist` so allowlist updates
	// from the lab take effect without re-registering the capability.
	let tmpRuntime =
		{
			compiledAllowlist: compilePathAllowlist(tmpOptions.PathAllowlist),
			allowWrites: tmpOptions.AllowWrites
		};
	_ActiveMeadowProxyConfig = tmpRuntime;
	let tmpLog = pFable.log;

	pBeaconService.registerCapability(
		{
			Capability: 'MeadowProxy',
			Name: 'DataBeaconMeadowProxyProvider',
			actions:
			{
				'Request':
				{
					Description: 'Proxy an HTTP request to the databeacon\'s localhost REST API',
					SettingsSchema:
					[
						{ Name: 'Method',     DataType: 'String', Required: true },
						{ Name: 'Path',       DataType: 'String', Required: true },
						{ Name: 'Body',       DataType: 'String', Required: false },
						{ Name: 'RemoteUser', DataType: 'String', Required: false },

						// Forwarded caller identity. A session id string or a
						// session object ({ SessionID, CustomerID, UserID, ... }).
						// Presented to the local REST API as `x-trusted-session`
						// so a remote-fronting connection acts under the caller's
						// identity instead of its bound machine session.
						{ Name: 'Session',    DataType: 'Object', Required: false }
					],
					Handler: function (pWorkItem, pContext, fHandlerCallback)
					{
						let tmpStart = Date.now();
						let tmpSettings = pWorkItem.Settings || {};
						let tmpMethod = (typeof(tmpSettings.Method) === 'string') ? tmpSettings.Method.toUpperCase() : '';
						let tmpPath = tmpSettings.Path || '';
						let tmpRawBody = (typeof(tmpSettings.Body) === 'string') ? tmpSettings.Body : '';
						let tmpRemoteUser = tmpSettings.RemoteUser || 'anonymous';

						// Validate method
						if (!tmpMethod)
						{
							return fHandlerCallback(new Error('MeadowProxy: Method is required.'));
						}
						if (!tmpRuntime.allowWrites && tmpMethod !== 'GET' && tmpMethod !== 'HEAD')
						{
							if (tmpLog) { tmpLog.warn(`MeadowProxy: rejected ${tmpMethod} ${tmpPath} (writes disabled)`); }
							return fHandlerCallback(new Error('MeadowProxy: writes are disabled on this beacon.'));
						}

						// Validate path
						if (!isPathAllowed(tmpPath, tmpRuntime.compiledAllowlist))
						{
							if (tmpLog) { tmpLog.warn(`MeadowProxy: rejected ${tmpMethod} ${tmpPath} (not allowlisted)`); }
							return fHandlerCallback(new Error('MeadowProxy: path is not in the allowlist.'));
						}

						// Port from fable settings
						let tmpPort = (pFable.settings && pFable.settings.APIServerPort) || 8389;
						let tmpHostname = (pFable.settings && pFable.settings.APIServerAddress) || '127.0.0.1';

						// Normalise leading slash
						let tmpRequestPath = (tmpPath.charAt(0) === '/') ? tmpPath : ('/' + tmpPath);

						let tmpHeaders = {};
						tmpHeaders[tmpOptions.InternalHeaderName] = tmpOptions.InternalHeaderValue;
						tmpHeaders['X-Beacon-User'] = tmpRemoteUser;

						// Forward the caller identity so a remote-fronting connection
						// presents it upstream (instead of its bound machine session).
						// meadow-endpoints (Header session source) reads x-trusted-session.
						if (tmpSettings.Session)
						{
							let tmpSessionObject = (typeof(tmpSettings.Session) === 'string')
								? { SessionID: tmpSettings.Session } : tmpSettings.Session;
							tmpHeaders['x-trusted-session'] = JSON.stringify(tmpSessionObject);
						}

						loopbackRequest(
							{
								hostname: tmpHostname,
								port: tmpPort,
								path: tmpRequestPath,
								method: tmpMethod,
								headers: tmpHeaders,
								body: tmpRawBody
							},
							(pError, pResult) =>
							{
								let tmpElapsed = Date.now() - tmpStart;
								if (pError)
								{
									if (tmpLog) { tmpLog.warn(`MeadowProxy: ${tmpMethod} ${tmpPath} failed after ${tmpElapsed}ms — ${pError.message}`); }
									return fHandlerCallback(pError);
								}
								if (tmpLog) { tmpLog.info(`MeadowProxy: ${tmpMethod} ${tmpPath} status=${pResult.Status} elapsed=${tmpElapsed}ms user=${tmpRemoteUser}`); }
								// Ultravisor-beacon Client expects { Outputs, Log } — results
								// outside the Outputs envelope are dropped on the floor.
								// Headers are forwarded so callers can see meadow's
								// X-Meadow-Upsert-{Total,Succeeded,Errored} counts on
								// bulk /Upserts; without them, a chunk where every row
								// failed (postgres type errors, missing table, NOT NULL
								// violations) returns HTTP 200 with body=[] and the
								// caller can't tell success from total failure.
								return fHandlerCallback(null,
									{
										Outputs:
										{
											Status:  pResult.Status,
											Headers: pResult.Headers || {},
											Body:    pResult.Body
										},
										Log: []
									});
							});
					}
				}
			}
		});
};

/**
 * Extend the active MeadowProxy capability's path allowlist at runtime.
 * Each entry in `pPatterns` may be a RegExp or a string regex source;
 * strings are compiled here. Patterns already present (by source) are
 * skipped so repeat calls are idempotent. Returns the new compiled
 * allowlist length, or 0 if no MeadowProxy capability has been
 * registered yet.
 */
const extendPathAllowlist = function (pPatterns)
{
	if (!_ActiveMeadowProxyConfig) { return 0; }
	if (!Array.isArray(pPatterns) || pPatterns.length === 0)
	{
		return _ActiveMeadowProxyConfig.compiledAllowlist.length;
	}
	let tmpExisting = _ActiveMeadowProxyConfig.compiledAllowlist;
	let tmpExistingSources = new Set(tmpExisting.map((pR) => pR.source));
	let tmpNew = compilePathAllowlist(pPatterns);
	for (let i = 0; i < tmpNew.length; i++)
	{
		if (!tmpExistingSources.has(tmpNew[i].source))
		{
			tmpExisting.push(tmpNew[i]);
		}
	}
	return tmpExisting.length;
};

/**
 * Replace the active MeadowProxy allowlist outright. Use sparingly —
 * typical lab use is `extendPathAllowlist`.
 */
const setPathAllowlist = function (pPatterns)
{
	if (!_ActiveMeadowProxyConfig) { return 0; }
	_ActiveMeadowProxyConfig.compiledAllowlist = compilePathAllowlist(pPatterns);
	return _ActiveMeadowProxyConfig.compiledAllowlist.length;
};

/**
 * Toggle write-allow at runtime without re-registering the capability.
 */
const setAllowWrites = function (pAllow)
{
	if (!_ActiveMeadowProxyConfig) { return false; }
	_ActiveMeadowProxyConfig.allowWrites = !!pAllow;
	return _ActiveMeadowProxyConfig.allowWrites;
};

/**
 * Snapshot of the active config — handy for tests and the
 * UpdateProxyConfig action's response payload.
 */
const getActiveConfig = function ()
{
	if (!_ActiveMeadowProxyConfig) { return null; }
	return {
		AllowWrites: _ActiveMeadowProxyConfig.allowWrites,
		PathAllowlist: _ActiveMeadowProxyConfig.compiledAllowlist.map((pR) => pR.source)
	};
};

/**
 * Test-only helper. Drops the registry entry so a fresh
 * `registerMeadowProxyCapability` starts cleanly.
 */
const _resetActiveConfig = function ()
{
	_ActiveMeadowProxyConfig = null;
};

module.exports =
	{
		registerMeadowProxyCapability: registerMeadowProxyCapability,
		extendPathAllowlist: extendPathAllowlist,
		setPathAllowlist: setPathAllowlist,
		setAllowWrites: setAllowWrites,
		getActiveConfig: getActiveConfig,
		// Exported for unit tests:
		_compilePathAllowlist: compilePathAllowlist,
		_isPathAllowed: isPathAllowed,
		_loopbackRequest: loopbackRequest,
		_resetActiveConfig: _resetActiveConfig,
		DEFAULT_PATH_ALLOWLIST: DEFAULT_PATH_ALLOWLIST,
		DEFAULT_OPTIONS: DEFAULT_OPTIONS
	};
