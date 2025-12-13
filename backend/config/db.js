import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // connect with just the URI (Mongoose v7+ detects good defaults)
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

export default connectDB;

