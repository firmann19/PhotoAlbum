const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");


describe("GET /photos", () => {
  it("Should send response with 201 status code", (done) => {
    request(app)
      .post("/photos")
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        expect(200)
        done();
      });
  });
});

describe("GET /photos/:id", () => {
    it("Should send response with 201 status code", (done) => {
      request(app)
        .post("/photos/4")
        .end(function (err, res) {
          if (err) {
            done(err);
          }
          expect(200)
          done();
        });
    });
  });

  describe("POST /photos", () => {
    it("Should send response with 201 status code", (done) => {
      request(app)
        .post("/photos")
        .send({
            title: "Foto Bersama Dia",
            caption: "Ini foto pertama dengan dia",
            image_url: "https://photobersamadia.com",
            UserId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        .end(function (err, res) {
          if (err) {
            done(err);
          }
          expect(201)
          done();
        });
    });
  });

afterAll((done) => {
  sequelize.queryInterface
    .bulkDelete("Photos", {})
    .then(() => {
      return done();
    })
    .catch((err) => {
      console.log(err);
      done(err);
    });
});
