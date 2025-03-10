async function getAllForks() {
    const db = require("../db");
    const {PreparedStatement: PS} = require('pg-promise');

    const getFork = new PS({name: "read_all_forks", text: "SELECT * FROM Forks"});
    const forks = db.manyOrNone(getFork);
    return forks;
}
module.exports = getAllForks;