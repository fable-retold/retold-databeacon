/**
 * DataBeacon -- Schema Manager
 *
 * Adds DDL capabilities to retold-databeacon: ensure that a named set
 * of tables (and their indices) exists in a connected database.
 * Mesh-callable via the DataBeaconSchema capability registered in
 * DataBeacon-BeaconProvider.js.
 *
 * Why this exists
 * ===============
 * retold-databeacon's DataBeaconManagement capability exposes
 * Introspect / EnableEndpoint / DisableEndpoint — all read-or-expose
 * surface, no create. Bootstrapping ultravisor's persistence tables
 * (UVQueueWorkItem etc.) into a fresh database from the mesh requires
 * a DDL surface. This module provides one.
 *
 * Schema descriptor shape
 * =======================
 * Callers pass a JSON descriptor following the conventions in
 * `modules/apps/ultravisor/source/persistence/UltravisorPersistenceSchema.json`:
 *
 *   {
 *     "SchemaName": "ultravisor",
 *     "Version":    1,
 *     "Tables": [
 *       {
 *         "Scope":             "UVQueueWorkItem",
 *         "DefaultIdentifier": "IDUVQueueWorkItem",
 *         "Domain":            "Ultravisor",
 *         "Schema": [
 *           { "Column": "...", "Type": "AutoIdentity|String|Integer|Float|Boolean|CreateDate|UpdateDate|Deleted", "Size": "..." },
 *           ...
 *         ],
 *         "Indexes": [ { "Name": "...", "Columns": [...], "Unique": true } ]
 *       }
 *     ]
 *   }
 *
 * Engine generalization (Session 4)
 * =================================
 * Every meadow connector (sqlite / mysql / mssql / postgresql) exposes
 * a `schemaProvider` getter that returns its `Meadow-Schema-<engine>`
 * service. Fresh-bootstrap (CREATE TABLE / CREATE INDEX) delegates to
 * the connector's idempotent `createTables` + `createAllIndices`.
 *
 * Forward-only ADD COLUMN now flows through `meadow-migrationmanager`'s
 * SchemaIntrospector → SchemaDiff → MigrationGenerator pipeline, with a
 * forward-only filter applied to the diff before the generator runs. The
 * resulting ALTER statements are executed via the connector's underlying
 * pool / handle (better-sqlite3 .exec() for SQLite; .query() for the
 * other three engines). The four MM services live on an isolated Pict
 * context constructed in this manager's constructor; no other MM
 * services are loaded.
 *
 * @author Steven Velozo <steven@velozo.com>
 * @license MIT
 */
const libFableServiceProviderBase = require('fable-serviceproviderbase');
const libMeadowMigrationManager = require('meadow-migrationmanager');

// Map our connector type ('sqlite' / 'mysql' / 'mssql' / 'postgresql')
// to the engine label meadow-migrationmanager's MigrationGenerator
// switches on ('SQLite' / 'MySQL' / 'MSSQL' / 'PostgreSQL'). Anything
// else surfaces as a clear error in ensureSchema; we don't have ALTER
// coverage for it.
const ENGINE_TO_MM_NAME =
{
	sqlite:     'SQLite',
	mysql:      'MySQL',
	mssql:      'MSSQL',
	postgresql: 'PostgreSQL',
	postgres:   'PostgreSQL'
};

