const { knex, Model } = require("../db");

class VehicleType extends Model {
	static get tableName() {
		return 'VehicleType';
	}

	static get relationMappings() {
        const Vehicle = require('./Vehicle');
		return {
			Vehicles: {
				relation: Model.HasManyRelation,
				modelClass: Vehicle,
				join: {
					from: "VehicleType.id",
					to: 'Vehicle.vehicleTypeId'
				}
			}
		}
	}
}

module.exports = VehicleType;
