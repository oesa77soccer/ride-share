// Knex, Model
const { knex, Model } = require("./api/db")
Model.knex(knex);

// Models
const Authorization = require("./api/models/Authorization");
const Driver = require("./api/models/Driver");
const Drivers = require("./api/models/Drivers");
const Location = require("./api/models/Location");
const Passenger = require("./api/models/Passenger");
const Ride = require("./api/models/Ride");
const State = require("./api/models/State");
const User = require("./api/models/User");
const Vehicle = require("./api/models/Vehicle");
const VehicleType = require("./api/models/VehicleType");

// Hapi
const Joi = require("@hapi/joi"); // Input validation
const Hapi = require("@hapi/hapi"); // Server
const Boom = require("@hapi/boom") // Boom: error handling

const server = Hapi.server({
    host: "localhost",
    port: 3000,
    routes: {
        cors: true,
    },
});

async function init() {
    // Show routes at startup.
    await server.register(require("blipp"));

    // Output logging information.
    await server.register({
        plugin: require("hapi-pino"),
        options: {
            prettyPrint: true,
        },
    });

    // Configure routes.
    server.route([

        {
            method: "GET",
            path: "/vehicles",
            config: {
                description: "Retrieve all vehicles",
            },
            handler: (request, h) => {
                return Vehicle.query();
            },
        },

        {
            method: "GET",
            path: "/vehicles/{id}",
            config: {
                description: "Retrieve a vehicle by ID",
                validate: {
                    params: Joi.object({
                        id: Joi.number().integer().min(1)
                    })
                }
            },
            handler: (request, h) => {
                return Vehicle.query()
                    .findById(request.params.id)
                    .then(rowsFound => {
                        if (rowsFound) {
                            return h.response({
                                ok: true,
                                message: `Found vehicle with ID '${request.params.id}'`,
                                data: rowsFound
                            })
                            .code(200);
                        } else {
                            return h.response({
                                ok: false,
                                message: `Couldn't find vehicle with ID '${request.params.id}'`,
                            })
                            .code(404);
                        }
                    });
            }
        },

        {
            method: "POST",
            path: "/vehicles",
            config: {
                description: "Add a vehicle",
                validate: {
                    payload: Joi.object({
                        make: Joi.string().min(1).max(50).optional(),
                        model: Joi.string().min(1).max(50).optional(),
                        color: Joi.string().min(1).max(50).optional(),
                        vehicleTypeId: Joi.number().integer().min(1).optional(),
                        capacity: Joi.number().integer().min(1).optional(),
                        mpg: Joi.number().min(1).optional(),
                        licenseState: Joi.string().min(2).max(2).optional(),
                        licensePlate: Joi.string().min(1).max(10).optional()
                    }),
                },
            },
            handler: async (request, h) => {
                
                if (request.payload.licensePlate) {
                    const existingVehicle = await Vehicle.query()
                        .where("licensePlate", request.payload.licensePlate)
                        .first();
                    if (existingVehicle) {
                        return h.response({
                            ok: false,
                            message: `Vehicle with license plate '${request.payload.licensePlate}' already exists`,
                        })
                        .code(400);
                    }
                }

                if (request.payload.vehicleType) {
                    const vehicleType = await VehicleType.query()
                        .findById(request.payload.vehicleTypeId);
                    if (!vehicleType) {
                        return h.response({
                            ok: false,
                            message: `Vehicle type with ID '${request.payload.vehicleTypeId}' does not exist`
                        })
                        .code(404)
                    }
                }

                if (request.payload.licenseState) {
                    const state = await State.query()
                        .where('abbreviation', request.payload.licenseState)
                        .first();
                    if (!state) {
                        return h.response({
                            ok: false,
                            message: `State with abbreviation '${request.payload.licenseState}' does not exist`
                        })
                        .code(404)
                    }
                }

                const newVehicle = await Vehicle.query().insert({
                    make: request.payload.make,
                    model: request.payload.model,
                    color: request.payload.color,
                    vehicleTypeId: request.payload.vehicleTypeId,
                    capacity: request.payload.capacity,
                    mpg: request.payload.mpg,
                    licenseState: request.payload.licenseState,
                    licensePlate: request.payload.licensePlate,
                })
                .returning('*');

                if (newVehicle) {
                    return h.response({
                        ok: true,
                        message: `Created vehicle with license plate '${request.payload.licensePlate}'`,
                        data: newVehicle
                    })
                    .code(201);
                } else {
                    return h.response({
                        ok: false,
                        message: `Couldn't create vehicle with license plate '${request.payload.licensePlate}'`,
                    })
                    .code(500);
                }
            },
        },

        {
            method: "DELETE",
            path: "/vehicles/{id}",
            config: {
                description: "Delete a vehicle",
                validate: {
                    params: Joi.object({
                        id: Joi.number().integer().min(1)
                    })
                }
            },
            handler: (request, h) => {
                return Vehicle.query()
                    .deleteById(request.params.id)
                    .then((rowsDeleted) => {
                        if (rowsDeleted === 1) {
                            return {
                                ok: true,
                                message: `Deleted vehicle with ID '${request.params.id}'`,
                            };
                        } else {
                            return {
                                ok: false,
                                message: `Couldn't delete vehicle with ID '${request.params.id}'`,
                            };
                        }
                    }
                );
            },
        },

        {
            method: "PATCH",
            path: "/vehicles/{id}",
            config: {
                description: "Update a vehicle",
            },
            handler: (request, h) => {
                return Vehicle.query()
                    .findById(request.params.id)
                    .patch({
                        make: request.payload.make,
                        model: request.payload.model,
                        color: request.payload.color,
                        vehicleTypeId: request.payload.vehicleTypeId,
                        capacity: request.payload.capacity,
                        mpg: request.payload.mpg,
                        licenseState: request.payload.licenseState,
                        licensePlate: request.payload.licensePlate,
                    }
                );
            },
        },

        {
            method: "GET",
            path: "/vehicle-types",
            config: {
                description: "Retrieve all vehicle-types",
            },
            handler: (request, h) => {
                return VehicleType.query();
            },
        },

        {
            method: "GET",
            path: "/vehicle-types/{id}",
            config: {
                description: "Retrieve a vehicle-type by ID",
                validate: {
                    params: Joi.object({
                        id: Joi.number().integer().min(1)
                    })
                }
            },
            handler: (request, h) => {
                return VehicleType.query()
                    .findById(request.params.id)
                    .then(rowsFound => {
                        if (rowsFound) {
                            return h.response({
                                ok: true,
                                message: `Found vehicle-type with ID '${request.params.id}'`,
                                data: rowsFound
                            })
                            .code(200);
                        } else {
                            return h.response({
                                ok: false,
                                message: `Couldn't find vehicle-type with ID '${request.params.id}'`,
                            })
                            .code(404);
                        }
                    });
            }
        },

        {
            method: "POST",
            path: "/vehicle-types",
            config: {
                description: "Add a vehicle type",
                validate: {
                    payload: Joi.object({
                        type: Joi.string().min(1).max(50).required(),
                    }),
                },
            },
            handler: async (request, h) => {
                const existingVehicleType = await Vehicle.query()
                    .where("type", request.payload.type)
                    .first();
                if (existingVehicleType) {
                    return h.response({
                        ok: false,
                        message: `Vehicle type '${request.payload.type}' already exists`,
                    })
                    .code(400);
                }

                const newVehicleType = await Vehicle.query().insert({
                    type: request.payload.type
                })
                .returning('*');

                if (newVehicleType) {
                    return h.response({
                        ok: true,
                        message: `Created vehicle type '${request.payload.type}'`,
                        data: newVehicleType
                    })
                    .code(201);
                } else {
                    return h.response({
                        ok: false,
                        message: `Couldn't create vehicle type '${request.payload.type}'`,
                    })
                    .code(500);
                }
            },
        },

        {
            method: "PATCH",
            path: "/vehicle-types/{id}",
            config: {
                description: "Update a vehicle type",
                validate: {
                    params: Joi.object({
                        id: Joi.number().integer().required()
                    }),
                    payload: Joi.object({
                        type: Joi.string().min(1).max(50).required(),
                    }),
                },
            },
            handler: (request, h) => {
                return VehicleType.query()
                    .findById(request.params.id)
                    .patch({
                        type: request.payload.type,
                    })
                    .returning('*')
                    .then(rowsPatched => {
                        if (rowsPatched) {
                            return {
                                ok: true,
                                message: `Updated vehicle type with ID '${request.params.id}'`,
                                data: rowsPatched
                            };
                        } else {
                            return {
                                ok: false,
                                message: `Couldn't update vehicle type with ID '${request.params.id}'`,
                            };
                        }
                    }
                );
            },
        },

        {
            method: "DELETE",
            path: "/vehicle-types/{id}",
            config: {
                description: "Delete a vehicle-type",
            },
            handler: (request, h) => {
                return VehicleType.query()
                    .deleteById(request.params.id)
                    .then((rowsDeleted) => {
                        if (rowsDeleted) {
                            return {
                                ok: true,
                                message: `Deleted vehicle-type with ID '${request.params.id}'`,
                                data: rowsDeleted
                            };
                        } else {
                            return {
                                ok: false,
                                message: `Couldn't delete vehicle-type with ID '${request.params.id}'`,
                            };
                        }
                    }
                );
            },
        },

        {
            method: "GET",
            path: "/locations",
            config: {
                description: "Retrieve all locations",
            },
            handler: (request, h) => {
                return Location.query();
            },
        },

        {
            method: "GET",
            path: "/locations/{id}",
            config: {
                description: "Retrieve a location by ID",
                validate: {
                    params: Joi.object({
                        id: Joi.number().integer().min(1)
                    })
                }
            },
            handler: (request, h) => {
                return Location.query()
                    .findById(request.params.id)
                    .then(rowsFound => {
                        if (rowsFound) {
                            return h.response({
                                ok: true,
                                message: `Found location with ID '${request.params.id}'`,
                                data: rowsFound
                            })
                            .code(200);
                        } else {
                            return h.response({
                                ok: false,
                                message: `Couldn't find location with ID '${request.params.id}'`,
                            })
                            .code(404);
                        }
                    });
            }
        },

        {
            method: "POST",
            path: "/locations",
            config: {
                description: "Create a location",
                validate: {
                    payload: Joi.object({
                        name: Joi.string().min(1).max(50).required(),
                        address: Joi.string().min(1).max(100).required(),
                        city: Joi.string().min(1).max(50).required(),
                        state: Joi.string().min(2).max(2).required(),
                        zipCode: Joi.string().min(5).max(5).required(),
                    }),
                },
            },
            handler: async (request, h) => {
                const state = await State.query()
                    .where('abbreviation', request.payload.state)
                    .first();
                if (!state) {
                    return h.response({
                        ok: false,
                        message: `State with abbreviation '${request.payload.state}' does not exist`
                    })
                    .code(404)
                }

                const newLocation = await Location.query().insert({
                    name: request.payload.name,
                    address: request.payload.address,
                    city: request.payload.city,
                    state: request.payload.state,
                    zipCode: request.payload.zipCode,
                })
                .returning('*');

                if (newLocation) {
                    return h.response({
                        ok: true,
                        message: `Created location '${request.payload.name}'`,
                        data: newLocation
                    })
                    .code(201);
                } else {
                    return h.response({
                        ok: false,
                        message: `Couldn't create location '${request.payload.name}'`,
                    })
                    .code(500);
                }
            },
        },

        {
            method: "DELETE",
            path: "/locations/{id}",
            config: {
                description: "Delete a location",
            },
            handler: (request, h) => {
                return Location.query()
                    .deleteById(request.params.id)
                    .then((rowsDeleted) => {
                        if (rowsDeleted === 1) {
                            return {
                                ok: true,
                                message: `Deleted location with ID '${request.params.id}'`,
                            };
                        } else {
                            return {
                                ok: false,
                                message: `Couldn't delete location with ID '${request.params.id}'`,
                            };
                        }
                    }
                );
            },
        },

        {
            method: "PATCH",
            path: "/locations/{id}",
            config: {
                description: "Update a location",
            },
            handler: (request, h) => {
                return Location.query()
                    .findById(request.params.id)
                    .patch({
                        name: request.payload.name,
                        address: request.payload.address,
                        city: request.payload.city,
                        state: request.payload.state,
                        zipCode: request.payload.zipCode,
                    }
                );
            },
        },

        {
            method: "GET",
            path: "/users",
            config: {
                description: "Retrieve all users",
            },
            handler: (request, h) => {
                return User.query();
            },
        },

        {
            method: "GET",
            path: "/users/{id}",
            config: {
                description: "Retrieve a user by ID",
                validate: {
                    params: Joi.object({
                        id: Joi.number().integer().min(1)
                    })
                }
            },
            handler: (request, h) => {
                return User.query()
                    .findById(request.params.id)
                    .then(rowsFound => {
                        if (rowsFound) {
                            return h.response({
                                ok: true,
                                message: `Found user with ID '${request.params.id}'`,
                                data: rowsFound
                            })
                            .code(200);
                        } else {
                            return h.response({
                                ok: false,
                                message: `Couldn't find user with ID '${request.params.id}'`,
                            })
                            .code(404);
                        }
                    });
            }
        },

        {
            method: "POST",
            path: "/users",
            config: {
                description: "Sign up to be a user",
                validate: {
                    payload: Joi.object({
                        firstName: Joi.string().required(),
                        lastName: Joi.string().required(),
                        email: Joi.string().email().required(),
                        password: Joi.string().required(),
                        phone: Joi.string().required(),
                    }),
                },
            },
            handler: async (request, h) => {
                const existingUser = await User.query()
                    .where("email", request.payload.email)
                    .first();
                if (existingUser) {
                    return h.response({
                        ok: false,
                        message: `User with email '${request.payload.email}' is already in use`,
                    })
                    .code(400);
                }

                const newUser = await User.query().insert({
                    firstName: request.payload.firstName,
                    lastName: request.payload.lastName,
                    email: request.payload.email,
                    password: request.payload.password,
                    phone: request.payload.phone,
                })
                .returning('*');

                if (newUser) {
                    return h.response({
                        ok: true,
                        message: `Created user '${request.payload.email}'`,
                        data: newUser
                    })
                    .code(201);
                } else {
                    return h.response({
                        ok: false,
                        message: `Couldn't create user with email '${request.payload.email}'`,
                    })
                    .code(500);
                }
            },
        },

        {
            method: "DELETE",
            path: "/users/{id}",
            config: {
                description: "Delete a user",
            },
            handler: (request, h) => {
                return User.query()
                    .deleteById(request.params.id)
                    .then((rowsDeleted) => {
                        if (rowsDeleted === 1) {
                            return {
                                ok: true,
                                message: `Deleted user with ID '${request.params.id}'`,
                            };
                        } else {
                            return {
                                ok: false,
                                message: `Couldn't delete user with ID '${request.params.id}'`,
                            };
                        }
                    }
                );
            },
        },

        {
            method: "PATCH",
            path: "/users/{id}",
            config: {
                description: "Update a user",
            },
            handler: (request, h) => {
                return User.query()
                    .findById(request.params.id)
                    .patch({
                        email: request.payload.email,
                        firstName: request.payload.firstName,
                        lastName: request.payload.lastName,                        
                    }
                );
            },
        },

        {
            method: "GET",
            path: "/rides",
            config: {
                description: "Retrieve all rides",
                validate: {
                    query: Joi.object({
                        name: Joi.string().min(1).optional(),
                        address: Joi.string().min(1).optional(),
                        city: Joi.string().min(1).optional(),
                        state: Joi.string().length(2).optional(),
                        zipCode: Joi.number().min(5).optional()
                    })
                }
            },
            handler: async (request, h) => {
                if (request.query.name) {
                    return await Ride.query()
                        .withGraphJoined('FromLocation')
                        .withGraphJoined('ToLocation')
                        .where('FromLocation.name', 'like', '%'+request.query.name+'%')
                        .orWhere('ToLocation.name', 'like', '%'+request.query.name+'%')
                }
                if (request.query.address) {
                    return await Ride.query()
                        .withGraphJoined('FromLocation')
                        .withGraphJoined('ToLocation')
                        .where('FromLocation.address', 'like', '%'+request.query.address+'%')
                        .orWhere('ToLocation.address', 'like', '%'+request.query.address+'%')
                }
                if (request.query.city) {
                    return await Ride.query()
                        .withGraphJoined('FromLocation')
                        .withGraphJoined('ToLocation')
                        .where('FromLocation.city', 'like', '%'+request.query.city+'%')
                        .orWhere('ToLocation.city', 'like', '%'+request.query.city+'%')
                }
                if (request.query.state) {
                    return await Ride.query()
                        .withGraphJoined('FromLocation')
                        .withGraphJoined('ToLocation')
                        .where('FromLocation.state', 'like', '%'+request.query.state+'%')
                        .orWhere('ToLocation.state', 'like', '%'+request.query.state+'%')
                }
                if (request.query.zipCode) {
                    return await Ride.query()
                        .withGraphJoined('FromLocation')
                        .withGraphJoined('ToLocation')
                        .where('FromLocation.zipCode', 'like', '%'+request.query.zipCode+'%')
                        .orWhere('ToLocation.zipCode', 'like', '%'+request.query.zipCode+'%')
                }
                return await Ride.query()
                    .withGraphFetched('FromLocation')
                    .withGraphFetched('ToLocation')
            },
        },

        {
            method: "GET",
            path: "/rides/{id}",
            config: {
                description: "Retrieve a ride by ID",
                validate: {
                    params: Joi.object({
                        id: Joi.number().integer().min(1)
                    })
                }
            },
            handler: (request, h) => {
                return Ride.query()
                    .findById(request.params.id)
                    .then(rowsFound => {
                        if (rowsFound) {
                            return h.response({
                                ok: true,
                                message: `Found ride with ID '${request.params.id}'`,
                                data: rowsFound
                            })
                            .code(200);
                        } else {
                            return h.response({
                                ok: false,
                                message: `Couldn't find ride with ID '${request.params.id}'`,
                            })
                            .code(404);
                        }
                    });
            }
        },

        {
            method: "POST",
            path: "/rides",
            config: {
                description: "Create a ride",
                validate: {
                    payload: Joi.object({
                        date: Joi.date().required(),
                        time: Joi.string().min(7).max(8).required(),
                        distance: Joi.number().required(),
                        fuelPrice: Joi.number().required(),
                        fee: Joi.number().required(),
                        vehicleId: Joi.number().integer().required(),
                        fromLocationId: Joi.number().integer().required(),
                        toLocationId: Joi.number().integer().required()
                    }),
                },
            },
            handler: async (request, h) => {
                const vehicle = await Vehicle.query()
                    .findById(request.payload.vehicleId);
                if (!vehicle) {
                    return h.response({
                        ok: false,
                        message: `Vehicle with ID '${request.payload.vehicleId}' does not exist`
                    })
                    .code(404)
                }

                const fromLocation = await Location.query()
                    .findById(request.payload.fromLocationId);
                if (!fromLocation) {
                    return h.response({
                        ok: false,
                        message: `Location '${request.payload.fromLocationId}' does not exist`
                    })
                    .code(404)
                }

                const toLocation = await Location.query()
                    .findById(request.payload.toLocationId);
                if (!toLocation) {
                    return h.response({
                        ok: false,
                        message: `Location '${request.payload.toLocationId}' does not exist`
                    })
                    .code(404)
                }

                const newRide = await Ride.query().insert({
                    date: request.payload.date,
                    time: request.payload.time,
                    distance: request.payload.distance,
                    fuelPrice: request.payload.fuelPrice,
                    fee: request.payload.fee,
                    vehicleId: request.payload.vehicleId,
                    fromLocationId: request.payload.fromLocationId,
                    toLocationId: request.payload.toLocationId,
                })
                .returning('*');

                if (newRide) {
                    return h.response({
                        ok: true,
                        message: `Created ride`,
                        data: newRide
                    })
                    .code(201);
                } else {
                    return h.response({
                        ok: false,
                        message: `Couldn't create ride`,
                    })
                    .code(500);
                }
            },
        },

        {   
            method: "DELETE",
            path: "/rides/{id}",
            config : {
                description: "Delete ride",
            },
            handler: (request, h) => {
                return Ride.query()
                    .deleteById(request.params.id)
                    .then((rowsDeleted) => {
                        if (rowsDeleted === 1) {
                            return {
                                ok: true,
                                message: `Deleted account with ID '${request.params.id}'`,
                            };
                        } else {
                            return {
                                ok: false,
                                message: `Couldn't delete account with ID '${request.params.id}'`,
                            };
                        }
                    }
                );
            },
        },

        {
            method: "PATCH",
            path: "/rides/{id}",
            config: {
                description: "Update a ride",
            },
            handler: (request, h) => {
                return Ride.query()
                    .findById(request.params.id)
                    .patch({
                        date: request.payload.date,
                        time: request.payload.time,
                    }
                );
            },
        },

        {
            method: "GET",
            path: "/drivers",
            config: {
                description: "Retrieve all drivers",
            },
            handler: (request, h) => {
                return Driver.query();
            },
        },

        {
            method: "GET",
            path: "/drivers/{id}",
            config: {
                description: "Retrieve a driver by ID",
                validate: {
                    params: Joi.object({
                        id: Joi.number().integer().min(1)
                    })
                }
            },
            handler: (request, h) => {
                return Driver.query()
                    .findById(request.params.id)
                    .then(rowsFound => {
                        if (rowsFound) {
                            return h.response({
                                ok: true,
                                message: `Found driver with ID '${request.params.id}'`,
                                data: rowsFound
                            })
                            .code(200);
                        } else {
                            return h.response({
                                ok: false,
                                message: `Couldn't find driver with ID '${request.params.id}'`,
                            })
                            .code(404);
                        }
                    });
            }
        },

        {
            method: "POST",
            path: "/drivers",
            config: {
                description: "Sign up a user as a driver (in general)",
                validate: {
                    payload: Joi.object({
                        userId: Joi.number().integer().required(),
                        licenseNumber: Joi.string().min(1).required(),
                        licenseState: Joi.string().length(2).required(),
                    })
                }
            },
            handler: async (request, h) => {
                const user = await User.query()
                    .findById(request.payload.userId);
                if (!user) {
                    return h.response({
                        ok: false,
                        message: `User with ID '${request.payload.userId}' does not exist`
                    })
                    .code(404);
                }

                const licenseState = await State.query()
                    .where('abbreviation', request.payload.licenseState)
                    .first();
                if (!licenseState) {
                    return h.response({
                        ok: false,
                        message: `License state with abbreviation '${request.payload.licenseState}' does not exist`
                    })
                    .code(404);
                }

                const existingDriver = await Driver.query()
                    .where('userId', request.payload.userId)
                    .first();
                if (existingDriver) {
                    return h.response({
                        ok: false,
                        message: `You are already a driver`
                    })
                    .code(400);             
                }

                const newDriver = await Driver.query()
                    .insert({
                        userId: request.payload.userId,
                        licenseNumber: request.payload.licenseNumber,
                        licenseState: request.payload.licenseState
                    })
                    .returning('*');

                if (newDriver) {
                    return h.response({
                        ok: true,
                        message: `Nice! You're now a driver`,
                        data: newDriver
                    })
                    .code(201);
                } else {
                    return h.response({
                        ok: false,
                        message: `That didn't work for some reason`
                    })
                    .code(500);                  
                }
            }
        },
 
        {
            method: "DELETE",
            path: "/drivers/{id}",
            config: {
                description: "Delete a driver",
            },
            handler: (request, h) => {
                return Driver.query()
                    .deleteById(request.params.id)
                    .then((rowsDeleted) => {
                        if (rowsDeleted === 1) {
                            return {
                                ok: true,
                                message: `Deleted driver with ID '${request.params.id}'`,
                            };
                        } else {
                            return {
                                ok: false,
                                message: `Couldn't delete driver with ID '${request.params.id}'`,
                            };
                        }
                    }
                );
            },
        },

        {
            method: "PATCH",
            path: "/drivers/{id}",
            config: {
                description: "Update a driver",
            },
            handler: (request, h) => {
                return Driver.query()
                    .findById(request.params.id)
                    .patch({
                        userId: request.payload.userId,
                        licenseState: request.payload.licenseState,
                        licenseNumber: request.payload.licenseNumber,
                    }
                );
            },
        },

        {
            method: "GET",
            path: "/passengers",
            config: {
                description: "Retrieve all passengers",
            },
            handler: (request, h) => {
                return Passenger.query();
            },
        },

        {
            method: "GET",
            path: "/passengers/{id}",
            config: {
                description: "Retrieve a passenger by ID",
                validate: {
                    params: Joi.object({
                        id: Joi.number().integer().min(1)
                    })
                }
            },
            handler: (request, h) => {
                return Passenger.query()
                    .where('passengerId', request.params.id)
                    .then(rowsFound => {
                        if (rowsFound.length) {
                            return h.response({
                                ok: true,
                                message: `Found passenger with ID '${request.params.id}'`,
                                data: rowsFound
                            })
                            .code(200);
                        } else {
                            return h.response({
                                ok: false,
                                message: `Couldn't find passenger with ID '${request.params.id}'`,
                            })
                            .code(404);
                        }
                    });
            }
        },

        {
            method: "POST",
            path: "/passengers",
            config: {
                description: "Sign a user up for a ride",
                validate: {
                    payload: Joi.object({
                        userId: Joi.number().integer().required(),
                        rideId: Joi.number().integer().required()
                    })
                }
            },
            handler: async (request, h) => {
                const ride = await Ride.query()
                    .findById(request.payload.rideId)
                    .withGraphFetched('Vehicle')
                    .withGraphFetched('Passengers');
                if (!ride) {
                    return h.response({
                        ok: false,
                        message: `Ride with ID ${request.payload.rideId} does not exist`
                    })
                    .code(404);
                }

                const currentDate = new Date();        
                if (ride.date < currentDate) {
                    return h.response({
                        ok: false,
                        message: `Ride is already in transit`
                    })
                    .code(400);
                }

                if (ride.Passengers.length == ride.Vehicle.capacity) {
                    return h.response({
                        ok: false,
                        message: `Ride is full`
                    })
                    .code(400);                
                }

                const user = await User.query()
                    .findById(request.payload.userId);
                if (!user) {
                    return h.response({
                        ok: false,
                        message: `User with ID '${request.payload.userId}' does not exist`
                    })
                    .code(404);                
                }

                const newPassenger = await Passenger.query()
                    .insert({
                        userId: request.payload.userId,
                        rideId: request.payload.rideId
                    })
                    .returning('*');

                if (newPassenger) {
                    return h.response({
                        ok: true,
                        message: `Created passenger`,
                        data: newPassenger
                    })
                    .code(201);
                } else {
                    return h.response({
                        ok: false,
                        message: `That didn't work for some reason`
                    })
                    .code(500);
                }
            }
        },

        {
            method: "DELETE",
            path: "/passengers/{id}",
            config: {
                description: "Delete a passenger",
            },
            handler: (request, h) => {
                return Passenger.query()
                    .deleteById(request.params.id)
                    .then((rowsDeleted) => {
                        if (rowsDeleted === 1) {
                            return {
                                ok: true,
                                message: `Deleted passenger with ID '${request.params.id}'`,
                            };
                        } else {
                            return {
                                ok: false,
                                message: `Couldn't delete passenger with ID '${request.params.id}'`,
                            };
                        }
                    }
                );
            },
        },





        {
            method: "POST",
            path: "/login",
            config: {
                description: "Log in",
                validate: {
                    payload: Joi.object({
                        email: Joi.string().email().required(),
                        password: Joi.string().min(8).required(),
                    }),
                },
            },
            handler: async (request, h) => {
                const user = await User.query()
                    .where("email", request.payload.email)
                    .first();
                if (
                    user &&
                    (await user.verifyPassword(request.payload.password))
                ) {
                    return {
                        ok: true,
                        message: `Logged in successfully as '${request.payload.email}'`,
                        details: {
                            id: user.id,
                            firstName: user.first_name,
                            lastName: user.last_name,
                            email: user.email,
                            phone: user.phone,
                            isAdmin: user.isAdmin,
                        },
                    };
                } else {
                    throw Boom.badRequest('Invalid email or password');
                }
            },
        },

        {
            method: "POST",
            path: "/reset-password",
            config: {
                description: "Reset Password",
                validate: {
                    payload: Joi.object({
                        email: Joi.string().email().required(),
                        currentPassword: Joi.string().min(8).required(),
                        newPassword: Joi.string().min(8).required(),
                        confirmNewPassword: Joi.string().min(8).required(),
                    }),
                },
            },
            handler: async (request, h) => {
                const account = await Account.query()
                    .where("email", request.payload.email)
                    .first();
                if (!account) {
                    return {
                        ok: false,
                        message: "Invalid email address",
                    };
                }
                if (!(await account.verifyPassword(request.payload.currentPassword))) {
                    return {
                        ok: false,
                        message: "Incorrect password",
                    };
                }
                if (request.payload.newPassword !== request.payload.confirmNewPassword) {
                    return {
                        ok: false,
                        message: "New passwords don't match",
                    };
                }
                await Account.query()
                    .patch({ password: request.payload.newPassword })
                    .where("email", request.payload.email)
                return {
                    ok: true,
                    message: `Reset password successfully for '${request.payload.email}'`,
                    details: {
                        id: account.id,
                        firstName: account.first_name,
                        lastName: account.last_name,
                        email: account.email,
                    },
                }
            }
        },
    ]);

    // Start the server.
    await server.start();
}

// process.on("unhandledRejection", (err) => {
//     server.logger().error(err);
//     process.exit(1);
// });

// Go!
init();
