const api = require("../api");
const supertest = require("supertest");
const supertestReq = supertest(api);
require("dotenv").config();

describe("Auth", () => {
    test ("Put /register should create user", async () => {
        await supertestReq.put("/register").send({username: "test11", email: "test11@test.com", password:"test11"});
        const res = await supertestReq.post("/login").send({username: "test11", password: "test11"})
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
        expect(res.body).toHaveProperty("token")
    });

    test ("Put /login with wrong details should fail", async () => {
        const res = await supertestReq.post("/login")
        expect(res.status).toEqual(401);
    })
})