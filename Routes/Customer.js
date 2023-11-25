const express = require("express");
const router = express.Router();
const Customers = require("../Schema/CustomerSchema");
const jwt = require("jsonwebtoken");
router.post("/signup", async (req, res) => {
  const { name, email, mobileNumber, password } = req.body;
  const isExists = await Customers.findOne({ email: email });
  if (isExists) {
    res.status(200).send({ message: "Customer already exists.", token: "customerExists" });
  } else {
    const Customer = new Customers({
      name: name,
      email: email,
      mobileNo: mobileNumber,
      password: password,
    });
    const customerAdded = await Customer.save();
    if (customerAdded) {
      const jwtToken = jwt.sign(customerAdded.toJSON(), "mysecretkey");
      res
        .status(200)
        .send({ message: "Customer added successfully.", token: jwtToken });
    } else {
      console.log("error");
    }
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const customerExists = await Customers.findOne({ email: email });
  if (customerExists) {
    if (customerExists.password === password) {
      const jwtToken = jwt.sign(customerExists.toJSON(), "mysecretkey");
      res.status(200).send({ message: "Login successful.", token: jwtToken });
    } else {
      res.status(403).send({ message: "Email or password is incorrect." });
    }
  } else {
    res.status(401).send({ message: "Customer is not registered." });
  }
});
router.get("/customer_details", async (req, res) => {
  const {_id} = jwt.verify(req.headers.authorization, "mysecretkey");
  const customerDetails = await Customers.findOne({
    _id: _id,
  });
  if (customerDetails) {
    const jwtToken = jwt.sign(customerDetails.toJSON(), "mysecretkey");
    res.status(200).send({ token: jwtToken });
  } else {
    res.status(500).send({ msg: "Internal Server Error" });
  }
});
router.put("/update", async (req, res) => {
  const { name, email, mobileNumber, password } = req.body;
  const { _id } = jwt.verify(req.headers.authorization, "mysecretkey");
  try {
    const update = await Customers.findOneAndUpdate(
      { _id: _id },
      {
        name: name,
        email: email,
        mobileNo: mobileNumber,
        password: password,
      }
    );
    if (update) {
      const jwtToken = jwt.sign(update.toJSON(), "mysecretkey");
      res
        .status(200)
        .send({message:"Customer details updated successfully!", token: jwtToken});
    }
  } catch (e) {
    res.status(500).send("Some error occurred.");
  }
});
module.exports = router;
