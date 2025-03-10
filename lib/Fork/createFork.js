async function createFork(creatorID, parentID, recipeName, recipeDesc, recipeMethod, bannerImg, img, icon) {
    const db = require('../db');
    const {PreparedStatement: PS} = require('pg-promise');
    
    // Prepared statements for all of the sql queries
    const addFork = new PS({name: "add-fork", text: "INSERT INTO forks(creator_id, recipe_name, recipe_desc, recipe_method, banner_img, img, icon, fork_count) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING fork_id"});
    const createClosureLink = new PS({name: "create-closure-link", text: "INSERT INTO Forks_closure(parent_id, child_id, depth) VALUES ($1, $2, $3)"});
    const getDepth = new PS({name: "get-depth", text: "SELECT depth FROM forks_closure WHERE child_id = $1"});
    

    
    // -=-=-=-=-=-=-NEED TO PREVENT THIS FROM ERRORING WHEN GETTING THE fork_id WHEN NO ROWS ARE FOUND-=-=-=-=-=-=-
    // Insert new fork and return the id of said new fork (fork_count of 0 since it is newly forked)
    const newForkID = await db.one(addFork, [creatorID, recipeName, recipeDesc, recipeMethod, bannerImg, img, icon, 0], u => u.fork_id);

    // Getting the depth from the parent node for the child node's depth since the depth of the child node is just the parent's + 1
    var parentForkDepth = await db.oneOrNone(getDepth, parentID, u => u.depth);

    // If there is no parent, the parent depth is 0 (every node must have a depth so if it is null, no rows were returned form the query)
    if (parentForkDepth == null) {
        parentForkDepth = 0;
    }

    // Creating link in the closure table that links the original recipe to the forked recipe, also increments the depth gotten from original recipe
    db.none(createClosureLink, [parentID, newForkID, parentForkDepth+1]);

    // Debug
    console.log(`Created new fork with ID: ${newForkID}`);
    console.log(`Created link between forks Parent: ${parentID}, Child: ${newForkID}`);
}
module.exports = createFork;