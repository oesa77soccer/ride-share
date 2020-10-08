const { knex, Model } = require("../db");

class Vehicle extends Model {
	static get tableName() {
		return 'Vehicle';
	}

	static get relationMappings() {
		return {
			authorizations: {
				relation: Model.HasManyRelation,
				modelClass: Authorization,
				join: {
					from: "vehicle.id",
					to: 'Model.authorization.id'
				}
			},

			rides: {
				relation: Model.HasManyRelation,
				modelClass: Ride,
				join: {
					from: 'vehicle.id',
					to: 'Model.ride.vehicleId'
				}
			}
		}
	}
}

