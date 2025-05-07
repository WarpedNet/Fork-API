
async function updateUser(data, res) {
    const jwt = require('jsonwebtoken');
    const db = require('../db')
    const bcrypt = require('bcryptjs');
    const {PreparedStatement: PS} = require('pg-promise');

    jwt.verify(data.token, process.env.JWT_SECRET, async function(err, decoded) {
        if (err) {
            res.status(401).send("Invalid Token");
        }
        else {
            const updateUser = new PS({name: 'update-user', text: 'UPDATE customers SET username=$2, email=$3, password=$4 WHERE id=$1'});

            // Set the data to the new data if it exists
            db.none(updateUser,
                [decoded.userID,
                (data.username) ? data.username : decoded.username,
                (data.email) ? data.email : decoded.email,
                (data.password) ? await bcrypt.hash(data.password, 8) : decoded.passwordHash]
            )
            res.status(200).send("Updated user")
        }
    });
}
module.exports = updateUser;