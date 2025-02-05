// Creating the database connection and exporting it to use in other files
const pgp = require('pg-promise')

const db = pgp(`postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_ADDRESS}/forkdb`)

module.exports = db;