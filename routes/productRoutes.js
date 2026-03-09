const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "supersecretkey";

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ➤ Add product (PROTECTED)
router.post("/add-product", auth, async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      sellerId: req.userId // 🔥 FROM TOKEN
    });

    await product.save();
    res.json({ message: "Product Added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Seller products (PROTECTED)
router.get("/seller-products", auth, async (req, res) => {
  const products = await Product.find({ sellerId: req.userId });
  res.json(products);
});

// ➤ Delete product (PROTECTED)
router.delete("/delete-product/:id", auth, async (req, res) => {
  await Product.findOneAndDelete({
    _id: req.params.id,
    sellerId: req.userId
  });

  res.json({ message: "Product deleted" });
});

// ➤ Get all products (PUBLIC)
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Get single product (PUBLIC)
router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;