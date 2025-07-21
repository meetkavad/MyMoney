import mongoose from "mongoose";
import { categories } from "../Utils/categories.js";

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["income", "expense"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: categories,
    default: "Miscellaneous",
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export const TransactionModel = mongoose.model(
  "TransactionModel",
  transactionSchema
);
