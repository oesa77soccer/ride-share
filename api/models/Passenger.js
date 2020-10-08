const { knex, Model } = require("../db");

class Passenger extends Model {
	static get tableName() {
		return 'Passenger';
	}
}
