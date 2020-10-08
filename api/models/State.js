const { knex, Model } = require("../db");

class State extends Model {
	static get tableName() {
		return 'State';
	}
}

// State.query()
//     .then(states => {
//         states.forEach(state => {
//             console.log(state.abbreviation, state.name)
//         });
//         knex.destroy();
//     })
//     .catch(err => console.log(err.message));

async function getAllStates() {
    const states = await State.query();
    console.log(states.length);
    knex.destroy();
}

getAllStates();
// State.query()
//     .then(states => {
//         states.forEach(state => {
//             console.log(state)
//         })
//     })
//     .catch(err => console.log(err))