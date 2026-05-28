/**
 * DataBeacon - Beacon Provider Service
 *
 * Registers the DataBeacon as a beacon in the Ultravisor mesh,
 * exposing data access and management capabilities so other nodes
 * can interact with the connected databases remotely.
 *
 * Two capabilities are registered:
 *   - DataBeaconAccess:      Read operations (list connections, tables, records, query)
 *   - DataBeaconManagement:  Write operations (add connection, introspect, enable/disable endpoints)
 *
 * @author Steven Velozo <steven@velozo.com>
 */
const libFableServiceProviderBase = require('fable-serviceproviderbase');
const libMeadowProxyProvider = require('./DataBeacon-MeadowProxyProvider.js');
const { registerMeadowProxyCapability, extendPathAllowlist, setAllowWrites, getActiveConfig } = libMeadowProxyProvider;
const DataBeaconSchemaManager = require('./DataBeacon-SchemaManager.js');
const { registerSchemaCapability } = DataBeaconSchemaManager;
const { buildAggregateSQL } = require('./DataBeacon-SQLEmitter-Aggregate.js');
const { buildJoinPagedSQL } = require('./DataBeacon-SQLEmitter-Join.js');

let libBeaconService = null;
try
{
	libBeaconService = require('ultravisor-beacon');
}
catch (pError)
{
	// ultravisor-beacon is optional at load time
}

const defaultBeaconProviderOptions = (
	{
		RoutePrefix: '/beacon'
	});

