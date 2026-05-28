#!/usr/bin/env node
/**
 * Retold DataBeacon — CLI Entry Point
 *
 * A deployable data beacon for connecting to remote databases,
 * introspecting schemas, generating REST endpoints, and exposing
 * beacon capabilities to the Ultravisor mesh.
 *
 * Subcommands:
 *   serve               Start the API server with web UI (default)
 *   init                Initialize the database schema
 *
 * Configuration precedence (highest first):
 *   1. CLI flags          (e.g. `--port 9000`)
 *   2. DATABEACON_* env vars
 *   3. JSON config file   (--config <path>)
 *   4. Built-in defaults
 *
 * Standard `_FILE` suffix convention is honored on every secret-bearing
 * env var (e.g. DATABEACON_BEACON_PASSWORD_FILE=/run/secrets/foo) so
 * passwords can be sourced from Docker / k8s secret mounts instead of
 * being baked into env-var strings visible to `docker inspect`.
 *
 * @author Steven Velozo <steven@velozo.com>
 */
const libFable = require('pict');
const libMeadowConnectionManager = require('meadow-connection-manager');
const libRetoldDataBeacon = require('../source/Retold-DataBeacon.js');

const libFs = require('fs');
const libPath = require('path');

// ================================================================
// Env var resolution helper
// ================================================================

// Returns the value of an env var, with `_FILE` fallback for secrets:
// if `<NAME>` is set, return it; otherwise if `<NAME>_FILE` points to a
// readable file, return its trimmed contents. This is the same pattern
// the official mysql / postgres images use so `docker secret`,
// `k8s Secret`, and similar all work without bespoke wiring.
function _envOrFile(pVarName)
{
	let tmpValue = process.env[pVarName];
	if (tmpValue !== undefined && tmpValue !== '')
	{
		return tmpValue;
	}
	let tmpFilePath = process.env[pVarName + '_FILE'];
	if (tmpFilePath)
	{
		try
		{
			return libFs.readFileSync(tmpFilePath, 'utf8').replace(/\s+$/, '');
		}
		catch (pErr)
		{
			console.warn(`Retold DataBeacon: ${pVarName}_FILE set to ${tmpFilePath} but file is unreadable: ${pErr.message}`);
		}
	}
	return undefined;
}

// ================================================================
// CLI Argument Parsing
// ================================================================

let _CLIConfig = null;
let _CLILogPath = null;
let _CLIPort = null;
let _CLIDBPath = null;
let _CLICommand = 'serve';
let _CLIMode = 'server';  // 'server' (default, agent-on-customer) | 'client' (engineer laptop)
// Ultravisor auto-connect overrides. CLI flag > env var > config file > default.
// All four are optional; if --ultravisor / DATABEACON_ULTRAVISOR_URL is unset
// the beacon runs as a local REST service with no UV connection.
let _CLIUltravisorURL = '';
let _CLIBeaconName    = '';
let _CLIBeaconUser    = '';
let _CLIBeaconPassword = '';
let _CLIMaxConcurrent = null;

// Env-var defaults (CLI flags, parsed below, will override these).
// Reading these first means a config-file env var also seeds _CLIConfig
// before CLI parsing, so the CLI's existing precedence still wins.
let tmpEnvConfigPath = _envOrFile('DATABEACON_CONFIG_FILE');
if (tmpEnvConfigPath)
{
	try
	{
		let tmpResolved = libPath.resolve(tmpEnvConfigPath);
		_CLIConfig = JSON.parse(libFs.readFileSync(tmpResolved, 'utf8'));
		console.log(`Retold DataBeacon: Loaded config from ${tmpResolved} (DATABEACON_CONFIG_FILE)`);
	}
	catch (pErr)
	{
		console.error(`Retold DataBeacon: DATABEACON_CONFIG_FILE=${tmpEnvConfigPath} unreadable: ${pErr.message}`);
		process.exit(1);
	}
}
let tmpEnvPort = _envOrFile('DATABEACON_PORT');
if (tmpEnvPort) { _CLIPort = parseInt(tmpEnvPort, 10); }
let tmpEnvDBPath = _envOrFile('DATABEACON_DB_PATH');
if (tmpEnvDBPath) { _CLIDBPath = libPath.resolve(tmpEnvDBPath); }
let tmpEnvLogPath = _envOrFile('DATABEACON_LOG_PATH');
if (tmpEnvLogPath) { _CLILogPath = libPath.resolve(tmpEnvLogPath); }
let tmpEnvMode = _envOrFile('DATABEACON_MODE');
if (tmpEnvMode === 'client' || tmpEnvMode === 'server') { _CLIMode = tmpEnvMode; }

