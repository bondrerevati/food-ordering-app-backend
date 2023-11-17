const express = require("express");
const router = express.Router();
const Restaurants = require("../Schema/RestaurantSchema");
const jwt = require("jsonwebtoken");
router.post("/signup", async (req, res) => {
  const { name, email, address, openingTime, closingTime, password } = req.body;
  console.log(req.body);
  const isExists = await Restaurants.findOne({ email: email });
  if (isExists) {
    res.status(200).send({ message: "Restaurant already exists.", token: "restaurantExists" });
  } else {
    const Restaurant = new Restaurants({
      name: name,
      email: email,
      address: address,
      openingTime: openingTime,
      closingTime:closingTime,
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
module.exports = router;
