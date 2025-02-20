export async function newFork(parentID, customerID, recipe_name, recipe_method, banner_img, img, icon, fork_count) {
    const db = require('./db');
    const {PreparedStatement: PS} = require('pg-promise');

    const addFork = new PS({name: "add-fork", text: "INSERT INTO Forks(parentID, customerID, recipe_name, recipe_desc, recipe_method, banner_img, img, icon, fork_count) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9 RETURNING forkID"});
    const createClosureLink = new PS({name: "create-closure-link", text: "INSERT INTO Forks_closure(parentID, childID, depth) VALUES ($1, $2, $3)"});
    // Returns the randomly generated forkID PK from the newly inserted row
    const generatedID = db.one(addFork, [parentID, customerID, recipe_name, recipe_method, banner_img, img, icon, fork_count], fork => fork.forkID).then(id => {
        db.none(createClosureLink, [parentID, id, depth])
    });
    
}