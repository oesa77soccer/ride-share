const { knex, Model } = require("../db");

class Location extends Model {
	static get tableName() {
		return 'Location';
	}
	static get relationMappings() {
		return {
			ridesTo: {
				relation: Model.HasManyRelation,
				modelClass: Vehicle,
				join: {
					from: "state.abbreviation",
					to: 'Model.vehicle.licenseState'
				}
			},

			ridesFrom: {
				relation: Model.HasManyRelation,
				modelClass: Location,
				join: {
					from: 'state.abbreviation',
					to: 'Model.location.state'
				}
			}
		}
	}
}
