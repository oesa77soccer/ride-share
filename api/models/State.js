const { knex, Model } = require("../db");

class State extends Model {
	static get tableName() {
		return 'state';
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

module.exports = State;
