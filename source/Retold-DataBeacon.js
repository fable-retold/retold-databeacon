/**
 * Retold DataBeacon
 *
 * Deployable data beacon service — connect to remote databases,
 * introspect schemas, generate REST endpoints, and expose beacon
 * capabilities to the Ultravisor mesh.
 *
 * @author Steven Velozo <steven@velozo.com>
 */
const libFableServiceProviderBase = require('fable-serviceproviderbase');

const libOrator = require('orator');
const libOratorServiceServerRestify = require('orator-serviceserver-restify');
const libOratorStaticServer = require('orator-static-server');

const libMeadow = require('meadow');
const libMeadowEndpoints = require('meadow-endpoints');

const libPath = require('path');
const libFs = require('fs');

const libDataBeaconConnectionBridge = require('./services/DataBeacon-ConnectionBridge.js');
const libDataBeaconSchemaIntrospector = require('./services/DataBeacon-SchemaIntrospector.js');
const libDataBeaconDynamicEndpointManager = require('./services/DataBeacon-DynamicEndpointManager.js');
const libDataBeaconBeaconProvider = require('./services/DataBeacon-BeaconProvider.js');

// Embedded schema SQL for auto-creation when using SQLite
const DATABEACON_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS User (
	IDUser INTEGER PRIMARY KEY AUTOINCREMENT,
	GUIDUser TEXT,
	CreateDate TEXT, CreatingIDUser INTEGER DEFAULT 0,
	UpdateDate TEXT, UpdatingIDUser INTEGER DEFAULT 0,
	Deleted INTEGER DEFAULT 0, DeleteDate TEXT, DeletingIDUser INTEGER DEFAULT 0,
	LoginID TEXT, Name TEXT
);
CREATE TABLE IF NOT EXISTS BeaconConnection (
	IDBeaconConnection INTEGER PRIMARY KEY AUTOINCREMENT,
	GUIDBeaconConnection TEXT,
	CreateDate TEXT, CreatingIDUser INTEGER DEFAULT 0,
	UpdateDate TEXT, UpdatingIDUser INTEGER DEFAULT 0,
	Deleted INTEGER DEFAULT 0, DeleteDate TEXT, DeletingIDUser INTEGER DEFAULT 0,
	Name TEXT, Type TEXT, Config TEXT,
	Status TEXT DEFAULT 'Untested', LastTestedDate TEXT,
	AutoConnect INTEGER DEFAULT 0, Description TEXT
);
CREATE TABLE IF NOT EXISTS IntrospectedTable (
	IDIntrospectedTable INTEGER PRIMARY KEY AUTOINCREMENT,
	GUIDIntrospectedTable TEXT,
	CreateDate TEXT, CreatingIDUser INTEGER DEFAULT 0,
	UpdateDate TEXT, UpdatingIDUser INTEGER DEFAULT 0,
	Deleted INTEGER DEFAULT 0, DeleteDate TEXT, DeletingIDUser INTEGER DEFAULT 0,
	IDBeaconConnection INTEGER DEFAULT 0,
	DatabaseName TEXT, TableName TEXT,
	ColumnDefinitions TEXT,
	LastIntrospectedDate TEXT,
	EndpointsEnabled INTEGER DEFAULT 0,
	RowCountEstimate INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS IntrospectedTable_IDBeaconConnection_TableName ON IntrospectedTable (IDBeaconConnection, TableName);
INSERT OR IGNORE INTO User (IDUser, LoginID, Name) VALUES (1, 'system', 'System');
`;

const defaultDataBeaconSettings = (
	{
		AutoStartOrator: true,
		AutoCreateSchema: false,

		FullMeadowSchemaPath: `${process.cwd()}/model/`,
		FullMeadowSchemaFilename: 'MeadowModel-DataBeacon.json',

		// Path to the web app folder for static serving; false to skip
		WebAppPath: false,

		// Endpoint allow-list
		Endpoints:
			{
				MeadowEndpoints: true,
				ConnectionBridge: true,
				SchemaIntrospector: true,
				DynamicEndpointManager: true,
				BeaconProvider: true,
				WebUI: true
			},

		DataBeacon:
			{
				RoutePrefix: '/beacon'
			}
	});

class RetoldDataBeacon extends libFableServiceProviderBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, JSON.parse(JSON.stringify(defaultDataBeaconSettings)), pOptions);
		super(pFable, tmpOptions, pServiceHash);

		this.serviceType = 'RetoldDataBeacon';

		// Re-apply defaults without mutating the module-level defaultDataBeaconSettings object.
		this.options = Object.assign({}, JSON.parse(JSON.stringify(defaultDataBeaconSettings)), this.options);

		// Add the restify server provider and orator base class to fable
		this.fable.serviceManager.addServiceType('OratorServiceServer', libOratorServiceServerRestify);
		this.fable.serviceManager.addServiceType('Orator', libOrator);

		// Initialize Restify
		this.fable.serviceManager.instantiateServiceProvider('OratorServiceServer', this.options);

		// Initialize Orator
		this.fable.serviceManager.instantiateServiceProvider('Orator', this.options);

		// Initialize Meadow for internal DAL
		this._Meadow = libMeadow.new(pFable);
		this._DAL = {};
		this._MeadowEndpoints = {};

		// Register sub-services
		let tmpRoutePrefix = this.options.DataBeacon.RoutePrefix;

		this.fable.serviceManager.addServiceType('DataBeaconConnectionBridge', libDataBeaconConnectionBridge);
		this.fable.serviceManager.instantiateServiceProvider('DataBeaconConnectionBridge',
			{
				RoutePrefix: tmpRoutePrefix
			});

		this.fable.serviceManager.addServiceType('DataBeaconSchemaIntrospector', libDataBeaconSchemaIntrospector);
		this.fable.serviceManager.instantiateServiceProvider('DataBeaconSchemaIntrospector',
			{
				RoutePrefix: tmpRoutePrefix
			});

		this.fable.serviceManager.addServiceType('DataBeaconDynamicEndpointManager', libDataBeaconDynamicEndpointManager);
		this.fable.serviceManager.instantiateServiceProvider('DataBeaconDynamicEndpointManager',
			{
				RoutePrefix: tmpRoutePrefix
			});

		this.fable.serviceManager.addServiceType('DataBeaconBeaconProvider', libDataBeaconBeaconProvider);
		this.fable.serviceManager.instantiateServiceProvider('DataBeaconBeaconProvider',
			{
				RoutePrefix: tmpRoutePrefix
			});

		// Expose DAL on fable for convenience
		this.fable.DAL = this._DAL;
		this.fable.MeadowEndpoints = this._MeadowEndpoints;

		this.serviceInitialized = false;
	}

	/**
	 * Check if an endpoint group is enabled in the Endpoints configuration.
	 */
	isEndpointGroupEnabled(pGroupName)
	{
		if (!this.options.Endpoints)
		{
			return false;
		}
		if (!this.options.Endpoints.hasOwnProperty(pGroupName))
		{
			return false;
		}
		return !!this.options.Endpoints[pGroupName];
	}

	/**
	 * Create the database schema using the embedded SQL.
	 */
	createSchema(fCallback)
	{
		try
		{
			if (this.fable.MeadowSQLiteProvider && this.fable.MeadowSQLiteProvider.db)
			{
				this.fable.log.info('Creating DataBeacon schema (CREATE TABLE IF NOT EXISTS)...');
				this.fable.MeadowSQLiteProvider.db.exec(DATABEACON_SCHEMA_SQL);
				this.fable.log.info('DataBeacon schema created successfully.');
			}
			else
			{
				this.fable.log.warn('No SQLite provider available; skipping schema auto-creation.');
			}
		}
		catch (pError)
		{
			this.fable.log.error(`Error creating DataBeacon schema: ${pError}`);
			return fCallback(pError);
		}

		return fCallback();
	}

	/**
	 * Load a parsed model object and create DAL objects and Meadow Endpoints
	 * for each entity in it.
	 */
	loadModel(pModelName, pModelObject, fCallback)
	{
		this.fable.log.info(`DataBeacon loading model [${pModelName}]...`);

		let tmpEntityList = Object.keys(pModelObject.Tables);

		this.fable.log.info(`...initializing ${tmpEntityList.length} DAL objects for model [${pModelName}]...`);

		for (let i = 0; i < tmpEntityList.length; i++)
		{
			let tmpDALEntityName = tmpEntityList[i];
			let tmpRoutesAlreadyConnected = this._MeadowEndpoints.hasOwnProperty(tmpDALEntityName);

			try
			{
				let tmpDALSchema = pModelObject.Tables[tmpDALEntityName];
				let tmpDALMeadowSchema = tmpDALSchema.MeadowSchema;

				this._DAL[tmpDALEntityName] = this._Meadow.loadFromPackageObject(tmpDALMeadowSchema);
				this._DAL[tmpDALEntityName].setProvider('SQLite');
				this._MeadowEndpoints[tmpDALEntityName] = libMeadowEndpoints.new(this._DAL[tmpDALEntityName]);

				if (!tmpRoutesAlreadyConnected)
				{
					this._MeadowEndpoints[tmpDALEntityName].connectRoutes(this.fable.OratorServiceServer);
				}
			}
			catch (pError)
			{
				this.fable.log.error(`Error initializing DAL for entity [${tmpDALEntityName}]: ${pError}`);
			}
		}

		return fCallback();
	}

	/**
	 * Load a model from a JSON file on disk.
	 */
	loadModelFromFile(pModelName, pModelPath, pModelFilename, fCallback)
	{
		this.fable.log.info(`...loading model [${pModelName}] from file [${pModelPath}${pModelFilename}]...`);

		let tmpModelObject;
		try
		{
			tmpModelObject = require(`${pModelPath}${pModelFilename}`);
		}
		catch (pError)
		{
			this.fable.log.error(`Error loading model file [${pModelPath}${pModelFilename}]: ${pError}`);
			return fCallback(pError);
		}

		return this.loadModel(pModelName, tmpModelObject, fCallback);
	}

	initializeService(fCallback)
	{
		if (this.serviceInitialized)
		{
			return fCallback(new Error('RetoldDataBeacon is being initialized but has already been initialized...'));
		}

		let tmpAnticipate = this.fable.newAnticipate();

		this.fable.log.info(`Retold DataBeacon is initializing...`);

		// Log endpoint configuration
		let tmpGroupNames = ['MeadowEndpoints', 'ConnectionBridge', 'SchemaIntrospector', 'DynamicEndpointManager', 'BeaconProvider', 'WebUI'];
		let tmpEnabledGroups = [];
		let tmpDisabledGroups = [];
		for (let i = 0; i < tmpGroupNames.length; i++)
		{
			if (this.isEndpointGroupEnabled(tmpGroupNames[i]))
			{
				tmpEnabledGroups.push(tmpGroupNames[i]);
			}
			else
			{
				tmpDisabledGroups.push(tmpGroupNames[i]);
			}
		}
		this.fable.log.info(`Endpoint groups enabled: [${tmpEnabledGroups.join(', ')}]`);
		if (tmpDisabledGroups.length > 0)
		{
			this.fable.log.info(`Endpoint groups disabled: [${tmpDisabledGroups.join(', ')}]`);
		}

		// Start Orator web server
		tmpAnticipate.anticipate(
			(fInitCallback) =>
			{
				if (this.options.AutoStartOrator)
				{
					this.fable.Orator.startWebServer(fInitCallback);
				}
				else
				{
					return fInitCallback();
				}
			});

		// Enable JSON body parsing and query string parsing
		tmpAnticipate.anticipate(
			(fInitCallback) =>
			{
				this.fable.OratorServiceServer.server.use(this.fable.OratorServiceServer.bodyParser());
				this.fable.OratorServiceServer.server.use(require('restify').plugins.queryParser());
				return fInitCallback();
			});

		// Auto-create schema if configured
		tmpAnticipate.anticipate(
			(fInitCallback) =>
			{
				if (this.options.AutoCreateSchema)
				{
					return this.createSchema(fInitCallback);
				}
				return fInitCallback();
			});

		// Load internal meadow model
		tmpAnticipate.anticipate(
			(fInitCallback) =>
			{
				if (!this.isEndpointGroupEnabled('MeadowEndpoints'))
				{
					return fInitCallback();
				}

				if (this.options.FullMeadowSchemaFilename)
				{
					let tmpModelName = this.options.FullMeadowSchemaFilename.replace(/\.json$/i, '');
					return this.loadModelFromFile(tmpModelName, this.options.FullMeadowSchemaPath, this.options.FullMeadowSchemaFilename, fInitCallback);
				}
				else
				{
					return fInitCallback();
				}
			});

		// Wire endpoint routes for sub-services
		tmpAnticipate.anticipate(
			(fInitCallback) =>
			{
				if (this.isEndpointGroupEnabled('ConnectionBridge'))
				{
					this.fable.DataBeaconConnectionBridge.connectRoutes(this.fable.OratorServiceServer);
				}

				if (this.isEndpointGroupEnabled('SchemaIntrospector'))
				{
					this.fable.DataBeaconSchemaIntrospector.connectRoutes(this.fable.OratorServiceServer);
				}

				if (this.isEndpointGroupEnabled('DynamicEndpointManager'))
				{
					this.fable.DataBeaconDynamicEndpointManager.connectRoutes(this.fable.OratorServiceServer);
				}

				if (this.isEndpointGroupEnabled('BeaconProvider'))
				{
					this.fable.DataBeaconBeaconProvider.connectRoutes(this.fable.OratorServiceServer);
				}

				return fInitCallback();
			});

		// Serve static web UI
		tmpAnticipate.anticipate(
			(fInitCallback) =>
			{
				if (!this.isEndpointGroupEnabled('WebUI'))
				{
					return fInitCallback();
				}

				let tmpWebAppPath = this.options.WebAppPath;
				if (!tmpWebAppPath)
				{
					tmpWebAppPath = libPath.join(__dirname, 'services', 'web-app', 'web');
				}

				this.fable.log.info(`Serving DataBeacon web UI from ${tmpWebAppPath}`);

				// Serve pict.min.js from the pict package's dist folder
				let tmpPictMinJsPath;
				try
				{
					tmpPictMinJsPath = require.resolve('pict/dist/pict.min.js');
				}
				catch (pResolveError)
				{
					this.fable.log.warn(`Could not resolve pict.min.js: ${pResolveError}`);
				}

				if (tmpPictMinJsPath)
				{
					this.fable.OratorServiceServer.doGet('/pict.min.js',
						(pRequest, pResponse, fNext) =>
						{
							libFs.readFile(tmpPictMinJsPath, 'utf8',
								(pError, pData) =>
								{
									if (pError)
									{
										pResponse.send(500, { Error: 'Could not read pict.min.js' });
										return fNext();
									}
									pResponse.setHeader('Content-Type', 'application/javascript');
									pResponse.sendRaw(200, pData);
									return fNext();
								});
						});
				}

				this.fable.serviceManager.addServiceType('OratorStaticServer', libOratorStaticServer);
				let tmpStaticServer = this.fable.serviceManager.instantiateServiceProvider('OratorStaticServer');

				tmpStaticServer.addStaticRoute(tmpWebAppPath, 'index.html', '/*', '/');

				return fInitCallback();
			});

		// Warm up: auto-connect connections and re-enable persisted dynamic endpoints
		tmpAnticipate.anticipate(
			(fInitCallback) =>
			{
				if (!this.isEndpointGroupEnabled('ConnectionBridge'))
				{
					return fInitCallback();
				}

				this.fable.DataBeaconConnectionBridge.autoConnectSavedConnections(
					(pError) =>
					{
						if (pError)
						{
							this.fable.log.warn(`Warning during auto-connect: ${pError}`);
						}
						return fInitCallback();
					});
			});

		tmpAnticipate.anticipate(
			(fInitCallback) =>
			{
				if (!this.isEndpointGroupEnabled('DynamicEndpointManager'))
				{
					return fInitCallback();
				}

				this.fable.DataBeaconDynamicEndpointManager.warmUpEndpoints(
					(pError) =>
					{
						if (pError)
						{
							this.fable.log.warn(`Warning during endpoint warm-up: ${pError}`);
						}
						return fInitCallback();
					});
			});

		tmpAnticipate.wait(
			(pError) =>
			{
				if (pError)
				{
					this.log.error(`Error initializing Retold DataBeacon: ${pError}`);
					return fCallback(pError);
				}
				this.serviceInitialized = true;
				return fCallback();
			});
	}

	stopService(fCallback)
	{
		if (!this.serviceInitialized)
		{
			return fCallback(new Error('RetoldDataBeacon is being stopped but is not initialized...'));
		}

		this.fable.log.info(`Retold DataBeacon is stopping Orator`);

		let tmpAnticipate = this.fable.newAnticipate();

		tmpAnticipate.anticipate(this.fable.Orator.stopWebServer.bind(this.fable.Orator));

		tmpAnticipate.wait(
			(pError) =>
			{
				if (pError)
				{
					this.log.error(`Error stopping Retold DataBeacon: ${pError}`);
					return fCallback(pError);
				}
				this.serviceInitialized = false;
				return fCallback();
			});
	}
}

module.exports = RetoldDataBeacon;
module.exports.DATABEACON_SCHEMA_SQL = DATABEACON_SCHEMA_SQL;
