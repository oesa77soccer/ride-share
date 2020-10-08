const { knex, Model } = require("../db");

class Driver extends Model {
	static get tableName() {
		return 'Driver';
	}

	static get relationMappings() {
		return {
			drivers: {
				relation: Model.HasManyRelation,
				modelClass: Drivers,
				join: {
					from: 'driver.id',
					to: 'Model.drivers.driverId'
				}
			},
			authorizations: {
				relation: Model.HasManyRelation,
				modelClass: Authorization,
				join: {
					from: 'driver.id',
					to: 'Model.authorization.driverId'
				}
			}
		}
	}	
}
