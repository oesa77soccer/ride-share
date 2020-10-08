const { knex, Model } = require("../db");

class Authorization extends Model {
	static get tableName() {
		return 'Authorization';
	}
}
