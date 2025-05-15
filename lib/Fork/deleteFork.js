async function deleteFork(forkID) {
    const db = require('../db');
    const {PreparedStatement: PS} = require('pg-promise');

    const deleteFork = new PS({name: "delete-fork", text: "DELETE FROM forks WHERE id = $1"})
    db.none(deleteFork, forkID);
}
module.exports = deleteFork;