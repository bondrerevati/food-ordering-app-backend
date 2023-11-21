let mongoose = require("mongoose");

const schema = new mongoose.Schema({
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurants",
    },
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  }
});

const Items = mongoose.model("items", schema);
module.exports = Items;
