async function register(username, email, password, phone) {
    const db = require('./db')
    const {PreparedStatement: PS} = require('pg-promise')

    const addUser = new PS({name: 'add-user', text: 'INSERT INTO Customers(username, email, password, phone) VALUES($1, $2, $3, $4)'});

    db.none(addUser, [username, email, password, phone]).then(()=> {
        console.log(`Added user Username: ${username} | Email: ${email} | Password: ${password} | Phone: ${phone}`)
    })
}
module.exports = register;