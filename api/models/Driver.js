const { knex, Model } = require("../db");

class Driver extends Model {
	static get tableName() {
		return 'Driver';
	}

	static get relationMappings() {
		const Drivers = require('./Drivers');
		const Authorization = require('./Authorization');
		return {
			Drivers: {
				relation: Model.HasManyRelation,
				modelClass: Drivers,
				join: {
					from: 'Driver.id',
					to: 'Drivers.driverId'
				}
			},
			Authorizations: {
				relation: Model.HasManyRelation,
				modelClass: Authorization,
				join: {
					from: 'Driver.id',
					to: 'Authorization.driverId'
				}
			}
		}
	}	
}

module.exports = Driver;
