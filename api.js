const express = require('express');
const api = express();
const bodyParser = require('body-parser')
api.use(bodyParser.json({limit: '50mb'}))

// Fork CRUD

api.route("/fork")
.get(async (req, res) => {
    const getAllForks = require("./lib/Fork/getAllForks");
    const forks = getAllForks();
    console.log("Sending all forks")
    res.send(await forks);
})
.put(async (req, res) => {
    const data = req.body;
    if (data.token != null) {
        const jwt = require('jsonwebtoken');
        const createFork = require("./lib/Fork/createFork");
        jwt.verify(data.token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                res.status(401).send("Invalid user token!");
            }
            else {
                createFork(user.userID, data.parentID, data.recipeName, data.recipeDesc, data.recipeMethod, data.bannerImg, data.icon);
                res.status(200).send("Fork created!")
            }
        })
    }
    else {
        res.status(401).send("Error, user token required!")
    }

});

api.route("/fork/:id")
.get(async (req, res) => {
    const getFork = require("./lib/Fork/getFork");
    const fork = getFork(req.params.id);
    res.send(await fork);
})
.post(async (req, res) => {
    const updateFork = require("./lib/Fork/updateFork");
    updateFork(req.body);
})
.delete(async (req, res) => {
    const deleteFork = require("./lib/Fork/deleteFork");
    deleteFork(req.params.id);
});

api.route("/register")
.put(async (req, res) => {
    const data = req.body;
    const createUser = require("./lib/Auth/register");
    const success = await createUser(data.username, data.email, data.password);
    if (success) {
        res.status(200).send("Created User!");
    }
    else {
        res.status(401).send("Failed to create User, user already exists!");
    }
})

api.route("/login")
.post(async (req, res) => {
    const data = req.body;
    const login = require("./lib/Auth/login");
    const token = await login(data.username, data.password);
    if (token != null) {
        res.json({token: token})
    }
    else {
        res.status(401).send("Incorrect Login Details");
    }
});


api.listen(process.env.API_PORT, () => {
    console.log(`API listening on port ${process.env.API_PORT}`);
})