// Map our descriptor's high-level Type values onto the lower-level
// meadow connector DataType vocabulary used by `Meadow-Schema-<engine>`.
const DESCRIPTOR_TYPE_TO_MEADOW_DATATYPE =
{
	AutoIdentity:  'ID',
	AutoGUID:      'GUID',
	String:        'String',
	Text:          'Text',
	Integer:       'Numeric',
	Float:         'Decimal',
	Decimal:       'Decimal',
	Boolean:       'Boolean',
	// Deleted is meadow's auto-managed soft-delete flag. Meadow always
	// writes the integer literal `1` (or `0`) via UPDATE for portability
	// across engines — postgres / mysql / mssql / sqlite all behave the
	// same on the wire. So the column has to be a numeric type to accept
	// the integer value: postgres `boolean` rejects `1` with a 42804
	// type-mismatch error. Mapping to `Numeric` gets us SMALLINT/INT
	// across the engines we wire (sqlite / mysql / mssql / postgresql),
	// matches meadow's wire convention, and keeps `0`/`1` semantics
	// readable at the SQL level.
	Deleted:       'Numeric',
	CreateDate:    'DateTime',
	UpdateDate:    'DateTime',
	DeleteDate:    'DateTime',
	DateTime:      'DateTime',
	JSON:          'JSON',
	ForeignKey:    'ForeignKey',
	CreateIDUser:  'Numeric',
	UpdateIDUser:  'Numeric',
	DeleteIDUser:  'Numeric'
};

