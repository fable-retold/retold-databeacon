# DataBeaconDynamicEndpointManager

Generates Meadow DAL objects and REST endpoints from introspected table schemas. Each enabled table gets standard CRUD routes at `/1.0/{ConnectionHash}/{TableName}`, dispatched through one catch-all route per connection prefix into a per-table route table. Uses per-connection Meadow instances to route queries to the correct external database provider.

**Module:** `source/services/DataBeacon-DynamicEndpointManager.js`
**Service Type:** `DataBeaconDynamicEndpointManager`

## connectRoutes(pOratorServiceServer)

Wires the dynamic endpoint management REST routes onto the provided Orator service server.

```javascript
fable.DataBeaconDynamicEndpointManager.connectRoutes(fable.OratorServiceServer);
```

See the [REST route table](#rest-routes) below.

## enableEndpoint(pIDBeaconConnection, pTableName, fCallback)

Creates a Meadow DAL object and `meadow-endpoints` instance for an introspected table, then connects CRUD routes. The connection must be live, and the table must have been previously introspected.

```javascript
fable.DataBeaconDynamicEndpointManager.enableEndpoint(1, 'Orders',
	(pError, pResult) =>
	{
		if (pError) return console.error(pError);
		console.log(pResult);
		// { TableName: 'Orders', EndpointBase: '/1.0/Orders', ColumnCount: 8 }
	});
```

**Parameters:**

- `pIDBeaconConnection` -- Integer ID of the BeaconConnection (must be live)
- `pTableName` -- Name of the introspected table
- `fCallback` -- Called with `(pError, pResult)`

**Behavior:**

1. Verifies the connection is live via `DataBeaconConnectionBridge.isConnected()`
2. Loads the `IntrospectedTable` record and parses the `ColumnDefinitions`
3. Reads the `BeaconConnection` record to determine the database type
4. Builds a Meadow schema from the introspected columns using `_buildMeadowSchema()`
5. Gets or creates a per-connection Meadow instance using `_getMeadowForConnection()`
6. Creates a DAL entity with `meadow.loadFromPackageObject()` and sets the provider
7. Creates `meadow-endpoints` and connects routes to the Orator service server
8. Updates the `IntrospectedTable.EndpointsEnabled` flag to `1`

If the endpoint is already enabled (same connection + table), the callback returns immediately with a message and no duplicate routes are created.

**Generated CRUD routes for each enabled table:**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/1.0/{TableName}/Schema` | Get the Meadow schema for this entity |
| GET | `/1.0/{TableName}/Count` | Get total record count |
| GET | `/1.0/{TableName}/CountBy/:ByField/:ByValue` | Count with filter |
| GET | `/1.0/{TableName}/:IDRecord` | Read a single record by ID |
| GET | `/1.0/{TableName}s/:Begin/:Cap` | Read a page of records (Begin=start index, Cap=page size) |
| GET | `/1.0/{TableName}By/:ByField/:ByValue/:Begin/:Cap` | Read with filter |
| POST | `/1.0/{TableName}` | Create a new record |
| PUT | `/1.0/{TableName}` | Update a record |
| DELETE | `/1.0/{TableName}/:IDRecord` | Delete a record by ID |

## disableEndpoint(pIDBeaconConnection, pTableName, fCallback)

Disables CRUD endpoints for a specific table. Removes the endpoint from the internal tracking map and sets `IntrospectedTable.EndpointsEnabled` to `0`.

```javascript
fable.DataBeaconDynamicEndpointManager.disableEndpoint(1, 'Orders',
	(pError, pResult) =>
	{
		console.log(pResult);
		// { TableName: 'Orders', Disabled: true }
	});
```

**Note:** Restify does not support runtime route removal, so the HTTP routes remain registered until the server restarts. However, the endpoint will not be re-enabled on the next warm-up.

## listEndpoints()

Returns an array of all currently enabled dynamic endpoints. Synchronous.

```javascript
let tmpEndpoints = fable.DataBeaconDynamicEndpointManager.listEndpoints();
// [
//   { ConnectionID: 1, TableName: 'Orders', ConnectionType: 'MySQL', EndpointBase: '/1.0/Orders' },
//   { ConnectionID: 1, TableName: 'Products', ConnectionType: 'MySQL', EndpointBase: '/1.0/Products' }
// ]
```

## warmUpEndpoints(fCallback)

Re-enables dynamic endpoints from persisted `IntrospectedTable` records on service startup. Only re-enables tables where the associated connection is currently live.

```javascript
fable.DataBeaconDynamicEndpointManager.warmUpEndpoints(
	(pError) =>
	{
		if (pError) console.warn('Warm-up warning:', pError);
	});
```

Queries `IntrospectedTable` for records with `EndpointsEnabled=1` and `Deleted=0`. For each, checks if the connection is live. If so, calls `enableEndpoint()`. If the connection is not live, the table is skipped with a log message.

Called automatically during `RetoldDataBeacon.initializeService()` if the `DynamicEndpointManager` endpoint group is enabled.

## _buildMeadowSchema(pTableName, pColumns)

Constructs a Meadow package schema object from an array of introspected column definitions.

```javascript
let tmpSchema = fable.DataBeaconDynamicEndpointManager._buildMeadowSchema('Orders', tmpColumns);
```

**Parameters:**

- `pTableName` -- Table name (becomes the `Scope` in the schema)
- `pColumns` -- Array of column objects from introspection (with `Name`, `MeadowType`, `MaxLength`, `NativeType`, `IsPrimaryKey`)

**Returns:**

```javascript
{
	Scope: 'Orders',
	DefaultIdentifier: 'IDOrder',
	Domain: 'Default',
	Schema: [
		{ Column: 'IDOrder', Type: 'AutoIdentity', Size: 'Default' },
		{ Column: 'CustomerName', Type: 'String', Size: '255' }
	],
	DefaultObject: {
		IDOrder: 0,
		CustomerName: ''
	}
}
```

The `DefaultIdentifier` is set to the first primary key column found, or the first column if no primary key exists. Columns with names starting with `GUID` are mapped to `AutoGUID` type.

Default values in `DefaultObject` are set based on Meadow type:

- `AutoIdentity` / `Numeric` -- `0`
- `Boolean` -- `false`
- `DateTime` -- `null`
- `String` and others -- `''`

## _getMeadowForConnection(pIDBeaconConnection, pType)

Gets or creates a Meadow instance for a specific connection. Ensures provider isolation between different external databases.

```javascript
let tmpMeadow = fable.DataBeaconDynamicEndpointManager._getMeadowForConnection(1, 'MySQL');
```

Returns the cached instance if one already exists for the connection ID; otherwise creates a new `Meadow` instance.

## _providerNameForType(pType)

Maps a connection type string to its Meadow provider name.

```javascript
fable.DataBeaconDynamicEndpointManager._providerNameForType('MySQL');
// 'MySQL'
```

| Connection Type | Provider Name |
|-----------------|---------------|
| `MySQL` | `MySQL` |
| `PostgreSQL` | `PostgreSQL` |
| `MSSQL` | `MSSQL` |
| `SQLite` | `SQLite` |
| Other | Passed through as-is |

## REST Routes

All routes are prefixed with the configured `RoutePrefix` (default: `/beacon`).

| Method | Path | Description |
|--------|------|-------------|
| POST | `/beacon/endpoint/:connectionId/:tableName/enable` | Enable CRUD endpoints for a table |
| POST | `/beacon/endpoint/:connectionId/:tableName/disable` | Disable CRUD endpoints for a table |
| GET | `/beacon/endpoints` | List all enabled dynamic endpoints |

### POST /beacon/endpoint/:connectionId/:tableName/enable

Enables CRUD endpoints for an introspected table.

**Response:**

```json
{
	"Success": true,
	"Endpoint": {
		"TableName": "Orders",
		"EndpointBase": "/1.0/Orders",
		"ColumnCount": 8
	}
}
```

### POST /beacon/endpoint/:connectionId/:tableName/disable

Disables CRUD endpoints for a table.

**Response:**

```json
{
	"Success": true,
	"Result": {
		"TableName": "Orders",
		"Disabled": true
	}
}
```

### GET /beacon/endpoints

Lists all enabled dynamic endpoints.

**Response:**

```json
{
	"Count": 2,
	"Endpoints": [
		{
			"ConnectionID": 1,
			"TableName": "Orders",
			"ConnectionType": "MySQL",
			"EndpointBase": "/1.0/Orders"
		},
		{
			"ConnectionID": 1,
			"TableName": "Products",
			"ConnectionType": "MySQL",
			"EndpointBase": "/1.0/Products"
		}
	]
}
```
