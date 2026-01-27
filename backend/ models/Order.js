const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  gasSize: String,
  gasBrand: String,
  price: Number,
  address: String,
  latitude: Number,
  longitude: Number,
  paymentMethod: { type: String, default: "Pay on Delivery" },
  paymentStatus: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
