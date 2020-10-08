const { knex, Model } = require("../db");

class State extends Model {
	static get tableName() {
		return 'State';
	}
}

async function getAllStates() {
    const states = await State.query();
    console.log(states);
    knex.destroy();
}

getAllStates();