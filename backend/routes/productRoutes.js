// backend/routes/productRoutes.js
import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET all products
// GET all products (with optional server search ?q=term)
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const q = req.query.q ? String(req.query.q).trim() : null;

    let filter = {};
    if (q) {
      // case-insensitive partial match on title
      filter = { title: { $regex: q, $options: "i" } };
    }

    const items = await Product.find(filter).sort({ timestamp: -1 }).limit(limit);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// POST create product
router.post("/", async (req, res) => {
  try {
    const { title, site, price, url } = req.body;
    if (!title || price == null) {
      return res.status(400).json({ error: "title and price required" });
    }
    const p = new Product({ title, site, price, url });
    await p.save();
    res.status(201).json(p);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
