async function deleteFork(forkID) {
    const db = require('../db');
    const {PreparedStatement: PS} = require('pg-promise');

    const deleteFork = new PS({name: "delete-fork", text: "DELETE * FROM forks WHERE id = $1"})
    const deleteIngredientLinks = new PS({name: "delete-ingredient-links", text: "DELETE * FROM fork_ingredients WHERE forkid = $1"})
    db.none(deleteFork, forkID);
    db.none(deleteIngredientLinks, forkID)
}
module.exports = deleteFork;