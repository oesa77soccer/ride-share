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
                        zip: Joi.number().min(5).optional()
                    })
                }
            },
            handler: (request, h) => {
                if (request.query.name) {
                    return Ride.query()
                        .withGraphFetched('FromLocation')
                        .withGraphFetched('ToLocation')
                        .where('Location.name', '=', request.query.name)
                        // .orWhere('ToLocation.name', '=', request.query.name);
                }
                return Ride.query()
                    .withGraphFetched('FromLocation')
                    .withGraphFetched('ToLocation')
            },
        },

        {
            method: "POST",
            path: "/accounts",
            config: {
                description: "Sign up for an account",
                validate: {
                    payload: Joi.object({
                        firstName: Joi.string().required(),
                        lastName: Joi.string().required(),
                        email: Joi.string().email().required(),
                        password: Joi.string().required(),
                    }),
                },
            },
            handler: async (request, h) => {
                const existingAccount = await Account.query()
                    .where("email", request.payload.email)
                    .first();
                if (existingAccount) {
                    return {
                        ok: false,
                        msge: `Account with email '${request.payload.email}' is already in use`,
                    };
                }

                const newAccount = await Account.query().insert({
                    first_name: request.payload.firstName,
                    last_name: request.payload.lastName,
                    email: request.payload.email,
                    password: request.payload.password,
                });

                if (newAccount) {
                    return {
                        ok: true,
                        msge: `Created account '${request.payload.email}'`,
                    };
                } else {
                    return {
                        ok: false,
                        msge: `Couldn't create account with email '${request.payload.email}'`,
                    };
                }
            },
        },

        {
            method: "GET",
            path: "/accounts",
            config: {
                description: "Retrieve all accounts",
            },
            handler: (request, h) => {
                return Account.query();
            },
        },

        {
            method: "DELETE",
            path: "/accounts/{id}",
            config: {
                description: "Delete an account",
            },
            handler: (request, h) => {
                return Account.query()
                    .deleteById(request.params.id)
                    .then((rowsDeleted) => {
                        if (rowsDeleted === 1) {
                            return {
                                ok: true,
                                msge: `Deleted account with ID '${request.params.id}'`,
                            };
                        } else {
                            return {
                                ok: false,
                                msge: `Couldn't delete account with ID '${request.params.id}'`,
                            };
                        }
                    });
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
                const account = await Account.query()
                    .where("email", request.payload.email)
                    .first();
                if (
                    account &&
                    (await account.verifyPassword(request.payload.password))
                ) {
                    return {
                        ok: true,
                        msge: `Logged in successfully as '${request.payload.email}'`,
                        details: {
                            id: account.id,
                            firstName: account.first_name,
                            lastName: account.last_name,
                            email: account.email,
                        },
                    };
                } else {
                    return {
                        ok: false,
                        msge: "Invalid email or password",
                    };
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
                        msge: "Invalid email address",
                    };
                }
                if (!(await account.verifyPassword(request.payload.currentPassword))) {
                    return {
                        ok: false,
                        msge: "Incorrect password",
                    };
                }
                if (request.payload.newPassword !== request.payload.confirmNewPassword) {
                    return {
                        ok: false,
                        msge: "New passwords don't match",
                    };
                }
                await Account.query()
                    .patch({ password: request.payload.newPassword })
                    .where("email", request.payload.email)
                return {
                    ok: true,
                    msge: `Reset password successfully for '${request.payload.email}'`,
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
