async function register(username, email, password) {
    const db = require('../db')
    const bcrypt = require('bcryptjs');
    const {PreparedStatement: PS} = require('pg-promise');

    const checkIfUserExists = new PS({name: "check-user-exists", text: "SELECT * FROM customers WHERE email = $1"});
    const user = await db.oneOrNone(checkIfUserExists, [email]);
    console.log(user)
    if (user == null) {
        const hashedPassword = await bcrypt.hash(password, 8);

        const addUser = new PS({name: 'add-user', text: 'INSERT INTO customers(username, email, password) VALUES($1, $2, $3)'});
    
        db.none(addUser, [username, email, hashedPassword]).then(()=> {
            console.log(`Added user Username: ${username} | Email: ${email} | Password: ${hashedPassword}`)
        })
        return true;
    }
    else {
        return false;
    }
}
module.exports = register;