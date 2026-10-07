# Retold DataBeacon Implementation Reference

## Project Structure

<!-- bespoke diagram: edit diagrams/project-structure.mmd or .hints.json, then: npx pict-renderer-graph build modules/apps/retold-databeacon/docs -->
![Project Structure](diagrams/project-structure.svg)

## Core Service Lifecycle

The `initializeService()` method in `Retold-DataBeacon.js` runs a sequential pipeline using Fable's `Anticipate` pattern (waterfall of async steps):

### 1. Start Orator Web Server

When `AutoStartOrator` is true (the default), starts the Restify-based HTTP server on the configured port.

### 2. Configure Middleware

Enables JSON body parsing and query string parsing on the Restify server instance:

```javascript
this.fable.OratorServiceServer.server.use(this.fable.OratorServiceServer.bodyParser());
this.fable.OratorServiceServer.server.use(require('restify').plugins.queryParser());
```

### 3. Auto-Create Schema

When `AutoCreateSchema` is true (set by the CLI `serve` command), executes the embedded `DATABEACON_SCHEMA_SQL` string against the internal SQLite database. All statements use `CREATE TABLE IF NOT EXISTS`, making this safe to run on every startup.

### 4. Load Internal Meadow Model

Reads `MeadowModel-DataBeacon.json` from disk and creates Meadow DAL objects and meadow-endpoints for the three internal entities (`User`, `BeaconConnection`, `IntrospectedTable`). These endpoints are mounted at `/1.0/BeaconConnection`, `/1.0/IntrospectedTable`, etc.

### 5. Wire Service Routes

Calls `connectRoutes()` on each sub-service (ConnectionBridge, SchemaIntrospector, DynamicEndpointManager, BeaconProvider), registering their REST endpoints with the Orator server. Each service is gated by its entry in the `Endpoints` configuration object.

### 6. Serve Static Web UI

Resolves the web app folder path and registers a static file server via `orator-static-server`. Also registers a dedicated route for `/pict.min.js` that serves the file from the pict package's `dist/` folder.

### 7. Warm Up

Two warm-up steps restore state from the previous run:

- **Auto-connect**: ConnectionBridge queries all `BeaconConnection` records with `AutoConnect=1` and establishes live runtime connections.
- **Endpoint warm-up**: DynamicEndpointManager queries all `IntrospectedTable` records with `EndpointsEnabled=1` and re-creates their dynamic CRUD endpoints (only for connections that are live after auto-connect).

## Connection Management

### Persistence Layer

Connection configs are stored as `BeaconConnection` records in the internal SQLite database. The `Config` column holds a JSON string with driver-specific settings:

```javascript
// MySQL example
{
	"host": "db.example.com",
	"port": 3306,
	"user": "readonly",
	"password": "secret",
	"database": "production"
}
```

Passwords are masked before sending to clients. When a client sends an update with `password: "***"`, the `_mergeConfig` method preserves the stored password. This applies to `password`, `Password`, and `pass` field names.

### Runtime Connections

Each persisted connection can be activated into a live runtime connection via `MeadowConnectionManager`. The connection name follows the pattern `beacon-ext-{IDBeaconConnection}`.

The flow:
1. Client calls `POST /beacon/connection/:id/connect`
2. ConnectionBridge reads the `BeaconConnection` record from SQLite
3. Parses the `Config` JSON and merges with `{ Type: record.Type }`
4. Calls `MeadowConnectionManager.connect(name, fullConfig, callback)`
5. On success, the connection pool is available to SchemaIntrospector and DynamicEndpointManager

Disconnect tears down the pool via `MeadowConnectionManager.disconnect(name, callback)`.

### Available Types

The `GET /beacon/connection/available-types` endpoint queries `MeadowConnectionManager.getAvailableProviders()` to list which database connectors are installed. The package.json includes MySQL, PostgreSQL, MSSQL, and SQLite as regular dependencies, with MongoDB, RocksDB, and Solr as optional.

## Schema Introspection Pipeline

### Dialect Introspectors

Each dialect returns an object with `listTables(provider, callback)` and `describeTable(provider, tableName, callback)` methods.

**MySQL** queries `information_schema.TABLES` (filtered to `TABLE_SCHEMA = DATABASE()`) for table listing, and `information_schema.COLUMNS` for column details. Row count estimates come from `TABLE_ROWS`.

**PostgreSQL** queries `information_schema.tables` (filtered to `table_schema = 'public'`) for tables, and joins `information_schema.columns` with `table_constraints`/`key_column_usage` for primary key detection. Auto-increment is detected by checking for `nextval` in `column_default`.

**MSSQL** queries `INFORMATION_SCHEMA.TABLES` for table listing, and uses `INFORMATION_SCHEMA.COLUMNS` joined with key constraints. Auto-increment is detected via `COLUMNPROPERTY(..., 'IsIdentity')`.

