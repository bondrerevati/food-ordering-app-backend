const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OrderDetails",
  },

  items: [
    {
      item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Items",
      },
      item_name: String,
      restaurant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurants",
      },
      quantity: Number,
      active: {
        type: Boolean,
        default: true,
      },
    },
  ],
});

const OrderedItems = mongoose.model("orderedItems", schema);
module.exports = OrderedItems;
