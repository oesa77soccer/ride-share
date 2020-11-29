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
            method: "DELETE",
            path: "/ride/{id}",
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
                    throw Boom.notFound('Ride does not exist')
                }

                const currentDate = new Date();        
                if (ride.date < currentDate) {
                    throw Boom.badRequest('Ride is already in transit')
                }

                if (ride.Passengers.length == ride.Vehicle.capacity) {
                    throw Boom.badRequest('Ride is already full')
                }

                const user = await User.query()
                    .findById(request.payload.userId);
                if (!user) {
                    throw Boom.notFound('User does not exist');
                }

                return Passenger.query()
                    .insert({
                        userId: request.payload.userId,
                        rideId: request.payload.rideId
                    })
                    .returning('*');
            }
        },

        {
            method: "POST",
            path: "/user",
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
                    return {
                        ok: false,
                        message: `User with email '${request.payload.email}' is already in use`,
                    };
                }

                const newUser = await User.query().insert({
                    firstName: request.payload.firstName,
                    lastName: request.payload.lastName,
                    email: request.payload.email,
                    password: request.payload.password,
                    phone: request.payload.phone,
                });

                if (newUser) {
                    return {
                        ok: true,
                        message: `Created user '${request.payload.email}'`,
                    };
                } else {
                    return {
                        ok: false,
                        message: `Couldn't create user with email '${request.payload.email}'`,
                    };
                }
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
            method: "DELETE",
            path: "/user/{id}",
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
            method: "DELETE",
            path: "/vehicle/{id}",
            config: {
                description: "Delete a vehicle",
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
            method: "DELETE",
            path: "/vehicle-type/{id}",
            config: {
                description: "Delete a vehicle-type",
            },
            handler: (request, h) => {
                return VehicleType.query()
                    .deleteById(request.params.id)
                    .then((rowsDeleted) => {
                        if (rowsDeleted === 1) {
                            return {
                                ok: true,
                                message: `Deleted vehicle-type with ID '${request.params.id}'`,
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
            method: "DELETE",
            path: "/location/{id}",
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
            method: "DELETE",
            path: "/passenger/{id}",
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
            method: "DELETE",
            path: "/driver/{id}",
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
                    throw Boom.notFound('User does not exist');
                }

                const licenseState = await State.query()
                    .where('abbreviation', request.payload.licenseState);
                if (licenseState.length == 0) {
                    throw Boom.notFound('Invalid license state');
                }

                if (await Driver.query().findById(request.payload.userId)) {
                    throw Boom.badRequest('You are already a driver');
                }

                const newDriver = await Driver.query()
                    .insert({
                        userId: request.payload.userId,
                        licenseNumber: request.payload.licenseNumber,
                        licenseState: request.payload.licenseState
                    });

                if (newDriver) {
                    return {
                        ok: true,
                        message: `Nice! You're now a driver.`,
                    };
                } else {
                    throw Boom.internal('That didn\'t work for some reason.');
                }
            }
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
