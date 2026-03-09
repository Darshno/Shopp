const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    description: String,
    image: String,
    type: String,
    sellerId: String
  },
  { timestamps: true }
);

// 🔒 SAFE export (prevents overwrite error)
module.exports =
  mongoose.models.product ||
  mongoose.model("product", productSchema);