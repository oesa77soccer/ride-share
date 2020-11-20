const { knex, Model } = require("../db");

class Ride extends Model {
	static get tableName() {
		return 'Ride';
	}

	static get relationMappings() {
        const Drivers = require('./Drivers');
        const Passenger = require('./Passenger');
        const Location = require('./Location');
        const Vehicle = require('./Vehicle');
		return {
			Passengers: {
				relation: Model.HasManyRelation,
				modelClass: Passenger,
				join: {
					from: 'Ride.id',
					to: 'Passenger.rideId'
				}
			},
			Drivers: {
				relation: Model.HasManyRelation,
				modelClass: Drivers,
				join: {
					from: 'Ride.id',
					to: 'Drivers.rideId'
				}
            },
            FromLocation: {
                relation: Model.BelongsToOneRelation,
                modelClass: Location,
                join: {
                    from: 'Ride.fromLocationId',
                    to: 'Location.id'
                }
            },
            ToLocation: {
                relation: Model.BelongsToOneRelation,
                modelClass: Location,
                join: {
                    from: 'Ride.toLocationId',
                    to: 'Location.id'
                }
            },
            Vehicle: {
                relation: Model.BelongsToOneRelation,
                modelClass: Vehicle,
                join: {
                    from: 'Ride.vehicleId',
                    to: 'Vehicle.id'
                }
            }
		}
	}
}

module.exports = Ride;
