const { generateToken } = require("../helpers/jwt");
const { sequelize } = require("../models");
const request = require("supertest");
const app = require("../app");

let token = "";
let wrongToken = "token salah";

let photoId = "";
let wrongPhotoId = 2222;

const userData = {
  id: 1,
  username: "firman1911",
  email: "firmanramadhan@gmail.com",
  password: "firman11",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const photoData = {
  id: 1,
  title: "Photo Mas Firman",
  caption: "Foto  remaja",
  image_url: "http://photomasfirman.com",
};

const wrongPhotoData = {
  title : "",
  caption : "",
  image_url : "",
}

beforeAll((done) => {
  sequelize.queryInterface
    .bulkInsert("Users", [userData], {})
    .then(() => {
      token = generateToken({
        id: userData.id,
        username: userData.username,
        email: userData.email,
      });
      return done();
    })
    .catch((err) => {
      done(err);
    });
});

/**
 * Test createPhoto
 */
// Success
describe("POST /photos", () => {
  it("should send response with 201 status code", (done) => {
    request(app)
      .post("/photos")
      .set("token", token)
      .send(photoData)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(201);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("title");
        expect(res.body).toHaveProperty("caption");
        expect(res.body).toHaveProperty("image_url");
        expect(res.body).toHaveProperty("UserId");
        expect(res.body.title).toEqual(photoData.title);
        done();
      });
  });
});

// Error
  describe("POST /photos", () => {
  it("should send response with 400 status code", (done) => {
    request(app)
      .post("/photos")
      .set("token", token)
      .send(wrongPhotoData)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(500);
        done();
      });
  });
});

/**
 * Test getAllPhotos
 */
// Success
 describe("GET /photos", () => {
  it("should send response with 200 status code", (done) => {
    request(app)
      .get("/photos")
      .set("token", token)
      .end(function (err, res) {
        if (err) {
          done(err);
        }

        expect(res.status).toEqual(200);
        done();
      });
  });
});

// Error
describe("GET /photos", () => {
  it("should send response with 401 status code", (done) => {
    request(app)
      .get("/photos")
      .set("wrongToken", wrongToken)
      .end(function (err, res) {
        if (err) {
          done(err);
        }

        expect(res.status).toEqual(401);
        done();
      });
  });
});

/**
 * Test getOnePhotoById
 */
// Success
 describe("GET /photos/:id", () => {
  it("should send response with 200 status code", (done) => {
    request(app)
      .get(`/photos/${photoId}`)
      .set("token", token)
      .end(function (err, res) {
        if (err) {
          done(err);
        }

        expect(res.status).toEqual(200);
        done();
      });
  });
});

// Error
describe("GET /photos/:id", () => {
  it("should send response with 404 status code", (done) => {
    request(app)
      .get(`/photos/${wrongPhotoId}`)
      .set("token", token)
      .end(function (err, res) {
        if (err) {
          done(err);
        }

        expect(res.status).toEqual(404);
        done();
      });
  });
});

afterAll((done) => {
  sequelize.queryInterface
    .bulkDelete("Users", {})
    .then(() => {
      return done();
    })
    .catch((err) => {
      done(err);
    });

  sequelize.queryInterface
    .bulkDelete("Photos", {})
    .then(() => {
      return done();
    })
    .catch((err) => {
      done(err);
    });
});
