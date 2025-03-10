async function updateFork(forkID, recipeName, recipeMethod, recipeDesc, banner_img, img, icon, fork_count) {
    const db = require('../db');
    const {PreparedStatement: PS} = require('pg-promise');

    // Using coalesce (selects the first non null value from list) to not update if the value is null
    const updateFork = new PS({name: "update-fork", text: `
        UPDATE Forks SET
        recipe_name = COALESCE($2, recipe_name),
        recipe_method = COALESCE($3, recipe_method),
        recipe_desc = COALESCE($4, recipe_desc),
        banner_img = COALESCE($5, banner_img),
        img = COALESCE($6, img),
        icon = COALESCE($7, icon),
        fork_count = COALESCE($8, fork_count)
        WHERE fork_id = $1
    `});
    db.none(updateFork, [forkID, recipeName, recipeMethod, recipeDesc, banner_img, img, icon, fork_count])
}
module.exports = updateFork;