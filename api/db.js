// Connect knex to the database.
const knex = require('knex') ({
    client: 'pg',
    searchPath: 'ride_share',
	connection: {
		host: 'faraday.cse.taylor.edu',
		user: 'logan_roth',
		password: 'fatipofo',
        database: 'logan_roth',
	}
});
// Connect objection to knex.
const { Model } = require("objection");
Model.knex(knex);
module.exports = { knex, Model };
