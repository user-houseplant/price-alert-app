// backend/config/db.js
// import mongoose from "mongoose";


// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log("✅ MongoDB Connected");
//   } catch (error) {
//     console.error("❌ MongoDB connection failed:", error.message);
//     process.exit(1); // stop server if DB fails
//   }
// };

// export default connectDB;

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log("Using URI:", uri); // TEMP DEBUG

    await mongoose.connect(uri);
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
};

export default connectDB;
