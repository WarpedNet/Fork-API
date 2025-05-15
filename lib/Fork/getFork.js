async function getFork(id, res) {
    const db = require("../db");
    const {PreparedStatement: PS} = require('pg-promise');

    const getFork = new PS({name: "read_fork", text: "SELECT * FROM forks WHERE id = $1"});
    const getCreatorName = new PS({name: "read_customers", text: "SELECT username FROM customers WHERE id = $1"})
    const getForkIngredientLinks = new PS({name: "get-ingredient-links", text: "SELECT ingredientid FROM fork_ingredients WHERE forkid = $1"})
    const getForkIngredient = new PS({name: "get-ingredient", text: "SELECT name FROM ingredients WHERE id = $1"})

    const fork = await db.oneOrNone(getFork, id);
    if (fork) {
        const ingredientLinks = await db.manyOrNone(getForkIngredientLinks, [id]);
        const ingredients = await Promise.all(ingredientLinks.map(async (ingredient) => {return (await db.one(getForkIngredient, [ingredient.ingredientid]))}))

        const creatorName = await db.oneOrNone(getCreatorName, fork.customer_id)

        
        res.json({
            creatorName: creatorName.username,
            recipeName: fork.name,
            recipeDesc: fork.description,
            method: fork.method,
            banner: fork.banner,
            icon: fork.icon,
            count: fork.count,
            ingredients: ingredients
        });
    }
    else {
        res.status(404).send("Fork not found")
    }

}
module.exports = getFork;