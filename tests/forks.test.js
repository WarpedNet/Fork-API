const api = require("../api");
const supertest = require("supertest");
const supertestReq = supertest(api);
require("dotenv").config();

describe("Fork", () => {
    test ("GET /fork should return all forks", async () => {
        const res = await supertestReq.get("/fork");
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
    });

    test ("PUT /fork should add a fork", async () => {
        // Register test user and login
        await supertestReq.put("/register").send({username: "test15", email: "test15@test.com", password:"test15"});
        const res = await supertestReq.post("/login").send({username: "test15", password: "test15"})
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
        expect(res.body).toHaveProperty("token")

        const token = res.body.token;

        const fork = await supertestReq.put("/fork").send({
            token: token,
            recipeName: "test15",
            recipeDesc: "test15"
        })
        expect(fork.status).toEqual(200);
        expect(fork.type).toEqual(expect.stringContaining('json'));
        expect(fork.body).toHaveProperty("centralID")
    });

    test ("GET to /fork/:id should get fork by id", async () => {
        // Register test user and login
        await supertestReq.put("/register").send({username: "test16", email: "test16@test.com", password:"test16"});
        const res = await supertestReq.post("/login").send({username: "test16", password: "test16"});
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
        expect(res.body).toHaveProperty("token");

        const token = res.body.token;

        // Create a fork
        const fork = await supertestReq.put("/fork").send({
            token: token,
            recipeName: "test16",
            recipeDesc: "test16"
        })
        expect(fork.status).toEqual(200);
        expect(fork.type).toEqual(expect.stringContaining('json'));
        expect(fork.body).toHaveProperty("centralID")

        const forkID = fork.body.centralID;

        // Get the fork
        const getFork = await supertestReq.get(`/fork/${forkID}`);
        expect(getFork.status).toEqual(200);
        expect(getFork.type).toEqual(expect.stringContaining('json'));

        expect(getFork.body).toHaveProperty("creatorName");
        expect(getFork.body).toHaveProperty("recipeName");
        expect(getFork.body).toHaveProperty("recipeDesc");
        expect(getFork.body).toHaveProperty("method");
        expect(getFork.body).toHaveProperty("banner");
        expect(getFork.body).toHaveProperty("icon");
        expect(getFork.body).toHaveProperty("count");
        expect(getFork.body).toHaveProperty("ingredients");
    })

    test ("DELETE to /fork/:id should delete fork by id", async () => {
        // Register test user and login
        await supertestReq.put("/register").send({username: "test17", email: "test17@test.com", password:"test17"});
        const res = await supertestReq.post("/login").send({username: "test17", password: "test17"});
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
        expect(res.body).toHaveProperty("token");

        const token = res.body.token;

        // Create a fork
        const fork = await supertestReq.put("/fork").send({
            token: token,
            recipeName: "test17",
            recipeDesc: "test17"
        })
        expect(fork.status).toEqual(200);
        expect(fork.type).toEqual(expect.stringContaining('json'));
        expect(fork.body).toHaveProperty("centralID")

        const forkID = fork.body.centralID;

        // Get the fork
        const getFork = await supertestReq.get(`/fork/${forkID}`);
        expect(getFork.status).toEqual(200);
        expect(getFork.type).toEqual(expect.stringContaining('json'));

        expect(getFork.body).toHaveProperty("creatorName");
        expect(getFork.body).toHaveProperty("recipeName");
        expect(getFork.body).toHaveProperty("recipeDesc");
        expect(getFork.body).toHaveProperty("method");
        expect(getFork.body).toHaveProperty("banner");
        expect(getFork.body).toHaveProperty("icon");
        expect(getFork.body).toHaveProperty("count");
        expect(getFork.body).toHaveProperty("ingredients");

        // Delete fork
        await supertestReq.delete(`/fork/${forkID}`);

        // Try to get fork again
        const getDeletedFork = await supertestReq.get(`/fork/${forkID}`);
        expect(getDeletedFork.status).toEqual(404);
    })

    test ("POST to /forks/user should return user forks", async () => {
        // Creating test user & logging in
        await supertestReq.put("/register").send({username: "test18", email: "test18@test.com", password:"test18"});
        const res = await supertestReq.post("/login").send({username: "test18", password: "test18"})
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
        expect(res.body).toHaveProperty("token")

        const token = res.body.token

        // Create a fork
        const fork = await supertestReq.put("/fork").send({
            token: token,
            recipeName: "test18",
            recipeDesc: "test18"
        })
        expect(fork.status).toEqual(200);
        expect(fork.type).toEqual(expect.stringContaining('json'));
        expect(fork.body).toHaveProperty("centralID")

        const getUserForks = await supertestReq.post("/forks/user").send({"token": token});
        expect(getUserForks.status).toEqual(200);
        expect(getUserForks.type).toEqual(expect.stringContaining('json'));
        expect(getUserForks.body).toHaveLength(1);
    });
})