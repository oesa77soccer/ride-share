const { knex, Model } = require("../db");

class Ride extends Model {
	static get tableName() {
		return 'ride';
	}

	static get relationMappings() {
        const Drivers = require('./Drivers');
        const Passenger = require('./Passenger');
        const Location = require('./Location');
        const Vehicle = require('./Vehicle');
		return {
			passengers: {
				relation: Model.HasManyRelation,
				modelClass: Passenger,
				join: {
					from: 'ride.id',
					to: 'passenger.rideId'
				}
			},
			drivers: {
				relation: Model.HasManyRelation,
				modelClass: Drivers,
				join: {
					from: 'ride.id',
					to: 'drivers.rideId'
				}
            },
            fromLocation: {
                relation: Model.BelongsToOneRelation,
                modelClass: Location,
                join: {
                    from: 'ride.fromLocationId',
                    to: 'location.Id'
                }
            },
            toLocation: {
                relation: Model.BelongsToOneRelation,
                modelClass: Location,
                join: {
                    from: 'ride.toLocationId',
                    to: 'location.Id'
                }
            },
            vehicle: {
                relation: Model.BelongsToOneRelation,
                modelClass: Vehicle,
                join: {
                    from: 'ride.vehicleId',
                    to: 'vehicle.Id'
                }
            }
		}
	}
}

module.exports = Ride;
