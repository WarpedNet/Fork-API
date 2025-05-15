async function getUserForks(data, res) {

    const db = require("../db");
    const {PreparedStatement: PS} = require('pg-promise');
    const jwt = require('jsonwebtoken');
    jwt.verify(data.token, process.env.JWT_SECRET, async function(err, decoded) {
        if (err) {
            res.status(401).send("Invalid Token");
        }
        else {
            const getFork = new PS({name: "read-all-user-forks", text: "SELECT * FROM forks WHERE customer_id = $1"});
            const forks = await db.manyOrNone(getFork, [decoded.userID]);
            res.status(200).send(forks)
        }
    });


}
module.exports = getUserForks;