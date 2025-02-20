export async function updateFork(forkID, newData) {
    const db = require('./db');
    const {PreparedStatement: PS} = require('pg-promise');

    const updateFork = new PS({name: "update-fork", text: "UPDATE Forks SET parentID = $1, customerID = $2, recipe_name = $3, recipe_method = $4, banner_img = $5, img = $6, icon = $7, fork_count = $8"})
    const getFork = new PS({name: "read_fork", text: "SELECT * FROM Forks WHERE forkID = $1"})

    const oldInfo = db.one(getFork, forkID)

    updateFork.values([oldInfo.parentID, oldInfo.customerID, oldInfo.recipe_name, oldInfo.recipe_method, oldInfo.banner_img, oldInfo.img, oldInfo.icon, oldInfo.fork_count])

    
}