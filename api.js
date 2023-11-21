const express = require("express");
const router = express.Router();
const customer = require("./Routes/Customer");
const restaurant = require("./Routes/Restaurant");
const item = require("./Routes/Item");
router.use("/customer", customer);
router.use("/restaurant", restaurant);
router.use("/item", item);
module.exports = router;
