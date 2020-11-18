const { knex, Model } = require("../db");

class User extends Model {
	static get tableName() {
		return 'User';
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


// User.query()
// 	.where('id',1)
// 	.firs()
// 	.then(user => {
// 		console.log(user);
// 		return user.$relatedQuery('drivers');
// 	})
// 	.then(drivers => console.log(drivers))
// 	.catch(error => console.log(error.message));

module.exports = User;

