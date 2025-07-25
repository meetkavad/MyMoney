import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./Config/db.js";
import { authRouter } from "./Router/auth.route.js";
import { userRouter } from "./Router/user.route.js";
import { transactionRouter } from "./Router/transaction.route.js";

dotenv.config();
const app = express();

// to parse JSON bodies
app.use(express.json());
// cors middleware to allow cross-origin requests
app.use(cors());

// Add API prefix to all routes for Vercel
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/transaction", transactionRouter);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Database connected.");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

start();
