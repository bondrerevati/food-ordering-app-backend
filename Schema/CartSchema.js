const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
    },
    items: [
      {
        item_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Items",
        },
        restaurant_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Restaurants",
        },
        quantity: Number,
        name: String,
        price: String,
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Carts = mongoose.model("carts", schema);
module.exports = Carts;
