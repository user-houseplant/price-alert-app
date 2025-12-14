import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";
import PriceHistory from "../models/PriceHistory.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const product = await Product.create({
      title: "iPhone 15",
      price: 79999,
      source: "Amazon",
      url: "https://amazon.in",
    });

    await PriceHistory.create({
      product: product._id,
      price: 79999,
      source: "Amazon",
    });

    console.log("✅ Sample product & price history inserted");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
