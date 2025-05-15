async function login(username, password, res) {
    const db = require('../db')
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    const {PreparedStatement: PS} = require('pg-promise');

    const getUser = new PS({name: "login-user", text: "SELECT * FROM customers WHERE username = $1"});
    const user = await db.oneOrNone(getUser, [username]);

    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ username: username, email: user.email, passwordHash: user.password, userID: user.id }, process.env.JWT_SECRET, { expiresIn: "4h"});
        res.json({token: token});
    }
    else {
        res.status(401).send("Incorrect Login Details");
    }
}
module.exports = login;