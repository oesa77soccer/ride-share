const { knex, Model } = require("../db");
const User = require("../models/User");

User.query()
    .select('firstName','lastName','Location.name')
    .from('User')
    .innerJoin('Driver','User.id','Driver.id')
    .innerJoin('Drivers','Driver.id','Drivers.driverId')
    .innerJoin('Ride','Drivers.rideId','Ride.id')
    .innerJoin('Location','Ride.fromLocationId','Location.id')
    .innerJoin('State','Location.state','State.abbreviation')
    .where('State.abbreviation','IN')
    .then(users => console.log(users))
    .catch(err => console.log(err.message));

User.query()
    .select('firstName','lastName','VehicleType.type')
    .from('User')
    .innerJoin('Driver','User.id','Driver.userId')
    .innerJoin('Authorization','Driver.id','Authorization.driverId')
    .innerJoin('Vehicle','Authorization.vehicleId','Vehicle.id')
    .innerJoin('VehicleType','Vehicle.vehicleTypeId','VehicleType.id')
    .then(users => {
        console.log(users)
        knex.destroy()
    })
    .catch(err => console.log(err.message));