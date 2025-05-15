async function register(username, email, password, res) {
    const db = require('../db')
    const bcrypt = require('bcryptjs');
    const {PreparedStatement: PS} = require('pg-promise');

    const checkIfUserExists = new PS({name: "check-user-exists", text: "SELECT * FROM customers WHERE username = $1"});
    const user = await db.oneOrNone(checkIfUserExists, [username]);
    // console.log(user)
    if (user == null) {
        const hashedPassword = await bcrypt.hash(password, 8);

        const addUser = new PS({name: 'add-user', text: 'INSERT INTO customers(username, email, password) VALUES($1, $2, $3)'});
    
        db.none(addUser, [username, email, hashedPassword])
        res.status(200).send("Created User!");
    }
    else {
        res.status(401).send("Failed to create User, user already exists!");
    }
}
module.exports = register;