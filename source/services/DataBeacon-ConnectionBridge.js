/**
 * DataBeacon - Connection Bridge Service
 *
 * Manages external database connections for the DataBeacon.
 * Combines persistence (CRUD against BeaconConnection DAL entity in
 * the internal SQLite) with runtime connection management (delegates
 * to fable.MeadowConnectionManager for actual connect/disconnect/test).
 *
 * @author Steven Velozo <steven@velozo.com>
 */
const libFableServiceProviderBase = require('fable-serviceproviderbase');

const defaultConnectionBridgeOptions = (
	{
		RoutePrefix: '/beacon'
	});

class DataBeaconConnectionBridge extends libFableServiceProviderBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, defaultConnectionBridgeOptions, pOptions);
		super(pFable, tmpOptions, pServiceHash);

		this.serviceType = 'DataBeaconConnectionBridge';

		// Runtime connection status tracking (not persisted — rebuilt on startup)
		this._LiveConnections = {};
	}

	/**
	 * Mask sensitive fields in a Config JSON string before sending to client.
	 */
	_maskConfig(pConfigJSON)
	{
		if (!pConfigJSON) return '{}';
		try
		{
			let tmpConfig = JSON.parse(pConfigJSON);
			if (tmpConfig.password) tmpConfig.password = '***';
			if (tmpConfig.Password) tmpConfig.Password = '***';
			if (tmpConfig.pass) tmpConfig.pass = '***';
			return JSON.stringify(tmpConfig);
		}
		catch (pError)
		{
			return '{}';
		}
	}

	/**
	 * Merge an incoming Config object with the stored one,
	 * preserving the actual password if the client sent '***'.
	 */
	_mergeConfig(pNewConfig, pStoredConfigJSON)
	{
		let tmpStored = {};
		try
		{
			tmpStored = JSON.parse(pStoredConfigJSON || '{}');
		}
		catch (pError) { /* ignore parse errors */ }

		if (pNewConfig.password === '***' && tmpStored.password)
		{
			pNewConfig.password = tmpStored.password;
		}
		if (pNewConfig.Password === '***' && tmpStored.Password)
		{
			pNewConfig.Password = tmpStored.Password;
		}
		if (pNewConfig.pass === '***' && tmpStored.pass)
		{
			pNewConfig.pass = tmpStored.pass;
		}
		return JSON.stringify(pNewConfig);
	}

	/**
	 * Get a unique connection name for MeadowConnectionManager.
	 */
	_connectionName(pIDBeaconConnection)
	{
		return `beacon-ext-${pIDBeaconConnection}`;
	}

	/**
	 * Check whether a connection is live in MeadowConnectionManager.
	 */
	isConnected(pIDBeaconConnection)
	{
		let tmpName = this._connectionName(pIDBeaconConnection);
		let tmpConn = this.fable.MeadowConnectionManager.getConnection(tmpName);
		return !!(tmpConn && tmpConn.status === 'connected');
	}

	/**
	 * Get the live connection instance for an external database.
	 */
	getConnectionInstance(pIDBeaconConnection)
	{
		let tmpName = this._connectionName(pIDBeaconConnection);
		let tmpConn = this.fable.MeadowConnectionManager.getConnection(tmpName);
		return tmpConn ? tmpConn.instance : null;
	}

	/**
	 * Get the live connection metadata for an external database.
	 */
	getConnection(pIDBeaconConnection)
	{
		let tmpName = this._connectionName(pIDBeaconConnection);
		return this.fable.MeadowConnectionManager.getConnection(tmpName);
	}

	/**
	 * Auto-connect all connections with AutoConnect=true on startup.
	 */
	autoConnectSavedConnections(fCallback)
	{
		if (!this.fable.DAL || !this.fable.DAL.BeaconConnection)
		{
			return fCallback();
		}

		let tmpQuery = this.fable.DAL.BeaconConnection.query.clone()
			.addFilter('Deleted', 0)
			.addFilter('AutoConnect', 1);

		this.fable.DAL.BeaconConnection.doReads(tmpQuery,
			(pError, pQuery, pRecords) =>
			{
				if (pError || !pRecords || pRecords.length === 0)
				{
					return fCallback();
				}

				this.fable.log.info(`DataBeacon: Auto-connecting ${pRecords.length} saved connection(s)...`);

				let tmpAnticipate = this.fable.newAnticipate();

				for (let i = 0; i < pRecords.length; i++)
				{
					let tmpRecord = pRecords[i];
					tmpAnticipate.anticipate(
						(fStepCallback) =>
						{
							this._connectRuntime(tmpRecord,
								(pConnError) =>
								{
									if (pConnError)
									{
										this.fable.log.warn(`Auto-connect failed for "${tmpRecord.Name}": ${pConnError}`);
									}
									else
									{
										this.fable.log.info(`Auto-connected: "${tmpRecord.Name}" (${tmpRecord.Type})`);
									}
									return fStepCallback();
								});
						});
				}

				tmpAnticipate.wait(fCallback);
			});
	}

	/**
	 * Establish a live runtime connection via MeadowConnectionManager.
	 */
	_connectRuntime(pRecord, fCallback)
	{
		let tmpConfig = {};
		try
		{
			tmpConfig = JSON.parse(pRecord.Config || '{}');
		}
		catch (pError) { /* ignore */ }

		let tmpConnName = this._connectionName(pRecord.IDBeaconConnection);

		// Disconnect first if already connected
		let tmpExisting = this.fable.MeadowConnectionManager.getConnection(tmpConnName);
		if (tmpExisting)
		{
			this.fable.MeadowConnectionManager.disconnect(tmpConnName,
				() =>
				{
					this._doConnect(tmpConnName, pRecord.Type, tmpConfig, fCallback);
				});
		}
		else
		{
			this._doConnect(tmpConnName, pRecord.Type, tmpConfig, fCallback);
		}
	}

	/**
	 * Normalize config keys to PascalCase for Meadow connection providers.
	 * Providers read from fable.settings[Type] and expect PascalCase
	 * (Server, Port, User, Password, Database) for the fallback path.
	 */
	_normalizeConfig(pConfig)
	{
		let tmpNormalized = Object.assign({}, pConfig);

		// Map common lowercase keys to PascalCase
		if (tmpNormalized.host && !tmpNormalized.Server)
		{
			tmpNormalized.Server = tmpNormalized.host;
		}
		if (tmpNormalized.port && !tmpNormalized.Port)
		{
			tmpNormalized.Port = tmpNormalized.port;
		}
		if (tmpNormalized.user && !tmpNormalized.User)
		{
			tmpNormalized.User = tmpNormalized.user;
		}
		if (tmpNormalized.password && !tmpNormalized.Password)
		{
			tmpNormalized.Password = tmpNormalized.password;
		}
		if (tmpNormalized.database && !tmpNormalized.Database)
		{
			tmpNormalized.Database = tmpNormalized.database;
		}
		if (tmpNormalized.connectionLimit && !tmpNormalized.ConnectionPoolLimit)
		{
			tmpNormalized.ConnectionPoolLimit = tmpNormalized.connectionLimit;
		}

		return tmpNormalized;
	}

	/**
	 * Is this beacon configured to let a remote-fronting connection present its
	 * own login when a request carries no caller session?
	 *
	 * Off by default: a beacon services requests on someone else's behalf, so
	 * falling back to its own identity would run those requests as the beacon's
	 * user and silently widen what the caller can reach. Opting in is a
	 * deployment-level statement that this beacon's connections act as
	 * themselves — machine-to-machine movement, or public reference data.
	 *
	 * @return {boolean} true when DATABEACON_ALLOW_BOUND_SESSION_FALLBACK is set truthy
	 */
	_allowBoundSessionFallback()
	{
		let tmpSetting = process.env.DATABEACON_ALLOW_BOUND_SESSION_FALLBACK;
		if (tmpSetting === undefined && this.fable.settings)
		{
			tmpSetting = this.fable.settings.AllowBoundSessionFallback;
		}
		if (typeof (tmpSetting) === 'boolean')
		{
			return tmpSetting;
		}
		return (String(tmpSetting).toLowerCase() === 'true' || String(tmpSetting) === '1');
	}

	_doConnect(pName, pType, pConfig, fCallback)
	{
		let tmpFullConfig = Object.assign({}, this._normalizeConfig(pConfig), { Type: pType });

		// Only the remote-fronting connection types carry a session upstream;
		// the SQL providers have no such notion.
		if (pType === 'MeadowEndpoints' || pType === 'RetoldDataBeacon')
		{
			tmpFullConfig.AllowBoundSessionFallback = this._allowBoundSessionFallback();
		}

		this.fable.MeadowConnectionManager.connect(pName, tmpFullConfig,
			(pError, pConnection) =>
			{
				if (pError)
				{
					return fCallback(pError);
				}
				this._LiveConnections[pName] = true;
				return fCallback(null, pConnection);
			});
	}

	/**
	 * Connect REST API routes for connection management.
	 */
	connectRoutes(pOratorServiceServer)
	{
		let tmpRoutePrefix = this.options.RoutePrefix;

		// GET /beacon/connections -- list all non-deleted connections
		pOratorServiceServer.doGet(`${tmpRoutePrefix}/connections`,
			(pRequest, pResponse, fNext) =>
			{
				if (!this.fable.DAL || !this.fable.DAL.BeaconConnection)
				{
					pResponse.send({ Connections: [] });
					return fNext();
				}

				let tmpQuery = this.fable.DAL.BeaconConnection.query.clone()
					.addFilter('Deleted', 0);

				this.fable.DAL.BeaconConnection.doReads(tmpQuery,
					(pError, pQuery, pRecords) =>
					{
						if (pError)
						{
							pResponse.send({ Error: pError.message || pError, Connections: [] });
							return fNext();
						}

						for (let i = 0; i < pRecords.length; i++)
						{
							pRecords[i].Config = this._maskConfig(pRecords[i].Config);
							pRecords[i].Connected = this.isConnected(pRecords[i].IDBeaconConnection);
						}

						pResponse.send({ Count: pRecords.length, Connections: pRecords });
						return fNext();
					});
			});

		// POST /beacon/connection -- create a new connection
		pOratorServiceServer.doPost(`${tmpRoutePrefix}/connection`,
			(pRequest, pResponse, fNext) =>
			{
				if (!this.fable.DAL || !this.fable.DAL.BeaconConnection)
				{
					pResponse.send({ Error: 'BeaconConnection DAL not initialized' });
					return fNext();
				}

				let tmpBody = pRequest.body || {};
				let tmpRecord =
				{
					Name: tmpBody.Name || 'Untitled Connection',
					Type: tmpBody.Type || 'MySQL',
					Config: (typeof tmpBody.Config === 'string') ? tmpBody.Config : JSON.stringify(tmpBody.Config || {}),
					Status: 'Untested',
					AutoConnect: tmpBody.AutoConnect ? 1 : 0,
					Description: tmpBody.Description || ''
				};

				let tmpQuery = this.fable.DAL.BeaconConnection.query.clone()
					.setIDUser(0)
					.addRecord(tmpRecord);

				this.fable.DAL.BeaconConnection.doCreate(tmpQuery,
					(pError, pQuery, pQueryRead, pRecord) =>
					{
						if (pError)
						{
							pResponse.send({ Error: pError.message || pError });
							return fNext();
						}

						pRecord.Config = this._maskConfig(pRecord.Config);
						pRecord.Connected = false;
						pResponse.send({ Success: true, Connection: pRecord });
						return fNext();
					});
			});

		// GET /beacon/connection/:id -- read a single connection
		pOratorServiceServer.doGet(`${tmpRoutePrefix}/connection/:id`,
			(pRequest, pResponse, fNext) =>
			{
				if (!this.fable.DAL || !this.fable.DAL.BeaconConnection)
				{
					pResponse.send({ Error: 'BeaconConnection DAL not initialized' });
					return fNext();
				}

				let tmpID = parseInt(pRequest.params.id, 10);

				let tmpQuery = this.fable.DAL.BeaconConnection.query.clone()
					.addFilter('IDBeaconConnection', tmpID);

				this.fable.DAL.BeaconConnection.doRead(tmpQuery,
					(pError, pQuery, pRecord) =>
					{
						if (pError)
						{
							pResponse.send({ Error: pError.message || pError });
							return fNext();
						}
						if (!pRecord || !pRecord.IDBeaconConnection)
						{
							pResponse.send({ Error: 'Connection not found' });
							return fNext();
						}

						pRecord.Config = this._maskConfig(pRecord.Config);
						pRecord.Connected = this.isConnected(pRecord.IDBeaconConnection);
						pResponse.send({ Connection: pRecord });
						return fNext();
					});
			});

		// PUT /beacon/connection/:id -- update a connection
		pOratorServiceServer.doPut(`${tmpRoutePrefix}/connection/:id`,
			(pRequest, pResponse, fNext) =>
			{
				if (!this.fable.DAL || !this.fable.DAL.BeaconConnection)
				{
					pResponse.send({ Error: 'BeaconConnection DAL not initialized' });
					return fNext();
				}

				let tmpID = parseInt(pRequest.params.id, 10);
				let tmpBody = pRequest.body || {};

				let tmpReadQuery = this.fable.DAL.BeaconConnection.query.clone()
					.addFilter('IDBeaconConnection', tmpID);

				this.fable.DAL.BeaconConnection.doRead(tmpReadQuery,
					(pReadError, pReadQuery, pExisting) =>
					{
						if (pReadError || !pExisting || !pExisting.IDBeaconConnection)
						{
							pResponse.send({ Error: 'Connection not found' });
							return fNext();
						}

						if (tmpBody.Name !== undefined) pExisting.Name = tmpBody.Name;
						if (tmpBody.Type !== undefined) pExisting.Type = tmpBody.Type;
						if (tmpBody.Config !== undefined)
						{
							let tmpNewConfig = (typeof tmpBody.Config === 'string')
								? JSON.parse(tmpBody.Config)
								: tmpBody.Config;
							pExisting.Config = this._mergeConfig(tmpNewConfig, pExisting.Config);
						}
						if (tmpBody.Status !== undefined) pExisting.Status = tmpBody.Status;
						if (tmpBody.AutoConnect !== undefined) pExisting.AutoConnect = tmpBody.AutoConnect ? 1 : 0;
						if (tmpBody.Description !== undefined) pExisting.Description = tmpBody.Description;

						let tmpUpdateQuery = this.fable.DAL.BeaconConnection.query.clone()
							.addRecord(pExisting);

						this.fable.DAL.BeaconConnection.doUpdate(tmpUpdateQuery,
							(pError, pQuery, pQueryRead, pRecord) =>
							{
								if (pError)
								{
									pResponse.send({ Error: pError.message || pError });
									return fNext();
								}

								pRecord.Config = this._maskConfig(pRecord.Config);
								pRecord.Connected = this.isConnected(pRecord.IDBeaconConnection);
								pResponse.send({ Success: true, Connection: pRecord });
								return fNext();
							});
					});
			});

		// DELETE /beacon/connection/:id -- soft-delete
		pOratorServiceServer.doDel(`${tmpRoutePrefix}/connection/:id`,
			(pRequest, pResponse, fNext) =>
			{
				if (!this.fable.DAL || !this.fable.DAL.BeaconConnection)
				{
					pResponse.send({ Error: 'BeaconConnection DAL not initialized' });
					return fNext();
				}

				let tmpID = parseInt(pRequest.params.id, 10);

				// Disconnect if live
				let tmpConnName = this._connectionName(tmpID);
				let tmpExistingConn = this.fable.MeadowConnectionManager.getConnection(tmpConnName);
				if (tmpExistingConn)
				{
					this.fable.MeadowConnectionManager.disconnect(tmpConnName, () => {});
					delete this._LiveConnections[tmpConnName];
				}

				let tmpDeleteQuery = this.fable.DAL.BeaconConnection.query.clone()
					.addFilter('IDBeaconConnection', tmpID);

				this.fable.DAL.BeaconConnection.doDelete(tmpDeleteQuery,
					(pError, pQuery, pRecord) =>
					{
						if (pError)
						{
							pResponse.send({ Error: pError.message || pError });
							return fNext();
						}
						pResponse.send({ Success: true });
						return fNext();
					});
			});

		// POST /beacon/connection/:id/test -- test a saved connection
		pOratorServiceServer.doPost(`${tmpRoutePrefix}/connection/:id/test`,
			(pRequest, pResponse, fNext) =>
			{
				if (!this.fable.DAL || !this.fable.DAL.BeaconConnection)
				{
					pResponse.send({ Success: false, Error: 'BeaconConnection DAL not initialized' });
					return fNext();
				}

				let tmpID = parseInt(pRequest.params.id, 10);

				let tmpReadQuery = this.fable.DAL.BeaconConnection.query.clone()
					.addFilter('IDBeaconConnection', tmpID);

				this.fable.DAL.BeaconConnection.doRead(tmpReadQuery,
					(pReadError, pReadQuery, pExisting) =>
					{
						if (pReadError || !pExisting || !pExisting.IDBeaconConnection)
						{
							pResponse.send({ Success: false, Error: 'Connection not found' });
							return fNext();
						}

						let tmpConfig = {};
						try { tmpConfig = JSON.parse(pExisting.Config || '{}'); }
						catch (e) { /* ignore */ }

						let tmpTestConfig = Object.assign({}, tmpConfig, { Type: pExisting.Type });

						this.fable.MeadowConnectionManager.testConnection(tmpTestConfig,
							(pTestError, pResult) =>
							{
								pExisting.LastTestedDate = new Date().toISOString();
								pExisting.Status = pTestError ? 'Failed' : 'OK';

								let tmpUpdateQuery = this.fable.DAL.BeaconConnection.query.clone()
									.addRecord(pExisting);

								this.fable.DAL.BeaconConnection.doUpdate(tmpUpdateQuery,
									() =>
									{
										if (pTestError)
										{
											pResponse.send({ Success: false, Error: pTestError.message || pTestError, Status: 'Failed' });
										}
										else
										{
											pResponse.send({ Success: true, Status: 'OK' });
										}
										return fNext();
									});
							});
					});
			});

		// POST /beacon/connection/test -- test an ad-hoc connection config
		pOratorServiceServer.doPost(`${tmpRoutePrefix}/connection/test`,
			(pRequest, pResponse, fNext) =>
			{
				let tmpBody = pRequest.body || {};
				let tmpType = tmpBody.Type || '';
				let tmpConfig = tmpBody.Config || {};

				if (!tmpType)
				{
					pResponse.send({ Success: false, Error: 'Type is required' });
					return fNext();
				}

				let tmpTestConfig = Object.assign({}, tmpConfig, { Type: tmpType });

				this.fable.MeadowConnectionManager.testConnection(tmpTestConfig,
					(pTestError) =>
					{
						if (pTestError)
						{
							pResponse.send({ Success: false, Error: pTestError.message || pTestError });
						}
						else
						{
							pResponse.send({ Success: true });
						}
						return fNext();
					});
			});

		// POST /beacon/connection/:id/connect -- establish live runtime connection
		pOratorServiceServer.doPost(`${tmpRoutePrefix}/connection/:id/connect`,
			(pRequest, pResponse, fNext) =>
			{
				if (!this.fable.DAL || !this.fable.DAL.BeaconConnection)
				{
					pResponse.send({ Success: false, Error: 'BeaconConnection DAL not initialized' });
					return fNext();
				}

				let tmpID = parseInt(pRequest.params.id, 10);

				let tmpReadQuery = this.fable.DAL.BeaconConnection.query.clone()
					.addFilter('IDBeaconConnection', tmpID);

				this.fable.DAL.BeaconConnection.doRead(tmpReadQuery,
					(pReadError, pReadQuery, pExisting) =>
					{
						if (pReadError || !pExisting || !pExisting.IDBeaconConnection)
						{
							pResponse.send({ Success: false, Error: 'Connection not found' });
							return fNext();
						}

						this._connectRuntime(pExisting,
							(pConnError) =>
							{
								if (pConnError)
								{
									pExisting.Status = 'Failed';
								}
								else
								{
									pExisting.Status = 'Connected';
								}

								let tmpUpdateQuery = this.fable.DAL.BeaconConnection.query.clone()
									.addRecord(pExisting);

								this.fable.DAL.BeaconConnection.doUpdate(tmpUpdateQuery,
									() =>
									{
										if (pConnError)
										{
											pResponse.send({ Success: false, Error: pConnError.message || pConnError });
											return fNext();
										}

										// Re-wire any dynamic endpoints that were flagged
										// EndpointsEnabled=1 in the config DB. Without this,
										// a cold-start + manual Connect would leave the
										// Introspection view showing endpoints as "Active"
										// while the actual Restify routes are missing until
										// the user toggles the endpoint off and on again.
										let tmpEndpointManager = this.fable.DataBeaconDynamicEndpointManager;
										if (tmpEndpointManager && typeof tmpEndpointManager.restoreEnabledEndpointsForConnection === 'function')
										{
											tmpEndpointManager.restoreEnabledEndpointsForConnection(pExisting.IDBeaconConnection,
												(pRestoreError, pRestoreResult) =>
												{
													pResponse.send(
													{
														Success: true,
														Status: 'Connected',
														EndpointsRestored: (pRestoreResult && typeof pRestoreResult.Restored === 'number') ? pRestoreResult.Restored : 0
													});
													return fNext();
												});
											return;
										}

										pResponse.send({ Success: true, Status: 'Connected', EndpointsRestored: 0 });
										return fNext();
									});
							});
					});
			});

		// POST /beacon/connection/:id/disconnect -- tear down live connection
		pOratorServiceServer.doPost(`${tmpRoutePrefix}/connection/:id/disconnect`,
			(pRequest, pResponse, fNext) =>
			{
				let tmpID = parseInt(pRequest.params.id, 10);
				let tmpConnName = this._connectionName(tmpID);

				this.fable.MeadowConnectionManager.disconnect(tmpConnName,
					(pError) =>
					{
						delete this._LiveConnections[tmpConnName];

						// Drop in-memory endpoint handles for this connection so
						// listEndpoints() stops advertising routes that point at
						// a now-dead MeadowEndpoints instance. The persisted
						// EndpointsEnabled flag is untouched — a subsequent
						// /connect will restore those routes automatically.
						let tmpEndpointManager = this.fable.DataBeaconDynamicEndpointManager;
						if (tmpEndpointManager && typeof tmpEndpointManager.clearInMemoryEndpointsForConnection === 'function')
						{
							tmpEndpointManager.clearInMemoryEndpointsForConnection(tmpID);
						}

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

		// GET /beacon/connection/available-types -- list installed connector types
		pOratorServiceServer.doGet(`${tmpRoutePrefix}/connection/available-types`,
			(pRequest, pResponse, fNext) =>
			{
				let tmpAvailable = [];
				let tmpProviders = this.fable.MeadowConnectionManager.getAvailableProviders();
				let tmpTypes = Object.keys(tmpProviders);

				for (let i = 0; i < tmpTypes.length; i++)
				{
					tmpAvailable.push(
					{
						Type: tmpTypes[i],
						Installed: tmpProviders[tmpTypes[i]]
					});
				}

				pResponse.send({ Types: tmpAvailable });
				return fNext();
			});

		// GET /beacon/connection/schemas -- aggregated form schemas, drives
		// the schema-driven ConnectionForm view (pict-section-connection-form).
		// MCM 1.1.0+ exposes getAllProviderFormSchemas(); older versions are
		// handled defensively so the UI surfaces a friendly empty state.
		pOratorServiceServer.doGet(`${tmpRoutePrefix}/connection/schemas`,
			(pRequest, pResponse, fNext) =>
			{
				let tmpMCM = this.fable.MeadowConnectionManager;
				let tmpSchemas = (tmpMCM && typeof(tmpMCM.getAllProviderFormSchemas) === 'function')
					? tmpMCM.getAllProviderFormSchemas()
					: [];
				if (tmpSchemas.length === 0)
				{
					this.fable.log.warn('DataBeacon: meadow-connection-manager getAllProviderFormSchemas() returned no schemas; UI will show "no providers detected".');
				}
				pResponse.send({ Schemas: tmpSchemas });
				return fNext();
			});

		this.fable.log.info(`DataBeacon ConnectionBridge routes connected at ${tmpRoutePrefix}/connection*`);
	}
}

module.exports = DataBeaconConnectionBridge;
module.exports.serviceType = 'DataBeaconConnectionBridge';
module.exports.default_configuration = defaultConnectionBridgeOptions;
