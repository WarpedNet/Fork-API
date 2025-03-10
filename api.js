const express = require('express');

const api = express();

// Fork CRUD

api.route("/fork")
.get(async (req, res) => {
    const getAllForks = require("./lib/Fork/getAllForks");
    const forks = getAllForks();
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

// WILL DELETE BELOW IF ABOVE WORKS

// api.put("/fork", async (req, res) => {
//     const data = req.body;
//     const createFork = require("./lib/Fork/createFork");
//     createFork(data.creatorID, data.parentID, data.recipeName, data.recipeDesc, data.recipeMethod, data.bannerImg, data.img, data.icon);
// })

// api.get("/fork", async (req, res) => {
//     const getAllForks = require("./lib/Fork/getAllForks");
//     const forks = getAllForks();
//     res.send(await forks);
// })
// api.get("/fork/:id", async (req, res) => {
//     const getFork = require("./lib/Fork/getFork");
//     const fork = getFork(req.params.id);
//     res.send(await fork);
// })
// //// INCOMPLETE
// api.post("/fork/:id", async (req, res) => {
//     const updateFork = require("./lib/Fork/updateFork");
//     updateFork(req.body);
// })

// //// INCOMPLETE
// api.delete("/fork/:id", async (req, res) => {
//     const deleteFork = require("./lib/Fork/deleteFork");
//     deleteFork(req.params.id);
// })





api.listen(process.env.API_PORT, () => {
    console.log(`API listening on port ${process.env.API_PORT}`);
})