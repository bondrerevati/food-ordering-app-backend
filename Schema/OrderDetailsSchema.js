const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customers",
  },

  total: {
    type: Number,
    required: true,
  },

  payment_id: {},
});
const OrderDetails = mongoose.model("orderDetails", schema);
module.exports = OrderDetails;
