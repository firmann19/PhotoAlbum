const router = require("express").Router();

const PhotoController = require("../controllers/photoController");

router.get("/photos", PhotoController.GetAllPhotos);

module.exports = router;
