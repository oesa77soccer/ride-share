const { knex, Model } = require("../db");

class State extends Model {
	static get tableName() {
		return 'State';
	}
	static get relationMappings() {
		return {
			vehicles: {
				relation: Model.HasManyRelation,
				modelClass: Vehicle,
				join: {
					from: "state.abbreviation",
					to: 'Model.vehicle.licenseState'
				}
			},

			locations: {
				relation: Model.HasManyRelation,
				modelClass: Location,
				join: {
					from: 'state.abbreviation',
					to: 'Model.location.state'
				}
			}

			drivers: {
				relation: Model.HasManyRelation,
				modelClass: Driver,
				join: {
					from: 'state.abbreviation',
					to: 'Model.driver.licenseState'
				}
			}
		}
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
