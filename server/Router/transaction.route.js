import express from "express";
import { upload } from "../Middleware/fileUploader.js";
import { authenticateToken } from "../Middleware/authorization.js";
import {
  getTransactions,
  postTransaction,
  getTransaction,
  deleteTransaction,
  updateTransaction,
  getAnalytics,
  extractTransactions,
} from "../Controller/transaction.controller.js";

export const transactionRouter = express.Router();

transactionRouter
  .route("/")
  .get(authenticateToken, getTransactions)
  .post(authenticateToken, postTransaction);

transactionRouter.route("/analytics").get(authenticateToken, getAnalytics);

// upload middleware for file extraction
transactionRouter
  .route("/extract")
  .post(authenticateToken, upload.single("file"), extractTransactions);

transactionRouter
  .route("/:id")
  .get(authenticateToken, getTransaction)
  .delete(authenticateToken, deleteTransaction)
  .patch(authenticateToken, updateTransaction);
