const { knex, Model } = require("../db");

class Vehicle-Type extends Model {
	static get tableName() {
		return 'Vehicle-Type';
	}

	static get relationMappings() {
		return {
			vehicles: {
				relation: Model.HasManyRelation,
				modelClass: Vehicle,
				join: {
					from: "vehicle-type.id",
					to: 'Model.vehicle.id'
				}
			}
		}
	}
}