**SQLite** queries `sqlite_master` for table names (excluding `sqlite_%` internal tables), and uses `PRAGMA table_info` for column details. Auto-increment is inferred when a column is both the primary key and has an `INTEGER` type.

### Type Mapping Table

The `_mapNativeTypeToMeadow` method converts native database types to Meadow types:

| Native Type(s)                                                      | Meadow Type    |
|---------------------------------------------------------------------|----------------|
| Primary key + auto-increment                                        | AutoIdentity   |
| INT, TINYINT, SMALLINT, MEDIUMINT, BIGINT                          | Numeric        |
| DECIMAL, NUMERIC, FLOAT, DOUBLE, REAL, MONEY, SMALLMONEY           | Numeric        |
| BOOLEAN, BOOL, BIT                                                  | Boolean        |
| DATE, TIME, DATETIME, TIMESTAMP, YEAR                               | DateTime       |
| CHAR, VARCHAR, TEXT, NCHAR, NTEXT, CLOB, XML, JSON, UUID, ENUM, SET | String        |
| BLOB, BINARY, VARBINARY, BYTEA, IMAGE                              | String         |
| (anything else)                                                     | String         |

The `_mapSizeToMeadow` method determines schema sizes:

| Meadow Type   | Size Logic                                                  |
|---------------|-------------------------------------------------------------|
| AutoIdentity  | `"Default"`                                                 |
| Numeric       | `"decimal"` for float/double/decimal types, `"int"` otherwise |
| Boolean       | `"Default"`                                                 |
| DateTime      | `"Default"`                                                 |
| String        | `CHARACTER_MAXIMUM_LENGTH` if available, otherwise `"Default"` |

### Persistence

After introspecting all tables, results are upserted into the `IntrospectedTable` entity. The upsert logic queries by `IDBeaconConnection` + `TableName` to find existing records. Existing records get their `ColumnDefinitions` and `LastIntrospectedDate` updated; new records are created with `EndpointsEnabled=0`.

### Read-Only Query Execution

SchemaIntrospector includes a `executeQuery` method that runs arbitrary SQL against external databases, with a safety check that only permits statements starting with `SELECT`. The query is dispatched to the correct driver based on the connection's `Type`.

## Dynamic Endpoint Generation

### Building Meadow Schemas

When an endpoint is enabled for an introspected table, `DynamicEndpointManager._buildMeadowSchema` converts the column definitions into a Meadow-compatible schema object:

```javascript
// Input: introspected columns
[
	{ Name: "IDProduct", MeadowType: "AutoIdentity", MaxLength: null, IsPrimaryKey: true },
	{ Name: "GUIDProduct", MeadowType: "String", MaxLength: 36, IsPrimaryKey: false },
	{ Name: "Name", MeadowType: "String", MaxLength: 200, IsPrimaryKey: false },
	{ Name: "Price", MeadowType: "Numeric", MaxLength: null, NativeType: "DECIMAL" }
]

// Output: Meadow schema
{
	Scope: "Product",
	DefaultIdentifier: "IDProduct",
	Domain: "Default",
	Schema: [
		{ Column: "IDProduct", Type: "AutoIdentity", Size: "Default" },
		{ Column: "GUIDProduct", Type: "AutoGUID", Size: "36" },
		{ Column: "Name", Type: "String", Size: "200" },
		{ Column: "Price", Type: "Numeric", Size: "decimal" }
	],
	DefaultObject: {
		IDProduct: 0,
		GUIDProduct: "",
		Name: "",
		Price: 0
	}
}
```

Columns with names starting with `GUID` are automatically mapped to the `AutoGUID` schema type.

### Provider Isolation

Each external database connection gets its own Meadow instance (`_ConnectionMeadows` map keyed by connection ID). This prevents DAL queries for one connection from being routed to a different database's provider. The connection's driver instance is stored on the Fable object under a dynamic key (`DynamicProvider_{connectionId}-{tableName}`).

### Route Mounting

Once the Meadow DAL and endpoints are created, `meadow-endpoints.connectRoutes()` registers the standard Meadow CRUD routes:

| HTTP Method | Route Pattern                    | Operation |
|-------------|----------------------------------|-----------|
| GET         | `/1.0/{Table}s/0/{Cap}`          | Reads     |
| GET         | `/1.0/{Table}/{ID}`              | Read      |
| POST        | `/1.0/{Table}`                   | Create    |
| PUT         | `/1.0/{Table}`                   | Update    |
| DELETE      | `/1.0/{Table}/{ID}`              | Delete    |
| GET         | `/1.0/{Table}s/Count/0`          | Count     |
| GET         | `/1.0/{Table}/Schema`            | Schema    |