class DataBeaconBeaconProvider extends libFableServiceProviderBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, defaultBeaconProviderOptions, pOptions);
		super(pFable, tmpOptions, pServiceHash);

		this.serviceType = 'DataBeaconBeaconProvider';

		this._BeaconService = null;
	}

	/**
	 * Connect to an Ultravisor coordinator as a beacon.
	 *
	 * @param {object} pBeaconConfig Beacon configuration:
	 *   - ServerURL {string} Ultravisor server URL (required)
	 *   - Name {string} Beacon name / mesh handle (default: 'retold-databeacon')
	 *   - UserName {string} HTTP-auth identity for /1.0/Authenticate (default: '' → falls back to Name in the SDK)
	 *   - Password {string} Auth password (default: '')
	 *   - MaxConcurrent {number} Max concurrent work items (default: 3)
	 *   - Tags {object} Beacon tags (default: {})
	 * @param {Function} fCallback Called with (pError)
	 */
	connectBeacon(pBeaconConfig, fCallback)
	{
		if (!libBeaconService)
		{
			return fCallback(new Error('ultravisor-beacon module is not installed.'));
		}

		if (!pBeaconConfig || !pBeaconConfig.ServerURL)
		{
			return fCallback(new Error('connectBeacon requires a ServerURL in the config.'));
		}

		if (this._BeaconService && this._BeaconService.isEnabled())
		{
			this.log.warn('DataBeaconBeaconProvider: beacon already connected.');
			return fCallback(null);
		}

		this.fable.addServiceTypeIfNotExists('UltravisorBeacon', libBeaconService);

		this._BeaconService = this.fable.instantiateServiceProviderWithoutRegistration('UltravisorBeacon',
			{
				ServerURL: pBeaconConfig.ServerURL,
				Name: pBeaconConfig.Name || 'retold-databeacon',
				UserName: pBeaconConfig.UserName || '',
				Password: pBeaconConfig.Password || '',
				MaxConcurrent: pBeaconConfig.MaxConcurrent || 3,
				StagingPath: pBeaconConfig.StagingPath || process.cwd(),
				Tags: pBeaconConfig.Tags || {},
				BindAddresses: pBeaconConfig.BindAddresses || []
			});

		// Register capabilities on the beacon-service. Extracted so
		// in-process integration tests can stand up a beacon-service,
		// register the same capability set, and exercise the handlers
		// without going through the thin-client / WebSocket stack.
		this._registerCapabilitiesOn(this._BeaconService, (pBeaconConfig && pBeaconConfig.MeadowProxy) || {});

		// Enable the beacon
		this._BeaconService.enable(
			(pError) =>
			{
				if (pError)
				{
					this.log.error(`Error enabling DataBeacon beacon: ${pError}`);
					return fCallback(pError);
				}
				this.log.info(`DataBeacon beacon connected to ${pBeaconConfig.ServerURL}`);
				// Install the web-UI auth proxy now that we know the UV
				// URL + beacon name + (eventually) the BeaconID.  This
				// is the entire opt-in for login + audit on the
				// databeacon's UI — gated routes 401 when UV is in
				// authenticated mode, pass-through in promiscuous.
				try
				{
					this._installWebAuth(pBeaconConfig);
				}
				catch (pInstallErr)
				{
					// Non-fatal: log and continue.  The beacon still
					// serves its API + UI; users just won't get the
					// login screen until the next restart.
					this.log.warn(`WebAuth install skipped: ${pInstallErr && pInstallErr.message}`);
				}
				return fCallback(null);
			});
	}

	/**
	 * Wire the beacon-SDK's WebAuth helper into the databeacon's Orator
	 * server.  Idempotent — the helper short-circuits on a repeat call
	 * via its internal WeakMap registry, so a second connectBeacon
	 * doesn't double-mount routes.
	 */
	_installWebAuth(pBeaconConfig)
	{
		if (!libBeaconService || !libBeaconService.WebAuth)
		{
			// SDK predates WebAuth; nothing to do.
			return;
		}
		if (!this.fable.OratorServiceServer)
		{
			this.log.warn('WebAuth install: OratorServiceServer not available on fable; skipping.');
			return;
		}
		this._WebAuthHandle = libBeaconService.WebAuth.install(this.fable.OratorServiceServer,
			{
				UltravisorURL:     pBeaconConfig.ServerURL,
				BeaconName:        pBeaconConfig.Name || 'retold-databeacon',
				BeaconID:          () => this._BeaconService && this._BeaconService.getBeaconID
					? this._BeaconService.getBeaconID() : '',
				CookieName:        'SessionID',
				RoutePrefix:       '/1.0/',
				StatusPath:        '/status',
				// Gate everything except /1.0/Authenticate, /CheckSession,
				// /Deauthenticate, /status, and the static web bundle
				// (paths under '/' that don't start with /1.0/, /api/, or
				// /beacon/).  Leaving /beacon/ ungated keeps the existing
				// /beacon/ultravisor/status route working pre-login so
				// the page-title fetch in index.html doesn't 401 before
				// the gate can redirect.
				GatedPathPrefixes: ['/1.0/Records', '/1.0/Connections', '/1.0/Endpoints'],
				Log:               this.fable.log
			});
		this.log.info('WebAuth: mounted /1.0/{Authenticate,Deauthenticate,CheckSession} + /status proxy');
	}

	/**
	 * Register the standard databeacon capability set
	 * (DataBeaconAccess, DataBeaconManagement, MeadowProxy,
	 * DataBeaconSchema) on a given UltravisorBeacon service. Public so
	 * tests can attach the same capabilities to their own beacon-service
	 * instances without driving a real coordinator connection.
	 *
	 * @param {object} pBeaconService - An UltravisorBeacon instance.
	 * @param {object} [pMeadowProxyOptions] - Forwarded to
	 *   registerMeadowProxyCapability (PathAllowlist, AllowWrites, etc.).
	 * @returns {object} The same beacon-service for chaining.
	 */
	registerCapabilitiesOn(pBeaconService, pMeadowProxyOptions)
	{
		return this._registerCapabilitiesOn(pBeaconService, pMeadowProxyOptions || {});
	}

	_registerCapabilitiesOn(pBeaconService, pMeadowProxyOptions)
	{
		let tmpFable = this.fable;
		let tmpLog = this.log;

		// ---------------------------------------------------------
		// Capability: DataBeaconAccess
		// Read operations against the beacon's connected databases
		// ---------------------------------------------------------
		pBeaconService.registerCapability(
			{
				Capability: 'DataBeaconAccess',
				Name: 'DataBeaconAccessProvider',
				actions:
				{
					'ListConnections':
					{
						Description: 'List all configured database connections',
						SettingsSchema: [],
						Handler: function (pWorkItem, pContext, fHandlerCallback)
						{
							if (!tmpFable.DAL || !tmpFable.DAL.BeaconConnection)
							{
								return fHandlerCallback(null, { Outputs: { Connections: [] }, Log: [] });
							}

							let tmpQuery = tmpFable.DAL.BeaconConnection.query.clone()
								.addFilter('Deleted', 0);

							tmpFable.DAL.BeaconConnection.doReads(tmpQuery,
								(pError, pQuery, pRecords) =>
								{
									if (pError)
									{
										return fHandlerCallback(pError);
									}
									// Mask configs
									for (let i = 0; i < pRecords.length; i++)
									{
										pRecords[i].Config = '{}';
									}
									return fHandlerCallback(null, { Outputs: { Connections: pRecords }, Log: [] });
								});
						}
					},
					'ListTables':
					{
						Description: 'List introspected tables for a connection',
						SettingsSchema:
						[
							{ Name: 'IDBeaconConnection', DataType: 'Number', Required: true }
						],
						Handler: function (pWorkItem, pContext, fHandlerCallback)
						{
							let tmpSettings = pWorkItem.Settings || {};
							let tmpConnID = tmpSettings.IDBeaconConnection;

							if (!tmpConnID)
							{
								return fHandlerCallback(new Error('IDBeaconConnection is required'));
							}

							let tmpQuery = tmpFable.DAL.IntrospectedTable.query.clone()
								.addFilter('IDBeaconConnection', tmpConnID)
								.addFilter('Deleted', 0);

							tmpFable.DAL.IntrospectedTable.doReads(tmpQuery,
								(pError, pQuery, pRecords) =>
								{
									if (pError)
									{
										return fHandlerCallback(pError);
									}
									let tmpTables = pRecords.map((pR) => ({
										TableName: pR.TableName,
										EndpointsEnabled: !!pR.EndpointsEnabled,
										RowCountEstimate: pR.RowCountEstimate
									}));
									return fHandlerCallback(null, { Outputs: { Tables: tmpTables }, Log: [] });
								});
						}
					},
					'ReadRecords':
					{
						Description: 'Read records from an enabled dynamic endpoint table',
						SettingsSchema:
						[
							{ Name: 'IDBeaconConnection', DataType: 'Number', Required: true },
							{ Name: 'TableName', DataType: 'String', Required: true },
							{ Name: 'Cap', DataType: 'Number', Required: false },
							{ Name: 'Begin', DataType: 'Number', Required: false }
						],
						Handler: function (pWorkItem, pContext, fHandlerCallback)
						{
							let tmpSettings = pWorkItem.Settings || {};
							let tmpConnID = tmpSettings.IDBeaconConnection;
							let tmpTableName = tmpSettings.TableName;
							let tmpCap = tmpSettings.Cap || 100;

							let tmpKey = `${tmpConnID}-${tmpTableName}`;
							let tmpEndpointEntry = tmpFable.DataBeaconDynamicEndpointManager._EnabledEndpoints[tmpKey];

							if (!tmpEndpointEntry)
							{
								return fHandlerCallback(new Error(`Endpoint not enabled for ${tmpTableName}`));
							}

							let tmpQuery = tmpEndpointEntry.dal.query.clone()
								.setCap(tmpCap);

							if (tmpSettings.Begin)
							{
								tmpQuery.setBegin(tmpSettings.Begin);
							}

							tmpEndpointEntry.dal.doReads(tmpQuery,
								(pError, pQuery, pRecords) =>
								{
									if (pError)
									{
										return fHandlerCallback(pError);
									}
									return fHandlerCallback(null, { Outputs: { Records: pRecords, Count: pRecords.length }, Log: [] });
								});
						}
					},
					'QueryTable':
					{
						Description: 'Execute a read-only SQL query against a connected database',
						SettingsSchema:
						[
							{ Name: 'IDBeaconConnection', DataType: 'Number', Required: true },
							{ Name: 'SQL', DataType: 'String', Required: true }
						],
						Handler: function (pWorkItem, pContext, fHandlerCallback)
						{
							let tmpSettings = pWorkItem.Settings || {};
							let tmpConnID = tmpSettings.IDBeaconConnection;
							let tmpSQL = tmpSettings.SQL;

							tmpFable.DataBeaconSchemaIntrospector.executeQuery(tmpConnID, tmpSQL,
								(pError, pResults) =>
								{
									if (pError)
									{
										return fHandlerCallback(pError);
									}
									return fHandlerCallback(null, { Outputs: { Rows: pResults, RowCount: Array.isArray(pResults) ? pResults.length : 0 }, Log: [] });
								});
						}
					},
					'Aggregate':
					{
						// Push GROUP BY into the source DB. Used by the data-mapper's
						// SQLAggregate operation type (streaming-layout counterpart of
						// the in-memory Aggregation). The structured spec is bundled
						// inside an Object-typed AggregateSpec setting so UV's settings
						// resolver doesn't template-strip it.
						Description: 'Run a structured GROUP BY query against a connected database and return the aggregated rows.',
						SettingsSchema:
						[
							{ Name: 'IDBeaconConnection', DataType: 'Number', Required: true },
							{ Name: 'AggregateSpec',      DataType: 'Object', Required: true }
						],
						Handler: function (pWorkItem, pContext, fHandlerCallback)
						{
							let tmpSettings = pWorkItem.Settings || {};
							let tmpConnID = tmpSettings.IDBeaconConnection;
							let tmpSpec = tmpSettings.AggregateSpec;

							if (typeof(tmpSpec) === 'string')
							{
								try { tmpSpec = JSON.parse(tmpSpec); }
								catch (pParseErr)
								{
									return fHandlerCallback(new Error('Aggregate: AggregateSpec was a string but failed to parse as JSON: ' + pParseErr.message));
								}
							}

							if (!tmpFable.DAL || !tmpFable.DAL.BeaconConnection)
							{
								return fHandlerCallback(new Error('Aggregate: BeaconConnection DAL not initialized.'));
							}

							let tmpReadQuery = tmpFable.DAL.BeaconConnection.query.clone()
								.addFilter('IDBeaconConnection', tmpConnID);

							tmpFable.DAL.BeaconConnection.doRead(tmpReadQuery,
								(pReadError, pReadQuery, pConnectionRecord) =>
								{
									if (pReadError || !pConnectionRecord)
									{
										return fHandlerCallback(new Error('Aggregate: connection record not found for IDBeaconConnection=' + tmpConnID));
									}

									let tmpType = pConnectionRecord.Type;
									let tmpSQL;
									try
									{
										tmpSQL = buildAggregateSQL(tmpType, tmpSpec);
									}
									catch (pBuildError)
									{
										return fHandlerCallback(pBuildError);
									}

									let tmpStart = Date.now();
									tmpFable.DataBeaconSchemaIntrospector.executeQuery(tmpConnID, tmpSQL,
										(pError, pResults) =>
										{
											if (pError)
											{
												if (tmpFable.log) { tmpFable.log.warn('Aggregate: ' + tmpType + ' query failed: ' + pError.message + ' :: ' + tmpSQL); }
												return fHandlerCallback(pError);
											}
											let tmpElapsed = Date.now() - tmpStart;
											let tmpRows = Array.isArray(pResults) ? pResults : [];
											if (tmpFable.log) { tmpFable.log.info('Aggregate: ' + tmpType + ' returned ' + tmpRows.length + ' row(s) in ' + tmpElapsed + 'ms'); }
											return fHandlerCallback(null,
												{
													Outputs:
													{
														Rows: tmpRows,
														RowCount: tmpRows.length,
														ElapsedMs: tmpElapsed,
														SQL: tmpSQL
													},
													Log: []
												});
										});
								});
						}
					},
					'Join':
					{
						// Push an INNER JOIN into the source DB. Used by the data-mapper's
						// SQLJoin operation type (streaming-layout counterpart of the
						// in-memory Intersection). Returns one paged batch of joined rows;
						// the data-mapper loops it offset-by-offset until short read.
						// Both sides of the join must live on the same connection — for
						// cross-DB joins, fall back to the in-memory Intersection layout.
						Description: 'Run a paged INNER JOIN against a connected database (source + related must be co-located on the same connection) and return the joined rows.',
						SettingsSchema:
						[
							{ Name: 'IDBeaconConnection', DataType: 'Number', Required: true },
							{ Name: 'JoinSpec',           DataType: 'Object', Required: true }
						],
						Handler: function (pWorkItem, pContext, fHandlerCallback)
						{
							let tmpSettings = pWorkItem.Settings || {};
							let tmpConnID = tmpSettings.IDBeaconConnection;
							let tmpSpec = tmpSettings.JoinSpec;

							if (typeof(tmpSpec) === 'string')
							{
								try { tmpSpec = JSON.parse(tmpSpec); }
								catch (pParseErr)
								{
									return fHandlerCallback(new Error('Join: JoinSpec was a string but failed to parse as JSON: ' + pParseErr.message));
								}
							}

							if (!tmpFable.DAL || !tmpFable.DAL.BeaconConnection)
							{
								return fHandlerCallback(new Error('Join: BeaconConnection DAL not initialized.'));
							}

							let tmpReadQuery = tmpFable.DAL.BeaconConnection.query.clone()
								.addFilter('IDBeaconConnection', tmpConnID);

							tmpFable.DAL.BeaconConnection.doRead(tmpReadQuery,
								(pReadError, pReadQuery, pConnectionRecord) =>
								{
									if (pReadError || !pConnectionRecord)
									{
										return fHandlerCallback(new Error('Join: connection record not found for IDBeaconConnection=' + tmpConnID));
									}

									let tmpType = pConnectionRecord.Type;
									let tmpBuilt;
									try
									{
										tmpBuilt = buildJoinPagedSQL(tmpType, tmpSpec);
									}
									catch (pBuildError)
									{
										return fHandlerCallback(pBuildError);
									}
									let tmpSQL = tmpBuilt.SQL;
									let tmpParams = tmpBuilt.Params || [];
									let tmpCursorField = tmpBuilt.CursorField;

									let tmpStart = Date.now();
									tmpFable.DataBeaconSchemaIntrospector.executeQuery(tmpConnID, tmpSQL, tmpParams,
										(pError, pResults) =>
										{
											if (pError)
											{
												if (tmpFable.log) { tmpFable.log.warn('Join: ' + tmpType + ' query failed: ' + pError.message + ' :: ' + tmpSQL); }
												return fHandlerCallback(pError);
											}
											let tmpElapsed = Date.now() - tmpStart;
											let tmpRows = Array.isArray(pResults) ? pResults : [];
											let tmpCursorTag;
											if (Object.prototype.hasOwnProperty.call(tmpSpec, 'AfterValue'))
											{
												tmpCursorTag = 'after=' + ((tmpSpec.AfterValue === null) ? 'null' : JSON.stringify(tmpSpec.AfterValue));
											}
											else
											{
												tmpCursorTag = 'offset=' + (tmpSpec.Offset || 0);
											}
											if (tmpFable.log) { tmpFable.log.info('Join: ' + tmpType + ' returned ' + tmpRows.length + ' row(s) in ' + tmpElapsed + 'ms (' + tmpCursorTag + ', limit=' + (tmpSpec.Limit || 500) + ')'); }
											return fHandlerCallback(null,
												{
													Outputs:
													{
														Rows: tmpRows,
														RowCount: tmpRows.length,
														ElapsedMs: tmpElapsed,
														Offset: tmpSpec.Offset || 0,
														AfterValue: (Object.prototype.hasOwnProperty.call(tmpSpec, 'AfterValue') ? tmpSpec.AfterValue : null),
														CursorField: tmpCursorField,
														SQL: tmpSQL
													},
													Log: []
												});
										});
								});
						}
					}
				}
			});

		// ---------------------------------------------------------
		// Capability: DataBeaconManagement
		// Write/admin operations
		// ---------------------------------------------------------
		pBeaconService.registerCapability(
			{
				Capability: 'DataBeaconManagement',
				Name: 'DataBeaconManagementProvider',
				actions:
				{
					'Introspect':
					{
						Description: 'Introspect all tables for a connected database',
						SettingsSchema:
						[
							{ Name: 'IDBeaconConnection', DataType: 'Number', Required: true }
						],
						Handler: function (pWorkItem, pContext, fHandlerCallback)
						{
							let tmpSettings = pWorkItem.Settings || {};
							let tmpConnID = tmpSettings.IDBeaconConnection;

							tmpFable.DataBeaconSchemaIntrospector.introspect(tmpConnID,
								(pError, pResults) =>
								{
									if (pError)
									{
										return fHandlerCallback(pError);
									}
									return fHandlerCallback(null,
									{
										Outputs:
										{
											TableCount: pResults.length,
											Tables: pResults.map((pR) => ({ TableName: pR.TableName, ColumnCount: pR.Columns.length, Columns: pR.Columns }))
										},
										Log: []
									});
								});
						}
					},
					'EnableEndpoint':
					{
						Description: 'Enable CRUD REST endpoints for an introspected table',
						SettingsSchema:
						[
							{ Name: 'IDBeaconConnection', DataType: 'Number', Required: true },
							{ Name: 'TableName', DataType: 'String', Required: true }
						],
						Handler: function (pWorkItem, pContext, fHandlerCallback)
						{
							let tmpSettings = pWorkItem.Settings || {};
							tmpFable.DataBeaconDynamicEndpointManager.enableEndpoint(
								tmpSettings.IDBeaconConnection, tmpSettings.TableName,
								(pError, pResult) =>
								{
									if (pError) { return fHandlerCallback(pError); }
									return fHandlerCallback(null, { Outputs: pResult || {}, Log: [] });
								});
						}
					},
					'DisableEndpoint':
					{
						Description: 'Disable CRUD REST endpoints for an introspected table',
						SettingsSchema:
						[
							{ Name: 'IDBeaconConnection', DataType: 'Number', Required: true },
							{ Name: 'TableName', DataType: 'String', Required: true }
						],
						Handler: function (pWorkItem, pContext, fHandlerCallback)
						{
							let tmpSettings = pWorkItem.Settings || {};
							tmpFable.DataBeaconDynamicEndpointManager.disableEndpoint(
								tmpSettings.IDBeaconConnection, tmpSettings.TableName,
								(pError, pResult) =>
								{
									if (pError) { return fHandlerCallback(pError); }
									return fHandlerCallback(null, { Outputs: pResult || {}, Log: [] });
								});
						}
					},
					'UpdateProxyConfig':
					{
						// Mutates the live MeadowProxy capability's allowlist /
						// write-gate. Used by ultravisor's persistence bridges
						// to add their PascalCase /1.0/UV*/ routes before the
						// first MeadowProxy.Request — the default allowlist
						// is intentionally restrictive (lowercase-first) to
						// keep mesh clients away from the databeacon's
						// internal entities. See
						// modules/apps/ultravisor/docs/features/persistence-via-databeacon.md
						// for the bootstrap sequence.
						Description: 'Update the MeadowProxy capability\'s runtime config (PathAllowlist, AllowWrites).',
						SettingsSchema:
						[
							{ Name: 'PathAllowlist', DataType: 'Array',   Required: false },
							{ Name: 'AllowWrites',   DataType: 'Boolean', Required: false }
						],
						Handler: function (pWorkItem, pContext, fHandlerCallback)
						{
							let tmpSettings = pWorkItem.Settings || {};
							let tmpAdded = 0;
							if (Array.isArray(tmpSettings.PathAllowlist))
							{
								let tmpBefore = (getActiveConfig() || {}).PathAllowlist || [];
								let tmpLen = extendPathAllowlist(tmpSettings.PathAllowlist);
								tmpAdded = Math.max(0, tmpLen - tmpBefore.length);
							}
							if (typeof tmpSettings.AllowWrites === 'boolean')
							{
								setAllowWrites(tmpSettings.AllowWrites);
							}
							let tmpActive = getActiveConfig();
							if (!tmpActive)
							{
								return fHandlerCallback(new Error('UpdateProxyConfig: MeadowProxy capability is not registered on this beacon.'));
							}
							return fHandlerCallback(null,
							{
								Outputs:
								{
									Success: true,
									PatternsAdded: tmpAdded,
									ActiveConfig: tmpActive
								},
								Log: []
							});
						}
					},
					'CreateConnection':
					{
						// Idempotent connection provisioning via the mesh.
						// Mirrors POST /beacon/connection but reachable as a
						// typed capability so other beacons (e.g. retold-data-mapper)
						// can self-bootstrap their config storage on first launch
						// without an operator visiting the databeacon's web UI.
						//
						// Idempotent: if a connection with the same Name already
						// exists it returns the existing IDBeaconConnection
						// (Created=false). Caller can rely on safe re-runs.
						//
						// Settings:
						//   Name        — display name + lookup key for idempotency
						//   Type        — 'SQLite' | 'MySQL' | 'PostgreSQL' | ...
						//   Config      — connection settings; object preferred, string accepted
						//   AutoConnect — if true, connect immediately after create + restore endpoints
						//   Description — optional human-readable description
						Description: 'Create a database connection on this databeacon (idempotent by Name)',
						SettingsSchema:
						[
							{ Name: 'Name',        DataType: 'String',  Required: true  },
							{ Name: 'Type',        DataType: 'String',  Required: true  },
							{ Name: 'Config',      DataType: 'Object',  Required: true  },
							{ Name: 'AutoConnect', DataType: 'Boolean', Required: false },
							{ Name: 'Description', DataType: 'String',  Required: false }
						],
						Handler: function (pWorkItem, pContext, fHandlerCallback)
						{
							let tmpSettings = pWorkItem.Settings || {};
							if (!tmpFable.DAL || !tmpFable.DAL.BeaconConnection)
							{
								return fHandlerCallback(new Error('CreateConnection: BeaconConnection DAL not initialized'));
							}
							let tmpName = String(tmpSettings.Name || '').trim();
							if (!tmpName)
							{
								return fHandlerCallback(new Error('CreateConnection: Name is required'));
							}
							let tmpType = String(tmpSettings.Type || '').trim();
							if (!tmpType)
							{
								return fHandlerCallback(new Error('CreateConnection: Type is required'));
							}
							let tmpConfigStr = (typeof tmpSettings.Config === 'string')
								? tmpSettings.Config
								: JSON.stringify(tmpSettings.Config || {});

							let tmpBridge = tmpFable.DataBeaconConnectionBridge;

							// Idempotency probe — find by Name so re-runs are safe.
							let tmpFindQuery = tmpFable.DAL.BeaconConnection.query.clone()
								.addFilter('Name', tmpName)
								.addFilter('Deleted', 0);
							tmpFable.DAL.BeaconConnection.doRead(tmpFindQuery, (pFindErr, pFindQ, pExisting) =>
							{
								// Existing → return its ID (no overwrite of Config — the
								// expected use case is "make sure this connection exists",
								// not "reset it to these values"). Operator can edit via UI.
								if (!pFindErr && pExisting && pExisting.IDBeaconConnection)
								{
									return _maybeAutoConnect(pExisting, /*Created=*/false);
								}
								// Insert.
								let tmpRecord =
								{
									Name:        tmpName,
									Type:        tmpType,
									Config:      tmpConfigStr,
									Status:      'Untested',
									AutoConnect: tmpSettings.AutoConnect ? 1 : 0,
									Description: tmpSettings.Description || ''
								};
								let tmpCreateQuery = tmpFable.DAL.BeaconConnection.query.clone()
									.setIDUser(0)
									.addRecord(tmpRecord);
								tmpFable.DAL.BeaconConnection.doCreate(tmpCreateQuery,
									(pCreateErr, pCreateQ, pCreateRead, pNew) =>
									{
										if (pCreateErr) return fHandlerCallback(pCreateErr);
										return _maybeAutoConnect(pNew, /*Created=*/true);
									});
							});

							function _maybeAutoConnect(pConn, pCreated)
							{
								if (!tmpSettings.AutoConnect || !tmpBridge)
								{
									return fHandlerCallback(null,
									{
										Outputs:
										{
											IDBeaconConnection: pConn.IDBeaconConnection,
											Name:               pConn.Name,
											Type:               pConn.Type,
											Created:            pCreated,
											Connected:          tmpBridge ? tmpBridge.isConnected(pConn.IDBeaconConnection) : false
										},
										Log: []
									});
								}
								// AutoConnect=true: bring the runtime up. Idempotent —
								// _connectRuntime handles already-connected by reconnecting.
								tmpBridge._connectRuntime(pConn, (pConnErr) =>
								{
									let tmpEndpointMgr = tmpFable.DataBeaconDynamicEndpointManager;
									let fFinish = (pConnected) =>
									{
										fHandlerCallback(null,
										{
											Outputs:
											{
												IDBeaconConnection: pConn.IDBeaconConnection,
												Name:               pConn.Name,
												Type:               pConn.Type,
												Created:            pCreated,
												Connected:          pConnected,
												ConnectError:       pConnErr ? (pConnErr.message || String(pConnErr)) : null
											},
											Log: []
										});
									};
									if (!pConnErr && tmpEndpointMgr && typeof tmpEndpointMgr.restoreEnabledEndpointsForConnection === 'function')
									{
										tmpEndpointMgr.restoreEnabledEndpointsForConnection(pConn.IDBeaconConnection,
											() => fFinish(true));
									}
									else
									{
										fFinish(!pConnErr);
									}
								});
							}
						}
					}
				}
			});

		// ---------------------------------------------------------
		// Capability: MeadowProxy
		// Relay HTTP requests to the databeacon's localhost REST API
		// so a client-mode databeacon can drive the entire meadow
		// surface transparently through the ultravisor mesh.
		// ---------------------------------------------------------
		registerMeadowProxyCapability(pBeaconService, tmpFable, pMeadowProxyOptions);

		// ---------------------------------------------------------
		// Capability: DataBeaconSchema
		// Idempotent DDL — EnsureSchema / IntrospectSchema. Used by
		// ultravisor's persistence bridges to bootstrap their tables
		// (UVQueueWorkItem etc.) on the connected database. See
		// modules/apps/ultravisor/docs/features/persistence-via-databeacon.md
		// for the cross-module plan. Session 2 generalizes the SQLite
		// path via meadow's per-engine Schema-<engine> services.
		// ---------------------------------------------------------
		tmpFable.addServiceTypeIfNotExists('DataBeaconSchemaManager', DataBeaconSchemaManager);
		if (!tmpFable.DataBeaconSchemaManager)
		{
			let tmpMgr = tmpFable.instantiateServiceProvider('DataBeaconSchemaManager', {});
			tmpFable.DataBeaconSchemaManager = tmpMgr;
		}
		registerSchemaCapability(pBeaconService, tmpFable);

		return pBeaconService;
	}

	/**
	 * Disconnect from the Ultravisor coordinator.
	 */
	disconnectBeacon(fCallback)
	{
		if (!this._BeaconService)
		{
			return fCallback();
		}

		this._BeaconService.disable(
			(pError) =>
			{
				this._BeaconService = null;
				return fCallback(pError || null);
			});
	}

	/**
	 * Check if the beacon is currently connected.
	 */
	isBeaconConnected()
	{
		return !!(this._BeaconService && this._BeaconService.isEnabled());
	}

	// ================================================================
	// REST Routes
	// ================================================================

	connectRoutes(pOratorServiceServer)
	{
		let tmpRoutePrefix = this.options.RoutePrefix;

		// POST /beacon/ultravisor/connect -- connect to Ultravisor coordinator
		pOratorServiceServer.doPost(`${tmpRoutePrefix}/ultravisor/connect`,
			(pRequest, pResponse, fNext) =>
			{
				let tmpBody = pRequest.body || {};

				if (!tmpBody.ServerURL)
				{
					pResponse.send({ Success: false, Error: 'ServerURL is required' });
					return fNext();
				}

				this.connectBeacon(tmpBody,
					(pError) =>
					{
						if (pError)
						{
							pResponse.send({ Success: false, Error: pError.message || pError });
						}
						else
						{
							pResponse.send({ Success: true, Status: 'Connected' });
						}
						return fNext();
					});
			});

		// POST /beacon/ultravisor/disconnect -- disconnect from Ultravisor
		pOratorServiceServer.doPost(`${tmpRoutePrefix}/ultravisor/disconnect`,
			(pRequest, pResponse, fNext) =>
			{
				this.disconnectBeacon(
					(pError) =>
					{
						if (pError)
						{
							pResponse.send({ Success: false, Error: pError.message || pError });
						}
						else
						{
							pResponse.send({ Success: true, Status: 'Disconnected' });
						}
						return fNext();
					});
			});

		// GET /beacon/ultravisor/status -- beacon connection status
		pOratorServiceServer.doGet(`${tmpRoutePrefix}/ultravisor/status`,
			(pRequest, pResponse, fNext) =>
			{
				pResponse.send(
				{
					Connected: this.isBeaconConnected(),
					BeaconName: this._BeaconService ? (this._BeaconService.options.Name || 'retold-databeacon') : null
				});
				return fNext();
			});

		this.fable.log.info(`DataBeacon BeaconProvider routes connected at ${tmpRoutePrefix}/ultravisor*`);
	}
}

module.exports = DataBeaconBeaconProvider;
module.exports.serviceType = 'DataBeaconBeaconProvider';
module.exports.default_configuration = defaultBeaconProviderOptions;
