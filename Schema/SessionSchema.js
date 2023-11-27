let mongoose = require("mongoose");

const schema = new mongoose.Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customers",
      },
      total: {
        type: Number,
        required: true,
      },
});

const Sessions = mongoose.model("sessions", schema);
module.exports = Sessions;