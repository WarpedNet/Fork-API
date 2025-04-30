async function login(username, password) {
    const db = require('../db')
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    const {PreparedStatement: PS} = require('pg-promise');

    const getUser = new PS({name: "login-user", text: "SELECT * FROM customers WHERE username = $1"});
    const user = await db.oneOrNone(getUser, [username]);
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ username: username, email: user.email }, process.env.JWT_SECRET, { expiresIn: "4h"});
        return token;
    }
    else {
        return null;
    }
}
module.exports = login;