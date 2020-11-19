const { knex, Model } = require("../db");

class Authorization extends Model {
	static get tableName() {
		return 'authorization';
    }
    
    static get relationMappings() {
        const Driver = require('./Driver');
        const Vehicle = require('./Vehicle');
		return {
			driver: {
				relation: Model.BelongsToOneRelation,
				modelClass: Driver,
				join: {
					from: 'authorization.driverId',
					to: 'driver.id'
				}
            },
            vehicle: {
                relation: Model.BelongsToOneRelation,
                modelClass: Vehicle,
                join: {
                    from: 'authorization.vehicleId',
                    to: 'vehicle.id'
                }
            }
        }
    }
}

module.exports = Authorization;

