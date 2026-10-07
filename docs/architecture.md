# Retold DataBeacon Architecture

## System Overview

Retold DataBeacon is a deployable service that bridges remote databases and the Retold/Ultravisor ecosystem. It connects to external database servers, introspects their schemas, and dynamically generates RESTful CRUD endpoints for discovered tables. When paired with an Ultravisor coordinator, DataBeacon exposes its data access and management operations as beacon capabilities, allowing other nodes in the mesh to query and manage remote databases without direct network access.

DataBeacon uses an internal SQLite database for its own persistence (connection configs, introspected metadata), keeping the service self-contained and portable. The external databases it connects to are separate systems -- DataBeacon acts as a gateway, not a data store.

## Component Architecture

<!-- bespoke diagram: edit diagrams/component-architecture.mmd or .hints.json, then: npx pict-renderer-graph build modules/apps/retold-databeacon/docs -->
![Component Architecture](diagrams/component-architecture.svg)

## Service Architecture

### ConnectionBridge

ConnectionBridge manages the full lifecycle of external database connections. It has two distinct responsibilities:

**Persistence.** Connection configurations (host, port, credentials, database type) are stored as `BeaconConnection` records in the internal SQLite database via the Meadow DAL. Passwords are masked in API responses and merged carefully on updates so that clients sending `***` preserve the stored credential.

**Runtime connections.** When a user triggers a connect, ConnectionBridge delegates to `MeadowConnectionManager`, which handles the actual driver-level connection pooling. Each connection is registered under a unique name (`beacon-ext-{id}`) and tracked in a `_LiveConnections` map. On startup, connections with `AutoConnect=true` are automatically re-established.

Key routes:
- `GET /beacon/connections` -- list all connections (configs masked)
- `POST /beacon/connection` -- create a new connection record
- `POST /beacon/connection/:id/connect` -- establish live runtime connection
- `POST /beacon/connection/:id/disconnect` -- tear down live connection
- `POST /beacon/connection/:id/test` -- test connectivity without persisting a live connection
- `GET /beacon/connection/available-types` -- list installed database connectors

### SchemaIntrospector

SchemaIntrospector discovers tables and columns from connected external databases using dialect-specific SQL. Each dialect has a pair of operations: `listTables` and `describeTable`.

| Dialect    | Table Discovery                                                    | Column Discovery                          |
|------------|--------------------------------------------------------------------|-------------------------------------------|
| MySQL      | `information_schema.TABLES` where `TABLE_SCHEMA = DATABASE()`     | `information_schema.COLUMNS`              |
| PostgreSQL | `information_schema.tables` where `table_schema = 'public'`       | `information_schema.columns` + key joins  |
| MSSQL      | `INFORMATION_SCHEMA.TABLES` where `TABLE_TYPE = 'BASE TABLE'`     | `INFORMATION_SCHEMA.COLUMNS` + `COLUMNPROPERTY` |
| SQLite     | `sqlite_master` where `type='table'`                               | `PRAGMA table_info`                       |

After discovery, native database types are mapped to Meadow types (`AutoIdentity`, `Numeric`, `Boolean`, `DateTime`, `String`). Results are persisted to the `IntrospectedTable` entity in internal SQLite as JSON column definitions, enabling endpoint generation without re-introspecting.

SchemaIntrospector also provides a read-only query executor that only permits `SELECT` statements against external databases.

Key routes:
- `POST /beacon/connection/:id/introspect` -- introspect all tables for a connection
- `GET /beacon/connection/:id/tables` -- list cached introspected tables
- `GET /beacon/connection/:id/table/:tableName` -- get column details for a table
- `POST /beacon/connection/:id/query` -- execute a read-only SELECT query

### DynamicEndpointManager

DynamicEndpointManager builds Meadow schema objects from introspected column definitions and creates live CRUD endpoints. For each enabled table:

1. Parses the stored `ColumnDefinitions` JSON from the `IntrospectedTable` record
2. Constructs a Meadow schema with appropriate types, sizes, and default values
3. Creates a per-connection Meadow instance for provider isolation (so queries route to the correct external database)
4. Instantiates a `meadow-endpoints` object and mounts it in the table's own route table

The resulting endpoints follow the standard Meadow REST pattern at `/1.0/{ConnectionHash}/{TableName}` with full CRUD operations (Create, Read, Reads, Update, Delete, Count, Schema).

