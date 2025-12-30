// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db.js";

// import testRoutes from "./routes/testRoutes.js";
// import productRoutes from "./routes/productRoutes.js";

// dotenv.config();
// connectDB();

// const app = express();

// /* 🔴 BODY PARSER MUST COME BEFORE ROUTES */
// app.use(cors());
// app.use(express.json());   // ← THIS LINE IS CRITICAL

// app.use("/api/test", testRoutes);
// app.use("/api/products", productRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import searchRoute from "./routes/searchRoute.js";

const app = express();

app.use(cors());
app.use(express.json());

// REGISTER ROUTE HERE
app.use("/api/search", searchRoute);

app.listen(5000, () => console.log("🚀 Server running on port 5000"));

