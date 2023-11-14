let mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: Number,
    required: true,
  },
    password: {
    type: String,
    required: true,
  },
});

const Customers = mongoose.model("customers", schema);
module.exports = Customers;