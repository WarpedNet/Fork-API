async function createFork(creatorID, parentID, recipeName, recipeDesc, recipeMethod, bannerImg, icon, ingredients, res) {
    const db = require('../db');
    const {PreparedStatement: PS} = require('pg-promise');

    // Prepared statements for all of the sql queries
    const addFork = new PS({name: "add-fork", text: "INSERT INTO forks(customer_id, name, description, method, banner, icon, count) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id"});
    const linkCustomerToFork = new PS({name: "link-customer-fork", text: "INSERT INTO customer_forks(customerid, forkid) VALUES ($1, $2)"})
    const getDepth = new PS({name: "get-depth", text: "SELECT depth FROM forks_closure WHERE child_id = $1"});
    // Post gres doesnt have an option to insert if not exists so this is a workaround
    const addIngredients = new PS({name: "ingredient-exist", text: "INSERT INTO ingredients (name) VALUES ($1) ON CONFLICT (name) DO NOTHING;"});
    const getIngredientID = new PS({name: "get-ingredient-id", text: "SELECT id FROM ingredients WHERE name = $1"})
    const linkIngredients = new PS({name: "link-ingredient", text:"INSERT INTO fork_ingredients (forkid, ingredientid) VALUES ($1, $2);"})
    
    // -=-=-=-=-=-=-NEED TO PREVENT THIS FROM ERRORING WHEN GETTING THE fork_id WHEN NO ROWS ARE FOUND-=-=-=-=-=-=-
    // Insert new fork and return the id of said new fork (fork_count of 0 since it is newly forked)
    const newForkID = await db.one(addFork, [creatorID, recipeName, recipeDesc, recipeMethod, bannerImg, icon, 0], u => u.id);

    if (parentID != null) {
        const createClosureLink = new PS({name: "create-closure-link", text: "INSERT INTO forks_closure(parent_id, child_id, depth) VALUES ($1, $2, $3)"});

        // Getting the depth from the parent node for the child node's depth since the depth of the child node is just the parent's + 1
        var parentForkDepth = await db.oneOrNone(getDepth, parentID);

        // If there is no parent, the parent depth is 0 (every node must have a depth so if it is null, no rows were returned form the query)
        if (parentForkDepth == null) {
            parentForkDepth = 0;
        }
        else {
            parentForkDepth = parentForkDepth.depth
        }

        // Creating link in the closure table that links the original recipe to the forked recipe, also increments the depth gotten from original recipe
        db.none(createClosureLink, [parentID, newForkID, parentForkDepth+1]);
    }

    // Link the fork to the customer in the customer_forks table
    db.none(linkCustomerToFork, [creatorID, newForkID]);

    ingredients.forEach(async (ingredient) => {
       await db.none(addIngredients, [ingredient.name]);
       const ingredientID = await db.one(getIngredientID, [ingredient.name], u => u.id)
       await db.none(linkIngredients, [newForkID, ingredientID]);
    });

    res.json({centralID: newForkID})
    
}
module.exports = createFork;