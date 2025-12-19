import mongoose from "mongoose";

const priceHistorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  source: {
    type: String, // Amazon, Flipkart, etc
  },
  capturedAt: {
    type: Date,
    default: Date.now,
  },
});

const PriceHistory = mongoose.model("PriceHistory", priceHistorySchema);
export default PriceHistory;
