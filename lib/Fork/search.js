async function search(name) {
    const db = require("../db");
    const {PreparedStatement: PS} = require('pg-promise');

    const getForks = new PS({name: "read_fork", text: "SELECT * FROM forks WHERE name LIKE $1"});
    const forks = db.manyOrNone(getForks, "%"+name+"%");
    return forks;
}
module.exports = search;