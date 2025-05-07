async function updateFork(userID, forkID, recipeName, recipeMethod, recipeDesc, banner_img, icon, ingredients) {
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
    const deleteIngredientLinks = new PS({name: "delete-ingredient-links", text: "DELETE * FROM fork_ingredients WHERE forkid = $1"})
    const addIngredients = new PS({name: "ingredient-exist", text: "INSERT INTO ingredients (name) VALUES ($1) ON CONFLICT (name) DO NOTHING;"});
    const getIngredientID = new PS({name: "get-ingredient", text: "SELECT id FROM ingredients WHERE name = $1"})
    const linkIngredients = new PS({name: "link-ingredient", text:"INSERT INTO fork_ingredients (forkid, ingredientid) VALUES ($1, $2);"})

    db.none(updateFork, [forkID, recipeName, recipeMethod, recipeDesc, banner_img, icon, userID])
    await db.none(deleteIngredientLinks, forkID)
    ingredients.forEach(async (ingredient) => {
        await db.none(addIngredients, [ingredient.name]);
        const ingredientID = await db.one(getIngredientID, [ingredient.name], u => u.id)
        await db.none(linkIngredients, [forkID, ingredientID]);
    });
}
module.exports = updateFork;