const { knex, Model } = require("../db");

class Ride extends Model {
	static get tableName() {
		return 'Ride';
	}

	static get relationMappings() {
        const Drivers = require('Drivers');
        const Passenger = require('Passenger');
		return {
			passengers: {
				relation: Model.HasManyRelation,
				modelClass: Passenger,
				join: {
					from: 'ride.id',
					to: 'Model.passenger.rideId'
				}
			},
			drivers: {
				relation: Model.HasManyRelation,
				modelClass: Drivers,
				join: {
					from: 'ride.id',
					to: 'Model.drivers.driverId'
				}
			}
		}
	}
}

