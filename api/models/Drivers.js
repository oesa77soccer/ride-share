const { knex, Model } = require("../db");

class Drivers extends Model {
	static get tableName() {
		return 'Drivers';
    }
    
    static get relationMappings() {
        const Ride = require('Ride');
        const Driver = require('Driver');
		return {
			driver: {
				relation: Model.BelongsToOneRelation,
				modelClass: Driver,
				join: {
					from: 'drivers.driverId',
					to: 'driver.id'
				}
            },
            ride: {
                relation: Model.BelongsToOneRelation,
                modelClass: Ride,
                join: {
                    from: 'drivers.rideId',
                    to: 'ride.id'
                }
            }
        }
    }
}
module.exports = Drivers;
