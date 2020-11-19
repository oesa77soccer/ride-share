const { knex, Model } = require("../db");

class User extends Model {
	static get tableName() {
		return 'User';
	}

	static get relationMappings() {
        const Driver = require('./Driver');
        const Passenger = require('./Passenger');
		return {
			Drivers: {
				relation: Model.HasManyRelation,
				modelClass: Driver,
				join: {
					from: "User.id",
					to: 'Driver.userId'
				}
			},

			Passengers: {
				relation: Model.HasManyRelation,
				modelClass: Passenger,
				join: {
					from: 'User.id',
					to: 'Passenger.userId'
				}
			}
		}
	}
}

module.exports = User;

