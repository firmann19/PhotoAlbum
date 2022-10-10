const router = require("express").Router();

const PhotoController = require("../controllers/photoController");

router.get("/photos", PhotoController.GetAllPhotos);
router.get("/photos/:id", PhotoController.GetOnePhotoByID)
router.post("/photos", PhotoController.createPhoto)
router.put("/photos/:id", PhotoController.updateOnePhotoByID)
router.delete("/photos/:id", PhotoController.deleteOnePhotoByID)

module.exports = router;
