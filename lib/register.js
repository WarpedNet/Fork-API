export async function register(username, password) {
    const db = require('./db')
    const {PreparedStatement: PS} = require('pg-promise')

    const addStatement = new PS({name: 'add-user', text: 'INSERT INTO Users(name, age) VALUES($1, $2)'});

    db.none(addUser, [username, password])
}
