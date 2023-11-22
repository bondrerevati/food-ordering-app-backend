const express = require("express");
const router = express.Router();
const Items = require("../Schema/ItemSchema");
const multer = require("multer");
const cloudinary = require("../helper/CloudinaryConfig");
const jwt = require("jsonwebtoken");
const imgConfig = multer.diskStorage({});
const imgFilter = (req, file, callback) => {
  if (
    file.mimetype.split("/")[1] === "jpeg" ||
    file.mimetype.split("/")[1] === "jpg" ||
    file.mimetype.split("/")[1] === "png"
  ) {
    callback(null, true);
  } else {
    callback(new multer.MulterError(-1), false);
  }
};
const upload = multer({
  storage: imgConfig,
  fileFilter: imgFilter,
}).single("image");

const uploadImage = (req, res, next) => {
  try {
    upload(req, res, (err) => {
      if (err) {
        if (err.code === -1) {
          return res.status(422).send({
            message:
              "Invalid file type! Please upload images in .png, jpg, jpeg format only",
          });
        }
      } else {
        next();
      }
    });
  } catch (e) {
    console.log(e);
  }
};
router.post("/additem", uploadImage, async (req, res) => {
  try {
    const { name, price, quantity, description } = req.body;
    const decodeToken = jwt.verify(req.headers.authorization, "mysecretkey");
    if (req.file) {
      const uploadedImage = await cloudinary.uploader.upload(req.file.path);
      if (uploadedImage) {
        const Item = new Items({
          restaurant_id: decodeToken._id,
          name: name,
          imageUrl: uploadedImage.secure_url,
          price: price,
          quantity: quantity,
          description: description,
        });
        const itemAdded = await Item.save();
        if (itemAdded) {
          res.status(200).send({ message: "Item added successfully." });
        } else {
          console.log("error");
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
});
router.get("/getitems", async (req, res) => {
  try {
    const getItems = await Items.find();
    res.status(200).json(getItems);
  } catch (error) {
    res.status(400).json(error);
  }
});
router.get("/getitemsbyid", async (req, res) => {
  try {
    const { _id } = jwt.verify(req.body.headers.Authorization, "mysecretkey");
    const getItems = await Items.find({ restaurant_id: _id });
    res.status(200).json(getItems);
  } catch (error) {
    res.status(400).json(error);
  }
});
module.exports = router;
