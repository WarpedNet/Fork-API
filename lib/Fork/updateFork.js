async function updateFork(forkID, recipeName, recipeMethod, recipeDesc, banner_img, img, icon, fork_count) {
    const db = require('../db');
    const {PreparedStatement: PS} = require('pg-promise');

    // Using coalesce (selects the first non null value from list) to not update if the value is null
    const updateFork = new PS({name: "update-fork", text: `
        UPDATE forks SET
        name = COALESCE($2, name),
        method = COALESCE($3, method),
        description = COALESCE($4, description),
        banner = COALESCE($5, banner),
        img = COALESCE($6, img),
        icon = COALESCE($7, icon),
        count = COALESCE($8, count)
        WHERE id = $1
    `});
    db.none(updateFork, [forkID, recipeName, recipeMethod, recipeDesc, banner_img, img, icon, fork_count])
}
module.exports = updateFork;