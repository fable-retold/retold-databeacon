/**
 * DataBeacon - Dynamic Endpoint Manager Service
 *
 * Generates meadow DAL objects and REST endpoints from introspected
 * table schemas. Each enabled table gets standard CRUD routes at
 * /1.0/{ConnectionHash}/{TableName}, served through one dispatch route per
 * connection prefix into a small route table per table. Uses per-connection
 * Meadow instances to route queries to the correct external database
 * provider.
 *
 * @author Steven Velozo <steven@velozo.com>
 */
const libFableServiceProviderBase = require('fable-serviceproviderbase');
const libMeadow = require('meadow');
const libMeadowEndpoints = require('meadow-endpoints');
const libFindMyWay = require('find-my-way');

// The first URL segment after a route prefix is the table scope, its list
// form (scope + 's') or its select form (scope + 'Select') — meadow-endpoints'
// route partials.
const ROUTE_SEGMENT_SUFFIXES = [ 'Select', 's' ];
// Orator service-server verb names and the HTTP methods they register.
const ROUTE_TABLE_VERBS = { get: 'GET', post: 'POST', put: 'PUT', del: 'DELETE', patch: 'PATCH', opts: 'OPTIONS', head: 'HEAD' };
const ROUTE_TABLE_METHODS = Object.values(ROUTE_TABLE_VERBS);

const defaultDynamicEndpointManagerOptions = (
	{
		RoutePrefix: '/beacon'
	});

