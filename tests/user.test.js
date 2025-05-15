const api = require("../api");
const supertest = require("supertest");
const supertestReq = supertest(api);
require("dotenv").config();

describe("User", () => {
    test ("Post to /user with token should return username and password", async () => {
        await supertestReq.put("/register").send({username: "test12", email: "test12@test.com", password:"test12"});
        const res = await supertestReq.post("/login").send({username: "test12", password: "test12"})
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
        expect(res.body).toHaveProperty("token")

        const token = res.body.token;
        const userDetails = await supertestReq.post("/user").send({"token": token})
        expect(userDetails.status).toEqual(200);
        expect(userDetails.type).toEqual(expect.stringContaining('json'));
        expect(userDetails.body).toHaveProperty("username")
        expect(userDetails.body).toHaveProperty("email")
    });

    test ("Put to /user with token, new username, new email and new password should update user", async () => {
        // Creating test user & logging in
        await supertestReq.put("/register").send({username: "test13", email: "test13@test.com", password:"test13"});
        const res = await supertestReq.post("/login").send({username: "test13", password: "test13"})
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
        expect(res.body).toHaveProperty("token")

        // Updating user
        const token = res.body.token;
        const updateUser = await supertestReq.put("/user").send({
            "token": token,
            "username":"test14",
            "email":"test14@test.com",
            "password":"test14"
        })
        expect(updateUser.status).toEqual(200);

        const newLogin = await supertestReq.post("/login").send({username: "test14", password: "test14"})
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
        expect(res.body).toHaveProperty("token")
    });
});