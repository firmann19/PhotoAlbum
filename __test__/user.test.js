const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");

const userData = {
  username: "firman1911",
  email: "firmanramadhan@gmail.com",
  password: "firman11",
};

describe("POST /users/register", () => {
  it("Should send response with 201 status code", (done) => {
    request(app)
      .post("/users/register")
      .send(userData)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(201);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("username");
        expect(res.body).toHaveProperty("email");
        expect(res.body.username).toEqual(userData.username);
        expect(res.body.email).toEqual(userData.email);
        done();
      });
  });
});

describe("POST /users/login", () => {
  it("Should send response with 201 status code", (done) => {
    request(app)
      .post("/users/login")
      .send(userData)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(200);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("token");
        expect(typeof res.body.token).toEqual("string");
        done();
      });
  });
});


const wrongUser = {
  username: "delpia01",
  email: "delpiamaharani@gmail.com",
  password: "123456",
};

it("Should send response with 401 status code", (done) => {
  request(app)
    .post("/users/login")
    .send(wrongUser)
    .end(function (err, res) {
      if (err) {
        done(err);
      }
      expect(res.status).toEqual(401);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("name");
      expect(res.body).toHaveProperty("devMessage");
      expect(res.body.name).toEqual("User Login Error");
      done();
    });
});


afterAll((done) => {
  sequelize.queryInterface
    .bulkDelete("Users", {})
    .then(() => {
      return done();
    })
    .catch((err) => {
      console.log(err)
      done(err);
    });
});