class DataBeaconSchemaManager extends libFableServiceProviderBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
		this.serviceType = 'DataBeaconSchemaManager';

		// Embed an isolated meadow-migrationmanager Pict context, then
		// instantiate only the four services we use:
		//   - SchemaIntrospector   reads the live database into the
		//                          DDL-level shape SchemaDiff expects
		//                          (Tables[]/Columns[]/Indices[]).
		//   - SchemaDiff           compares introspected vs descriptor.
		//   - MigrationGenerator   converts the diff to engine-specific
		//                          ALTER / CREATE statements.
		//   - SchemaDeployer       used as a convenience for new tables
		//                          (delegates to createTable +
		//                          createIndices on the schemaProvider).
		// Everything else MM ships (TUI, REST, WebUI, SchemaLibrary,
		// FlowDataBuilder, ConnectionLibrary, MeadowPackageGenerator)
		// is deliberately not instantiated; their transitive deps don't
		// load until you ask for them.
		this._MM = new libMeadowMigrationManager(
			{
				Product: 'DataBeacon-SchemaManager',
				LogStreams: (pFable.settings && pFable.settings.LogStreams) || [{ streamtype: 'console', level: 'warn' }]
			});
		this._SchemaIntrospector = this._MM.instantiateServiceProvider('SchemaIntrospector');
		this._SchemaDiff         = this._MM.instantiateServiceProvider('SchemaDiff');
		this._MigrationGenerator = this._MM.instantiateServiceProvider('MigrationGenerator');
		this._SchemaDeployer     = this._MM.instantiateServiceProvider('SchemaDeployer');
	}

	/**
	 * EnsureSchema action handler. Idempotent: every call ensures the
	 * tables in the descriptor exist on the named connection, runs
	 * forward-only ADD COLUMN migrations where the engine supports it,
	 * and creates indices if missing.
	 *
	 * @param {object} pSettings    - { IDBeaconConnection, SchemaName, SchemaJSON }
	 * @param {function} fCallback - function(pError, pResult)
	 *   pResult: { Success, Engine, SchemaName, TablesCreated, ColumnsAdded, IndicesCreated, Notes:[] }
	 */
	ensureSchema(pSettings, fCallback)
	{
		let tmpConnID = pSettings && pSettings.IDBeaconConnection;
		let tmpSchemaName = (pSettings && pSettings.SchemaName) || 'unnamed';
		let tmpSchemaJSON = pSettings && pSettings.SchemaJSON;

		if (!tmpConnID)
		{
			return fCallback(new Error('EnsureSchema: IDBeaconConnection is required.'));
		}
		if (!tmpSchemaJSON || !Array.isArray(tmpSchemaJSON.Tables))
		{
			return fCallback(new Error('EnsureSchema: SchemaJSON.Tables is required.'));
		}

		let tmpBridge = this.fable.DataBeaconConnectionBridge;
		if (!tmpBridge)
		{
			return fCallback(new Error('EnsureSchema: DataBeaconConnectionBridge service not available.'));
		}
		let tmpConn = tmpBridge.getConnection(tmpConnID);
		if (!tmpConn || tmpConn.status !== 'connected')
		{
			return fCallback(new Error(`EnsureSchema: connection [${tmpConnID}] is not live.`));
		}

		let tmpSchemaService = this._engineSchemaService(tmpConn);
		if (!tmpSchemaService)
		{
			return fCallback(new Error(
				`EnsureSchema: connector "${tmpConn.type}" does not expose a schemaProvider — ` +
				`only sqlite / mysql / mssql / postgresql connectors are wired for EnsureSchema.`));
		}

		let tmpEngine = (tmpConn.type || '').toLowerCase();
		let tmpMeadowSchema;
		try
		{
			tmpMeadowSchema = this._descriptorToMeadowSchema(tmpSchemaJSON);
		}
		catch (pTransErr)
		{
			return fCallback(pTransErr);
		}

		let tmpMMEngine = ENGINE_TO_MM_NAME[tmpEngine];
		if (!tmpMMEngine)
		{
			return fCallback(new Error(
				`EnsureSchema: engine [${tmpEngine}] is not supported by meadow-migrationmanager — ` +
				`only sqlite / mysql / mssql / postgresql are wired.`));
		}

		let tmpResult =
		{
			Success: true,
			SchemaName: tmpSchemaName,
			Engine: tmpEngine,
			TablesCreated: [],
			ColumnsAdded: [],
			IndicesCreated: [],
			MigrationStatements: [],
			SkippedDestructive: [],
			Notes: []
		};

		// 1. Introspect the live database into the same shape SchemaDiff
		//    expects on both sides. SchemaIntrospector is engine-agnostic;
		//    it delegates to the connector's introspectDatabaseSchema.
		this._SchemaIntrospector.introspectDatabase(tmpSchemaService, (pIntErr, pIntrospected) =>
		{
			if (pIntErr) { return fCallback(pIntErr); }
			let tmpIntrospected = pIntrospected || { Tables: [] };
			let tmpExistingTableNames = new Set();
			let tmpIntroTables = Array.isArray(tmpIntrospected.Tables) ? tmpIntrospected.Tables : [];
			for (let i = 0; i < tmpIntroTables.length; i++)
			{
				if (tmpIntroTables[i] && tmpIntroTables[i].TableName)
				{
					tmpExistingTableNames.add(tmpIntroTables[i].TableName);
				}
			}

			// 2. Diff introspected (source) against descriptor (target).
			//    The result's TablesAdded entries are brand-new tables;
			//    TablesModified.ColumnsAdded entries are forward-only
			//    ALTER candidates we want to keep; ColumnsRemoved /
			//    ColumnsModified / TablesRemoved are destructive and get
			//    filtered out below.
			let tmpDiff;
			try
			{
				tmpDiff = this._SchemaDiff.diffSchemas(tmpIntrospected, tmpMeadowSchema);
			}
			catch (pDiffErr)
			{
				return fCallback(pDiffErr);
			}

			// 3. Forward-only filter. Drop everything destructive from
			//    the diff before MigrationGenerator runs. We log the
			//    dropped entries on the result so an operator who really
			//    wants the change can see what they need to issue
			//    out-of-band.
			let tmpFiltered = this._forwardOnlyFilter(tmpDiff, tmpResult);

			// 4. Track what would-be-created so the result reports
			//    TablesCreated / ColumnsAdded / IndicesCreated even
			//    though we'll execute via SchemaDeployer / engine pool.
			for (let i = 0; i < tmpFiltered.TablesAdded.length; i++)
			{
				let tmpAddedTbl = tmpFiltered.TablesAdded[i];
				if (tmpAddedTbl && tmpAddedTbl.TableName)
				{
					tmpResult.TablesCreated.push(tmpAddedTbl.TableName);
				}
			}
			for (let i = 0; i < tmpFiltered.TablesModified.length; i++)
			{
				let tmpMod = tmpFiltered.TablesModified[i];
				let tmpAddedCols = Array.isArray(tmpMod.ColumnsAdded) ? tmpMod.ColumnsAdded : [];
				for (let j = 0; j < tmpAddedCols.length; j++)
				{
					tmpResult.ColumnsAdded.push(`${tmpMod.TableName}.${tmpAddedCols[j].Column}`);
				}
				let tmpAddedIdxs = Array.isArray(tmpMod.IndicesAdded) ? tmpMod.IndicesAdded : [];
				for (let j = 0; j < tmpAddedIdxs.length; j++)
				{
					tmpResult.IndicesCreated.push(tmpAddedIdxs[j].Name);
				}
			}

			// 5. For brand-new tables we deploy via the connector's
			//    schemaProvider — its createTables handles index creation
			//    too, and its DDL is hand-written per engine (handles
			//    quoting / IF NOT EXISTS quirks better than the diff
			//    generator's CREATE TABLE output).
			let fApplyAlters = () =>
			{
				let tmpStatements = this._MigrationGenerator.generateMigrationStatements(
					{ TablesAdded: [], TablesRemoved: [], TablesModified: tmpFiltered.TablesModified },
					tmpMMEngine);
				tmpResult.MigrationStatements = tmpStatements.slice();
				if (tmpStatements.length === 0)
				{
					return this._createIndicesForExistingTables(tmpSchemaService, tmpMeadowSchema, tmpExistingTableNames, tmpResult, fCallback);
				}
				this._executeStatements(tmpConn, tmpEngine, tmpStatements, (pExecErr) =>
				{
					if (pExecErr) { return fCallback(pExecErr); }
					return this._createIndicesForExistingTables(tmpSchemaService, tmpMeadowSchema, tmpExistingTableNames, tmpResult, fCallback);
				});
			};

			if (tmpFiltered.TablesAdded.length === 0)
			{
				return fApplyAlters();
			}

			let tmpAddedTables = tmpFiltered.TablesAdded.map((pT) =>
			{
				// SchemaDiff returns the original target-table object; it
				// includes the descriptor's Indices. SchemaDeployer.deployTable
				// hands the same shape back to the connector's createTable +
				// createIndices.
				return pT;
			});

			let tmpDeployIdx = 0;
			let fDeployNext = () =>
			{
				if (tmpDeployIdx >= tmpAddedTables.length) { return fApplyAlters(); }
				let tmpTbl = tmpAddedTables[tmpDeployIdx++];
				this._SchemaDeployer.deployTable(tmpSchemaService, tmpTbl, (pDeployErr) =>
				{
					if (pDeployErr) { return fCallback(pDeployErr); }
					return fDeployNext();
				});
			};
			fDeployNext();
		});
	}

	/**
	 * Drop destructive entries from the diff so EnsureSchema is forward-
	 * only. Anything we drop gets logged on `pResult.SkippedDestructive`
	 * so an operator can see what would have changed if the path
	 * accepted destructive ops. Returns a fresh diff object — never
	 * mutates the input.
	 */
	_forwardOnlyFilter(pDiff, pResult)
	{
		let tmpFiltered =
		{
			TablesAdded: Array.isArray(pDiff.TablesAdded) ? pDiff.TablesAdded.slice() : [],
			TablesRemoved: [],
			TablesModified: []
		};
		let tmpRemoved = Array.isArray(pDiff.TablesRemoved) ? pDiff.TablesRemoved : [];
		for (let i = 0; i < tmpRemoved.length; i++)
		{
			let tmpName = tmpRemoved[i] && tmpRemoved[i].TableName;
			if (tmpName)
			{
				pResult.SkippedDestructive.push(`drop-table:${tmpName}`);
				pResult.Notes.push(`Skipped destructive: DROP TABLE ${tmpName} (forward-only).`);
			}
		}
		let tmpModified = Array.isArray(pDiff.TablesModified) ? pDiff.TablesModified : [];
		for (let i = 0; i < tmpModified.length; i++)
		{
			let tmpMod = tmpModified[i];
			let tmpKept =
			{
				TableName: tmpMod.TableName,
				ColumnsAdded: Array.isArray(tmpMod.ColumnsAdded) ? tmpMod.ColumnsAdded : [],
				ColumnsRemoved: [],
				ColumnsModified: [],
				IndicesAdded: Array.isArray(tmpMod.IndicesAdded) ? tmpMod.IndicesAdded : [],
				IndicesRemoved: [],
				ForeignKeysAdded: Array.isArray(tmpMod.ForeignKeysAdded) ? tmpMod.ForeignKeysAdded : [],
				ForeignKeysRemoved: []
			};
			let tmpColRem = Array.isArray(tmpMod.ColumnsRemoved) ? tmpMod.ColumnsRemoved : [];
			for (let j = 0; j < tmpColRem.length; j++)
			{
				pResult.SkippedDestructive.push(`drop-column:${tmpMod.TableName}.${tmpColRem[j].Column}`);
			}
			let tmpColMod = Array.isArray(tmpMod.ColumnsModified) ? tmpMod.ColumnsModified : [];
			for (let j = 0; j < tmpColMod.length; j++)
			{
				pResult.SkippedDestructive.push(`alter-column:${tmpMod.TableName}.${tmpColMod[j].Column}`);
			}
			let tmpIdxRem = Array.isArray(tmpMod.IndicesRemoved) ? tmpMod.IndicesRemoved : [];
			for (let j = 0; j < tmpIdxRem.length; j++)
			{
				pResult.SkippedDestructive.push(`drop-index:${tmpIdxRem[j].Name}`);
			}
			if (tmpKept.ColumnsAdded.length > 0
				|| tmpKept.IndicesAdded.length > 0
				|| tmpKept.ForeignKeysAdded.length > 0)
			{
				tmpFiltered.TablesModified.push(tmpKept);
			}
		}
		if (pResult.SkippedDestructive.length > 0)
		{
			pResult.Notes.push(`Forward-only filter dropped ${pResult.SkippedDestructive.length} destructive change(s); see SkippedDestructive for the list.`);
		}
		return tmpFiltered;
	}

	/**
	 * After ALTERs land, we still want the connector's `createAllIndices`
	 * to run for tables that already existed before this call — the
	 * descriptor may have grown new indices that the SchemaDiff path
	 * already captured, but indices on indexed Columns (DDL Indexed:true)
	 * arrive via the connector's auto-derivation rather than the
	 * descriptor's `Indexes` block. Idempotent on every engine; tables
	 * that didn't exist before this call already had their indices
	 * created via SchemaDeployer.deployTable.
	 */
	_createIndicesForExistingTables(pSchemaService, pMeadowSchema, pExistingTableNames, pResult, fCallback)
	{
		let tmpExistingSchema =
		{
			Tables: pMeadowSchema.Tables.filter((pT) => pExistingTableNames.has(pT.TableName))
		};
		if (tmpExistingSchema.Tables.length === 0)
		{
			return fCallback(null, pResult);
		}
		pSchemaService.createAllIndices(tmpExistingSchema, (pIdxErr) =>
		{
			if (pIdxErr) { return fCallback(pIdxErr); }
			return fCallback(null, pResult);
		});
	}

	/**
	 * Execute MigrationGenerator output against the live connection.
	 * SQLite uses better-sqlite3's synchronous `.exec()`; the other
	 * three engines use the schema provider's `_ConnectionPool.query()`
	 * (the same handle createTables / createAllIndices already use).
	 * Ignores duplicate-column / already-exists errors so re-running
	 * EnsureSchema after a partial migration stays idempotent.
	 */
	_executeStatements(pConn, pEngine, pStatements, fCallback)
	{
		if (!pStatements || pStatements.length === 0) { return fCallback(null); }
		if (pEngine === 'sqlite')
		{
			let tmpDB = pConn.instance && pConn.instance._database;
			if (!tmpDB || typeof tmpDB.exec !== 'function')
			{
				return fCallback(new Error('Forward-migration: SQLite handle has no .exec method.'));
			}
			for (let i = 0; i < pStatements.length; i++)
			{
				let tmpSql = pStatements[i];
				if (this._isCommentOnly(tmpSql)) { continue; }
				try { tmpDB.exec(tmpSql); }
				catch (pErr)
				{
					if (this._isHarmlessAlterError(pErr.message || ''))
					{
						continue;
					}
					return fCallback(pErr);
				}
			}
			return fCallback(null);
		}
		// Pool-based engines (mysql / mssql / postgresql). The
		// schemaProvider holds the live pool reference.
		let tmpSchema = pConn.instance && (pConn.instance.schemaProvider || pConn.instance._SchemaProvider);
		let tmpPool = tmpSchema && tmpSchema._ConnectionPool;
		if (!tmpPool || typeof tmpPool.query !== 'function')
		{
			return fCallback(new Error(`Forward-migration: engine [${pEngine}] connector has no _ConnectionPool.query.`));
		}
		let tmpIdx = 0;
		let fNext = () =>
		{
			if (tmpIdx >= pStatements.length) { return fCallback(null); }
			let tmpSql = pStatements[tmpIdx++];
			if (this._isCommentOnly(tmpSql)) { return fNext(); }
			tmpPool.query(tmpSql, (pErr) =>
			{
				if (pErr && !this._isHarmlessAlterError(pErr.message || ''))
				{
					return fCallback(pErr);
				}
				return fNext();
			});
		};
		fNext();
	}

	_isCommentOnly(pSql)
	{
		if (!pSql) { return true; }
		let tmpTrim = String(pSql).trim();
		return tmpTrim.length === 0 || tmpTrim.indexOf('--') === 0;
	}

	_isHarmlessAlterError(pMessage)
	{
		// Engines tell us "already exists" / "duplicate column" in
		// different ways. Treat any of these as a no-op so re-running
		// after a partial migration stays idempotent.
		let tmpLower = String(pMessage || '').toLowerCase();
		return tmpLower.indexOf('duplicate column') >= 0
			|| tmpLower.indexOf('already exists') >= 0
			|| tmpLower.indexOf('duplicate key name') >= 0
			|| (tmpLower.indexOf('column') >= 0 && tmpLower.indexOf('already') >= 0);
	}

	/**
	 * IntrospectSchema action handler. Reports whether each descriptor
	 * table exists, and which descriptor columns are missing on each
	 * existing table. Engine-agnostic — uses the connector's
	 * `listTables` and `introspectTableColumns`.
	 *
	 * @param {object} pSettings    - { IDBeaconConnection, SchemaName, SchemaJSON }
	 * @param {function} fCallback - function(pError, pResult)
	 *   pResult: { Success, SchemaName, Engine, Tables: [{ Scope, Exists, Columns, MissingColumns }] }
	 */
	introspectSchema(pSettings, fCallback)
	{
		let tmpConnID = pSettings && pSettings.IDBeaconConnection;
		let tmpSchemaName = (pSettings && pSettings.SchemaName) || 'unnamed';
		let tmpSchemaJSON = pSettings && pSettings.SchemaJSON;

		if (!tmpConnID)
		{
			return fCallback(new Error('IntrospectSchema: IDBeaconConnection is required.'));
		}
		if (!tmpSchemaJSON || !Array.isArray(tmpSchemaJSON.Tables))
		{
			return fCallback(new Error('IntrospectSchema: SchemaJSON.Tables is required.'));
		}

		let tmpBridge = this.fable.DataBeaconConnectionBridge;
		if (!tmpBridge)
		{
			return fCallback(new Error('IntrospectSchema: DataBeaconConnectionBridge service not available.'));
		}
		let tmpConn = tmpBridge.getConnection(tmpConnID);
		if (!tmpConn || tmpConn.status !== 'connected')
		{
			return fCallback(new Error(`IntrospectSchema: connection [${tmpConnID}] is not live.`));
		}

		let tmpSchemaService = this._engineSchemaService(tmpConn);
		if (!tmpSchemaService)
		{
			return fCallback(new Error(
				`IntrospectSchema: connector "${tmpConn.type}" does not expose a schemaProvider.`));
		}

		let tmpEngine = (tmpConn.type || '').toLowerCase();
		let tmpResult =
		{
			Success: true,
			SchemaName: tmpSchemaName,
			Engine: tmpEngine,
			Tables: []
		};

		tmpSchemaService.listTables((pListErr, pExistingTables) =>
		{
			if (pListErr) { return fCallback(pListErr); }
			let tmpExistingSet = new Set(pExistingTables || []);
			let tmpDescTables = tmpSchemaJSON.Tables;

			let tmpAdvance = (pIdx) =>
			{
				if (pIdx >= tmpDescTables.length)
				{
					return fCallback(null, tmpResult);
				}
				let tmpDesc = tmpDescTables[pIdx];
				let tmpName = tmpDesc.Scope;
				let tmpExpectedCols = (tmpDesc.Schema || []).map((pC) => pC.Column);
				if (!tmpExistingSet.has(tmpName))
				{
					tmpResult.Tables.push(
					{
						Scope: tmpName,
						Exists: false,
						Columns: [],
						MissingColumns: tmpExpectedCols
					});
					return tmpAdvance(pIdx + 1);
				}
				tmpSchemaService.introspectTableColumns(tmpName, (pColErr, pCols) =>
				{
					if (pColErr) { return fCallback(pColErr); }
					let tmpHave = new Set((pCols || []).map((pC) => pC.Column));
					let tmpMissing = tmpExpectedCols.filter((pName) => !tmpHave.has(pName));
					tmpResult.Tables.push(
					{
						Scope: tmpName,
						Exists: true,
						Columns: Array.from(tmpHave),
						MissingColumns: tmpMissing
					});
					return tmpAdvance(pIdx + 1);
				});
			};

			tmpAdvance(0);
		});
	}

	// ====================================================================
	// Engine resolution + descriptor translation
	// ====================================================================

	/**
	 * Return the connector's MeadowSchema service for a live connection.
	 * Every meadow connector exposes either a `schemaProvider` getter
	 * or, on older revisions, a `_SchemaProvider` field. Returns null
	 * for connectors that don't ship a schema service (e.g. mongodb,
	 * solr, dgraph) — those raise a clear error in ensureSchema.
	 */
	_engineSchemaService(pConn)
	{
		if (!pConn || !pConn.instance) { return null; }
		if (pConn.instance.schemaProvider) { return pConn.instance.schemaProvider; }
		if (pConn.instance._SchemaProvider) { return pConn.instance._SchemaProvider; }
		return null;
	}

	/**
	 * Translate our schema descriptor (Scope / Schema / Indexes / high-
	 * level Type) into the meadow connector shape (TableName / Columns /
	 * Indices / lower-level DataType).
	 */
	_descriptorToMeadowSchema(pDescriptor)
	{
		let tmpTables = [];
		for (let i = 0; i < pDescriptor.Tables.length; i++)
		{
			let tmpDesc = pDescriptor.Tables[i];
			if (!tmpDesc.Scope || !Array.isArray(tmpDesc.Schema))
			{
				continue;
			}
			let tmpMeadowTable =
			{
				TableName: tmpDesc.Scope,
				Columns: tmpDesc.Schema.map((pCol) => this._descriptorToMeadowColumn(pCol))
			};
			if (Array.isArray(tmpDesc.Indexes))
			{
				tmpMeadowTable.Indices = tmpDesc.Indexes.map((pIdx, pK) => (
					{
						Name: pIdx.Name || `IX_${tmpDesc.Scope}_${pK}`,
						Columns: Array.isArray(pIdx.Columns) ? pIdx.Columns : [pIdx.Columns],
						Unique: !!pIdx.Unique,
						Strategy: pIdx.Strategy || ''
					}));
			}
			tmpTables.push(tmpMeadowTable);
		}
		return { Tables: tmpTables };
	}

	_descriptorToMeadowColumn(pCol)
	{
		let tmpType = pCol.Type;
		let tmpSize = pCol.Size;
		let tmpDataType = DESCRIPTOR_TYPE_TO_MEADOW_DATATYPE[tmpType] || 'Text';

		// `String, Size: 'Default'` has no meaningful CHAR(N) on
		// MySQL / MSSQL / Postgres. Fall back to Text (unbounded) so
		// the engine path still produces a valid CREATE TABLE. SQLite
		// stores both as TEXT so this is invisible there.
		if (tmpType === 'String' && (tmpSize === 'Default' || tmpSize == null))
		{
			tmpDataType = 'Text';
			tmpSize = null;
		}
		// JSON columns take Text on every supported engine — keep them
		// engine-portable. Connectors with native JSON could promote
		// later without changing this map.
		if (tmpType === 'JSON')
		{
			tmpDataType = 'Text';
			tmpSize = null;
		}

		let tmpResult = { Column: pCol.Column, DataType: tmpDataType };
		if (tmpSize && tmpSize !== 'Default' && tmpSize !== 'int')
		{
			tmpResult.Size = tmpSize;
		}
		else if (tmpDataType === 'Decimal')
		{
			// Connectors render `DECIMAL(${Size})` directly — supply a
			// neutral default for Float-typed descriptor columns.
			tmpResult.Size = '10,2';
		}
		return tmpResult;
	}

}

