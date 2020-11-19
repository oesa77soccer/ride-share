const { knex, Model } = require("../db");

class VehicleType extends Model {
	static get tableName() {
		return 'vehicleType';
	}

	static get relationMappings() {
        const Vehicle = require('./Vehicle');
		return {
			vehicles: {
				relation: Model.HasManyRelation,
				modelClass: Vehicle,
				join: {
					from: "vehicleType.id",
					to: 'vehicle.vehicleTypeId'
				}
			}
		}
	}
}

module.exports = VehicleType;