class DataBeaconDynamicEndpointManager extends libFableServiceProviderBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, defaultDynamicEndpointManagerOptions, pOptions);
		super(pFable, tmpOptions, pServiceHash);

		this.serviceType = 'DataBeaconDynamicEndpointManager';

		// Dynamic endpoints are reached only via the MeadowProxy loopback (a
		// machine intermediary), so the request's identity arrives as the
		// forwarded `x-trusted-session` header rather than an orator session.
		// Default the meadow-endpoints session source to 'Header' so that
		// forwarded caller identity is honored (and stamped onto upstream calls
		// by remote-fronting connections). Operators can override in config.
		if (!this.fable.settings.MeadowEndpointsSessionDataSource)
		{
			this.fable.settings.MeadowEndpointsSessionDataSource = 'Header';
		}

		// Track enabled dynamic endpoints
		// Key: "connectionId-tableName", Value: { dal, endpoints, connectionId, tableName }
		this._EnabledEndpoints = {};

		// Per-connection Meadow instances for provider isolation
		// Key: connectionId, Value: Meadow instance
		this._ConnectionMeadows = {};
		this._ConnectionScopedFables = {};

		// Sticky set of table keys whose Restify routes have been physically
		// registered at least once since this process started. Restify /
		// find-my-way throws on duplicate registrations, so enableEndpoint
		// skips connectRoutes() when the key is already present here and
		// relies on the earlier route handler picking up the refreshed
		// `this.fable.Meadow{Type}Provider` binding at query time.
		// Key: "connectionId-tableName", Value: true
		this._RegisteredRouteKeys = {};

		// Namespaced tables route through one dispatch route per prefix into a
		// small route table per table scope. find-my-way checks every existing
		// route for a duplicate on each insert, so one shared router makes
		// registering N tables O(N^2); per-table tables keep it O(N). A table's
		// routes compile on its first request (~100KB each), so memory tracks
		// the tables in use rather than every enabled table.
		// Key: route prefix ("/1.0/<routeHash>"), Value: Map<scope, { Endpoints, Router }>
		this._RouteTables = {};
	}

	/**
	 * Map a Meadow semantic type to its JSON Schema equivalent.  meadow-endpoints
	 * walks `DAL.jsonSchema.properties` during create/update, so we build a
	 * proper properties map rather than leaving the default empty JSON schema
	 * meadow-schema hands back when no JsonSchema is supplied.
	 */
	_mapMeadowTypeToJsonSchemaType(pMeadowType)
	{
		switch (pMeadowType)
		{
			case 'AutoIdentity':
			case 'CreateIDUser':
			case 'UpdateIDUser':
			case 'DeleteIDUser':
			case 'Numeric':
				return 'number';
			case 'Boolean':
			case 'Deleted':
				return 'boolean';
			case 'CreateDate':
			case 'UpdateDate':
			case 'DeleteDate':
			case 'DateTime':
				return 'string';
			case 'AutoGUID':
			case 'String':
			case 'Text':
			default:
				return 'string';
		}
	}

	/**
	 * Build a Meadow schema object from introspected column definitions.
	 */
	_buildMeadowSchema(pTableName, pColumns)
	{
		let tmpIntrospector = this.fable.DataBeaconSchemaIntrospector;
		let tmpSchema = [];
		let tmpDefaultObject = {};
		let tmpJsonSchemaProperties = {};

		for (let i = 0; i < pColumns.length; i++)
		{
			let tmpCol = pColumns[i];
			let tmpMeadowType = tmpCol.MeadowType || 'String';
			let tmpSize = tmpIntrospector._mapSizeToMeadow(tmpMeadowType, tmpCol.MaxLength, tmpCol.NativeType);

			// The introspector maps column names to Meadow semantic types
			// (CreateDate, UpdateDate, AutoGUID, etc.) so we just pass
			// the MeadowType through. See SchemaIntrospector._mapNativeTypeToMeadow().
			let tmpSchemaType = tmpMeadowType;
			let tmpColName = tmpCol.Name;

			tmpSchema.push(
			{
				Column: tmpColName,
				Type: tmpSchemaType,
				Size: tmpSize
			});

			tmpJsonSchemaProperties[tmpColName] =
			{
				type: this._mapMeadowTypeToJsonSchemaType(tmpSchemaType)
			};

			// Set default values based on the schema type.
			// Meadow-managed fields (AutoIdentity, AutoGUID, CreateDate, etc.)
			// are auto-populated by the waterfall — we don't set defaults for those.
			switch (tmpSchemaType)
			{
				case 'AutoIdentity':
					tmpDefaultObject[tmpColName] = 0;
					break;
				case 'AutoGUID':
					tmpDefaultObject[tmpColName] = null;
					break;
				case 'CreateDate':
				case 'UpdateDate':
				case 'DeleteDate':
					tmpDefaultObject[tmpColName] = null;
					break;
				case 'CreateIDUser':
				case 'UpdateIDUser':
				case 'DeleteIDUser':
					tmpDefaultObject[tmpColName] = 0;
					break;
				case 'Deleted':
					tmpDefaultObject[tmpColName] = 0;
					break;
				case 'Numeric':
					tmpDefaultObject[tmpColName] = 0;
					break;
				case 'Boolean':
					tmpDefaultObject[tmpColName] = false;
					break;
				case 'DateTime':
					tmpDefaultObject[tmpColName] = null;
					break;
				default:
					tmpDefaultObject[tmpColName] = '';
					break;
			}
		}

		// DefaultIdentifier is only set when a single column provably identifies a
		// row.  meadow stamps it onto every query and the foxhound dialects order
		// capped reads by it, so naming a non-unique column here silently
		// reintroduces the LIMIT/OFFSET row loss it exists to prevent — a
		// composite key or a heap table has no scalar identity to offer.
		let tmpPrimaryKeyColumns = pColumns.filter((pC) => pC.IsPrimaryKey);

		let tmpPackage = {
			Scope: pTableName,
			Domain: 'Default',
			Schema: tmpSchema,
			DefaultObject: tmpDefaultObject,
			JsonSchema:
			{
				title: pTableName,
				type: 'object',
				properties: tmpJsonSchemaProperties,
				required: []
			}
		};

		if (tmpPrimaryKeyColumns.length === 1)
		{
			tmpPackage.DefaultIdentifier = tmpPrimaryKeyColumns[0].Name;
		}
		else
		{
			this.fable.log.warn(`Table [${pTableName}] has ${tmpPrimaryKeyColumns.length < 1 ? 'no primary key' : 'a composite primary key'}; endpoints are enabled without a DefaultIdentifier. Paged reads of this table cannot be ordered deterministically and may return overlapping pages.`,
				{ TableName: pTableName, PrimaryKeyColumns: tmpPrimaryKeyColumns.map((pC) => pC.Name) });
		}

		return tmpPackage;
	}

	/**
	 * Get or create a Meadow instance for a specific connection.
	 * This ensures provider isolation between different external databases.
	 */
	_getMeadowForConnection(pIDBeaconConnection, pType)
	{
		let tmpKey = String(pIDBeaconConnection);

		if (this._ConnectionMeadows[tmpKey])
		{
			return this._ConnectionMeadows[tmpKey];
		}

		// Create a prototype-scoped fable for this connection.
		// Each connection gets its own Meadow{Type}Provider binding
		// so that multiple connections of the same engine type don't
		// collide on the global fable.Meadow{Type}Provider property.
		let tmpScopedFable = Object.create(this.fable);
		this._ConnectionScopedFables[tmpKey] = tmpScopedFable;

		let tmpMeadow = libMeadow.new(tmpScopedFable);
		this._ConnectionMeadows[tmpKey] = tmpMeadow;

		return tmpMeadow;
	}

	/**
	 * Map a connection type to its Meadow provider name.
	 */
	_providerNameForType(pType)
	{
		switch (pType)
		{
			case 'MySQL': return 'MySQL';
			case 'PostgreSQL': return 'PostgreSQL';
			case 'MSSQL': return 'MSSQL';
			case 'SQLite': return 'SQLite';
			default: return pType;
		}
	}

	/**
	 * Enable CRUD endpoints for a specific introspected table.
	 */
	enableEndpoint(pIDBeaconConnection, pTableName, fCallback)
	{
		let tmpKey = `${pIDBeaconConnection}-${pTableName}`;

		if (this._EnabledEndpoints[tmpKey])
		{
			return fCallback(null, { Message: 'Endpoint already enabled', TableName: pTableName });
		}

		// Verify the connection is live
		let tmpConnectionBridge = this.fable.DataBeaconConnectionBridge;
		if (!tmpConnectionBridge || !tmpConnectionBridge.isConnected(pIDBeaconConnection))
		{
			return fCallback(new Error('Connection is not live. Connect first.'));
		}

		// Load the introspected table record
		let tmpQuery = this.fable.DAL.IntrospectedTable.query.clone()
			.addFilter('IDBeaconConnection', pIDBeaconConnection)
			.addFilter('TableName', pTableName)
			.addFilter('Deleted', 0);

		this.fable.DAL.IntrospectedTable.doReads(tmpQuery,
			(pError, pQuery, pRecords) =>
			{
				if (pError || !pRecords || pRecords.length === 0)
				{
					return fCallback(new Error(`Introspected table not found: ${pTableName}. Run introspect first.`));
				}

				let tmpRecord = pRecords[0];
				let tmpColumns = [];
				try
				{
					tmpColumns = JSON.parse(tmpRecord.ColumnDefinitions || '[]');
				}
				catch (e)
				{
					return fCallback(new Error('Failed to parse column definitions'));
				}

				if (tmpColumns.length === 0)
				{
					return fCallback(new Error('No columns found for table'));
				}

				// Load the connection record to get the type
				let tmpConnQuery = this.fable.DAL.BeaconConnection.query.clone()
					.addFilter('IDBeaconConnection', pIDBeaconConnection);

				this.fable.DAL.BeaconConnection.doRead(tmpConnQuery,
					(pConnError, pConnQuery, pConnectionRecord) =>
					{
						if (pConnError || !pConnectionRecord)
						{
							return fCallback(new Error('Connection record not found'));
						}

						try
						{
							let tmpType = pConnectionRecord.Type;
							let tmpProviderName = this._providerNameForType(tmpType);

							// Build the meadow schema from introspected columns
							let tmpMeadowSchema = this._buildMeadowSchema(pTableName, tmpColumns);

							// Use the connection's provider instance
							let tmpConnectionInstance = tmpConnectionBridge.getConnectionInstance(pIDBeaconConnection);
							let tmpProviderKey = `Meadow${tmpProviderName}Provider`;

							// Get or create a scoped Meadow for this connection FIRST
							// (this also creates the scoped fable via _getMeadowForConnection)
							let tmpMeadow = this._getMeadowForConnection(pIDBeaconConnection, tmpType);

							// Bind the provider on this connection's SCOPED fable.
							// Each connection gets its own prototype-linked fable copy
							// so multiple connections of the same engine type (e.g. two
							// MySQL databases) don't collide on the global provider key.
							let tmpScopedFable = this._ConnectionScopedFables[String(pIDBeaconConnection)];
							if (tmpScopedFable)
							{
								// The bound instance is the provider's configuration
								// AND session source — meadow's MeadowEndpoints
								// provider (like the SQL providers) reads the live
								// connection instance at this key per request.
								tmpScopedFable[tmpProviderKey] = tmpConnectionInstance;
							}
							else
							{
								// Fallback: single-connection case, set on global fable
								this.fable[tmpProviderKey] = tmpConnectionInstance;
							}

							// Create DAL entity
							let tmpDAL = tmpMeadow.loadFromPackageObject(tmpMeadowSchema);
							tmpDAL.setProvider(tmpProviderName);

							// Create meadow-endpoints
							let tmpEndpoints = libMeadowEndpoints.new(tmpDAL);

							// Namespace under a hash of the human-readable connection name
							// so customer tables never collide with internal entities or
							// other connections' same-named tables.
							let tmpRouteHash = null;
							try
							{
								let tmpSanitize = require('meadow-connection-manager').sanitizeConnectionName;
								if (tmpSanitize && pConnectionRecord.Name)
								{
									tmpRouteHash = tmpSanitize(pConnectionRecord.Name);
								}
							}
							catch (pSanitizeError)
							{
								// If sanitizer unavailable, fall back to connection ID
								tmpRouteHash = `conn-${pIDBeaconConnection}`;
							}
							if (tmpRouteHash)
							{
								tmpEndpoints.EndpointPrefix = `/${tmpEndpoints.EndpointVersion}/${tmpRouteHash}/${tmpDAL.scope}`;
							}

							if (tmpRouteHash)
							{
								// A re-enable replaces the table's route table
								// outright, so it serves the fresh endpoints.
								this._mountRouteTable(`/${tmpEndpoints.EndpointVersion}/${tmpRouteHash}`, tmpDAL.scope, tmpEndpoints);
							}
							else if (!this._RegisteredRouteKeys[tmpKey])
							{
								// Restify can't unregister routes, so only call
								// connectRoutes() the first time we wire this
								// connection+table key. On subsequent enables
								// (post-disconnect/reconnect) the original route
								// handler is still live; we rely on it resolving
								// `this.fable.Meadow{Type}Provider` (which we just
								// refreshed above) at query time, so traffic hits
								// the fresh live connection with no duplicate route
								// registration.
								tmpEndpoints.connectRoutes(this.fable.OratorServiceServer);
								this._RegisteredRouteKeys[tmpKey] = true;
							}

							// Track the enabled endpoint.  RouteHash lets listAll...()
							// emit the fully-namespaced /1.0/<hash>/<Table> base
							// that clients (web UI, tests, docs) should hit.
							this._EnabledEndpoints[tmpKey] =
							{
								dal: tmpDAL,
								endpoints: tmpEndpoints,
								connectionId: pIDBeaconConnection,
								tableName: pTableName,
								connectionType: tmpType,
								routeHash: tmpRouteHash
							};

							let fEnabled = () =>
							{
								let tmpEndpointBase = tmpRouteHash
									? `/1.0/${tmpRouteHash}/${pTableName}`
									: `/1.0/${pTableName}`;
								this.fable.log.info(`Dynamic endpoints enabled for ${pTableName} at [${tmpEndpointBase}] (connection #${pIDBeaconConnection})`);
								return fCallback(null,
								{
									TableName: pTableName,
									EndpointBase: tmpEndpointBase,
									ColumnCount: tmpColumns.length
								});
							};

							// Warm-up and restore re-enable rows already flagged;
							// only write the flag when it changes.
							if (tmpRecord.EndpointsEnabled == 1)
							{
								return fEnabled();
							}
							tmpRecord.EndpointsEnabled = 1;
							let tmpUpdateQuery = this.fable.DAL.IntrospectedTable.query.clone()
								.addRecord(tmpRecord);

							this.fable.DAL.IntrospectedTable.doUpdate(tmpUpdateQuery, fEnabled);
						}
						catch (pEnableError)
						{
							this.fable.log.error(`Error enabling endpoint for ${pTableName}: ${pEnableError}`);
							return fCallback(pEnableError);
						}
					});
			});
	}

	/**
	 * Mount one table's meadow endpoints behind the prefix's dispatch route,
	 * connecting the dispatch route on first use. The table's routes compile
	 * on its first request (_routeTableRouter).
	 *
	 * @param {string} pRoutePrefix - e.g. "/1.0/<routeHash>"
	 * @param {string} pScope - The table's DAL scope (the first URL segment after the prefix).
	 * @param {object} pEndpoints - The table's meadow-endpoints instance, EndpointPrefix already set.
	 */
	_mountRouteTable(pRoutePrefix, pScope, pEndpoints)
	{
		if (!this._RouteTables[pRoutePrefix])
		{
			this._RouteTables[pRoutePrefix] = new Map();
			this._connectDispatchRoutes(pRoutePrefix);
		}
		this._RouteTables[pRoutePrefix].set(pScope, { Endpoints: pEndpoints, Router: null });
	}

	/**
	 * A mounted table's router, compiling its routes on first use.
	 *
	 * @param {{ Endpoints: object, Router: object|null }} pRouteTable
	 * @return {object} A find-my-way router.
	 */
	_routeTableRouter(pRouteTable)
	{
		if (!pRouteTable.Router)
		{
			let tmpRouter = libFindMyWay(this._routeTableOptions());
			pRouteTable.Endpoints.connectRoutes(this._routeTableServer(tmpRouter));
			pRouteTable.Router = tmpRouter;
		}
		return pRouteTable.Router;
	}

	/**
	 * Route-table router options: the same configuration the service server
	 * hands its own router, so matching (parameter length, trailing slashes,
	 * case) behaves as it would there.
	 *
	 * @return {object}
	 */
	_routeTableOptions()
	{
		let tmpServer = this.fable.OratorServiceServer;
		let tmpConfiguration = (tmpServer && tmpServer.options && tmpServer.options.hasOwnProperty('RestifyConfiguration')) ? tmpServer.options.RestifyConfiguration :
			(this.fable.settings.hasOwnProperty('RestifyConfiguration')) ? this.fable.settings.RestifyConfiguration :
			{};
		return Object.assign({ maxParamLength: Number.MAX_SAFE_INTEGER }, tmpConfiguration);
	}

	/**
	 * The service-server surface meadow-endpoints' connectRoutes() calls,
	 * registering into a route table: every orator verb and its
	 * *WithBodyParser form. The dispatch routes parse bodies
	 * (_connectDispatchRoutes), so both forms register the same way. A route
	 * table runs one handler per route, so more than one throws rather than
	 * dropping middleware.
	 *
	 * @param {object} pRouter - A find-my-way router.
	 * @return {object}
	 */
	_routeTableServer(pRouter)
	{
		let tmpServer = {};
		let tmpVerbs = Object.keys(ROUTE_TABLE_VERBS);
		for (let i = 0; i < tmpVerbs.length; i++)
		{
			let tmpVerb = tmpVerbs[i];
			let tmpMethod = ROUTE_TABLE_VERBS[tmpVerb];
			let fOn = (pRoute, ...fHandlers) =>
			{
				if (fHandlers.length !== 1)
				{
					throw new Error(`Route tables take exactly one handler per route; ${tmpMethod} ${pRoute} was given ${fHandlers.length}.`);
				}
				pRouter.on(tmpMethod, pRoute, fHandlers[0]);
			};
			tmpServer[tmpVerb] = fOn;
			tmpServer[`${tmpVerb}WithBodyParser`] = fOn;
		}
		return tmpServer;
	}

	/**
	 * Connect the prefix's catch-all routes on the service server, one per
	 * verb, each with the server's body parser ahead of dispatch so every
	 * table route sees a parsed body whatever the server-wide middleware.
	 *
	 * @param {string} pRoutePrefix
	 */
	_connectDispatchRoutes(pRoutePrefix)
	{
		let tmpServer = this.fable.OratorServiceServer;
		let fDispatch = (pRequest, pResponse, fNext) =>
		{
			return this._dispatchRouteTable(pRoutePrefix, pRequest, pResponse, fNext);
		};
		let tmpRoute = `${pRoutePrefix}/*`;
		let tmpVerbs = Object.keys(ROUTE_TABLE_VERBS);
		for (let i = 0; i < tmpVerbs.length; i++)
		{
			tmpServer[`${tmpVerbs[i]}WithBodyParser`](tmpRoute, fDispatch);
		}
	}

	/**
	 * Candidate table scopes for a URL segment, most specific first.
	 *
	 * @param {string} pSegment
	 * @return {Array<string>}
	 */
	_candidateScopes(pSegment)
	{
		let tmpCandidates = [ pSegment ];
		for (let i = 0; i < ROUTE_SEGMENT_SUFFIXES.length; i++)
		{
			let tmpSuffix = ROUTE_SEGMENT_SUFFIXES[i];
			if (pSegment.length > tmpSuffix.length && pSegment.endsWith(tmpSuffix))
			{
				tmpCandidates.push(pSegment.slice(0, -tmpSuffix.length));
			}
		}
		return tmpCandidates;
	}

	/**
	 * Route a request under a prefix to its table's route table, answering
	 * 404 / 405 the way the service server's own router does on a miss.
	 *
	 * @param {string} pRoutePrefix
	 * @param {object} pRequest
	 * @param {object} pResponse
	 * @param {function} fNext
	 * @return {any}
	 */
	_dispatchRouteTable(pRoutePrefix, pRequest, pResponse, fNext)
	{
		let tmpPath = pRequest.getUrl().pathname;
		let tmpRouteTables = this._RouteTables[pRoutePrefix];
		let tmpSegment = tmpPath.slice(pRoutePrefix.length + 1).split('/')[0];
		let tmpCandidates = this._candidateScopes(tmpSegment);
		let tmpBestRoute = null;
		let tmpPathKnown = false;
		for (let i = 0; i < tmpCandidates.length; i++)
		{
			let tmpRouteTable = tmpRouteTables.get(tmpCandidates[i]);
			if (!tmpRouteTable)
			{
				continue;
			}
			let tmpRouter = this._routeTableRouter(tmpRouteTable);
			let tmpRoute = tmpRouter.find(pRequest.method, tmpPath);
			// Two tables can claim a segment (Item's list "Items" and a table
			// named Items). One router would prefer the static match over the
			// parametric one; fewer captured params is that same preference.
			if (tmpRoute && (!tmpBestRoute || Object.keys(tmpRoute.params).length < Object.keys(tmpBestRoute.params).length))
			{
				tmpBestRoute = tmpRoute;
			}
			if (!tmpRoute && !tmpPathKnown)
			{
				tmpPathKnown = ROUTE_TABLE_METHODS.some((pMethod) => !!tmpRouter.find(pMethod, tmpPath));
			}
		}
		if (tmpBestRoute)
		{
			pRequest.params = Object.assign(pRequest.params || {}, tmpBestRoute.params);
			return tmpBestRoute.handler(pRequest, pResponse, fNext);
		}
		if (tmpPathKnown)
		{
			pResponse.send(405, { code: 'MethodNotAllowed', message: `${pRequest.method} is not allowed` });
		}
		else
		{
			pResponse.send(404, { code: 'ResourceNotFound', message: `${tmpPath} does not exist` });
		}
		return fNext(false);
	}

	/**
	 * Disable CRUD endpoints for a specific table.
	 * Note: Restify doesn't support route removal, so we mark it disabled
	 * and the routes will not be re-enabled on restart.
	 */
	disableEndpoint(pIDBeaconConnection, pTableName, fCallback)
	{
		let tmpKey = `${pIDBeaconConnection}-${pTableName}`;

		delete this._EnabledEndpoints[tmpKey];

		// Update the IntrospectedTable record
		let tmpQuery = this.fable.DAL.IntrospectedTable.query.clone()
			.addFilter('IDBeaconConnection', pIDBeaconConnection)
			.addFilter('TableName', pTableName)
			.addFilter('Deleted', 0);

		this.fable.DAL.IntrospectedTable.doReads(tmpQuery,
			(pError, pQuery, pRecords) =>
			{
				if (pRecords && pRecords.length > 0)
				{
					let tmpRecord = pRecords[0];
					tmpRecord.EndpointsEnabled = 0;

					let tmpUpdateQuery = this.fable.DAL.IntrospectedTable.query.clone()
						.addRecord(tmpRecord);

					this.fable.DAL.IntrospectedTable.doUpdate(tmpUpdateQuery,
						() =>
						{
							this.fable.log.info(`Dynamic endpoints disabled for ${pTableName}`);
							return fCallback(null, { TableName: pTableName, Disabled: true });
						});
				}
				else
				{
					return fCallback(null, { TableName: pTableName, Disabled: true });
				}
			});
	}

	/**
	 * List all enabled dynamic endpoints.
	 */
	listEndpoints()
	{
		let tmpEndpoints = [];
		let tmpKeys = Object.keys(this._EnabledEndpoints);

		for (let i = 0; i < tmpKeys.length; i++)
		{
			let tmpEntry = this._EnabledEndpoints[tmpKeys[i]];
			let tmpBase = tmpEntry.routeHash
				? `/1.0/${tmpEntry.routeHash}/${tmpEntry.tableName}`
				: `/1.0/${tmpEntry.tableName}`;
			tmpEndpoints.push(
			{
				ConnectionID: tmpEntry.connectionId,
				TableName: tmpEntry.tableName,
				ConnectionType: tmpEntry.connectionType,
				RouteHash: tmpEntry.routeHash || '',
				EndpointBase: tmpBase
			});
		}

		return tmpEndpoints;
	}

	/**
	 * Re-enable dynamic endpoints from persisted IntrospectedTable records
	 * on service startup (warm-up).
	 */
	warmUpEndpoints(fCallback)
	{
		if (!this.fable.DAL || !this.fable.DAL.IntrospectedTable)
		{
			return fCallback();
		}

		let tmpQuery = this.fable.DAL.IntrospectedTable.query.clone()
			.addFilter('EndpointsEnabled', 1)
			.addFilter('Deleted', 0);

		this.fable.DAL.IntrospectedTable.doReads(tmpQuery,
			(pError, pQuery, pRecords) =>
			{
				if (pError || !pRecords || pRecords.length === 0)
				{
					return fCallback();
				}

				this.fable.log.info(`DataBeacon: Warming up ${pRecords.length} dynamic endpoint(s)...`);

				let tmpAnticipate = this.fable.newAnticipate();

				for (let i = 0; i < pRecords.length; i++)
				{
					let tmpRecord = pRecords[i];
					tmpAnticipate.anticipate(
						(fStepCallback) =>
						{
							// Yield between tables: enabling is synchronous end to end
							// with the SQLite store, so without this the server can't
							// answer anything until every table is warm.
							setImmediate(() =>
							{
								// Only re-enable if the connection is live
								let tmpConnectionBridge = this.fable.DataBeaconConnectionBridge;
								if (tmpConnectionBridge && tmpConnectionBridge.isConnected(tmpRecord.IDBeaconConnection))
								{
									this.enableEndpoint(tmpRecord.IDBeaconConnection, tmpRecord.TableName,
										(pEnableError) =>
										{
											if (pEnableError)
											{
												this.fable.log.warn(`Warm-up failed for ${tmpRecord.TableName}: ${pEnableError}`);
											}
											return fStepCallback();
										});
								}
								else
								{
									this.fable.log.info(`Skipping warm-up for ${tmpRecord.TableName} — connection not live`);
									return fStepCallback();
								}
							});
						});
				}

				tmpAnticipate.wait(fCallback);
			});
	}

	/**
	 * Restore all persisted dynamic endpoints for a single connection that
	 * just reconnected. Invoked from ConnectionBridge's /connect handler so
	 * that tables flagged `EndpointsEnabled = 1` in the config DB have their
	 * Restify routes re-wired without the user having to toggle them off
	 * and back on. Mirrors warmUpEndpoints but scoped to one connection.
	 *
	 * @param {number} pIDBeaconConnection
	 * @param {function(Error?, {Restored:number}?)} fCallback
	 */
	restoreEnabledEndpointsForConnection(pIDBeaconConnection, fCallback)
	{
		let tmpCallback = (typeof fCallback === 'function') ? fCallback : () => {};
		if (!this.fable.DAL || !this.fable.DAL.IntrospectedTable)
		{
			return tmpCallback(null, { Restored: 0 });
		}
		if (pIDBeaconConnection === null || pIDBeaconConnection === undefined)
		{
			return tmpCallback(null, { Restored: 0 });
		}

		let tmpQuery = this.fable.DAL.IntrospectedTable.query.clone()
			.addFilter('IDBeaconConnection', pIDBeaconConnection)
			.addFilter('EndpointsEnabled', 1)
			.addFilter('Deleted', 0);

		this.fable.DAL.IntrospectedTable.doReads(tmpQuery,
			(pError, pQuery, pRecords) =>
			{
				if (pError)
				{
					this.fable.log.warn(`DataBeacon: Endpoint restore query failed for connection #${pIDBeaconConnection}: ${pError.message || pError}`);
					return tmpCallback(pError, { Restored: 0 });
				}
				if (!pRecords || pRecords.length === 0)
				{
					return tmpCallback(null, { Restored: 0 });
				}

				this.fable.log.info(`DataBeacon: Restoring ${pRecords.length} endpoint(s) for connection #${pIDBeaconConnection}...`);

				let tmpAnticipate = this.fable.newAnticipate();
				let tmpRestoredCount = 0;

				for (let i = 0; i < pRecords.length; i++)
				{
					let tmpRecord = pRecords[i];
					tmpAnticipate.anticipate(
						(fStepCallback) =>
						{
							// Yield between tables, as warm-up does.
							setImmediate(() =>
							{
								this.enableEndpoint(pIDBeaconConnection, tmpRecord.TableName,
									(pEnableError) =>
									{
										if (pEnableError)
										{
											this.fable.log.warn(`DataBeacon: Endpoint restore failed for ${tmpRecord.TableName}: ${pEnableError.message || pEnableError}`);
										}
										else
										{
											tmpRestoredCount++;
										}
										return fStepCallback();
									});
							});
						});
				}

				tmpAnticipate.wait(
					(pAnticipateError) =>
					{
						if (!pAnticipateError)
						{
							this.fable.log.info(`DataBeacon: Restored ${tmpRestoredCount}/${pRecords.length} endpoint(s) for connection #${pIDBeaconConnection}.`);
						}
						return tmpCallback(pAnticipateError || null, { Restored: tmpRestoredCount });
					});
			});
	}

	/**
	 * Forget all in-memory endpoint handles for a connection. Called from
	 * ConnectionBridge's /disconnect so `listEndpoints()` stops advertising
	 * routes that point at a dead connection. The persisted
	 * `EndpointsEnabled` flag is preserved so a subsequent reconnect can
	 * reinstate them via `restoreEnabledEndpointsForConnection`.
	 *
	 * Note: Restify does not support route removal, so the physical route
	 * handler stays registered — but without a live MeadowEndpoints
	 * instance behind it, and with no entry in `_EnabledEndpoints`, any
	 * hit will fail with a clear connection-not-live error and the
	 * endpoints listing will be accurate.
	 *
	 * @param {number} pIDBeaconConnection
	 */
	clearInMemoryEndpointsForConnection(pIDBeaconConnection)
	{
		if (pIDBeaconConnection === null || pIDBeaconConnection === undefined) return 0;
		let tmpKeys = Object.keys(this._EnabledEndpoints);
		let tmpRemoved = 0;
		for (let i = 0; i < tmpKeys.length; i++)
		{
			let tmpEntry = this._EnabledEndpoints[tmpKeys[i]];
			if (tmpEntry && tmpEntry.connectionId === pIDBeaconConnection)
			{
				delete this._EnabledEndpoints[tmpKeys[i]];
				tmpRemoved++;
			}
		}
		if (tmpRemoved > 0)
		{
			this.fable.log.info(`DataBeacon: Cleared ${tmpRemoved} in-memory endpoint handle(s) for connection #${pIDBeaconConnection}.`);
		}
		return tmpRemoved;
	}

	// ================================================================
	// REST Routes
	// ================================================================

	connectRoutes(pOratorServiceServer)
	{
		let tmpRoutePrefix = this.options.RoutePrefix;

		// POST /beacon/endpoint/:connectionId/:tableName/enable
		pOratorServiceServer.doPost(`${tmpRoutePrefix}/endpoint/:connectionId/:tableName/enable`,
			(pRequest, pResponse, fNext) =>
			{
				let tmpConnectionId = parseInt(pRequest.params.connectionId, 10);
				let tmpTableName = pRequest.params.tableName;

				this.enableEndpoint(tmpConnectionId, tmpTableName,
					(pError, pResult) =>
					{
						if (pError)
						{
							pResponse.send({ Success: false, Error: pError.message || pError });
							return fNext();
						}
						pResponse.send({ Success: true, Endpoint: pResult });
						return fNext();
					});
			});

		// POST /beacon/endpoint/:connectionId/:tableName/disable
		pOratorServiceServer.doPost(`${tmpRoutePrefix}/endpoint/:connectionId/:tableName/disable`,
			(pRequest, pResponse, fNext) =>
			{
				let tmpConnectionId = parseInt(pRequest.params.connectionId, 10);
				let tmpTableName = pRequest.params.tableName;

				this.disableEndpoint(tmpConnectionId, tmpTableName,
					(pError, pResult) =>
					{
						if (pError)
						{
							pResponse.send({ Success: false, Error: pError.message || pError });
							return fNext();
						}
						pResponse.send({ Success: true, Result: pResult });
						return fNext();
					});
			});

		// GET /beacon/endpoints -- list all enabled dynamic endpoints
		pOratorServiceServer.doGet(`${tmpRoutePrefix}/endpoints`,
			(pRequest, pResponse, fNext) =>
			{
				let tmpEndpoints = this.listEndpoints();
				pResponse.send({ Count: tmpEndpoints.length, Endpoints: tmpEndpoints });
				return fNext();
			});

		this.fable.log.info(`DataBeacon DynamicEndpointManager routes connected at ${tmpRoutePrefix}/endpoint*`);
	}
}

module.exports = DataBeaconDynamicEndpointManager;
module.exports.serviceType = 'DataBeaconDynamicEndpointManager';
module.exports.default_configuration = defaultDynamicEndpointManagerOptions;
