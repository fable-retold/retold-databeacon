/**
 * DataBeacon - Schema Introspector Service
 *
 * Per-dialect schema introspection for external databases.
 * Queries information_schema (MySQL/PostgreSQL/MSSQL) or
 * sqlite_master/PRAGMA (SQLite) to discover tables and columns,
 * then persists the results to the IntrospectedTable DAL entity.
 *
 * @author Steven Velozo <steven@velozo.com>
 */
const libFableServiceProviderBase = require('fable-serviceproviderbase');

const defaultSchemaIntrospectorOptions = (
	{
		RoutePrefix: '/beacon'
	});

// Connection types whose query panel input is free-form SQL. Everything
// else is expected to be a JSON descriptor (or driver-specific string)
// and bypasses the SELECT-only gate.
const _SQLTypes = { MySQL: true, PostgreSQL: true, MSSQL: true, SQLite: true, Oracle: true };

class DataBeaconSchemaIntrospector extends libFableServiceProviderBase
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, defaultSchemaIntrospectorOptions, pOptions);
		super(pFable, tmpOptions, pServiceHash);

		this.serviceType = 'DataBeaconSchemaIntrospector';
	}

	// ================================================================
	// Dialect-Specific Introspectors
	// ================================================================

	/**
	 * Get an introspector object for the given connection type.
	 * Returns { listTables(pPool, fCallback), describeTable(pPool, pTableName, fCallback) }
	 */
	_getIntrospector(pType, pOwner)
	{
		switch (pType)
		{
			case 'MySQL':
				return this._mysqlIntrospector();
			case 'PostgreSQL':
				return this._postgresqlIntrospector();
			case 'MSSQL':
				return this._mssqlIntrospector();
			case 'SQLite':
				return this._sqliteIntrospector();
			case 'Oracle':
				return this._oracleIntrospector(pOwner);
			case 'MeadowEndpoints':
				// pOwner carries the parsed connection Config for this type.
				return this._meadowEndpointsIntrospector(pOwner || {});
			default:
				return null;
		}
	}

	/**
	 * Acquire a pooled Oracle connection, run one statement, return its rows
	 * as plain objects, and release the connection. Positional binds use the
	 * Oracle `:1` form. Shared by the Oracle introspector and _runQuery.
	 */
	_oracleExec(pProvider, pSQL, pBinds, fCallback)
	{
		if (!pProvider || typeof pProvider.getConnection !== 'function')
		{
			return fCallback(new Error('Oracle provider is not available or not connected.'));
		}
		pProvider.getConnection((pConnError, pConnection) =>
		{
			if (pConnError)
			{
				return fCallback(pConnError);
			}
			let tmpOutFormat = (pProvider.oracledb && pProvider.oracledb.OUT_FORMAT_OBJECT) || 4002;
			pConnection.execute(pSQL, pBinds || [], { outFormat: tmpOutFormat })
				.then((pResult) =>
				{
					let tmpRows = (pResult && pResult.rows) || [];
					pConnection.close().then(() => fCallback(null, tmpRows)).catch(() => fCallback(null, tmpRows));
				})
				.catch((pError) =>
				{
					pConnection.close().then(() => fCallback(pError)).catch(() => fCallback(pError));
				});
		});
	}

	_oracleIntrospector(pOwner)
	{
		// When an Owner (schema) is configured, introspect that schema's tables via
		// the ALL_* dictionary views (cross-schema, granted access). With no Owner,
		// fall back to USER_* (tables owned by the connecting user).
		let tmpOwner = (typeof pOwner === 'string' && pOwner.trim().length > 0) ? pOwner.trim() : null;
		return {
			listTables: (pProvider, fCallback) =>
			{
				let tmpSQL = tmpOwner
					? 'SELECT TABLE_NAME, NUM_ROWS FROM ALL_TABLES WHERE OWNER = :1 ORDER BY TABLE_NAME'
					: 'SELECT TABLE_NAME, NUM_ROWS FROM USER_TABLES ORDER BY TABLE_NAME';
				this._oracleExec(pProvider, tmpSQL, tmpOwner ? [tmpOwner] : [],
					(pError, pRows) =>
					{
						if (pError) return fCallback(pError);
						let tmpTables = [];
						for (let i = 0; i < pRows.length; i++)
						{
							tmpTables.push({ TableName: pRows[i].TABLE_NAME, RowCountEstimate: pRows[i].NUM_ROWS || 0 });
						}
						return fCallback(null, tmpTables);
					});
			},
			describeTable: (pProvider, pTableName, fCallback) =>
			{
				// Table name is the data-dictionary (typically upper-cased) name from
				// listTables. Owner-scoped queries bind :1=owner, :2=table; user-scoped
				// bind :1=table.
				let tmpColumnSQL, tmpPKSQL, tmpIdentitySQL, tmpBinds;
				if (tmpOwner)
				{
					tmpColumnSQL = 'SELECT COLUMN_NAME, DATA_TYPE, CHAR_LENGTH, DATA_LENGTH, NULLABLE, DATA_DEFAULT FROM ALL_TAB_COLUMNS WHERE OWNER = :1 AND TABLE_NAME = :2 ORDER BY COLUMN_ID';
					tmpPKSQL = 'SELECT cc.COLUMN_NAME FROM ALL_CONSTRAINTS c JOIN ALL_CONS_COLUMNS cc ON c.CONSTRAINT_NAME = cc.CONSTRAINT_NAME AND c.OWNER = cc.OWNER WHERE c.CONSTRAINT_TYPE = \'P\' AND c.OWNER = :1 AND c.TABLE_NAME = :2';
					tmpIdentitySQL = 'SELECT COLUMN_NAME FROM ALL_TAB_IDENTITY_COLS WHERE OWNER = :1 AND TABLE_NAME = :2';
					tmpBinds = [tmpOwner, pTableName];
				}
				else
				{
					tmpColumnSQL = 'SELECT COLUMN_NAME, DATA_TYPE, CHAR_LENGTH, DATA_LENGTH, NULLABLE, DATA_DEFAULT FROM USER_TAB_COLUMNS WHERE TABLE_NAME = :1 ORDER BY COLUMN_ID';
					tmpPKSQL = 'SELECT cc.COLUMN_NAME FROM USER_CONSTRAINTS c JOIN USER_CONS_COLUMNS cc ON c.CONSTRAINT_NAME = cc.CONSTRAINT_NAME WHERE c.CONSTRAINT_TYPE = \'P\' AND c.TABLE_NAME = :1';
					tmpIdentitySQL = 'SELECT COLUMN_NAME FROM USER_TAB_IDENTITY_COLS WHERE TABLE_NAME = :1';
					tmpBinds = [pTableName];
				}

				this._oracleExec(pProvider, tmpColumnSQL, tmpBinds, (pColError, pColRows) =>
				{
					if (pColError) return fCallback(pColError);
					this._oracleExec(pProvider, tmpPKSQL, tmpBinds, (pPKError, pPKRows) =>
					{
						if (pPKError) return fCallback(pPKError);
						this._oracleExec(pProvider, tmpIdentitySQL, tmpBinds, (pIdError, pIdRows) =>
						{
							// (ALL|USER)_TAB_IDENTITY_COLS is 12c+; a failure here just means
							// "no identity columns" rather than aborting the table.
							let tmpPKSet = new Set((pPKRows || []).map((pRow) => pRow.COLUMN_NAME));
							let tmpIdentitySet = new Set((pIdError ? [] : (pIdRows || [])).map((pRow) => pRow.COLUMN_NAME));

							let tmpColumns = [];
							for (let i = 0; i < pColRows.length; i++)
							{
								let tmpRow = pColRows[i];
								let tmpIsPK = tmpPKSet.has(tmpRow.COLUMN_NAME);
								let tmpIsIdentity = tmpIdentitySet.has(tmpRow.COLUMN_NAME);
								tmpColumns.push(
								{
									Name: tmpRow.COLUMN_NAME,
									NativeType: tmpRow.DATA_TYPE,
									MaxLength: tmpRow.CHAR_LENGTH || tmpRow.DATA_LENGTH || null,
									Nullable: tmpRow.NULLABLE === 'Y',
									IsPrimaryKey: tmpIsPK,
									IsAutoIncrement: tmpIsIdentity,
									DefaultValue: (tmpRow.DATA_DEFAULT === undefined) ? null : tmpRow.DATA_DEFAULT,
									MeadowType: this._mapNativeTypeToMeadow(tmpRow.DATA_TYPE, tmpIsPK, tmpIsIdentity, tmpRow.COLUMN_NAME, pTableName)
								});
							}
							return fCallback(null, tmpColumns);
						});
					});
				});
			}
		};
	}

	_mysqlIntrospector()
	{
		return {
			listTables: (pProvider, fCallback) =>
			{
				let tmpPool = pProvider.pool || pProvider;
				tmpPool.query(
					`SELECT TABLE_NAME, TABLE_ROWS FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE' ORDER BY TABLE_NAME`,
					(pError, pResults) =>
					{
						if (pError) return fCallback(pError);
						let tmpTables = [];
						for (let i = 0; i < pResults.length; i++)
						{
							tmpTables.push({ TableName: pResults[i].TABLE_NAME, RowCountEstimate: pResults[i].TABLE_ROWS || 0 });
						}
						return fCallback(null, tmpTables);
					});
			},
			describeTable: (pProvider, pTableName, fCallback) =>
			{
				let tmpPool = pProvider.pool || pProvider;
				tmpPool.query(
					`SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE, COLUMN_KEY, COLUMN_DEFAULT, EXTRA
					 FROM information_schema.COLUMNS
					 WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?
					 ORDER BY ORDINAL_POSITION`,
					[pTableName],
					(pError, pResults) =>
					{
						if (pError) return fCallback(pError);
						let tmpColumns = [];
						for (let i = 0; i < pResults.length; i++)
						{
							let tmpRow = pResults[i];
							tmpColumns.push(
							{
								Name: tmpRow.COLUMN_NAME,
								NativeType: tmpRow.DATA_TYPE,
								MaxLength: tmpRow.CHARACTER_MAXIMUM_LENGTH,
								Nullable: tmpRow.IS_NULLABLE === 'YES',
								IsPrimaryKey: tmpRow.COLUMN_KEY === 'PRI',
								IsAutoIncrement: (tmpRow.EXTRA || '').indexOf('auto_increment') >= 0,
								DefaultValue: tmpRow.COLUMN_DEFAULT,
								MeadowType: this._mapNativeTypeToMeadow(tmpRow.DATA_TYPE, tmpRow.COLUMN_KEY === 'PRI', (tmpRow.EXTRA || '').indexOf('auto_increment') >= 0, tmpRow.COLUMN_NAME, pTableName)
							});
						}
						return fCallback(null, tmpColumns);
					});
			}
		};
	}

	_postgresqlIntrospector()
	{
		return {
			listTables: (pProvider, fCallback) =>
			{
				let tmpPool = pProvider.pool || pProvider;
				tmpPool.query(
					`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name`,
					(pError, pResult) =>
					{
						if (pError) return fCallback(pError);
						let tmpRows = pResult.rows || pResult;
						let tmpTables = [];
						for (let i = 0; i < tmpRows.length; i++)
						{
							tmpTables.push({ TableName: tmpRows[i].table_name, RowCountEstimate: 0 });
						}
						return fCallback(null, tmpTables);
					});
			},
			describeTable: (pProvider, pTableName, fCallback) =>
			{
				let tmpPool = pProvider.pool || pProvider;
				let tmpSQL = `
					SELECT c.column_name, c.data_type, c.character_maximum_length, c.is_nullable, c.column_default, c.identity_generation,
						   CASE WHEN pk.column_name IS NOT NULL THEN true ELSE false END AS is_primary_key
					FROM information_schema.columns c
					LEFT JOIN (
						SELECT ku.column_name
						FROM information_schema.table_constraints tc
						JOIN information_schema.key_column_usage ku ON tc.constraint_name = ku.constraint_name
						WHERE tc.table_name = $1 AND tc.constraint_type = 'PRIMARY KEY'
					) pk ON pk.column_name = c.column_name
					WHERE c.table_schema = 'public' AND c.table_name = $1
					ORDER BY c.ordinal_position`;

				tmpPool.query(tmpSQL, [pTableName],
					(pError, pResult) =>
					{
						if (pError) return fCallback(pError);
						let tmpRows = pResult.rows || pResult;
						let tmpColumns = [];
						for (let i = 0; i < tmpRows.length; i++)
						{
							let tmpRow = tmpRows[i];
							// Postgres 10+ IDENTITY columns have NULL column_default;
							// the flag lives in identity_generation (ALWAYS / BY DEFAULT).
							// Pre-10 SERIAL columns set column_default to nextval(seq).
							let tmpIsAuto = !!tmpRow.identity_generation || (tmpRow.column_default || '').indexOf('nextval') >= 0;
							tmpColumns.push(
							{
								Name: tmpRow.column_name,
								NativeType: tmpRow.data_type,
								MaxLength: tmpRow.character_maximum_length,
								Nullable: tmpRow.is_nullable === 'YES',
								IsPrimaryKey: tmpRow.is_primary_key,
								IsAutoIncrement: tmpIsAuto,
								DefaultValue: tmpRow.column_default,
								MeadowType: this._mapNativeTypeToMeadow(tmpRow.data_type, tmpRow.is_primary_key, tmpIsAuto, tmpRow.column_name, pTableName)
							});
						}
						return fCallback(null, tmpColumns);
					});
			}
		};
	}

	_mssqlIntrospector()
	{
		return {
			listTables: (pProvider, fCallback) =>
			{
				let tmpPool = pProvider.pool || pProvider;
				let tmpRequest = tmpPool.request ? tmpPool.request() : tmpPool;
				let tmpQuery = tmpRequest.query || tmpRequest;

				if (typeof tmpQuery === 'function')
				{
					tmpQuery.call(tmpRequest,
						`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' ORDER BY TABLE_NAME`,
						(pError, pResult) =>
						{
							if (pError) return fCallback(pError);
							let tmpRows = pResult.recordset || pResult;
							let tmpTables = [];
							for (let i = 0; i < tmpRows.length; i++)
							{
								tmpTables.push({ TableName: tmpRows[i].TABLE_NAME, RowCountEstimate: 0 });
							}
							return fCallback(null, tmpTables);
						});
				}
				else
				{
					return fCallback(new Error('MSSQL provider query interface not available'));
				}
			},
			describeTable: (pProvider, pTableName, fCallback) =>
			{
				let tmpPool = pProvider.pool || pProvider;
				let tmpRequest = tmpPool.request ? tmpPool.request() : tmpPool;
				let tmpQuery = tmpRequest.query || tmpRequest;

				if (typeof tmpQuery === 'function')
				{
					tmpRequest.input('tableName', pTableName);
					tmpQuery.call(tmpRequest,
						`SELECT c.COLUMN_NAME, c.DATA_TYPE, c.CHARACTER_MAXIMUM_LENGTH, c.IS_NULLABLE, c.COLUMN_DEFAULT,
						        CASE WHEN pk.COLUMN_NAME IS NOT NULL THEN 1 ELSE 0 END AS IS_PRIMARY_KEY,
						        COLUMNPROPERTY(OBJECT_ID(c.TABLE_SCHEMA + '.' + c.TABLE_NAME), c.COLUMN_NAME, 'IsIdentity') AS IS_IDENTITY
						 FROM INFORMATION_SCHEMA.COLUMNS c
						 LEFT JOIN (
						     SELECT ku.COLUMN_NAME FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
						     JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE ku ON tc.CONSTRAINT_NAME = ku.CONSTRAINT_NAME
						     WHERE tc.TABLE_NAME = @tableName AND tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
						 ) pk ON pk.COLUMN_NAME = c.COLUMN_NAME
						 WHERE c.TABLE_NAME = @tableName
						 ORDER BY c.ORDINAL_POSITION`,
						(pError, pResult) =>
						{
							if (pError) return fCallback(pError);
							let tmpRows = pResult.recordset || pResult;
							let tmpColumns = [];
							for (let i = 0; i < tmpRows.length; i++)
							{
								let tmpRow = tmpRows[i];
								tmpColumns.push(
								{
									Name: tmpRow.COLUMN_NAME,
									NativeType: tmpRow.DATA_TYPE,
									MaxLength: tmpRow.CHARACTER_MAXIMUM_LENGTH,
									Nullable: tmpRow.IS_NULLABLE === 'YES',
									IsPrimaryKey: !!tmpRow.IS_PRIMARY_KEY,
									IsAutoIncrement: !!tmpRow.IS_IDENTITY,
									DefaultValue: tmpRow.COLUMN_DEFAULT,
									MeadowType: this._mapNativeTypeToMeadow(tmpRow.DATA_TYPE, !!tmpRow.IS_PRIMARY_KEY, !!tmpRow.IS_IDENTITY, tmpRow.COLUMN_NAME, pTableName)
								});
							}
							return fCallback(null, tmpColumns);
						});
				}
				else
				{
					return fCallback(new Error('MSSQL provider query interface not available'));
				}
			}
		};
	}

	_sqliteIntrospector()
	{
		return {
			listTables: (pProvider, fCallback) =>
			{
				try
				{
					let tmpDB = pProvider.db || pProvider;
					let tmpStmt = tmpDB.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name`);
					let tmpRows = tmpStmt.all();
					let tmpTables = [];
					for (let i = 0; i < tmpRows.length; i++)
					{
						tmpTables.push({ TableName: tmpRows[i].name, RowCountEstimate: 0 });
					}
					return fCallback(null, tmpTables);
				}
				catch (pError)
				{
					return fCallback(pError);
				}
			},
			describeTable: (pProvider, pTableName, fCallback) =>
			{
				try
				{
					let tmpDB = pProvider.db || pProvider;
					let tmpStmt = tmpDB.prepare(`PRAGMA table_info("${pTableName.replace(/"/g, '""')}")`);
					let tmpRows = tmpStmt.all();
					let tmpColumns = [];
					for (let i = 0; i < tmpRows.length; i++)
					{
						let tmpRow = tmpRows[i];
						let tmpIsPK = !!tmpRow.pk;
						tmpColumns.push(
						{
							Name: tmpRow.name,
							NativeType: tmpRow.type || 'TEXT',
							MaxLength: null,
							Nullable: !tmpRow.notnull,
							IsPrimaryKey: tmpIsPK,
							IsAutoIncrement: tmpIsPK && (tmpRow.type || '').toUpperCase().indexOf('INTEGER') >= 0,
							DefaultValue: tmpRow.dflt_value,
							MeadowType: this._mapNativeTypeToMeadow(tmpRow.type || 'TEXT', tmpIsPK, tmpIsPK && (tmpRow.type || '').toUpperCase().indexOf('INTEGER') >= 0, tmpRow.name, pTableName)
						});
					}
					return fCallback(null, tmpColumns);
				}
				catch (pError)
				{
					return fCallback(pError);
				}
			}
		};
	}

	// ================================================================
	// Type Mapping
	// ================================================================

	/**
	 * Map a native database type to a Meadow type.
	 */
	_mapNativeTypeToMeadow(pNativeType, pIsPrimaryKey, pIsAutoIncrement, pColumnName, pTableName)
	{
		if (pIsPrimaryKey && pIsAutoIncrement)
		{
			return 'AutoIdentity';
		}

		// Recognize standard Meadow audit columns by name.
		// The PascalCase naming convention (CreateDate, UpdatingIDUser, etc.)
		// is distinctive to Meadow schemas — virtually no other system uses it.
		if (pColumnName)
		{
			// AutoGUID is the table's primary identity-companion GUID:
			// GUID<TableName> alongside ID<TableName>. Other GUIDxxx
			// columns (e.g. a clone preserving its source's GUIDSource as
			// a pass-through reference) stay as plain Strings — promoting
			// every GUID-prefixed column to AutoGUID makes meadow's
			// CollisionRename treat them ALL as unique-constrained, which
			// silently rejects rows whose source-side GUID happens to
			// collide (synth_guid() collisions at scale, etc.) with
			// "Record with GUID X already exists!".
			if (pColumnName === 'GUID' + (pTableName || ''))    { return 'AutoGUID'; }
			if (pColumnName === 'CreateDate')          { return 'CreateDate'; }
			if (pColumnName === 'CreatingIDUser')      { return 'CreateIDUser'; }
			if (pColumnName === 'UpdateDate')          { return 'UpdateDate'; }
			if (pColumnName === 'UpdatingIDUser')      { return 'UpdateIDUser'; }
			if (pColumnName === 'Deleted')             { return 'Deleted'; }
			if (pColumnName === 'DeleteDate')          { return 'DeleteDate'; }
			if (pColumnName === 'DeletingIDUser')      { return 'DeleteIDUser'; }
		}

		let tmpType = (pNativeType || 'TEXT').toUpperCase();

		// Integer types
		if (tmpType.indexOf('INT') >= 0 || tmpType === 'TINYINT' || tmpType === 'SMALLINT' || tmpType === 'MEDIUMINT' || tmpType === 'BIGINT')
		{
			return 'Numeric';
		}

		// Decimal/float types
		if (tmpType.indexOf('DECIMAL') >= 0 || tmpType.indexOf('NUMERIC') >= 0 || tmpType.indexOf('FLOAT') >= 0 ||
			tmpType.indexOf('DOUBLE') >= 0 || tmpType.indexOf('REAL') >= 0 || tmpType === 'MONEY' || tmpType === 'SMALLMONEY' ||
			tmpType.indexOf('NUMBER') >= 0)
		{
			return 'Numeric';
		}

		// Boolean types
		if (tmpType === 'BOOLEAN' || tmpType === 'BOOL' || tmpType === 'BIT')
		{
			return 'Boolean';
		}

		// Date/time types
		if (tmpType.indexOf('DATE') >= 0 || tmpType.indexOf('TIME') >= 0 || tmpType === 'YEAR')
		{
			return 'DateTime';
		}

		// Text/string types
		if (tmpType.indexOf('CHAR') >= 0 || tmpType.indexOf('TEXT') >= 0 || tmpType === 'ENUM' || tmpType === 'SET' ||
			tmpType === 'CLOB' || tmpType.indexOf('VARYING') >= 0 || tmpType === 'NTEXT' || tmpType === 'NCHAR' ||
			tmpType === 'XML' || tmpType === 'JSON' || tmpType === 'UUID' || tmpType === 'UNIQUEIDENTIFIER' ||
			tmpType.indexOf('CHARACTER') >= 0)
		{
			return 'String';
		}

		// Binary types
		if (tmpType.indexOf('BLOB') >= 0 || tmpType.indexOf('BINARY') >= 0 || tmpType === 'BYTEA' || tmpType === 'IMAGE')
		{
			return 'String';
		}

		// Default to String
		return 'String';
	}

	/**
	 * Map a Meadow type and native type to a Meadow schema size.
	 */
	_mapSizeToMeadow(pMeadowType, pMaxLength, pNativeType)
	{
		if (pMeadowType === 'AutoIdentity') return 'Default';
		if (pMeadowType === 'Numeric')
		{
			let tmpType = (pNativeType || '').toUpperCase();
			if (tmpType.indexOf('DECIMAL') >= 0 || tmpType.indexOf('FLOAT') >= 0 ||
				tmpType.indexOf('DOUBLE') >= 0 || tmpType.indexOf('REAL') >= 0)
			{
				return 'decimal';
			}
			return 'int';
		}
		if (pMeadowType === 'Boolean') return 'Default';
		if (pMeadowType === 'DateTime') return 'Default';
		if (pMaxLength && pMaxLength > 0) return String(pMaxLength);
		return 'Default';
	}

	// ================================================================
	// Core Introspection Logic
	// ================================================================

	/**
	 * Introspect all tables for a given connection ID and persist results.
	 */
	/**
	 * Introspector for MeadowEndpoints connections — a remote meadow REST API
	 * has no information_schema, but it publishes its full extended model as
	 * a single JSON document (per-table MeadowSchema with meadow types). The
	 * document URL comes from the connection Config:
	 *
	 *   Config.SchemaDocumentURL        (required) e.g.
	 *       https://api.example.com/docs/Extended-Schema.json
	 *   Config.SchemaDocumentTTLSeconds (optional, default 900)
	 *
	 * The document is large (megabytes), so it is cached per URL with a
	 * medium TTL and concurrent fetches are deduplicated.
	 *
	 * @param {object} pConfig - the parsed connection Config
	 * @return {{ listTables: function, describeTable: function }}
	 */
	_meadowEndpointsIntrospector(pConfig)
	{
		let tmpDocumentURL = pConfig.SchemaDocumentURL || '';
		let tmpParsedTTL = parseInt(pConfig.SchemaDocumentTTLSeconds, 10);
		let tmpTTLSeconds = Number.isFinite(tmpParsedTTL) && tmpParsedTTL >= 0 ? tmpParsedTTL : 900;
		let tmpMissingURLError = () => new Error('MeadowEndpoints introspection requires Config.SchemaDocumentURL (the remote extended-schema document, e.g. https://<api-host>/docs/Headlight-Extended.json).');

		return {
			listTables: (pProvider, fCallback) =>
			{
				if (!tmpDocumentURL) return fCallback(tmpMissingURLError());
				this._fetchSchemaDocument(tmpDocumentURL, tmpTTLSeconds,
					(pError, pDocument) =>
					{
						if (pError) return fCallback(pError);
						let tmpTables = Object.keys(pDocument.Tables || {}).sort()
							.map((pTableName) => ({ TableName: pTableName, RowCountEstimate: 0 }));
						return fCallback(null, tmpTables);
					});
			},
			describeTable: (pProvider, pTableName, fCallback) =>
			{
				if (!tmpDocumentURL) return fCallback(tmpMissingURLError());
				this._fetchSchemaDocument(tmpDocumentURL, tmpTTLSeconds,
					(pError, pDocument) =>
					{
						if (pError) return fCallback(pError);
						let tmpTable = (pDocument.Tables || {})[pTableName];
						let tmpMeadowSchema = tmpTable && tmpTable.MeadowSchema;
						if (!tmpMeadowSchema || !Array.isArray(tmpMeadowSchema.Schema))
						{
							return fCallback(new Error(`Table not present in the remote schema document: ${pTableName}`));
						}
						let tmpColumns = [];
						for (let i = 0; i < tmpMeadowSchema.Schema.length; i++)
						{
							let tmpEntry = tmpMeadowSchema.Schema[i];
							let tmpIsIdentity = (tmpEntry.Type === 'AutoIdentity');
							tmpColumns.push(
							{
								Name: tmpEntry.Column,
								// The document already speaks meadow types — surface the
								// type in both slots so downstream consumers agree.
								NativeType: tmpEntry.Type,
								MaxLength: (tmpEntry.Size && tmpEntry.Size !== 'Default') ? tmpEntry.Size : null,
								Nullable: !tmpIsIdentity,
								IsPrimaryKey: tmpIsIdentity,
								IsAutoIncrement: tmpIsIdentity,
								DefaultValue: null,
								MeadowType: tmpEntry.Type
							});
						}
						return fCallback(null, tmpColumns);
					});
			}
		};
	}

	/**
	 * Fetch (and cache) a remote schema document. Cache is per URL with a TTL;
	 * concurrent requests for the same URL share one in-flight fetch.
	 *
	 * @param {string} pURL
	 * @param {number} pTTLSeconds
	 * @param {function} fCallback - function(pError, pDocument)
	 */
	_fetchSchemaDocument(pURL, pTTLSeconds, fCallback)
	{
		if (!this._SchemaDocumentCache)
		{
			this._SchemaDocumentCache = {};
		}
		let tmpEntry = this._SchemaDocumentCache[pURL];
		let tmpNowMs = Date.now();
		if (tmpEntry && tmpEntry.Document && (tmpNowMs - tmpEntry.FetchedAtMs) < (pTTLSeconds * 1000))
		{
			return fCallback(null, tmpEntry.Document);
		}
		if (tmpEntry && tmpEntry.PendingCallbacks)
		{
			tmpEntry.PendingCallbacks.push(fCallback);
			return;
		}
		tmpEntry = this._SchemaDocumentCache[pURL] = { FetchedAtMs: 0, Document: (tmpEntry && tmpEntry.Document) || null, PendingCallbacks: [ fCallback ] };

		let fSettle = (pError, pDocument) =>
		{
			let tmpCallbacks = tmpEntry.PendingCallbacks || [];
			tmpEntry.PendingCallbacks = null;
			if (!pError)
			{
				tmpEntry.Document = pDocument;
				tmpEntry.FetchedAtMs = Date.now();
			}
			for (let i = 0; i < tmpCallbacks.length; i++)
			{
				tmpCallbacks[i](pError, pDocument || tmpEntry.Document);
			}
		};

		let tmpLib;
		let tmpParsedURL;
		try
		{
			tmpParsedURL = new URL(pURL);
			tmpLib = (tmpParsedURL.protocol === 'https:') ? require('https') : require('http');
		}
		catch (pURLError)
		{
			return fSettle(new Error(`Invalid SchemaDocumentURL: ${pURL}`));
		}
		this.log.info(`SchemaIntrospector: fetching remote schema document ${pURL} (TTL ${pTTLSeconds}s)...`);
		let tmpRequest = tmpLib.get(pURL, (pResponse) =>
		{
			if (pResponse.statusCode >= 400)
			{
				pResponse.resume();
				return fSettle(new Error(`Schema document fetch failed: HTTP ${pResponse.statusCode} for ${pURL}`));
			}
			let tmpChunks = [];
			pResponse.on('data', (pChunk) => { tmpChunks.push(pChunk); });
			pResponse.on('end', () =>
			{
				try
				{
					let tmpDocument = JSON.parse(Buffer.concat(tmpChunks).toString('utf8'));
					// Two published shapes: the bare extended document
					// ({ Tables: {...} }, e.g. Headlight-Extended.json) and
					// retold-data-service's GET /1.0/Retold/Model/:Name
					// envelope ({ ..., Model: { Tables: {...} } }). Normalize
					// before caching so the introspector reads one shape.
					if (!tmpDocument.Tables && tmpDocument.Model && tmpDocument.Model.Tables)
					{
						tmpDocument = { Tables: tmpDocument.Model.Tables };
					}
					this.log.info(`SchemaIntrospector: schema document loaded (${Object.keys(tmpDocument.Tables || {}).length} tables).`);
					return fSettle(null, tmpDocument);
				}
				catch (pParseError)
				{
					return fSettle(new Error(`Schema document is not valid JSON: ${pParseError.message}`));
				}
			});
			pResponse.on('error', (pStreamError) => fSettle(pStreamError));
		});
		tmpRequest.on('error', (pRequestError) => fSettle(pRequestError));
		tmpRequest.setTimeout(60000, () => { tmpRequest.destroy(new Error(`Schema document fetch timed out: ${pURL}`)); });
	}

	/**
	 * Resolve the live provider + dialect introspector for a connection.
	 * Shared prelude for both full-database and single-table introspection.
	 *
	 * @param {number} pIDBeaconConnection
	 * @param {function} fCallback - function(pError, { Type, Introspector, Provider, ConnectionRecord })
	 */
	_resolveIntrospectionContext(pIDBeaconConnection, fCallback)
	{
		let tmpConnectionBridge = this.fable.DataBeaconConnectionBridge;

		if (!tmpConnectionBridge || !tmpConnectionBridge.isConnected(pIDBeaconConnection))
		{
			return fCallback(new Error('Connection is not live. Connect first.'));
		}

		// Load the connection record to get the type
		let tmpReadQuery = this.fable.DAL.BeaconConnection.query.clone()
			.addFilter('IDBeaconConnection', pIDBeaconConnection);

		this.fable.DAL.BeaconConnection.doRead(tmpReadQuery,
			(pReadError, pReadQuery, pConnectionRecord) =>
			{
				if (pReadError || !pConnectionRecord || !pConnectionRecord.IDBeaconConnection)
				{
					return fCallback(new Error('Connection record not found'));
				}

				let tmpType = pConnectionRecord.Type;
				// Oracle: an optional Owner/Schema in the connection Config scopes
				// introspection to another schema's tables (ALL_* views) instead of
				// only the connecting user's own tables (USER_*).
				// MeadowEndpoints: the whole parsed Config rides through — the
				// introspector reads SchemaDocumentURL (+ TTL) from it.
				let tmpOwner = '';
				if (tmpType === 'Oracle' || tmpType === 'MeadowEndpoints')
				{
					try
					{
						let tmpConfig = JSON.parse(pConnectionRecord.Config || '{}');
						tmpOwner = (tmpType === 'MeadowEndpoints')
							? tmpConfig
							: (tmpConfig.Owner || tmpConfig.owner || tmpConfig.Schema || tmpConfig.schema || '');
					}
					catch (pParseError) { /* no/invalid Config — type-specific fallbacks apply */ }
				}
				let tmpIntrospector = this._getIntrospector(tmpType, tmpOwner);

				if (!tmpIntrospector)
				{
					return fCallback(new Error(`Introspection not supported for type: ${tmpType}`));
				}

				let tmpProvider = tmpConnectionBridge.getConnectionInstance(pIDBeaconConnection);

				if (!tmpProvider)
				{
					return fCallback(new Error('Could not get connection provider instance'));
				}

				return fCallback(null,
				{
					Type: tmpType,
					Introspector: tmpIntrospector,
					Provider: tmpProvider,
					ConnectionRecord: pConnectionRecord
				});
			});
	}

	/**
	 * Introspect all tables for a given connection ID and persist results.
	 */
	introspect(pIDBeaconConnection, fCallback)
	{
		this._resolveIntrospectionContext(pIDBeaconConnection,
			(pContextError, pContext) =>
			{
				if (pContextError)
				{
					return fCallback(pContextError);
				}

				this.fable.log.info(`Introspecting ${pContext.Type} connection "${pContext.ConnectionRecord.Name}"...`);

				pContext.Introspector.listTables(pContext.Provider,
					(pListError, pTables) =>
					{
						if (pListError)
						{
							return fCallback(pListError);
						}

						this.fable.log.info(`Found ${pTables.length} table(s). Describing columns...`);

						let tmpAnticipate = this.fable.newAnticipate();
						let tmpResults = [];

						for (let i = 0; i < pTables.length; i++)
						{
							let tmpTableInfo = pTables[i];
							tmpAnticipate.anticipate(
								(fStepCallback) =>
								{
									pContext.Introspector.describeTable(pContext.Provider, tmpTableInfo.TableName,
										(pDescError, pColumns) =>
										{
											if (pDescError)
											{
												this.fable.log.warn(`Error describing table ${tmpTableInfo.TableName}: ${pDescError}`);
												return fStepCallback();
											}

											tmpResults.push(
											{
												TableName: tmpTableInfo.TableName,
												RowCountEstimate: tmpTableInfo.RowCountEstimate || 0,
												Columns: pColumns
											});
											return fStepCallback();
										});
								});
						}

						tmpAnticipate.wait(
							(pWaitError) =>
							{
								if (pWaitError)
								{
									return fCallback(pWaitError);
								}

								// Persist results to IntrospectedTable
								this._persistIntrospectionResults(pIDBeaconConnection, tmpResults,
									(pPersistError) =>
									{
										if (pPersistError)
										{
											return fCallback(pPersistError);
										}
										return fCallback(null, tmpResults);
									});
							});
					});
			});
	}

	/**
	 * Introspect a SINGLE named table and persist just that table's
	 * definition. O(1) regardless of how many tables the connection holds —
	 * used by the per-table enable-endpoint flow so a freshly-created table
	 * can be registered without re-enumerating (and re-persisting) the whole
	 * database. The IntrospectedTable cache is additive/upsert, so scoping to
	 * one table leaves every other table's cached entry intact.
	 *
	 * @param {number} pIDBeaconConnection
	 * @param {string} pTableName
	 * @param {function} fCallback - function(pError, pResults) — pResults is a
	 *   one-element array in the same shape introspect() returns.
	 */
	introspectTable(pIDBeaconConnection, pTableName, fCallback)
	{
		if (!pTableName)
		{
			return fCallback(new Error('introspectTable: a table name is required.'));
		}

		this._resolveIntrospectionContext(pIDBeaconConnection,
			(pContextError, pContext) =>
			{
				if (pContextError)
				{
					return fCallback(pContextError);
				}

				this.fable.log.info(`Introspecting ${pContext.Type} table "${pTableName}" (single-table)...`);

				pContext.Introspector.describeTable(pContext.Provider, pTableName,
					(pDescError, pColumns) =>
					{
						if (pDescError)
						{
							return fCallback(pDescError);
						}
						if (!pColumns || pColumns.length === 0)
						{
							return fCallback(new Error(`introspectTable: table "${pTableName}" was not found (no columns).`));
						}

						let tmpResults =
						[
							{
								TableName: pTableName,
								RowCountEstimate: 0,
								Columns: pColumns
							}
						];

						this._persistIntrospectionResults(pIDBeaconConnection, tmpResults,
							(pPersistError) =>
							{
								if (pPersistError)
								{
									return fCallback(pPersistError);
								}
								return fCallback(null, tmpResults);
							});
					});
			});
	}

	/**
	 * Persist introspection results to the IntrospectedTable DAL entity.
	 * Upserts: updates existing records, creates new ones.
	 */
	_persistIntrospectionResults(pIDBeaconConnection, pResults, fCallback)
	{
		if (!this.fable.DAL || !this.fable.DAL.IntrospectedTable)
		{
			return fCallback(new Error('IntrospectedTable DAL not initialized'));
		}

		let tmpAnticipate = this.fable.newAnticipate();
		let tmpNow = new Date().toISOString();

		for (let i = 0; i < pResults.length; i++)
		{
			let tmpResult = pResults[i];

			tmpAnticipate.anticipate(
				(fStepCallback) =>
				{
					// Check if a record already exists for this connection+table
					let tmpFindQuery = this.fable.DAL.IntrospectedTable.query.clone()
						.addFilter('IDBeaconConnection', pIDBeaconConnection)
						.addFilter('TableName', tmpResult.TableName)
						.addFilter('Deleted', 0);

					this.fable.DAL.IntrospectedTable.doReads(tmpFindQuery,
						(pFindError, pFindQuery, pExisting) =>
						{
							if (pExisting && pExisting.length > 0)
							{
								// Update existing record
								let tmpRecord = pExisting[0];
								tmpRecord.ColumnDefinitions = JSON.stringify(tmpResult.Columns);
								tmpRecord.LastIntrospectedDate = tmpNow;
								tmpRecord.RowCountEstimate = tmpResult.RowCountEstimate || 0;

								let tmpUpdateQuery = this.fable.DAL.IntrospectedTable.query.clone()
									.addRecord(tmpRecord);

								this.fable.DAL.IntrospectedTable.doUpdate(tmpUpdateQuery,
									(pError) =>
									{
										if (pError) this.fable.log.warn(`Error updating IntrospectedTable for ${tmpResult.TableName}: ${pError}`);
										return setImmediate(fStepCallback);
									});
							}
							else
							{
								// Create new record
								let tmpNewRecord =
								{
									IDBeaconConnection: pIDBeaconConnection,
									DatabaseName: '',
									TableName: tmpResult.TableName,
									ColumnDefinitions: JSON.stringify(tmpResult.Columns),
									LastIntrospectedDate: tmpNow,
									EndpointsEnabled: 0,
									RowCountEstimate: tmpResult.RowCountEstimate || 0
								};

								let tmpCreateQuery = this.fable.DAL.IntrospectedTable.query.clone()
									.setIDUser(0)
									.addRecord(tmpNewRecord);

								this.fable.DAL.IntrospectedTable.doCreate(tmpCreateQuery,
									(pError) =>
									{
										if (pError) this.fable.log.warn(`Error creating IntrospectedTable for ${tmpResult.TableName}: ${pError}`);
										return setImmediate(fStepCallback);
									});
							}
						});
				});
		}

		tmpAnticipate.wait(fCallback);
	}

	/**
	 * Execute a read-only query against an external database connection.
	 *
	 * Two call shapes:
	 *   executeQuery(pID, pSQL, fCallback)            — no parameters
	 *   executeQuery(pID, pSQL, pParams, fCallback)   — parameterized SQL
	 *
	 * pParams is a positional array. Dialect-specific placeholders in the
	 * SQL string ($1 / ? / @p1) are filled with the array's values in
	 * driver-native fashion. Used by paged JOIN keyset pagination.
	 */
	executeQuery(pIDBeaconConnection, pSQL, pParams, fCallback)
	{
		// Back-compat: 3-arg form (pParams omitted) — pParams is the callback.
		if (typeof pParams === 'function' && fCallback === undefined)
		{
			fCallback = pParams;
			pParams = [];
		}
		if (!Array.isArray(pParams)) { pParams = []; }

		let tmpConnectionBridge = this.fable.DataBeaconConnectionBridge;

		if (!tmpConnectionBridge || !tmpConnectionBridge.isConnected(pIDBeaconConnection))
		{
			return fCallback(new Error('Connection is not live.'));
		}

		// Resolve the connection record before we can decide whether the
		// SELECT-only gate applies — it only applies to SQL driver types.
		let tmpReadQuery = this.fable.DAL.BeaconConnection.query.clone()
			.addFilter('IDBeaconConnection', pIDBeaconConnection);

		this.fable.DAL.BeaconConnection.doRead(tmpReadQuery,
			(pReadError, pReadQuery, pConnectionRecord) =>
			{
				if (pReadError || !pConnectionRecord)
				{
					return fCallback(new Error('Connection record not found'));
				}

				let tmpType = pConnectionRecord.Type;

				// Safety: only allow SELECT statements for SQL drivers.
				// Non-SQL drivers (MongoDB / Solr / RocksDB) receive a JSON
				// descriptor whose shape is validated downstream.
				if (_SQLTypes[tmpType])
				{
					let tmpTrimmed = (pSQL || '').trim().toUpperCase();
					if (!tmpTrimmed.startsWith('SELECT'))
					{
						return fCallback(new Error('Only SELECT queries are allowed.'));
					}
				}

				let tmpProvider = tmpConnectionBridge.getConnectionInstance(pIDBeaconConnection);

				if (!tmpProvider)
				{
					return fCallback(new Error('Could not get connection provider instance'));
				}

				this._runQuery(tmpType, tmpProvider, pSQL, pParams, fCallback);
			});
	}

	_runQuery(pType, pProvider, pSQL, pParams, fCallback)
	{
		// Back-compat: 4-arg form (pParams omitted).
		if (typeof pParams === 'function' && fCallback === undefined)
		{
			fCallback = pParams;
			pParams = [];
		}
		if (!Array.isArray(pParams)) { pParams = []; }
		let tmpHasParams = pParams.length > 0;

		switch (pType)
		{
			case 'MySQL':
			{
				let tmpPool = pProvider.pool || pProvider;
				if (!tmpPool || typeof tmpPool.query !== 'function')
				{
					return fCallback(new Error('MySQL provider not connected.'));
				}
				let fHandle = (pError, pResults) =>
				{
					if (pError) return fCallback(pError);
					return fCallback(null, pResults);
				};
				if (tmpHasParams)
				{
					tmpPool.query(pSQL, pParams, fHandle);
				}
				else
				{
					tmpPool.query(pSQL, fHandle);
				}
				break;
			}
			case 'PostgreSQL':
			{
				let tmpPool = pProvider.pool || pProvider;
				if (!tmpPool || typeof tmpPool.query !== 'function')
				{
					return fCallback(new Error('PostgreSQL provider not connected.'));
				}
				let fHandle = (pError, pData) =>
				{
					if (pError) return fCallback(pError);
					return fCallback(null, (pData && pData.rows) || pData || []);
				};
				let tmpResult = tmpHasParams
					? tmpPool.query(pSQL, pParams, fHandle)
					: tmpPool.query(pSQL, fHandle);
				// node-postgres' Pool.query may return a Promise on newer
				// versions when no callback is supplied — defensive support.
				if (tmpResult && typeof tmpResult.then === 'function' && typeof tmpResult.catch === 'function')
				{
					this._adoptPromise(tmpResult, (pData) => (pData && pData.rows) || pData || [], fCallback);
				}
				break;
			}
			case 'SQLite':
			{
				try
				{
					let tmpDB = pProvider.db || pProvider;
					if (!tmpDB || typeof tmpDB.prepare !== 'function')
					{
						return fCallback(new Error('SQLite provider not connected.'));
					}
					let tmpStmt = tmpDB.prepare(pSQL);
					let tmpRows = tmpHasParams ? tmpStmt.all(...pParams) : tmpStmt.all();
					return fCallback(null, tmpRows);
				}
				catch (pError)
				{
					return fCallback(pError);
				}
				break;
			}
			case 'MSSQL':
			{
				try
				{
					// node-mssql exposes a ConnectionPool with .request() that
					// returns a Request whose .query(sql) returns a Promise
					// resolving to { recordset, recordsets, rowsAffected, ... }.
					// Older versions also supported a callback variant — match
					// the SchemaIntrospector's existing dual-style for safety.
					let tmpPool = pProvider.pool || pProvider;
					if (!tmpPool || typeof tmpPool.request !== 'function')
					{
						return fCallback(new Error('MSSQL provider not connected.'));
					}
					let tmpRequest = tmpPool.request();
					// Bind positional params as @p1, @p2, ... matching the
					// placeholders our emitters generate.
					for (let i = 0; i < pParams.length; i++)
					{
						tmpRequest.input('p' + (i + 1), pParams[i]);
					}
					let tmpResult = tmpRequest.query(pSQL);
					if (tmpResult && typeof tmpResult.then === 'function')
					{
						this._adoptPromise(tmpResult, (pData) => (pData && pData.recordset) || [], fCallback);
					}
					else
					{
						return fCallback(null, (tmpResult && tmpResult.recordset) || []);
					}
				}
				catch (pError)
				{
					return fCallback(pError);
				}
				break;
			}
			case 'MongoDB':
				return this._runMongoQuery(pProvider, pSQL, fCallback);
			case 'Solr':
				return this._runSolrQuery(pProvider, pSQL, fCallback);
			case 'RocksDB':
				return this._runRocksDBQuery(pProvider, pSQL, fCallback);
			case 'RetoldDataBeacon':
				return this._runRetoldDataBeaconQuery(pProvider, pSQL, fCallback);
			case 'Oracle':
				return this._oracleExec(pProvider, pSQL, pParams, fCallback);
			default:
				return fCallback(new Error(`Query execution not supported for type: ${pType}`));
		}
	}

	/**
	 * Raw SQL via a RetoldDataBeacon connection: dispatches
	 * `DataBeaconAccess:QueryTable` through ultravisor to the remote beacon,
	 * which in turn runs the SQL against its connected database.
	 *
	 * @param {object} pProvider - The MeadowConnectionRetoldDataBeacon instance
	 * @param {string} pSQL - SQL statement (typically SELECT-only; writes are
	 *                        gated on the remote side by its own safety rules)
	 * @param {function} fCallback - function(pError, pRows)
	 */
	_runRetoldDataBeaconQuery(pProvider, pSQL, fCallback)
	{
		if (!pProvider || typeof pProvider._dispatchAction !== 'function')
		{
			return fCallback(new Error('RetoldDataBeacon provider is not available or not connected.'));
		}
		// The remote beacon's BeaconConnection ID for the customer DB is stored
		// on the provider as IDBeaconConnection (or defaults to 1 via
		// _defaultConnectionID()).
		let tmpRemoteID = pProvider._defaultConnectionID();
		pProvider._dispatchAction('DataBeaconAccess', 'QueryTable',
			{ IDBeaconConnection: tmpRemoteID, SQL: pSQL },
			(pError, pResult) =>
			{
				if (pError) { return fCallback(pError); }
				let tmpRows = (pResult && pResult.Rows) || [];
				return fCallback(null, tmpRows);
			});
	}

	/**
	 * Parse a JSON descriptor with a reject-clearly-on-error contract.
	 * @returns {[Object, null] | [null, Error]}
	 */
	_parseJSONDescriptor(pInput, pDriverName)
	{
		if (pInput && typeof pInput === 'object') return [pInput, null];
		let tmpTrimmed = (pInput || '').toString().trim();
		if (tmpTrimmed.length === 0) return [null, new Error(`Empty ${pDriverName} query — expected a JSON descriptor.`)];
		try
		{
			let tmpParsed = JSON.parse(tmpTrimmed);
			if (!tmpParsed || typeof tmpParsed !== 'object' || Array.isArray(tmpParsed))
			{
				return [null, new Error(`${pDriverName} query must be a JSON object.`)];
			}
			return [tmpParsed, null];
		}
		catch (pError)
		{
			return [null, new Error(`${pDriverName} query is not valid JSON: ${pError.message}`)];
		}
	}

	/**
	 * MongoDB dispatcher — supports three op shapes:
	 *
	 *   { "op": "find",       "collection": "users", "filter": {...}, "projection": {...}, "sort": {...}, "skip": 0, "limit": 50 }
	 *   { "op": "aggregate",  "collection": "users", "pipeline": [...], "options": {...} }
	 *   { "op": "runCommand", "command": { "distinct": "users", "key": "country" } }
	 *
	 * find + aggregate return `cursor.toArray()`. runCommand returns the
	 * command's `.cursor.firstBatch` when present, otherwise a single-row
	 * wrapper so the results table + exporters still see Array<Object>.
	 */
	_runMongoQuery(pProvider, pInput, fCallback)
	{
		let tmpPool = pProvider.pool || pProvider;
		if (!tmpPool || typeof tmpPool.collection !== 'function' || typeof tmpPool.command !== 'function')
		{
			return fCallback(new Error('MongoDB provider not connected.'));
		}
		let tmpParsed = this._parseJSONDescriptor(pInput, 'MongoDB');
		if (tmpParsed[1]) return fCallback(tmpParsed[1]);
		let tmpDescriptor = tmpParsed[0];
		let tmpOp = tmpDescriptor.op || tmpDescriptor.Op;

		try
		{
			if (tmpOp === 'find')
			{
				let tmpCollection = tmpDescriptor.collection || tmpDescriptor.Collection;
				if (!tmpCollection) return fCallback(new Error('MongoDB find: "collection" is required.'));
				let tmpCursor = tmpPool.collection(tmpCollection).find(
					tmpDescriptor.filter || tmpDescriptor.Filter || {},
					tmpDescriptor.projection ? { projection: tmpDescriptor.projection } : undefined
				);
				if (tmpDescriptor.sort) tmpCursor = tmpCursor.sort(tmpDescriptor.sort);
				if (typeof tmpDescriptor.skip === 'number') tmpCursor = tmpCursor.skip(tmpDescriptor.skip);
				if (typeof tmpDescriptor.limit === 'number') tmpCursor = tmpCursor.limit(tmpDescriptor.limit);
				return this._adoptPromise(tmpCursor.toArray(), (pRows) => pRows || [], fCallback);
			}
			if (tmpOp === 'aggregate')
			{
				let tmpCollection = tmpDescriptor.collection || tmpDescriptor.Collection;
				if (!tmpCollection) return fCallback(new Error('MongoDB aggregate: "collection" is required.'));
				let tmpPipeline = tmpDescriptor.pipeline || tmpDescriptor.Pipeline;
				if (!Array.isArray(tmpPipeline)) return fCallback(new Error('MongoDB aggregate: "pipeline" must be an array.'));
				let tmpCursor = tmpPool.collection(tmpCollection).aggregate(tmpPipeline, tmpDescriptor.options || undefined);
				return this._adoptPromise(tmpCursor.toArray(), (pRows) => pRows || [], fCallback);
			}
			if (tmpOp === 'runCommand')
			{
				let tmpCommand = tmpDescriptor.command || tmpDescriptor.Command;
				if (!tmpCommand || typeof tmpCommand !== 'object')
				{
					return fCallback(new Error('MongoDB runCommand: "command" must be a JSON object.'));
				}
				return this._adoptPromise(
					tmpPool.command(tmpCommand),
					(pResult) =>
					{
						if (!pResult) return [];
						// Command-cursor responses (aggregate-style commands).
						if (pResult.cursor && Array.isArray(pResult.cursor.firstBatch)) return pResult.cursor.firstBatch;
						// distinct / map of { values: [...] }.
						if (Array.isArray(pResult.values)) return pResult.values.map((v) => ({ Value: v }));
						// Generic command — wrap so the results panel stays tabular.
						return [pResult];
					},
					fCallback);
			}
			return fCallback(new Error(`MongoDB: unknown "op" [${tmpOp}] — expected "find", "aggregate", or "runCommand".`));
		}
		catch (pError)
		{
			return fCallback(pError);
		}
	}

	/**
	 * Solr dispatcher — accepts either a bare query string (treated as the
	 * `q=` parameter) or a JSON object with `q`, `fq`, `rows`, `start`,
	 * `sort`, `fl`. Returns `response.docs` from the Solr response.
	 */
	_runSolrQuery(pProvider, pInput, fCallback)
	{
		let tmpPool = pProvider.pool || pProvider;
		if (!tmpPool || typeof tmpPool.search !== 'function')
		{
			return fCallback(new Error('Solr provider not connected.'));
		}
		let tmpTrimmed = (pInput || '').toString().trim();
		if (tmpTrimmed.length === 0) return fCallback(new Error('Empty Solr query — expected a query string or JSON descriptor.'));

		let tmpQueryString;
		// Try JSON first; fall back to raw string.
		if (tmpTrimmed.charAt(0) === '{')
		{
			let tmpParsed = this._parseJSONDescriptor(tmpTrimmed, 'Solr');
			if (tmpParsed[1]) return fCallback(tmpParsed[1]);
			tmpQueryString = this._solrDescriptorToQueryString(tmpParsed[0]);
		}
		else
		{
			// Raw — assume it's either "foo:bar ..." or a full query string.
			tmpQueryString = (tmpTrimmed.indexOf('=') >= 0) ? tmpTrimmed : `q=${encodeURIComponent(tmpTrimmed)}`;
		}

		let tmpCb = (pError, pResponse) =>
		{
			if (pError) return fCallback(pError);
			let tmpDocs = pResponse && pResponse.response && Array.isArray(pResponse.response.docs)
				? pResponse.response.docs
				: (Array.isArray(pResponse) ? pResponse : []);
			return fCallback(null, tmpDocs);
		};

		try
		{
			// solr-client supports both callback (`search(q, cb)`) and Promise
			// styles depending on version.
			let tmpResult = tmpPool.search(tmpQueryString, tmpCb);
			if (tmpResult && typeof tmpResult.then === 'function')
			{
				this._adoptPromise(
					tmpResult,
					(pResponse) => (pResponse && pResponse.response && Array.isArray(pResponse.response.docs))
						? pResponse.response.docs
						: (Array.isArray(pResponse) ? pResponse : []),
					fCallback);
			}
		}
		catch (pError)
		{
			return fCallback(pError);
		}
	}

	_solrDescriptorToQueryString(pDescriptor)
	{
		let tmpParts = [];
		let tmpQ = pDescriptor.q || pDescriptor.Q || '*:*';
		tmpParts.push(`q=${encodeURIComponent(tmpQ)}`);
		if (Array.isArray(pDescriptor.fq))
		{
			for (let i = 0; i < pDescriptor.fq.length; i++) tmpParts.push(`fq=${encodeURIComponent(pDescriptor.fq[i])}`);
		}
		if (typeof pDescriptor.rows === 'number') tmpParts.push(`rows=${pDescriptor.rows}`);
		if (typeof pDescriptor.start === 'number') tmpParts.push(`start=${pDescriptor.start}`);
		if (pDescriptor.sort) tmpParts.push(`sort=${encodeURIComponent(pDescriptor.sort)}`);
		if (pDescriptor.fl) tmpParts.push(`fl=${encodeURIComponent(pDescriptor.fl)}`);
		return tmpParts.join('&');
	}

	/**
	 * RocksDB dispatcher — supports two op shapes:
	 *
	 *   { "op": "get",  "key": "user/123" }
	 *   { "op": "scan", "start": "user/", "end": "user/~", "limit": 100 }
	 *
	 * RocksDB's Node bindings are LevelDOWN-compatible: `db.get(key, cb)`
	 * and `db.iterator({gte, lte, limit})` with `.next(cb)`.
	 */
	_runRocksDBQuery(pProvider, pInput, fCallback)
	{
		let tmpDB = pProvider.db || pProvider;
		if (!tmpDB || typeof tmpDB.get !== 'function' || typeof tmpDB.iterator !== 'function')
		{
			return fCallback(new Error('RocksDB provider not connected.'));
		}
		let tmpParsed = this._parseJSONDescriptor(pInput, 'RocksDB');
		if (tmpParsed[1]) return fCallback(tmpParsed[1]);
		let tmpDescriptor = tmpParsed[0];
		let tmpOp = tmpDescriptor.op || tmpDescriptor.Op;

		try
		{
			if (tmpOp === 'get')
			{
				let tmpKey = tmpDescriptor.key || tmpDescriptor.Key;
				if (tmpKey === undefined || tmpKey === null) return fCallback(new Error('RocksDB get: "key" is required.'));
				tmpDB.get(tmpKey, { asBuffer: false }, (pError, pValue) =>
				{
					if (pError && !/NotFound/i.test(pError.message || '')) return fCallback(pError);
					if (pError) return fCallback(null, []); // key not found -> empty result
					return fCallback(null, [{ Key: String(tmpKey), Value: this._coerceRocksValue(pValue) }]);
				});
				return;
			}
			if (tmpOp === 'scan')
			{
				let tmpLimit = (typeof tmpDescriptor.limit === 'number') ? tmpDescriptor.limit : 100;
				let tmpOptions = { keyAsBuffer: false, valueAsBuffer: false };
				if (tmpDescriptor.start !== undefined) tmpOptions.gte = tmpDescriptor.start;
				if (tmpDescriptor.end !== undefined) tmpOptions.lte = tmpDescriptor.end;
				if (typeof tmpDescriptor.limit === 'number') tmpOptions.limit = tmpLimit;
				let tmpIterator = tmpDB.iterator(tmpOptions);
				let tmpRows = [];
				let fStep = () =>
				{
					tmpIterator.next((pError, pKey, pValue) =>
					{
						if (pError)
						{
							return tmpIterator.end(() => fCallback(pError));
						}
						if (pKey === undefined)
						{
							return tmpIterator.end((pEndError) => fCallback(pEndError || null, tmpRows));
						}
						tmpRows.push({ Key: String(pKey), Value: this._coerceRocksValue(pValue) });
						if (tmpRows.length >= tmpLimit)
						{
							return tmpIterator.end((pEndError) => fCallback(pEndError || null, tmpRows));
						}
						return fStep();
					});
				};
				fStep();
				return;
			}
			return fCallback(new Error(`RocksDB: unknown "op" [${tmpOp}] — expected "get" or "scan".`));
		}
		catch (pError)
		{
			return fCallback(pError);
		}
	}

	/**
	 * RocksDB returns Buffers for values. Convert to a printable string;
	 * if the bytes are valid UTF-8 we use that, else fall back to hex.
	 */
	_coerceRocksValue(pValue)
	{
		if (pValue === null || pValue === undefined) return null;
		if (typeof pValue === 'string') return pValue;
		if (typeof Buffer !== 'undefined' && Buffer.isBuffer(pValue))
		{
			let tmpUtf8 = pValue.toString('utf8');
			// Heuristic: if round-tripping yields the same bytes, it's UTF-8.
			if (Buffer.from(tmpUtf8, 'utf8').equals(pValue)) return tmpUtf8;
			return pValue.toString('hex');
		}
		return String(pValue);
	}

	/**
	 * Adapt a Promise-returning query into the (err, rows) callback shape
	 * used throughout this service. Idempotent — guards against double-fire
	 * when a driver also accepts a callback alongside the Promise.
	 */
	_adoptPromise(pPromise, fExtractRows, fCallback)
	{
		let tmpDelivered = false;
		let tmpDeliver = (pError, pRows) =>
		{
			if (tmpDelivered) return;
			tmpDelivered = true;
			return fCallback(pError, pRows);
		};
		pPromise.then(
			(pData) => tmpDeliver(null, fExtractRows(pData)),
			(pError) => tmpDeliver(pError));
	}

	// ================================================================
	// REST Routes
	// ================================================================

	connectRoutes(pOratorServiceServer)
	{
		let tmpRoutePrefix = this.options.RoutePrefix;

		// POST /beacon/connection/:id/introspect -- introspect all tables
		pOratorServiceServer.doPost(`${tmpRoutePrefix}/connection/:id/introspect`,
			(pRequest, pResponse, fNext) =>
			{
				let tmpID = parseInt(pRequest.params.id, 10);

				this.introspect(tmpID,
					(pError, pResults) =>
					{
						if (pError)
						{
							pResponse.send({ Success: false, Error: pError.message || pError });
							return fNext();
						}

						pResponse.send(
						{
							Success: true,
							TableCount: pResults.length,
							Tables: pResults.map((pR) => ({ TableName: pR.TableName, ColumnCount: pR.Columns.length, RowCountEstimate: pR.RowCountEstimate }))
						});
						return fNext();
					});
			});

		// GET /beacon/connection/:id/tables -- list cached introspected tables
		pOratorServiceServer.doGet(`${tmpRoutePrefix}/connection/:id/tables`,
			(pRequest, pResponse, fNext) =>
			{
				if (!this.fable.DAL || !this.fable.DAL.IntrospectedTable)
				{
					pResponse.send({ Tables: [] });
					return fNext();
				}

				let tmpID = parseInt(pRequest.params.id, 10);

				let tmpQuery = this.fable.DAL.IntrospectedTable.query.clone()
					.addFilter('IDBeaconConnection', tmpID)
					.addFilter('Deleted', 0);

				this.fable.DAL.IntrospectedTable.doReads(tmpQuery,
					(pError, pQuery, pRecords) =>
					{
						if (pError)
						{
							pResponse.send({ Error: pError.message || pError, Tables: [] });
							return fNext();
						}

						let tmpTables = [];
						for (let i = 0; i < pRecords.length; i++)
						{
							let tmpRec = pRecords[i];
							let tmpCols = [];
							try { tmpCols = JSON.parse(tmpRec.ColumnDefinitions || '[]'); }
							catch (e) { /* ignore */ }

							tmpTables.push(
							{
								IDIntrospectedTable: tmpRec.IDIntrospectedTable,
								TableName: tmpRec.TableName,
								ColumnCount: tmpCols.length,
								RowCountEstimate: tmpRec.RowCountEstimate,
								EndpointsEnabled: !!tmpRec.EndpointsEnabled,
								LastIntrospectedDate: tmpRec.LastIntrospectedDate
							});
						}

						pResponse.send({ Count: tmpTables.length, Tables: tmpTables });
						return fNext();
					});
			});

		// GET /beacon/connection/:id/table/:tableName -- get column details
		pOratorServiceServer.doGet(`${tmpRoutePrefix}/connection/:id/table/:tableName`,
			(pRequest, pResponse, fNext) =>
			{
				if (!this.fable.DAL || !this.fable.DAL.IntrospectedTable)
				{
					pResponse.send({ Error: 'IntrospectedTable DAL not initialized' });
					return fNext();
				}

				let tmpID = parseInt(pRequest.params.id, 10);
				let tmpTableName = pRequest.params.tableName;

				let tmpQuery = this.fable.DAL.IntrospectedTable.query.clone()
					.addFilter('IDBeaconConnection', tmpID)
					.addFilter('TableName', tmpTableName)
					.addFilter('Deleted', 0);

				this.fable.DAL.IntrospectedTable.doReads(tmpQuery,
					(pError, pQuery, pRecords) =>
					{
						if (pError || !pRecords || pRecords.length === 0)
						{
							pResponse.send({ Error: 'Table not found' });
							return fNext();
						}

						let tmpRec = pRecords[0];
						let tmpCols = [];
						try { tmpCols = JSON.parse(tmpRec.ColumnDefinitions || '[]'); }
						catch (e) { /* ignore */ }

						pResponse.send(
						{
							IDIntrospectedTable: tmpRec.IDIntrospectedTable,
							TableName: tmpRec.TableName,
							Columns: tmpCols,
							RowCountEstimate: tmpRec.RowCountEstimate,
							EndpointsEnabled: !!tmpRec.EndpointsEnabled,
							LastIntrospectedDate: tmpRec.LastIntrospectedDate
						});
						return fNext();
					});
			});

		// POST /beacon/connection/:id/query -- execute a read-only query
		pOratorServiceServer.doPost(`${tmpRoutePrefix}/connection/:id/query`,
			(pRequest, pResponse, fNext) =>
			{
				let tmpID = parseInt(pRequest.params.id, 10);
				let tmpBody = pRequest.body || {};
				let tmpSQL = tmpBody.SQL || tmpBody.sql || '';

				if (!tmpSQL)
				{
					pResponse.send({ Error: 'SQL is required' });
					return fNext();
				}

				this.executeQuery(tmpID, tmpSQL,
					(pError, pResults) =>
					{
						if (pError)
						{
							pResponse.send({ Success: false, Error: pError.message || pError });
							return fNext();
						}

						pResponse.send(
						{
							Success: true,
							RowCount: Array.isArray(pResults) ? pResults.length : 0,
							Rows: pResults
						});
						return fNext();
					});
			});

		this.fable.log.info(`DataBeacon SchemaIntrospector routes connected at ${tmpRoutePrefix}/connection/:id/introspect, tables, query`);
	}
}

module.exports = DataBeaconSchemaIntrospector;
module.exports.serviceType = 'DataBeaconSchemaIntrospector';
module.exports.default_configuration = defaultSchemaIntrospectorOptions;
