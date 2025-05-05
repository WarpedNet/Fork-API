async function updateFork(userID, forkID, recipeName, recipeMethod, recipeDesc, banner_img, icon) {
    const db = require('../db');
    const {PreparedStatement: PS} = require('pg-promise');

    // Using coalesce (selects the first non null value from list) to not update if the value is null
    // Adding customer_id for verification that the customer actually owns the fork they are editing
    const updateFork = new PS({name: "update-fork", text: `
        UPDATE forks SET
        name = COALESCE($2, name),
        method = COALESCE($3, method),
        description = COALESCE($4, description),
        banner = COALESCE($5, banner),
        icon = COALESCE($6, icon),
        WHERE id = $1 AND customer_id = $7 
    `});
    db.none(updateFork, [forkID, recipeName, recipeMethod, recipeDesc, banner_img, icon, userID])
}
module.exports = updateFork;