Each connection prefix (`/1.0/{ConnectionHash}`) has one catch-all route per verb on the Orator server, which dispatches into a small per-table route table keyed by the first path segment (`{TableName}`, `{TableName}s` or `{TableName}Select`). The server's router checks every existing route for a duplicate on each insert, so registering every table's routes on it directly made enabling N tables cost O(N²); per-table route tables keep it O(N) and leave the server's route count constant. A table's routes compile on its first request, so memory follows the tables actually in use. When two tables claim the same segment (`Item`'s list form and a table named `Items`), the match capturing fewer parameters wins — the same static-over-parametric preference a single router applies.

On startup, `warmUpEndpoints` re-enables any tables that were previously marked `EndpointsEnabled=true` in the internal database, but only if their parent connection is live. It yields to the event loop between tables, so the server keeps answering while it warms up. `test/perf-warmup.js` measures it: 5000 enabled tables warm up in under two seconds on a developer workstation.

Key routes:
- `POST /beacon/endpoint/:connectionId/:tableName/enable` -- enable CRUD endpoints
- `POST /beacon/endpoint/:connectionId/:tableName/disable` -- disable CRUD endpoints
- `GET /beacon/endpoints` -- list all active dynamic endpoints

### BeaconProvider

BeaconProvider registers DataBeacon as a beacon in the Ultravisor mesh. It wraps the `ultravisor-beacon` library (loaded optionally) and exposes two capability groups that other mesh nodes can invoke remotely.

The beacon is not started automatically -- it is triggered via a REST call or programmatically by providing a coordinator URL. Once connected, the beacon maintains a persistent WebSocket connection to the Ultravisor coordinator and receives work items for its registered capabilities.

Key routes:
- `POST /beacon/ultravisor/connect` -- connect to an Ultravisor coordinator
- `POST /beacon/ultravisor/disconnect` -- disconnect from Ultravisor
- `GET /beacon/ultravisor/status` -- check beacon connection status

## Data Flow

<!-- bespoke diagram: edit diagrams/data-flow.mmd or .hints.json, then: npx pict-renderer-graph build modules/apps/retold-databeacon/docs -->
![Data Flow](diagrams/data-flow.svg)

## Deployment Architecture

<!-- bespoke diagram: edit diagrams/deployment-architecture.mmd or .hints.json, then: npx pict-renderer-graph build modules/apps/retold-databeacon/docs -->
![Deployment Architecture](diagrams/deployment-architecture.svg)

The Docker image uses a multi-stage build. The builder stage runs `npx quack build` to produce the browser bundle (`retold-databeacon.js`), then the runtime stage copies only production dependencies and the built artifacts. The `/app/data` volume mount persists the internal SQLite database across container restarts.

Default port: **8389**. Override with `--port` or the `PORT` environment variable.

## Internal Storage

DataBeacon maintains three SQLite tables in its internal database:

### User

A minimal audit table required by the Meadow DAL. Seeded with a single `system` user on schema creation. Meadow uses `CreatingIDUser` and `UpdatingIDUser` fields across all entities for audit trails.

### BeaconConnection

Stores external database connection configurations. Key fields:

| Column        | Purpose                                                 |
|---------------|---------------------------------------------------------|
| Name          | Human-readable label                                    |
| Type          | Database dialect (`MySQL`, `PostgreSQL`, `MSSQL`, `SQLite`) |
| Config        | JSON blob with host, port, user, password, database     |
| Status        | Last known status (`Untested`, `OK`, `Failed`, `Connected`) |
| AutoConnect   | Whether to auto-connect on service startup              |

### IntrospectedTable

Caches schema metadata discovered from external databases. Key fields:

| Column             | Purpose                                             |
|--------------------|-----------------------------------------------------|
| IDBeaconConnection | Foreign key to the parent connection                |
| TableName          | Name of the table in the external database          |
| ColumnDefinitions  | JSON array of column metadata (name, type, keys)    |
| EndpointsEnabled   | Whether CRUD endpoints are active for this table    |
| RowCountEstimate   | Approximate row count from introspection            |

These tables enable full persistence across restarts. When DataBeacon starts, it reads `BeaconConnection` records with `AutoConnect=true`, establishes those connections, then reads `IntrospectedTable` records with `EndpointsEnabled=true` and re-creates their dynamic endpoints.

## Ultravisor Integration

When connected to an Ultravisor coordinator, DataBeacon registers two capabilities:

### DataBeaconAccess (Read Operations)

| Action          | Description                                        | Settings                                           |
|-----------------|----------------------------------------------------|----------------------------------------------------|
| ListConnections | List all configured database connections            | (none)                                             |
| ListTables      | List introspected tables for a connection           | `IDBeaconConnection` (Number, required)            |
| ReadRecords     | Read records from an enabled endpoint table         | `IDBeaconConnection` (Number), `TableName` (String), `Cap` (Number), `Begin` (Number) |
| QueryTable      | Execute a read-only SELECT query                    | `IDBeaconConnection` (Number), `SQL` (String)      |

### DataBeaconManagement (Write Operations)

| Action          | Description                                        | Settings                                           |
|-----------------|----------------------------------------------------|----------------------------------------------------|
| Introspect      | Introspect all tables for a connected database      | `IDBeaconConnection` (Number, required)            |
| EnableEndpoint  | Enable CRUD REST endpoints for a table              | `IDBeaconConnection` (Number), `TableName` (String) |
| DisableEndpoint | Disable CRUD REST endpoints for a table             | `IDBeaconConnection` (Number), `TableName` (String) |

Other nodes in the Ultravisor mesh invoke these capabilities by sending work items to the coordinator, which routes them to the DataBeacon. This allows remote database access and management without direct network connectivity between the requesting node and the target databases.