// Parse arguments
let tmpArgs = process.argv.slice(2);
let tmpPositionalIndex = 0;

for (let i = 0; i < tmpArgs.length; i++)
{
	let tmpArg = tmpArgs[i];

	if (tmpArg === '--config' || tmpArg === '-c')
	{
		if (tmpArgs[i + 1])
		{
			let tmpConfigPath = libPath.resolve(tmpArgs[i + 1]);
			try
			{
				let tmpRaw = libFs.readFileSync(tmpConfigPath, 'utf8');
				_CLIConfig = JSON.parse(tmpRaw);
				console.log(`Retold DataBeacon: Loaded config from ${tmpConfigPath}`);
			}
			catch (pConfigError)
			{
				console.error(`Retold DataBeacon: Failed to load config from ${tmpConfigPath}: ${pConfigError.message}`);
				process.exit(1);
			}
			i++;
		}
	}
	else if (tmpArg === '--port' || tmpArg === '-p')
	{
		if (tmpArgs[i + 1])
		{
			_CLIPort = parseInt(tmpArgs[i + 1], 10);
			i++;
		}
	}
	else if (tmpArg === '--db' || tmpArg === '-d')
	{
		if (tmpArgs[i + 1])
		{
			_CLIDBPath = libPath.resolve(tmpArgs[i + 1]);
			i++;
		}
	}
	else if (tmpArg === '--log' || tmpArg === '-l')
	{
		if (tmpArgs[i + 1] && !tmpArgs[i + 1].startsWith('-'))
		{
			_CLILogPath = libPath.resolve(tmpArgs[i + 1]);
			i++;
		}
		else
		{
			_CLILogPath = `${process.cwd()}/DataBeacon-Run-${Date.now()}.log`;
		}
	}
	else if (tmpArg === '--help' || tmpArg === '-h')
	{
		printHelp();
		process.exit(0);
	}
	else if (tmpArg === '--ultravisor' || tmpArg === '-u')
	{
		if (tmpArgs[i + 1]) { _CLIUltravisorURL = tmpArgs[i + 1]; i++; }
	}
	else if (tmpArg === '--name' || tmpArg === '-n')
	{
		if (tmpArgs[i + 1]) { _CLIBeaconName = tmpArgs[i + 1]; i++; }
	}
	else if (tmpArg === '--user' || tmpArg === '-U')
	{
		// HTTP-auth username for the dispatcher's /1.0/Authenticate POST.
		// Beacon name (--name) is the mesh handle UV uses for AffinityKey
		// routing; --user has to match a registered account on the auth-
		// beacon. Defaults to --name when omitted.
		if (tmpArgs[i + 1]) { _CLIBeaconUser = tmpArgs[i + 1]; i++; }
	}
	else if (tmpArg === '--password' || tmpArg === '-w')
	{
		if (tmpArgs[i + 1]) { _CLIBeaconPassword = tmpArgs[i + 1]; i++; }
	}
	else if (tmpArg === '--max-concurrent')
	{
		if (tmpArgs[i + 1]) { _CLIMaxConcurrent = parseInt(tmpArgs[i + 1], 10); i++; }
	}
	else if (tmpArg === '--client')
	{
		_CLIMode = 'client';
	}
	else if (tmpArg === '--mode')
	{
		if (tmpArgs[i + 1])
		{
			let tmpModeValue = tmpArgs[i + 1].toLowerCase();
			if (tmpModeValue === 'client' || tmpModeValue === 'server')
			{
				_CLIMode = tmpModeValue;
			}
			else
			{
				console.error(`Retold DataBeacon: unknown --mode [${tmpArgs[i + 1]}] (expected: server | client)`);
				process.exit(1);
			}
			i++;
		}
	}
	else if (tmpArg.startsWith('--mode='))
	{
		let tmpModeValue = tmpArg.substring('--mode='.length).toLowerCase();
		if (tmpModeValue === 'client' || tmpModeValue === 'server')
		{
			_CLIMode = tmpModeValue;
		}
		else
		{
			console.error(`Retold DataBeacon: unknown --mode [${tmpModeValue}] (expected: server | client)`);
			process.exit(1);
		}
	}
	else if (!tmpArg.startsWith('-'))
	{
		if (tmpPositionalIndex === 0)
		{
			_CLICommand = tmpArg;
		}
		tmpPositionalIndex++;
	}
}

