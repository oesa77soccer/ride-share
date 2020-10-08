const { knex, Model } = require("../db");

class User extends Model {
	static get tableName() {
		return 'Drivers';
	}
}
