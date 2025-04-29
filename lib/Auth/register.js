async function register(username, email, password) {
    const db = require('../db')
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');

    const hashedPassword = await bcrypt.hash(password, 8);
    const {PreparedStatement: PS} = require('pg-promise')

    const addUser = new PS({name: 'add-user', text: 'INSERT INTO customers(username, email, password) VALUES($1, $2, $3)'});

    db.none(addUser, [username, email, hashedPassword]).then(()=> {
        console.log(`Added user Username: ${username} | Email: ${email} | Password: ${hashedPassword}`)
    })
}
module.exports = register;