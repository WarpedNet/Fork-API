const express = require('express');
import { register } from './lib/register';

const api = express()

// Registering a user with a post request
api.post('/register', async (req, res) => {
    const user = await req.json();
    register(user.username, user.password)
})