import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";
import PriceHistory from "../models/PriceHistory.js";
import connectDB from "../config/db.js";

dotenv.config();

async function seed() {
  try {
    await connectDB();

    // pick an existing product (or adjust title)
    const product = await Product.findOne({ title: "iPhone 15" });

    if (!product) {
      console.log("❌ Product not found");
      process.exit(1);
    }

    const historyData = [
      { price: 82999, daysAgo: 10 },
      { price: 81999, daysAgo: 7 },
      { price: 80999, daysAgo: 4 },
      { price: product.price, daysAgo: 0 },
    ];

    for (const h of historyData) {
      await PriceHistory.create({
        product: product._id,
        price: h.price,
        source: product.source,
        capturedAt: new Date(
          Date.now() - h.daysAgo * 24 * 60 * 60 * 1000
        ),
      });
    }

    console.log("✅ Price history seeded");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
