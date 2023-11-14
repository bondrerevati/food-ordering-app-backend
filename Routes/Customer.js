const express = require("express");
const router = express.Router();
const Customers = require("../Schema/CustomerSchema");
const jwt = require("jsonwebtoken");
router.post("/signup", async (req, res) => {
  const { name, email, mobileNo, password } = req.body;
  console.log(req.body);
    const isExists = await Customers.findOne({ email: email });
    if (isExists) {
      res.status(200).send({ message: "Customer already exists." });
    } else {
      const Customer = new Customers({
        name: name,
        email: email,
        mobileNo: mobileNo,
        password: password,
      });
      const customerAdded = await Customer.save();
      console.log(customerAdded)
      if (customerAdded) {
        const jwtToken = jwt.sign(customerAdded.toJSON(), "mysecretkey");
        console.log(jwtToken)
        res
          .status(200)
          .send({ message: "Customer added successfully.", token: jwtToken });
      } else {
        console.log("error");
      }
    }
});
module.exports = router;
