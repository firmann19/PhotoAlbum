const { Photo, User } = require("../models");

class PhotoController {
  static GetAllPhotos(req, res) {
    Photo.findAll({
      include: User,
    })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }

  static async GetOnePhotoByID(req, res) {
    let id = req.params.id;
    try {
      const photoId = Photo.findByPk(id)

      if (photoId) {
        return res.status(200).json(photoData);
      }
    } catch (error) {
      return res.status(404).json({ message: "id not found" });
    }
  }

  static async createPhoto(req, res) {
    const { title, caption, image_url } = req.body;
    const user = res.locals.user;

    try {
      if(!title) {
        throw{message: "title is undefined"}
      } 

      const photoData = await Photo.create({
        title,
        caption,
        image_url,
        UserId: user.id,
      });

      if (photoData) {
        return res.status(201).json(photoData);
      }

      return res.status(400).json({ message: "Bad Request" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static updateOnePhotoByID(req, res) {
    let id = req.params.id;
    const { title, caption, image_url } = req.body;

    let data = {
      title,
      caption,
      image_url,
    };

    Photo.update(data, {
      where: {
        id,
      },
      returning: true,
    })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }

  static deleteOnePhotoByID(req, res) {
    let id = req.params.id;
    Photo.destroy({
      where: {
        id,
      },
    })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
}

module.exports = PhotoController;
