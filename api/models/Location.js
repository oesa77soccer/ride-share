const { knex, Model } = require("../db");

class Location extends Model {
	static get tableName() {
		return 'Location';
	}
	static get relationMappings() {
		const Ride = require('Ride');
		return {
			ridesTo: {
				relation: Model.HasManyRelation,
				modelClass: Ride,
				join: {
					from: "location.id",
					to: 'Model.ride.toLocationId'
				}
			},

			ridesFrom: {
				relation: Model.HasManyRelation,
				modelClass: Ride,
				join: {
					from: 'location.id',
					to: 'Model.ride.fromLocationId'
				}
			}
		}
	}
}
