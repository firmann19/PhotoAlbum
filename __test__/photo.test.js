const { generateToken } = require("../helpers/jwt");
const { sequelize } = require("../models");
const request = require("supertest");
const app = require("../app");

let token = "";
let wrongToken = "token salah";

let photoId = "";
let wrongPhotoId = 688772;

const userData = {
  username : "firman1911",
  email : "firmanramadhan@gmail.com",
  password : "firman11",
}

const photoData = {
  title : "gambar 1",
  caption : "ini gambar 1",
  image_url : "ini link gambar 1",
}
const wrongPhotoData = {
  title : "",
  caption : "",
  image_url : "",
}


beforeAll((done) => {
    // create user
    request(app)
        .post('/user/register')
        .send(userData)
        .end(function (err,res) {
            if(err) {
                done(err)
            }

            let payload = {
                id: res.body.data.id,
                email: res.body.data.email,
            }

            token = generateToken(payload);

            // insert photo
            request(app)
                .post('/photo')
                .set('token',token)
                .send(photoData)
                .end(function (err,res) {
                    if(err) {
                        done(err)
                    }

                    photoId = res.body.data.id;
                    done()
                })
        })
})

/**
 * Test getAllPhotos
 */
// Success
describe("GET /photos", () => {
  it("should send response with 200 status code", (done) => {
      request(app)
          .get('/photos')
          .set('token',token)
          .end(function (err,res) {
              if(err) {
                  done(err)
              }

              expect(res.status).toEqual(200);
              expect(typeof res.body).toEqual("object");
              expect(res.body).toHaveProperty("error");
              expect(res.body).toHaveProperty("code");
              expect(res.body).toHaveProperty("data");
              expect(res.body.error).toEqual(false);
              expect(res.body.code).toEqual(200);
              expect(typeof res.body.data).toEqual("object");
              done()
          })
          
  })
})

// Error
describe("GET /photos", () => {
  it("should send response with 401 status code", (done) => {
      request(app)
          .get('/photos')
          .set('token',wrongToken)
          .end(function (err,res) {
              if(err) {
                  done(err)
              }

              expect(res.status).toEqual(401);
              expect(typeof res.body).toEqual("object");
              expect(res.body).toHaveProperty("error");
              expect(res.body).toHaveProperty("code");
              expect(res.body).toHaveProperty("message");
              expect(res.body.error).toEqual(true);
              expect(res.body.code).toEqual(401);
              expect(res.body.message).toEqual("Unauthorized");
              done()
          })
          
  })
})

/**
* Test getOnePhotoById
*/
// Success
describe("GET /photos/:id", () => {
  it("should send response with 200 status code", (done) => {
      request(app)
          .get(`/photos/${photoId}`)
          .set('token',token)
          .end(function (err,res) {
              if(err) {
                  done(err)
              }

              expect(res.status).toEqual(200);
              expect(typeof res.body).toEqual("object");
              expect(res.body).toHaveProperty("error");
              expect(res.body).toHaveProperty("code");
              expect(res.body).toHaveProperty("data");
              expect(res.body.error).toEqual(false);
              expect(res.body.code).toEqual(200);
              expect(res.body.data).toHaveProperty("id");
              expect(res.body.data).toHaveProperty("title");
              expect(res.body.data).toHaveProperty("caption");
              expect(res.body.data).toHaveProperty("image_url");
              expect(res.body.data).toHaveProperty("createdAt");
              expect(res.body.data).toHaveProperty("updatedAt");
              done()
          })
          
  })
})

// Error
describe("GET /photos/:id", () => {
  it("should send response with 404 status code", (done) => {
      request(app)
          .get(`/photos/${wrongPhotoId}`)
          .set('token',token)
          .end(function (err,res) {
              if(err) {
                  done(err)
              }

              expect(res.status).toEqual(404);
              expect(typeof res.body).toEqual("object");
              expect(res.body).toHaveProperty("error");
              expect(res.body).toHaveProperty("code");
              expect(res.body).toHaveProperty("message");
              expect(res.body.error).toEqual(true);
              expect(res.body.code).toEqual(404);
              expect(res.body.message).toEqual("photo not found");
              done()
          })
          
  })
})

/**
* Test createPhoto
*/
// Success
describe("POST /photos", () => {
  it("should send response with 201 status code", (done) => {

      request(app)
          .post('/photos')
          .set('token',token)
          .send(photoData)
          .end(function (err,res) {
              if(err) {
                  done(err)
              }

              expect(res.status).toEqual(201);
              expect(typeof res.body).toEqual("object");
              expect(res.body).toHaveProperty("error");
              expect(res.body).toHaveProperty("code");
              expect(res.body).toHaveProperty("message");
              expect(res.body).toHaveProperty("data");
              expect(res.body.error).toEqual(false);
              expect(res.body.code).toEqual(201);
              expect(res.body.message).toEqual("new photo created");
              expect(res.body.data).toHaveProperty("id");
              expect(res.body.data).toHaveProperty("title");
              expect(res.body.data).toHaveProperty("caption");
              expect(res.body.data).toHaveProperty("image_url");
              expect(res.body.data).toHaveProperty("createdAt");
              expect(res.body.data).toHaveProperty("updatedAt");
              done()
          })
          
  })
})

// Error
describe("POST /photos", () => {
  it("should send response with 400 status code", (done) => {

      request(app)
          .post('/photos')
          .set('token',token)
          .send(wrongPhotoData)
          .end(function (err,res) {
              if(err) {
                  done(err)
              }

              expect(res.status).toEqual(400);
              expect(typeof res.body).toEqual("object");
              expect(res.body).toHaveProperty("error");
              expect(res.body).toHaveProperty("code");
              expect(res.body).toHaveProperty("message");
              expect(res.body).toHaveProperty("errors");
              expect(res.body.error).toEqual(true);
              expect(res.body.code).toEqual(400);
              expect(res.body.message).toEqual("bad request");
              expect(typeof res.body.errors).toEqual("object");
              done()
          })
          
  })
})

afterAll((done) => {
  sequelize.queryInterface.bulkDelete("Users", {})
      .then(() => {
          sequelize.queryInterface.bulkDelete("Photos", {})
              .then(() => {
                  return done()
              })
              .catch((err) => {
                  done(err)
              })
      })
      .catch((err) => {
          done(err)
      })
})