### Warm-Up on Restart

`warmUpEndpoints` queries `IntrospectedTable` for records with `EndpointsEnabled=1`, then calls `enableEndpoint` for each one whose parent connection is currently live. This restores the full set of dynamic endpoints after a container restart without requiring manual re-enablement. It yields to the event loop between tables, skips rewriting a flag that is already set, and leaves each table's routes uncompiled until its first request (see the route-table note in `architecture.md`); `node test/perf-warmup.js --tables 5000` measures startup and HTTP responsiveness at that scale.

## Beacon Capability Reference

### DataBeaconAccess

Read-only operations for querying connected databases remotely.

**ListConnections**
- Description: List all configured database connections
- SettingsSchema: (none)
- Returns: `{ Connections: [...] }` (configs stripped)

**ListTables**
- Description: List introspected tables for a connection
- SettingsSchema:
  - `IDBeaconConnection` (Number, required)
- Returns: `{ Tables: [{ TableName, EndpointsEnabled, RowCountEstimate }] }`

**ReadRecords**
- Description: Read records from an enabled dynamic endpoint table
- SettingsSchema:
  - `IDBeaconConnection` (Number, required)
  - `TableName` (String, required)
  - `Cap` (Number, optional, default 100)
  - `Begin` (Number, optional)
- Returns: `{ Records: [...], Count: N }`

**QueryTable**
- Description: Execute a read-only SQL query against a connected database
- SettingsSchema:
  - `IDBeaconConnection` (Number, required)
  - `SQL` (String, required) -- must start with `SELECT`
- Returns: `{ Rows: [...], RowCount: N }`

### DataBeaconManagement

Write and administrative operations.

**Introspect**
- Description: Introspect all tables for a connected database
- SettingsSchema:
  - `IDBeaconConnection` (Number, required)
- Returns: `{ TableCount: N, Tables: [{ TableName, ColumnCount }] }`

**EnableEndpoint**
- Description: Enable CRUD REST endpoints for an introspected table
- SettingsSchema:
  - `IDBeaconConnection` (Number, required)
  - `TableName` (String, required)
- Returns: `{ TableName, EndpointBase, ColumnCount }`

**DisableEndpoint**
- Description: Disable CRUD REST endpoints for an introspected table
- SettingsSchema:
  - `IDBeaconConnection` (Number, required)
  - `TableName` (String, required)
- Returns: `{ TableName, Disabled: true }`

## Web UI Architecture

The web UI is a Pict single-page application bundled with Quackage (browserify).

### Build Pipeline

The `.quackage.json` config specifies:
- **Input**: `source/services/web-app/pict-app/Pict-DataBeacon-Bundle.js`
- **Output**: `source/services/web-app/web/retold-databeacon.js`

Running `npx quack build` processes the bundle entry point through browserify and writes the output to the static web folder.

### Application Class

`Pict-Application-DataBeacon.js` extends `pict-application` and manages:

- **AppData state**: `Connections`, `AvailableTypes`, `Tables`, `Endpoints`, `Records`, `BeaconStatus`, `CurrentView`
- **View registration**: Layout, Dashboard, Connections, Introspection, Endpoints, Records
- **Provider registration**: DataBeaconProvider (API client)
- **Navigation**: `navigateTo(viewName)` toggles visibility of view panels and updates nav active state

### Views

| View            | Container ID                       | Purpose                                    |
|-----------------|------------------------------------|--------------------------------------------|
| Layout          | `#DataBeacon-App`                  | Shell with sidebar nav and content panels  |
| Dashboard       | `#DataBeacon-View-Dashboard`       | Status overview, connection/endpoint counts |
| Connections     | `#DataBeacon-View-Connections`     | Connection CRUD forms                      |
| Introspection   | `#DataBeacon-View-Introspection`   | Table/column browser for a connection      |
| Endpoints       | `#DataBeacon-View-Endpoints`       | Enable/disable dynamic endpoints           |
| Records         | `#DataBeacon-View-Records`         | Browse records from enabled endpoints      |

### Provider

`Pict-Provider-DataBeacon.js` wraps all REST API calls using the browser `fetch` API. Each method follows the pattern:

1. Call `_apiCall(method, path, body, callback)`
2. On success, update `pict.AppData` with the response
3. Re-render affected views

The provider is registered as a singleton and is accessible at `pict.providers.DataBeaconProvider`.

### HTML Shell

`index.html` loads `pict.min.js` (served by a dedicated route on the server) and `retold-databeacon.js` (the browserified bundle). It boots the Pict application instance and calls `_Pict.initialize()`.

## Docker Deployment Details

### Multi-Stage Build

