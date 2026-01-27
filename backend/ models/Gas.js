const mongoose = require("mongoose");

const gasSchema = new mongoose.Schema({
  size: String,
  brand: String,
  price: Number,
  image: String,
  inStock: Boolean
});

module.exports = mongoose.model("Gas", gasSchema);
