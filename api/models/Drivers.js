const { knex, Model } = require("../db");

class Drivers extends Model {
	static get tableName() {
		return 'Drivers';
    }
    
    static get relationMappings() {
        const Ride = require('./Ride');
        const Driver = require('./Driver');
		return {
			Driver: {
				relation: Model.BelongsToOneRelation,
				modelClass: Driver,
				join: {
					from: 'Drivers.driverId',
					to: 'Driver.id'
				}
            },
            Ride: {
                relation: Model.BelongsToOneRelation,
                modelClass: Ride,
                join: {
                    from: 'Drivers.rideId',
                    to: 'Ride.id'
                }
            }
        }
    }
}

module.exports = Drivers;
