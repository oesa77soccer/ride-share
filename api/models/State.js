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
			Vehicles: {
				relation: Model.HasManyRelation,
				modelClass: Vehicle,
				join: {
					from: "State.abbreviation",
					to: 'Vehicle.licenseState'
				}
			},

			Locations: {
				relation: Model.HasManyRelation,
				modelClass: Location,
				join: {
					from: 'State.abbreviation',
					to: 'Location.state'
				}
			},

			Drivers: {
				relation: Model.HasManyRelation,
				modelClass: Driver,
				join: {
					from: 'State.abbreviation',
					to: 'Driver.licenseState'
				}
			}
		}
	}
}

module.exports = State;
