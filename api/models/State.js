const { knex, Model } = require("../db");

class State extends Model {
	static get tableName() {
		return 'State';
	}
	static get relationMappings() {
        const Driver = require('./Driver');
        const Vehicle = require('./Vehicle');
        const Location = require('./Location');
		return {
			vehicles: {
				relation: Model.HasManyRelation,
				modelClass: Vehicle,
				join: {
					from: "state.abbreviation",
					to: 'vehicle.licenseState'
				}
			},

			locations: {
				relation: Model.HasManyRelation,
				modelClass: Location,
				join: {
					from: 'state.abbreviation',
					to: 'location.state'
				}
			},

			drivers: {
				relation: Model.HasManyRelation,
				modelClass: Driver,
				join: {
					from: 'state.abbreviation',
					to: 'driver.licenseState'
				}
			}
		}
	}
}

async function getAllStates() {
    const states = await State.query();
    console.log(states);
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

module.exports = State;
