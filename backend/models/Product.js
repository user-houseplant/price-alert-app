import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    source: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  { timestamps: true }
);

// ✅ USE THE SAME VARIABLE NAME HERE
const Product = mongoose.model("Product", productSchema);

export default Product;
