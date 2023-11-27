const express = require("express");
const router = express.Router();
const Carts = require("../Schema/CartSchema");
const Items = require("../Schema/ItemSchema");
const Sessions = require("../Schema/SessionSchema");
const OrderDetails = require("../Schema/OrderDetailsSchema");
const OrderedItems = require("../Schema/OrderedItemsSchema");
const jwt = require("jsonwebtoken");
const { default: axios } = require("axios");
router.post("/addtocart", async (req, res) => {
  const { foodItem } = req.body;
  const decodeToken = jwt.verify(req.headers.authorization, "mysecretkey");
  try {
    let cart = await Carts.findOne({ customer_id: decodeToken._id });

    if (cart) {
      let itemIndex = cart.items.findIndex(
        (item) => item.item_id == foodItem._id
      );
      if (itemIndex > -1) {
        let productItem = cart.items[itemIndex];
        productItem.quantity = productItem.quantity + 1;
        cart.items[itemIndex] = productItem;
      } else {
        cart.items.push({
          item_id: foodItem._id,
          restaurant_id: foodItem.restaurant_id,
          quantity: 1,
          name: foodItem.name,
          price: foodItem.price,
        });
      }
      const itemAdded = await cart.save();
      if (itemAdded) {
        const cart_items = await Carts.find({ customer_id: decodeToken._id });
        let productPrices = cart_items[0].items.map(async (elem) => {
          return {
            product: await Items.findById({ _id: elem.item_id }),
            quantity: elem.quantity,
          };
        });
        Promise.all(productPrices).then(async (resp) => {
          let shopping_total = 0;
          resp.forEach((elem) => {
            shopping_total +=
              Number(elem.product.price) * Number(elem.quantity);
          });
          const update_shopping_session = await Sessions.findOneAndUpdate(
            { customer_id: decodeToken._id },
            { $set: { total: shopping_total } }
          );
          if (update_shopping_session) {
            res.status(200).send({
              message: "Cart and shopping session updated successfully",
              result: resp,
            });
          }
        });
      }
    } else {
      const newCart = await Carts.create({
        customer_id: decodeToken._id,
        items: [
          {
            item_id: foodItem._id,
            restaurant_id: foodItem.restaurant_id,
            quantity: 1,
            name: foodItem.name,
            price: foodItem.price,
          },
        ],
      });
      if (newCart) {
        const cartExist = await Carts.find({ customer_id: decodeToken._id });
        if (cartExist) {
          let total = 0;
          let productsInCart = cartExist[0].items.map(async (elem) => {
            return {
              product: await Items.findById({ _id: elem.item_id }),
              quantity: elem.quantity,
            };
          });
          Promise.all(productsInCart).then(async (resp) => {
            resp.forEach((elem) => {
              total =
                total + Number(elem.product.price) * Number(elem.quantity);
            });
            const shopping_session_exists = await Sessions.findOne({
              customer_id: decodeToken._id,
            });
            if (shopping_session_exists) {
              const update_total = await Sessions.findOneAndUpdate(
                { customer_id: decodeToken._id },
                { $set: { total: total } }
              );

              if (update_total) {
                res.status(200).send({
                  message: "updated shopping session as well",
                  result: resp,
                });
              }
            } else {
              const shopping_session = {
                customer_id: decodeToken._id,
                total: total,
              };

              const Session_details = new Sessions(shopping_session);
              const session_created = await Session_details.save();
              if (newCart && session_created) {
                res.status(200).send({
                  msg: "data added successfully",
                  result: resp,
                });
              }
            }
          });
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});
router.get("/getitemsbyid", async (req, res) => {
  try {
    const { _id } = jwt.verify(req.headers.authorization, "mysecretkey");
    const getItems = await Carts.find({ customer_id: _id });
    res.status(200).json(getItems);
  } catch (error) {
    res.status(400).json(error);
  }
});
router.put("/updateitemquantity", async (req, res) => {
  const { cartItemData, newQuantity } = req.body;
  const decodeToken = jwt.verify(req.headers.authorization, "mysecretkey");
  let cart = await Carts.findOne({
    customer_id: decodeToken._id,
  });
  let itemIndex = cart.items.findIndex(
    (item) => item.item_id == cartItemData.item_id
  );
  if (itemIndex > -1) {
    let productItem = cart.items[itemIndex];
    productItem.quantity = Number(newQuantity);
    cart.items[itemIndex] = productItem;
  }
  const itemUpdated = await cart.save();
  if (itemUpdated) {
    const cart_items = await Carts.find({ customer_id: decodeToken._id });
    let productPrices = cart_items[0].items.map(async (elem) => {
      return {
        product: await Items.findById({ _id: elem.item_id }),
        quantity: elem.quantity,
      };
    });
    Promise.all(productPrices).then(async (resp) => {
      let shopping_total = 0;
      resp.forEach((elem) => {
        shopping_total += Number(elem.product.price) * Number(elem.quantity);
      });
      const update_shopping_session = await Sessions.findOneAndUpdate(
        { customer_id: decodeToken._id },
        { $set: { total: shopping_total } }
      );
      if (update_shopping_session) {
        res.status(200).send({
          message: "Cart and shopping session updated successfully",
          result: resp,
        });
      }
    });
  }
});
router.delete("/deleteitem", async (req, res) => {
  const { cartItemData } = req.body;
  const decodeToken = jwt.verify(req.headers.authorization, "mysecretkey");
  let cart = await Carts.findOneAndUpdate(
    {
      customer_id: decodeToken._id,
    },
    {
      $pull: {
        items: {
          item_id: cartItemData.item_id,
        },
      },
    }
  );
  if (cart) {
    const cart_items = await Carts.find({ customer_id: decodeToken._id });
    let productPrices = cart_items[0].items.map(async (elem) => {
      return {
        product: await Items.findById({ _id: elem.item_id }),
        quantity: elem.quantity,
      };
    });
    Promise.all(productPrices).then(async (resp) => {
      let shopping_total = 0;
      resp.forEach((elem) => {
        shopping_total += Number(elem.product.price) * Number(elem.quantity);
      });
      const update_shopping_session = await Sessions.findOneAndUpdate(
        { customer_id: decodeToken._id },
        { $set: { total: shopping_total } }
      );
      if (update_shopping_session) {
        res.status(200).send({
          message: "Cart and shopping session updated successfully",
          result: resp,
        });
      }
    });
  }
});
router.post("/checkout", async (req, res) => {
  const token = req.headers.authorization;
  const { _id } = jwt.verify(req.headers.authorization, "mysecretkey");
  const getTotalPrice = await Sessions.findOne({ customer_id: _id });
  if (getTotalPrice && getTotalPrice.total) {
    const fetchCart = await Carts.find({ customer_id: _id });
    if (fetchCart) {
      let itemsInCart = fetchCart[0].items.map(async (element) => {
        return {
          item: await Items.findById(element.item_id),
          quantity: element.quantity,
        };
      });
      Promise.all(itemsInCart).then(async (response) => {
        const newOrderData = {
          customer_id: _id,
          total: getTotalPrice.total,
        };
        const order = new OrderDetails(newOrderData);
        const newOrderAdded = await order.save();
        if (newOrderAdded) {
          const orderedItems = new OrderedItems({
            order_id: newOrderAdded._id,
          });
          const orderAdded = await orderedItems.save();
          console.log(orderAdded);
          if (orderAdded) {
            const orderSuccess = response.map(async (element) => {
              let updatedData = await OrderedItems.updateOne(
                {
                  order_id: newOrderAdded._id,
                },
                {
                  $push: {
                    items: {
                      item_id: element.item._id,
                      quantity: element.quantity,
                    },
                  },
                }
              );
              console.log(updatedData);
            });
            console.log(orderSuccess);
            Promise.all(orderSuccess).then(async (response) => {
                const cleanup = await axios.post(
                  "http://localhost:8080/cart/cleanup",
                  {},
                  {
                    headers: {
                      Authorization: token,
                    },
                  }
                );
                if (response && cleanup.status == 200) {
                  res.status(200).send("order created successfully");
                }
            });
          }
        }
      });
    }
  }
});
router.post("/cleanup", async (req, res) => {
  const { _id } = jwt.verify(req.headers.authorization, "mysecretkey");
  const cleanup = await Carts.deleteMany({ customer_id: _id });
  const deleteSession = await Sessions.deleteOne({ customer_id: _id });

  if (cleanup && deleteSession) {
    res.status(200).send("successful");
  }
});
module.exports = router;