**Stage 1 (builder)**:
- Base: `node:20-slim`
- Copies `package*.json`, runs `npm ci` (all dependencies including dev)
- Copies source, model, bin, and `.quackage.json`
- Runs `npx quack build` to produce the browser bundle
- Copies `pict.min.js` into the web folder

**Stage 2 (runtime)**:
- Base: `node:20-slim`
- Copies `package*.json`, runs `npm ci --omit=dev` (production only)
- Copies built artifacts from the builder stage
- Creates `/app/data` directory for SQLite persistence
- Exposes port 8389
- Declares `/app/data` as a volume

### Volume Mount

The SQLite database lives at `/app/data/databeacon.sqlite`. Mount a host directory or Docker volume to `/app/data` to persist data across container restarts:

```bash
docker run -p 8389:8389 -v /path/to/data:/app/data retold-databeacon
```

### Environment Variables

| Variable | Purpose                          | Default |
|----------|----------------------------------|---------|
| `PORT`   | Override the API server port     | 8389    |

### Health Check

The Dockerfile includes a health check that hits `GET /beacon/ultravisor/status` every 30 seconds. The endpoint always returns 200, confirming the service is responsive.

### CLI Options

```
retold-databeacon [command] [options]

Commands:
	serve                Start the API server with web UI (default)
	init                 Initialize/create the database schema

Options:
	--config, -c <path>  Path to a JSON config file
	--port, -p <port>    Override the API server port
	--db, -d <path>      Path to SQLite database file
	--log, -l [path]     Write log output to a file
	--help, -h           Show this help
```

## Extending DataBeacon

### Adding Custom Routes

Register additional routes after the service initializes by accessing the Orator server instance:

```javascript
let tmpDataBeacon = fable.serviceManager.instantiateServiceProvider('RetoldDataBeacon', { ... });

tmpDataBeacon.initializeService(
	(pError) =>
	{
		// Add a custom route
		fable.OratorServiceServer.doGet('/custom/status',
			(pRequest, pResponse, fNext) =>
			{
				pResponse.send({ Custom: true, Timestamp: Date.now() });
				return fNext();
			});
	});
```

### Registering Additional Beacon Capabilities

After the beacon connects to an Ultravisor coordinator, register new capabilities on the beacon service:

```javascript
let tmpBeaconProvider = fable.DataBeaconBeaconProvider;

// Connect first
tmpBeaconProvider.connectBeacon({ ServerURL: 'ws://coordinator:8080' },
	(pError) =>
	{
		// Register a custom capability
		tmpBeaconProvider._BeaconService.registerCapability(
			{
				Capability: 'CustomDataTransform',
				Name: 'CustomTransformProvider',
				actions:
				{
					'Transform':
					{
						Description: 'Apply a custom transformation to query results',
						SettingsSchema:
						[
							{ Name: 'IDBeaconConnection', DataType: 'Number', Required: true },
							{ Name: 'SQL', DataType: 'String', Required: true },
							{ Name: 'TransformType', DataType: 'String', Required: true }
						],
						Handler: function (pWorkItem, pContext, fHandlerCallback)
						{
							let tmpSettings = pWorkItem.Settings || {};
							// Custom logic here
							return fHandlerCallback(null, { Transformed: true });
						}
					}
				}
			});
	});
```

### Adding a New Dialect Introspector

To support a new database type (e.g., MongoDB), add a method to `DataBeacon-SchemaIntrospector.js`:

1. Add a case to the `_getIntrospector` switch statement:

```javascript
case 'MongoDB':
	return this._mongodbIntrospector();
```

2. Implement the introspector with `listTables` and `describeTable` methods:

```javascript
_mongodbIntrospector()
{
	return {
		listTables: (pProvider, fCallback) =>
		{
			// pProvider is the connection instance from MeadowConnectionManager
			// List collections and return as { TableName, RowCountEstimate }
			let tmpDB = pProvider.db;
			tmpDB.listCollections().toArray(
				(pError, pCollections) =>
				{
					if (pError) return fCallback(pError);
					let tmpTables = pCollections.map(
						(pC) => ({ TableName: pC.name, RowCountEstimate: 0 }));
					return fCallback(null, tmpTables);
				});
		},
		describeTable: (pProvider, pTableName, fCallback) =>
		{
			// Sample documents to infer schema
			// Return columns as { Name, NativeType, MaxLength, Nullable,
			//                      IsPrimaryKey, IsAutoIncrement, DefaultValue, MeadowType }
			// ...
			return fCallback(null, tmpColumns);
		}
	};
}
```

3. Add type mappings if the new dialect has types not covered by `_mapNativeTypeToMeadow`.

4. If the dialect needs a query executor, add a case to `_runQuery` for executing SELECT queries.

5. Ensure the corresponding `meadow-connection-*` package is listed in `package.json` (as a dependency or optionalDependency) so that `MeadowConnectionManager` can load the driver.
