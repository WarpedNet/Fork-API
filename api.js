const express = require('express');
const api = express();
const bodyParser = require('body-parser')
api.use(bodyParser.json({limit: '50mb'}))

// Fork CRUD

api.route("/fork")
.get(async (req, res) => {
    const getAllForks = require("./lib/Fork/getAllForks");
    const forks = getAllForks();
    // console.log("Get all forks")
    res.send(await forks);
})
.put(async (req, res) => {
    const data = req.body;
    if (data.token != null) {
        const jwt = require('jsonwebtoken');
        jwt.verify(data.token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                res.status(401).send("Invalid user token!");
            }
            else {
                if (data.centralID == null) {
                    const createFork = require("./lib/Fork/createFork");
                    createFork(user.userID, data.parentID, data.recipeName, data.recipeDesc, data.recipeMethod, data.bannerImg, data.icon, data.ingredients, res);
                }
                else {
                    const updateFork = require("./lib/Fork/updateFork");
                    updateFork(user.userID, data.centralID, data.recipeName, data.recipeMethod, data.recipeDesc, data.bannerImg, data.icon, data.ingredients);
                }
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
    getFork(req.params.id, res);
})
.delete(async (req, res) => {
    const deleteFork = require("./lib/Fork/deleteFork");
    await deleteFork(req.params.id);
    res.status(200).send("Fork deleted")
});

api.route("/search/:query")
.get(async (req, res) => {
    const searchFork = require("./lib/Fork/search");
    const forks = searchFork(req.params.query);
    res.send(await forks);
});

api.route("/register")
.put(async (req, res) => {
    // console.log("Register")
    const data = req.body;
    const createUser = require("./lib/Auth/register");
    if (data.username && data.email && data.password) {
        createUser(data.username, data.email, data.password, res);
    }
});

api.route("/login")
.post(async (req, res) => {
    // console.log("Login")
    const data = req.body;
    const login = require("./lib/Auth/login");
    login(data.username, data.password, res);
});

api.route("/user")
.post(async (req, res) => {
    // console.log("Get User Info")
    const data = req.body;
    const getUser = require("./lib/Auth/getUser");
    getUser(data.token, res);
})
.put(async (req, res) => {
    // console.log("Update User Info")
    const data = req.body;
    const updateUser = require("./lib/Auth/updateUser");
    updateUser(data, res);
});

api.route("/forks/user")
.post(async (req, res) => {
    // console.log("Get user forks")
    const data = req.body;
    const getUserForks = require("./lib/Fork/getUserForks");
    getUserForks(data, res);  
});

api.route("/comment")
.put(async (req, res) => {
    // console.log("Create comment")
    const data = req.body;
    const createComment = require("./lib/Fork/createComment");
    createComment(data, res);
});

api.listen(process.env.API_PORT, () => {
    console.log(`API listening on port ${process.env.API_PORT}`);
})

// Export for testing (Supertest runs its own server so no listen required)
// module.exports = api;