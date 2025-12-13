// backend/models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  site: { type: String },
  price: { type: Number, required: true },
  url: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const Product = mongoose.model("Product", ProductSchema);
export default Product;
