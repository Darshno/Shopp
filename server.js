const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const productRoutes = require("./routes/productRoutes");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const Order = require("./models/order");

const JWT_SECRET = "supersecretkey";
const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Limit payload size

// Serve static files
app.use(express.static(__dirname));

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

// ROUTES
app.use("/api", productRoutes);

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ name, email, password });
    await user.save();

    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create order
app.post("/api/orders", auth, async (req, res) => {
  try {
    console.log("Creating order for user:", req.userId);
    console.log("Order data:", req.body);

    const order = new Order({
      userId: req.userId,
      customer: req.body.customer,
      items: req.body.items,
      subtotal: req.body.subtotal,
      tax: req.body.tax,
      total: req.body.total,
      status: "placed"
    });

    await order.save();
    console.log("Order saved successfully:", order._id);
    res.json({ message: "Order placed successfully", orderId: order._id });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Error creating order", error: err.message });
  }
});

// Get all orders (admin/seller only) - MUST come before /api/orders/:id
app.get("/api/all-orders", auth, async (req, res) => {
  try {
    console.log("Fetching all orders for admin");
    const orders = await Order.find()
      .sort({ createdAt: -1 });
    console.log(`Found ${orders.length} orders`);
    res.json(orders);
  } catch (err) {
    console.error("Error fetching all orders:", err);
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
});

// Get user orders (limited to last 5)
app.get("/api/orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
});

// Get single order
app.get("/api/orders/:id", auth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.userId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error fetching order", error: err.message });
  }
});

// DATABASE
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/store";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});