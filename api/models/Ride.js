const { knex, Model } = require("../db");

class Ride extends Model {
	static get tableName() {
		return 'ride';
	}

	static get relationMappings() {
		return {
			passengers: {
				relation: Model.HasManyRelation,
				modelClass: Passenger,
				join: {
					from: 'Model.ride.id',
					to: 'Model.passenger.rideId'
				}
			}
		}
	}
}

