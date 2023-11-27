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
        quantity: Number,
      },
    ],
  });

const OrderedItems = mongoose.model("orderedItems", schema);
module.exports = OrderedItems;