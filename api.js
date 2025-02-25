const express = require('express');

const api = express()

// Registering a user with a post request
api.post('/register', async (req, res) => {
    const user = await req.json();
    register(user.username, user.password)
})

// Temporary Get requests for testing
api.get('/register', (req, res) => {
    const username = req.query.username;
    const email = req.query.email;
    const password = req.query.password;
    const phone = req.query.phonenum;
    res.send(`Hello ${username}\nEmail: ${email}\nPassword: ${password}\nPhone: ${phone}`)

    const registerUser = require('./lib/register');
    registerUser(username, email, password, phone);
})

api.get('/newFork', (req, res) => {
    // const creatorID = req.query.id;
    // const recipeName = req.query.rname;
    // const recipeDesc = req.query.rdesc;
    // const recipeMethod = req.query.rmethod;
    const newFork = require('./lib/newFork');
    // newFork(creatorID, recipeName, recipeDesc, recipeMethod)

    // customer / Creator id
    // forkid of the parent / id of the recipe that is being forked
    // data 
    newFork(3, 16, "test3", "test3", "test3", null, null, null);
})

api.listen(process.env.API_PORT, () => {
    console.log(`API listening on port ${process.env.API_PORT}`)
})