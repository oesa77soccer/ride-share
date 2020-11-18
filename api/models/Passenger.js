const { knex, Model } = require("../db");

class Passenger extends Model {
	static get tableName() {
		return 'Passenger';
    }
    
    static get relationMappings() {
        const Ride = require('Ride');
        const User = require('User');
		return {
			user: {
				relation: Model.BelongsToOneRelation,
				modelClass: User,
				join: {
					from: 'passenger.userId',
					to: 'user.id'
				}
            },
            ride: {
                relation: Model.BelongsToOneRelation,
                modelClass: Ride,
                join: {
                    from: 'passenger.rideId',
                    to: 'ride.id'
                }
            }
        }
    }
}
