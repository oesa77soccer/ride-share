const { knex, Model } = require("../db");

class Driver extends Model {
	static get tableName() {
		return 'Driver';
	}

	static get relationMappings() {
		const Drivers = require('Drivers');
		const Authorization = require('Authorization');
		return {
			drivers: {
				relation: Model.HasManyRelation,
				modelClass: Drivers,
				join: {
					from: 'driver.id',
					to: 'drivers.driverId'
				}
			},
			authorizations: {
				relation: Model.HasManyRelation,
				modelClass: Authorization,
				join: {
					from: 'driver.id',
					to: 'authorization.driverId'
				}
			}
		}
	}	
}
module.exports = Driver;
