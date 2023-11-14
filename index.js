var express = require("express");
var app = express();
var dotenv = require("dotenv");
dotenv.config();
var PORT = process.env.PORT;
let mongoose = require("mongoose");
let DBURL = process.env.DBURL;
var api = require("./api")
app.use(express.json());
app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  }
  console.log(PORT);
  console.log("Server started successfully at port " + PORT);
});
mongoose
  .connect(DBURL)
  .then(() => {
    console.log("connected to db");
  })
  .catch((e) => {
    console.log(e);
  });
  app.use("/",api)