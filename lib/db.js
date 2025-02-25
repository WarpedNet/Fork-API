// Creating the database connection and exporting it to use in other files
const pgp = require('pg-promise')();
const fs = require("fs");

// ssl may not be required in all instances but since we're using AWS RDS, RDS forces ssl so certificates have to be installed
const conf = {
    host: process.env.DB_ADDRESS,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
        require: true,
        rejectUnauthorized: true,
        ca: fs.readFileSync(process.env.DB_CERT_LOC).toString(),
    }
}
const db = pgp(conf)

module.exports = db;