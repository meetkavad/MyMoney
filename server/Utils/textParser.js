// llm text parser for financial entries

import axios from "axios";
import dotenv from "dotenv";
import { categories } from "./categories.js";
dotenv.config();

export const textParser = async (ocrText, type = "receipt") => {
  // format date to YYYY-MM-DD and categories to a string
  const formattedDate = new Date().toISOString().split("T")[0];
  const formattedCategories = categories.map((cat) => `"${cat}"`).join(", ");

  // type note based on the type of entry (receipt or transaction history)
  const typeNote =
    type === "receipt"
      ? `Set "type" to "expense" for all entries.`
      : `Set "type" to "income" if it's money coming in, or "expense" if it's going out.`;

  //prompt for the LLM to extract financial entries from OCR text
  const prompt = `
You are a strict JSON financial entry extractor.

Given the following unstructured OCR text, extract a JSON array in the format:
[
  {
    "description": "Item or transaction",
    "amount": 123,
    "date": "${formattedDate}",
    "category": "<MUST_BE_FROM_ALLOWED_CATEGORIES>",
    "type": "income" or "expense"
  }
]

Rules:
- ${typeNote}
- The "category" field MUST strictly be one of ONLY the following (copy-paste exactly):
  ${formattedCategories}
- DO NOT invent new categories. If unsure, use "Miscellaneous".
- No explanation, no markdown, no extra text — just the JSON array.

OCR Text:
${ocrText}
  `.trim();

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices[0].message.content;

    const jsonText = content
      .replace(/```json/, "")
      .replace(/```/, "")
      .trim();

    const parsed = JSON.parse(jsonText);

    // post-cleanup (if category is not in the list, set to "Miscellaneous")
    const cleaned = parsed.map((entry) => ({
      ...entry,
      category: categories.includes(entry.category)
        ? entry.category
        : "Miscellaneous",
    }));

    return cleaned;
  } catch (err) {
    return err.response?.data || err.message;
  }
};
