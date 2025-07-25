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

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/transaction", transactionRouter);

// Connect DB immediately when the function is first invoked
connectDB(process.env.MONGO_URI || "mongodb://localhost:27017/MyMoney")
  .then(() => console.log("db connected"))
  .catch((err) => console.error("DB connection error:", err));

// Export the app as a handler for Vercel
export default app;
