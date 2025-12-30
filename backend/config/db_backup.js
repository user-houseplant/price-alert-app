import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const MONGODB_URI =
      "mongodb+srv://priceapp:pricepassword123@pricealertdb.gy3xush.mongodb.net/pricealertdb?retryWrites=true&w=majority";

    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
  }
};

export default connectDB;
