const { knex, Model } = require("../db");

class User extends Model {
	static get tableName() {
		return 'user';
	}

	static get relationMappings() {
        const Driver = require('./Driver');
        const Passenger = require('./Passenger');
		return {
			drivers: {
				relation: Model.HasManyRelation,
				modelClass: Driver,
				join: {
					from: "user.id",
					to: 'driver.userId'
				}
			},

			passengers: {
				relation: Model.HasManyRelation,
				modelClass: Passenger,
				join: {
					from: 'user.id',
					to: 'passenger.userId'
				}
			}
		}
	}
}

module.exports = User;

