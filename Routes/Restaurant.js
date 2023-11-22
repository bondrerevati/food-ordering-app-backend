const express = require("express");
const router = express.Router();
const Restaurants = require("../Schema/RestaurantSchema");
const jwt = require("jsonwebtoken");
router.post("/signup", async (req, res) => {
  const { name, email, address, openingTime, closingTime, password } = req.body;
  const isExists = await Restaurants.findOne({ email: email });
  if (isExists) {
    res
      .status(200)
      .send({
        message: "Restaurant already exists.",
        token: "restaurantExists",
      });
  } else {
    const Restaurant = new Restaurants({
      name: name,
      email: email,
      address: address,
      openingTime: openingTime,
      closingTime: closingTime,
      password: password,
    });
    const restaurantAdded = await Restaurant.save();
    console.log(restaurantAdded);
    if (restaurantAdded) {
      const jwtToken = jwt.sign(restaurantAdded.toJSON(), "mysecretkey");
      console.log(jwtToken);
      res
        .status(200)
        .send({ message: "Restaurant added successfully.", token: jwtToken });
    } else {
      console.log("error");
    }
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const restaurantExists = await Restaurants.findOne({ email: email });
  if (restaurantExists) {
    if (restaurantExists.password === password) {
      const jwtToken = jwt.sign(restaurantExists.toJSON(), "mysecretkey");
      res.status(200).send({ message: "Login successful.", token: jwtToken });
    } else {
      res.status(403).send({ message: "Email or password is incorrect." });
    }
  } else {
    res.status(401).send({ message: "Restaurant is not registered." });
  }
});
router.get("/list", async (req, res) => {
  const restaurants = await Restaurants.find({});
  if (restaurants) {
    res.status(200).send(restaurants);
  } else {
    res.status(200).send({ message: "Restaurants not found." });
  }
});
router.get("/restaurant_details", async (req, res) => {
  const decodeToken = jwt.verify(req.body.token, "mysecretkey");
  console.log(decodeToken);
  const restaurantDetails = await Restaurants.findOne({
    _id: decodeToken.r_id,
  });
  if (restaurantDetails) {
    const jwtToken = jwt.sign(restaurantDetails.toJSON(), "mysecretkey");
    res.status(200).send({ token: jwtToken });
  } else {
    res.status(500).send({ msg: "Internal Server Error" });
  }
});
router.put("/update", async (req, res) => {
  const { name, email, address, openingTime, closingTime, password } = req.body;
  const { _id } = jwt.verify(req.body.headers.Authorization, "mysecretkey");
  try {
    const update = await Restaurants.findOneAndUpdate(
      { _id: _id },
      {
        name: name,
        email: email,
        address: address,
        openingTime: openingTime,
        closingTime: closingTime,
        password: password,
      }
    );
    if (update) {
      res
        .status(200)
        .send({message:"Restaurant details updated successfully!"});
    }
  } catch (e) {
    res.status(500).send("Some error occurred.");
  }
});
module.exports = router;