function printHelp()
{
	console.log(`
Retold DataBeacon — Remote Database Beacon Service

Usage:
  retold-databeacon [command] [options]

Commands:
  serve                Start the API server with web UI (default)
  init                 Initialize/create the database schema

Options:
  --config, -c <path>     Path to a JSON config file
  --port, -p <port>       Override the API server port (default: 8389)
  --db, -d <path>         Path to SQLite database file (default: ./data/databeacon.sqlite)
  --log, -l [path]        Write log output to a file
  --mode <server|client>  Invocation mode (default: server)
  --client                Shorthand for --mode client
  --ultravisor, -u <url>  Auto-connect to this Ultravisor on startup
  --name, -n <name>       Beacon name on the Ultravisor (mesh handle; default: retold-databeacon)
  --user, -U <user>       HTTP auth username on the Ultravisor. Defaults to
                          --name. Set this when the beacon's mesh name differs
                          from the registered USER account on the auth-beacon
                          (e.g. on shared UVs where beacon names are arbitrary
                          handles like "private_data_lake_beacon" but the auth-
                          beacon's users are operator emails / service-account IDs).
  --password, -w <pw>     Beacon auth password for the Ultravisor connection
  --max-concurrent <n>    Max concurrent beacon work items (default: 3)
  --help, -h              Show this help

Modes:
  server               Default. Local data introspection + optional Ultravisor
                       beacon registration (runs on customer infrastructure).
  client               Engineer-laptop mode. Uses a user-scoped default DB
                       path (~/.retold/databeacon-client.sqlite) so client
                       state doesn't collide with project-local files. The
                       web UI still opens on the same port; connect to a
                       remote customer by adding a BeaconConnection row
                       with Type = RetoldDataBeacon.

Environment variables (CLI flags take precedence):
  DATABEACON_PORT              Same as --port
  DATABEACON_DB_PATH           Same as --db
  DATABEACON_LOG_PATH          Same as --log
  DATABEACON_MODE              Same as --mode (server | client)
  DATABEACON_CONFIG_FILE       Same as --config

  DATABEACON_ULTRAVISOR_URL    If set, auto-connect to this Ultravisor on startup
  DATABEACON_BEACON_NAME       Mesh name to register with (default: retold-databeacon)
  DATABEACON_BEACON_USER       HTTP auth username (default: BEACON_NAME). Override
                               on shared UVs where the auth-beacon user account
                               differs from the beacon's mesh handle.
  DATABEACON_BEACON_PASSWORD   Auth password for the beacon connection
  DATABEACON_MAX_CONCURRENT    Max concurrent work items (default: 3)

  Any secret-bearing var also accepts a *_FILE suffix that points to a
  file whose contents become the value. Example:
    DATABEACON_BEACON_PASSWORD_FILE=/run/secrets/databeacon
  This is the same convention mysql / postgres images use, so docker
  secret + k8s Secret mounts work without bespoke wiring.

Examples:
  retold-databeacon                              Start server on default port
  retold-databeacon serve --port 9000            Start server on port 9000
  retold-databeacon --client                     Engineer-mode (remote SQL client)
  retold-databeacon init                         Create database tables
  retold-databeacon serve --db /mnt/data/db.sqlite  Use external volume for DB

  DATABEACON_ULTRAVISOR_URL=http://uv:54321 \\
  DATABEACON_BEACON_PASSWORD_FILE=/run/secrets/uv-pass \\
    retold-databeacon                            Container-style boot with auto-connect
`);
}

