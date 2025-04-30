const express = require('express');

const api = express();

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
    const createFork = require("./lib/Fork/createFork");
    createFork(data.creatorID, data.parentID, data.recipeName, data.recipeDesc, data.recipeMethod, data.bannerImg, data.img, data.icon);  
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
    const success = createUser(data.username, data.email, data.password);
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
    const token = login(data.username, data.email, data.password);
    if (token) {
        res.status(200).send({ token })
    }
    else {
        res.status(401).send("Incorrect Login Details");
    }
});


api.listen(process.env.API_PORT, () => {
    console.log(`API listening on port ${process.env.API_PORT}`);
})