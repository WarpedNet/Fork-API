async function register(username, email, password) {
    const db = require('../db')
    const {PreparedStatement: PS} = require('pg-promise')

    const addUser = new PS({name: 'add-user', text: 'INSERT INTO customers(username, email, password) VALUES($1, $2, $3)'});

    db.none(addUser, [username, email, password]).then(()=> {
        console.log(`Added user Username: ${username} | Email: ${email} | Password: ${password}`)
    })
}
module.exports = register;