// ================================================================
// Configuration
// ================================================================

// Default SQLite path depends on mode:
//   server  — ./data/databeacon.sqlite (project-local, matches Docker volume layouts)
//   client  — ~/.retold/databeacon-client.sqlite (user-scoped; engineer's mesh
//             connections shouldn't collide with any project-local sqlite file)
let _DefaultDBPath;
if (_CLIMode === 'client')
{
	let tmpHome = process.env.HOME || process.env.USERPROFILE || process.cwd();
	_DefaultDBPath = libPath.join(tmpHome, '.retold', 'databeacon-client.sqlite');
}
else
{
	_DefaultDBPath = libPath.join(process.cwd(), 'data', 'databeacon.sqlite');
}

let _Settings = (
	{
		Product: (_CLIMode === 'client') ? 'RetoldDataBeacon-Client' : 'RetoldDataBeacon',
		ProductVersion: '0.0.1',
		APIServerPort: _CLIPort || parseInt(process.env.PORT, 10) || 8389,
		LogStreams:
			[
				{
					streamtype: 'console'
				}
			],

		SQLite:
			{
				SQLiteFilePath: _CLIDBPath || _DefaultDBPath
			}
	});

// Merge CLI config if provided
if (_CLIConfig)
{
	Object.assign(_Settings, _CLIConfig);
}

if (_CLILogPath)
{
	_Settings.LogStreams.push(
		{
			loggertype: 'simpleflatfile',
			outputloglinestoconsole: false,
			showtimestamps: true,
			formattedtimestamps: true,
			level: 'trace',
			path: _CLILogPath
		});
}

// For non-serve commands, use quieter logging
if (_CLICommand !== 'serve')
{
	_Settings.LogStreams = [{ streamtype: 'console', level: 'warn' }];
}

// Ensure the data directory exists
let _DataDir = libPath.dirname(_Settings.SQLite.SQLiteFilePath);
if (_DataDir !== ':memory:' && !libFs.existsSync(_DataDir))
{
	libFs.mkdirSync(_DataDir, { recursive: true });
}

// ================================================================
// Bootstrap
// ================================================================

let _Fable = new libFable(_Settings);

_Fable.serviceManager.addServiceType('MeadowConnectionManager', libMeadowConnectionManager);
_Fable.serviceManager.instantiateServiceProvider('MeadowConnectionManager');

_Fable.MeadowConnectionManager.connect('databeacon',
	{
		Type: 'SQLite',
		SQLiteFilePath: _Settings.SQLite.SQLiteFilePath
	},
	(pError, pConnection) =>
	{
		if (pError)
		{
			console.error(`SQLite connection error: ${pError}`);
			process.exit(1);
		}

		// Bridge: Meadow DAL providers look up fable.MeadowSQLiteProvider
		_Fable.MeadowSQLiteProvider = pConnection.instance;
		_Fable.settings.MeadowProvider = 'SQLite';

		switch (_CLICommand)
		{
			case 'serve':
				commandServe();
				break;
			case 'init':
				commandInit();
				break;
			default:
				console.error(`Unknown command: ${_CLICommand}`);
				printHelp();
				process.exit(1);
		}
	});

