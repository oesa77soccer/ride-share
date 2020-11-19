const { knex, Model } = require("../db");

class Passenger extends Model {
	static get tableName() {
		return 'Passenger';
    }
    
    static get relationMappings() {
        const Ride = require('./Ride');
        const User = require('./User');
		return {
			User: {
				relation: Model.BelongsToOneRelation,
				modelClass: User,
				join: {
					from: 'Passenger.userId',
					to: 'User.id'
				}
            },
            Ride: {
                relation: Model.BelongsToOneRelation,
                modelClass: Ride,
                join: {
                    from: 'Passenger.rideId',
                    to: 'Ride.id'
                }
            }
        }
    }
}

module.exports = Passenger;
