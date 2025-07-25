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

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/transaction", transactionRouter);

// const port = process.env.PORT || 5000;

// // Start the server and connect to the database
// const start = async () => {
//   try {
//     await connectDB(
//       process.env.MONGO_URI || "mongodb://localhost:27017/MyMoney"
//     );
//     console.log("db connected");
//     app.listen(port, console.log(`server listening at port ${port}`));
//   } catch (error) {
//     console.error("Error starting server:", error);
//   }
// };

// start();

// Connect DB immediately when the function is first invoked
connectDB(process.env.MONGO_URI || "mongodb://localhost:27017/MyMoney")
  .then(() => console.log("db connected"))
  .catch((err) => console.error("DB connection error:", err));

// Export the app as a handler for Vercel
export default app;
