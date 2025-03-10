async function getFork(id) {
    const db = require("../db");
    const {PreparedStatement: PS} = require('pg-promise');

    const getFork = new PS({name: "read_fork", text: "SELECT * FROM Forks WHERE fork_id = $1"});
    const fork = db.oneOrNone(getFork, id);
    return fork;
}
module.exports = getFork;