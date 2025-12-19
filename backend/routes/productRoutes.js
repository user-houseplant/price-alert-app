// backend/routes/productRoutes.js
import PriceHistory from "../models/PriceHistory.js";

import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET all products (optional search: ?q=term&limit=50)
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const q = req.query.q ? String(req.query.q).trim() : null;

    let filter = {};
    if (q) {
      filter = { title: { $regex: q, $options: "i" } };
    }

    const items = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create product
router.post("/", async (req, res) => {
  try {
    const { title, source, price, url } = req.body;

    if (!title || price == null) {
      return res.status(400).json({ error: "title and price required" });
    }

    // 1️⃣ Create product
    const product = new Product({
      title,
      source,
      price,
      url,
    });

    await product.save();

    // 2️⃣ Create initial price history entry
    await PriceHistory.create({
      product: product._id,
      price,
      source,
      capturedAt: new Date(),
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// UPDATE product price (and track history)
router.put("/:id", async (req, res) => {
  try {
    const { price, source } = req.body;

    if (price == null) {
      return res.status(400).json({ error: "price is required" });
    }

    // 1️⃣ Find existing product
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // 2️⃣ Check if price actually changed
    const priceChanged = product.price !== price;

    // 3️⃣ Update product fields
    product.price = price;
    if (source) product.source = source;

    await product.save();

    // 4️⃣ If price changed → store history
    if (priceChanged) {
      await PriceHistory.create({
        product: product._id,
        price,
        source: source || product.source,
        capturedAt: new Date(),
      });
    }

    res.json({
      message: priceChanged
        ? "Price updated and history recorded"
        : "Price unchanged",
      product,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



export default router;
