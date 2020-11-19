const { knex, Model } = require("../db");

class Location extends Model {
	static get tableName() {
		return 'Location';
    }
    
	static get relationMappings() {
		const Ride = require('./Ride');
		return {
			RidesTo: {
				relation: Model.HasManyRelation,
				modelClass: Ride,
				join: {
					from: "Location.id",
					to: 'Ride.toLocationId'
				}
			},

			RidesFrom: {
				relation: Model.HasManyRelation,
				modelClass: Ride,
				join: {
					from: 'Location.id',
					to: 'Ride.fromLocationId'
				}
			}
		}
	}
}

module.exports = Location;
