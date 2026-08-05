/**
* Unit tests for the meadow schema the DynamicEndpointManager synthesizes from
* introspected columns — specifically which column it nominates as the identity.
*
* meadow stamps DefaultIdentifier onto every query and the foxhound dialects
* order capped reads by it, so nominating a non-unique column silently
* reintroduces LIMIT/OFFSET row loss.
*
* @license MIT
*/

const Chai = require('chai');
const Expect = Chai.expect;

const libFable = require('fable');
const libSchemaIntrospector = require('../source/services/DataBeacon-SchemaIntrospector.js');
const libDynamicEndpointManager = require('../source/services/DataBeacon-DynamicEndpointManager.js');

const _FableConfig = (
	{
		Product: 'DataBeaconMeadowSchemaIdentityTests',
		LogStreams: [ { streamtype: 'console', loglevel: 'error' } ]
	});

/**
* Stand up just enough of the beacon to call _buildMeadowSchema — it needs the
* introspector (for size mapping) and a logger, nothing else.
*
* @return {Object} the DynamicEndpointManager service
*/
const buildEndpointManager = function()
{
	let tmpFable = new libFable(_FableConfig);

	tmpFable.serviceManager.addServiceType('DataBeaconSchemaIntrospector', libSchemaIntrospector);
	tmpFable.DataBeaconSchemaIntrospector = tmpFable.serviceManager.instantiateServiceProvider('DataBeaconSchemaIntrospector', {});

	tmpFable.serviceManager.addServiceType('DataBeaconDynamicEndpointManager', libDynamicEndpointManager);
	return tmpFable.serviceManager.instantiateServiceProvider('DataBeaconDynamicEndpointManager', {});
};

suite
(
	'DataBeacon-MeadowSchemaIdentity',
	function()
	{
		suite
		(
			'DefaultIdentifier nomination',
			function()
			{
				test
				(
					'an auto-increment primary key is the identity',
					function()
					{
						let tmpManager = buildEndpointManager();
						let tmpPackage = tmpManager._buildMeadowSchema('Animal',
							[
								{ Name: 'IDAnimal', MeadowType: 'AutoIdentity', IsPrimaryKey: true, IsAutoIncrement: true },
								{ Name: 'Name', MeadowType: 'String', MaxLength: 64 }
							]);

						Expect(tmpPackage.DefaultIdentifier).to.equal('IDAnimal');
					}
				);

				test
				(
					'a primary key the database does not generate is still the identity',
					function()
					{
						// The private data lake ingests its own IDs, so the key is a
						// plain integer — a real identity that is not AutoIdentity.
						let tmpManager = buildEndpointManager();
						let tmpPackage = tmpManager._buildMeadowSchema('LakeTable',
							[
								{ Name: 'IDLakeTable', MeadowType: 'Numeric', IsPrimaryKey: true, IsAutoIncrement: false },
								{ Name: 'Name', MeadowType: 'String', MaxLength: 64 }
							]);

						Expect(tmpPackage.DefaultIdentifier).to.equal('IDLakeTable');

						let tmpIDEntry = tmpPackage.Schema.find((pEntry) => { return pEntry.Column === 'IDLakeTable'; });
						Expect(tmpIDEntry.Type).to.not.equal('AutoIdentity');
					}
				);

				test
				(
					'a table with no primary key nominates nothing',
					function()
					{
						// Previously this fell back to the first column, which the
						// dialects then ordered by — a non-unique sort that looks like
						// a fix and still drops rows across pages.
						let tmpManager = buildEndpointManager();
						let tmpPackage = tmpManager._buildMeadowSchema('Heap',
							[
								{ Name: 'Name', MeadowType: 'String', MaxLength: 64 },
								{ Name: 'Value', MeadowType: 'Numeric' }
							]);

						Expect(tmpPackage).to.not.have.property('DefaultIdentifier');
					}
				);

				test
				(
					'a composite primary key nominates nothing',
					function()
					{
						let tmpManager = buildEndpointManager();
						let tmpPackage = tmpManager._buildMeadowSchema('PartWholeJoin',
							[
								{ Name: 'IDPart', MeadowType: 'Numeric', IsPrimaryKey: true },
								{ Name: 'IDWhole', MeadowType: 'Numeric', IsPrimaryKey: true },
								{ Name: 'Name', MeadowType: 'String', MaxLength: 64 }
							]);

						Expect(tmpPackage).to.not.have.property('DefaultIdentifier');
					}
				);

				test
				(
					'the rest of the package is unaffected when no identity is nominated',
					function()
					{
						let tmpManager = buildEndpointManager();
						let tmpPackage = tmpManager._buildMeadowSchema('Heap',
							[
								{ Name: 'Name', MeadowType: 'String', MaxLength: 64 },
								{ Name: 'Value', MeadowType: 'Numeric' }
							]);

						Expect(tmpPackage.Scope).to.equal('Heap');
						Expect(tmpPackage.Schema).to.be.an('array').with.lengthOf(2);
						Expect(tmpPackage.DefaultObject).to.be.an('object');
						Expect(tmpPackage.JsonSchema.title).to.equal('Heap');
					}
				);
			}
		);
	}
);