/**
 * Register the DataBeaconSchema beacon capability on an existing
 * beacon service. Mirrors the registerMeadowProxyCapability shape.
 *
 * Two actions:
 *   - EnsureSchema(IDBeaconConnection, SchemaName, SchemaJSON)
 *   - IntrospectSchema(IDBeaconConnection, SchemaName, SchemaJSON)
 *
 * Both expect the descriptor in SchemaJSON to follow the convention
 * documented at the top of this file.
 */
const registerSchemaCapability = function (pBeaconService, pFable)
{
	let tmpManager = pFable.DataBeaconSchemaManager;
	if (!tmpManager)
	{
		throw new Error('registerSchemaCapability: DataBeaconSchemaManager not registered on fable yet.');
	}

	pBeaconService.registerCapability(
	{
		Capability: 'DataBeaconSchema',
		Name: 'DataBeaconSchemaProvider',
		actions:
		{
			'EnsureSchema':
			{
				Description: 'Idempotently materialize a set of tables (and indices) on a connected database.',
				SettingsSchema:
				[
					{ Name: 'IDBeaconConnection', DataType: 'Number', Required: true },
					{ Name: 'SchemaName',         DataType: 'String', Required: true },
					{ Name: 'SchemaJSON',         DataType: 'Object', Required: true }
				],
				Handler: function (pWorkItem, pContext, fHandlerCallback)
				{
					let tmpSettings = pWorkItem.Settings || {};
					tmpManager.ensureSchema(tmpSettings, (pErr, pResult) =>
					{
						if (pErr) { return fHandlerCallback(pErr); }
						return fHandlerCallback(null, { Outputs: pResult, Log: [] });
					});
				}
			},
			'IntrospectSchema':
			{
				Description: 'Report which descriptor tables/columns exist on a connected database.',
				SettingsSchema:
				[
					{ Name: 'IDBeaconConnection', DataType: 'Number', Required: true },
					{ Name: 'SchemaName',         DataType: 'String', Required: true },
					{ Name: 'SchemaJSON',         DataType: 'Object', Required: true }
				],
				Handler: function (pWorkItem, pContext, fHandlerCallback)
				{
					let tmpSettings = pWorkItem.Settings || {};
					tmpManager.introspectSchema(tmpSettings, (pErr, pResult) =>
					{
						if (pErr) { return fHandlerCallback(pErr); }
						return fHandlerCallback(null, { Outputs: pResult, Log: [] });
					});
				}
			}
		}
	});
};

module.exports = DataBeaconSchemaManager;
module.exports.registerSchemaCapability = registerSchemaCapability;
module.exports.DESCRIPTOR_TYPE_TO_MEADOW_DATATYPE = DESCRIPTOR_TYPE_TO_MEADOW_DATATYPE;
