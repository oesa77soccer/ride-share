const { knex, Model } = require("../db");

class Vehicle extends Model {
	static get tableName() {
		return 'Vehicle';
	}

	static get relationMappings() {
        const Authorization = require('./Authorization');
        const Ride = require('./Ride');
		return {
		    Authorizations: {
				relation: Model.HasManyRelation,
				modelClass: Authorization,
				join: {
					from: "Vehicle.id",
					to: 'Authorization.vehicleId'
				}
			},

			Rides: {
				relation: Model.HasManyRelation,
				modelClass: Ride,
				join: {
					from: 'Vehicle.id',
					to: 'Ride.vehicleId'
				}
			}
		}
	}
}

module.exports = Vehicle;
