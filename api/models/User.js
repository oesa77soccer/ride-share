const { knex, Model } = require("../db");

class User extends Model {
	static get tableName() {
		return 'User';
	}

	static get relationMappings() {
		return {
			drivers: {
				relation: Model.HasManyRelation,
				modelClass: Driver,
				join: {
					from: "user.id",
					to: 'Model.driver.id'
				}
			},

			passengers: {
				relation: Model.HasManyRelation,
				modelClass: Passenger,
				join: {
					from: 'user.id',
					to: 'Model.passenger.passengerId'
				}
			}
		}
	}
}


User.query()
	.where('id',1)
	.firs()
	.then(user => {
		console.log(user);
		return user.$relatedQuery('drivers');
	})
	.then(drivers => console.log(drivers))
	.catch(error => console.log(error.message));
