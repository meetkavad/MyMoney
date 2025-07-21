import { TransactionModel } from "../Model/TransactionModel.js";
import { textExtractor } from "../Utils/textExtractor.js";
import { textParser } from "../Utils/textParser.js";
import mongoose from "mongoose";

// Helper:
async function getTypeWiseTotals(filter) {
  const aggregationFilter = { ...filter };

  // Convert user ID to ObjectId if it's a string
  if (aggregationFilter.user && typeof aggregationFilter.user === "string") {
    aggregationFilter.user = new mongoose.Types.ObjectId(
      aggregationFilter.user
    );
  }

  // Aggregate total amounts by type (income and expense)
  const totalAmountByType = await TransactionModel.aggregate([
    { $match: aggregationFilter },
    {
      $group: {
        _id: "$type",
        totalAmount: { $sum: "$amount" }, // Keep raw amounts for dashboard
        absoluteTotalAmount: { $sum: { $abs: "$amount" } }, // Absolute amounts for analytics
      },
    },
  ]);

  // Format the result to include both raw and absolute amounts
  const result = totalAmountByType.reduce((acc, curr) => {
    acc[curr._id] = curr.totalAmount; // Keep using raw amounts for backward compatibility
    acc[`${curr._id}_absolute`] = curr.absoluteTotalAmount; // Add absolute versions
    return acc;
  }, {});

  return result;
}

// Controllers:
export const getTransactions = async (req, res) => {
  const { start, end, page = 1, limit = 10 } = req.query;
  const userId = req.user.id;

  try {
    // Build filter for user and date range
    const filter = { user: new mongoose.Types.ObjectId(userId) };

    if (start && end) {
      filter.date = { $gte: new Date(start), $lte: new Date(end) };
    }

    // get total transactions count
    const totalTransactions = await TransactionModel.countDocuments(filter);

    // Fetch transactions with pagination
    const transactions = await TransactionModel.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ date: -1 });

    // get type-wise totals for the user using given filter
    const totals = await getTypeWiseTotals(filter);

    res.status(200).json({
      message: "Transactions fetched successfully!",
      data: transactions,
      page: parseInt(page),
      totalPages: Math.ceil(totalTransactions / limit),
      totalAmount: totals, // to use at top of dashboard
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const postTransaction = async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;

    if (!type || !amount || !category) {
      return res
        .status(400)
        .json({ message: "Type, amount, and category are required" });
    }

    const userId = req.user.id;
    const transactionData = {
      type,
      user: userId,
      category,
      amount,
      description,
      date: date ? new Date(date) : new Date(),
    };

    const newTransaction = await TransactionModel.create(transactionData);

    res.status(201).json({
      message: "Transaction added successfully!",
      data: newTransaction,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something Went wrong", error: error.message });
  }
};

export const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const transaction = await TransactionModel.findOne({
      _id: id,
      user: userId, // in case if someone tries to access another user's transaction
    });

    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    res.status(200).json({
      message: "Transaction fetched successfully!",
      data: transaction,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something Went wrong", error: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, category, description, date } = req.body;
    const userId = req.user.id;

    const transaction = await TransactionModel.findOne({
      _id: id,
      user: userId,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (type !== undefined) transaction.type = type;
    if (amount !== undefined) transaction.amount = amount;
    if (category !== undefined) transaction.category = category;
    if (description !== undefined) transaction.description = description;
    if (date !== undefined) transaction.date = new Date(date);

    const updated = await transaction.save();

    res
      .status(200)
      .json({ message: "Transaction updated successfully", data: updated });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const transaction = await TransactionModel.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const { type, start, end } = req.query;
    const userId = req.user.id;

    if (!type || !start || !end) {
      return res
        .status(400)
        .json({ message: "Type, start, and end are required" });
    }

    // filter for analytics including user and date range
    const matchFilter = {
      user: new mongoose.Types.ObjectId(userId),
      date: { $gte: new Date(start), $lte: new Date(end) },
    };

    // get type-wise totals for the user using given filter
    const totals = await getTypeWiseTotals(matchFilter);

    matchFilter.type = type;

    // Aggregate transactions by category
    const categoryData = await TransactionModel.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: { $abs: "$amount" } }, // Use absolute values for analytics
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalAmount: 1,
        },
      },
    ]);

    // Get the absolute total for the specific type for percentage calculation
    const absoluteTotal = categoryData.reduce(
      (sum, item) => sum + item.totalAmount,
      0
    );

    // Calculate percentage for each category using absolute values
    const analytics = categoryData.map((item) => ({
      category: item.category,
      totalAmount: item.totalAmount, // This is now absolute value
      percentage:
        absoluteTotal > 0
          ? ((item.totalAmount / absoluteTotal) * 100).toFixed(2)
          : "0.00",
    }));

    // Sort analytics by percentage in descending order
    analytics.sort((a, b) => b.percentage - a.percentage);

    res.status(200).json({
      message: "Analytics fetched successfully!",
      totalAmount: totals,
      analytics: analytics,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const extractTransactions = async (req, res) => {
  try {
    const { type } = req.query;
    const fileBuffer = req.file?.buffer;
    const mimeType = req.file?.mimetype;

    if (!fileBuffer) {
      return res.status(400).json({ error: "No image or PDF uploaded." });
    }

    // 1. Get plain OCR text
    const ocrText = await textExtractor(fileBuffer, mimeType);

    if (!ocrText) {
      return res.status(400).json({ error: "OCR failed to extract text." });
    }

    // 2. Get structured data from AI
    const extractedItems = await textParser(ocrText, type);

    if (!Array.isArray(extractedItems)) {
      return res.status(500).json({
        error: "Failed to parse AI response",
        rawResponse: extractedItems,
      });
    }

    // 3. Save to DB
    const saved = await TransactionModel.insertMany(
      extractedItems.map((item) => ({
        ...item,
        user: req.user.id,
      }))
    );

    res.status(200).json({
      message: "Expenses extracted and stored successfully",
      data: saved,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
};
