async function getFork(id, res) {
    const db = require("../db");
    const {PreparedStatement: PS} = require('pg-promise');

    const getFork = new PS({name: "read_fork", text: "SELECT * FROM forks WHERE id = $1"});
    const getCreatorName = new PS({name: "read_customers", text: "SELECT username FROM customers WHERE id = $1"})
    const fork = await db.oneOrNone(getFork, id);
    const creatorName = await db.oneOrNone(getCreatorName, fork.customer_id)
    res.json({
        creatorName: creatorName.username,
        recipeName: fork.name,
        recipeDesc: fork.description,
        method: fork.method,
        banner: fork.banner,
        icon: fork.icon,
        count: fork.count
    });
}
module.exports = getFork;