const express = require("express");
const router = express.Router();
const Restaurants = require("../Schema/RestaurantSchema");
const OrderedItems = require("../Schema/OrderedItemsSchema");
const jwt = require("jsonwebtoken");
router.get("/getordersbyid", async (req, res) => {
  try {
    const { _id } = jwt.verify(req.headers.authorization, "mysecretkey");
    const getItems = await OrderedItems.find({
      items: { $elemMatch: { restaurant_id: _id } },
    });
    res.status(200).json(getItems);
  } catch (error) {
    res.status(400).json(error);
  }
});
router.post("/update_order_status", async (req, res) => {
  try {
    console.log(req);
    const { order_id, item_id } = req.body;
    let order = await OrderedItems.findOne({
      _id: order_id,
    });
    let itemIndex = order.items.findIndex((item) => item.item_id == item_id);
    if (itemIndex > -1) {
      let productItem = order.items[itemIndex];
      productItem.active = false;
      order.items[itemIndex] = productItem;
    }
    const itemUpdated = await order.save();
    res.status(200).send({ message: "Updated status successfully" });
  } catch (error) {
    res.status(400).json(error);
  }
});
module.exports = router;