// ================================================================
// Command: serve
// ================================================================
function commandServe()
{
	_Fable.serviceManager.addServiceType('RetoldDataBeacon', libRetoldDataBeacon);
	let tmpDataBeaconService = _Fable.serviceManager.instantiateServiceProvider('RetoldDataBeacon',
		{
			AutoCreateSchema: true,

			FullMeadowSchemaPath: libPath.join(__dirname, '..', 'model') + '/',
			FullMeadowSchemaFilename: 'MeadowModel-DataBeacon.json',

			Endpoints:
				{
					MeadowEndpoints: true,
					ConnectionBridge: true,
					SchemaIntrospector: true,
					DynamicEndpointManager: true,
					BeaconProvider: true,
					WebUI: true
				}
		});

	tmpDataBeaconService.initializeService(
		(pInitError) =>
		{
			if (pInitError)
			{
				_Fable.log.error(`Initialization error: ${pInitError}`);
				process.exit(1);
			}
			let tmpModeLabel = (_CLIMode === 'client') ? 'CLIENT MODE (remote-SQL explorer)' : 'SERVER MODE';
			_Fable.log.info(`Retold DataBeacon [${tmpModeLabel}] running on port ${_Settings.APIServerPort}`);
			_Fable.log.info(`API:     http://localhost:${_Settings.APIServerPort}/1.0/`);
			_Fable.log.info(`Beacon:  http://localhost:${_Settings.APIServerPort}/beacon/`);
			_Fable.log.info(`Web UI:  http://localhost:${_Settings.APIServerPort}/`);
			if (_CLIMode === 'client')
			{
				_Fable.log.info(`Client-mode DB: ${_Settings.SQLite.SQLiteFilePath}`);
				_Fable.log.info('Add a connection with Type="RetoldDataBeacon" to talk to a remote databeacon via Ultravisor.');
			}

			// Optional auto-connect to an Ultravisor coordinator. Only
			// runs when DATABEACON_ULTRAVISOR_URL is set; standalone
			// users with no Ultravisor in the loop see no behavior
			// change. Failures are logged but don't kill the process —
			// the beacon is still useful as a local REST surface.
			// Resolution precedence per field: CLI flag > env var > default.
			//
			// Name = the beacon's mesh handle (AffinityKey routing).
			// UserName = HTTP-auth identity for /1.0/Authenticate. On
			// shared/QA UVs the beacon's mesh name (e.g. "retold-
			// databeacon", "private_data_lake_beacon") usually isn't a
			// registered user account on the auth-beacon, so HTTP auth
			// fails with no session cookie — HTTP polling + any session-
			// gated REST then 401. Set --user / DATABEACON_BEACON_USER to
			// a real user/service-account on the auth-beacon to fix.
			// When unset, falls back to Name for backward compat with
			// promiscuous-UV / solo-beacon deployments.
			let tmpUVUrl = _CLIUltravisorURL || _envOrFile('DATABEACON_ULTRAVISOR_URL');
			if (tmpUVUrl)
			{
				let tmpBeaconName = _CLIBeaconName    || _envOrFile('DATABEACON_BEACON_NAME')     || 'retold-databeacon';
				let tmpBeaconUser = _CLIBeaconUser    || _envOrFile('DATABEACON_BEACON_USER')     || '';
				let tmpBeaconPw   = _CLIBeaconPassword || _envOrFile('DATABEACON_BEACON_PASSWORD') || '';
				let tmpMaxConc    = _CLIMaxConcurrent || parseInt(_envOrFile('DATABEACON_MAX_CONCURRENT') || '3', 10);
				let tmpBeaconConfig =
				{
					ServerURL:     tmpUVUrl,
					Name:          tmpBeaconName,
					UserName:      tmpBeaconUser,
					Password:      tmpBeaconPw,
					MaxConcurrent: tmpMaxConc
				};
				let tmpAsLabel = tmpBeaconUser && tmpBeaconUser !== tmpBeaconName
					? `"${tmpBeaconName}" (HTTP user: "${tmpBeaconUser}")`
					: `"${tmpBeaconName}"`;
				_Fable.log.info(`Auto-connecting to Ultravisor at ${tmpUVUrl} as ${tmpAsLabel}...`);
				_Fable.DataBeaconBeaconProvider.connectBeacon(tmpBeaconConfig,
					(pConnectError) =>
					{
						if (pConnectError)
						{
							_Fable.log.error(`Ultravisor auto-connect failed: ${pConnectError.message || pConnectError}`);
							return;
						}
						_Fable.log.info(`Ultravisor auto-connect succeeded — registered as ${tmpAsLabel}.`);
					});
			}
		});
}

// ================================================================
// Command: init
// ================================================================
function commandInit()
{
	console.log('Initializing DataBeacon database schema...');
	try
	{
		_Fable.MeadowSQLiteProvider.db.exec(libRetoldDataBeacon.DATABEACON_SCHEMA_SQL);
		console.log('Schema created successfully.');
		console.log(`Database: ${_Settings.SQLite.SQLiteFilePath}`);
	}
	catch (pError)
	{
		console.error(`Error creating schema: ${pError.message}`);
		process.exit(1);
	}
	process.exit(0);
}
