const { knex, Model } = require("../db");

class Authorization extends Model {
	static get tableName() {
		return 'Authorization';
    }
    
    static get relationMappings() {
        const Driver = require('./Driver');
        const Vehicle = require('./Vehicle');
		return {
			Driver: {
				relation: Model.BelongsToOneRelation,
				modelClass: Driver,
				join: {
					from: 'Authorization.driverId',
					to: 'Driver.id'
				}
            },
            Vehicle: {
                relation: Model.BelongsToOneRelation,
                modelClass: Vehicle,
                join: {
                    from: 'Authorization.vehicleId',
                    to: 'Vehicle.id'
                }
            }
        }
    }
}

module.exports = Authorization;

