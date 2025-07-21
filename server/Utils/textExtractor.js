import Tesseract from "tesseract.js";
import path from "path";
import pdfjs from "pdfjs-dist/legacy/build/pdf.js";

const { getDocument } = pdfjs;

export const textExtractor = async (fileBuffer, mimeType) => {
  try {
    if (!fileBuffer || fileBuffer.length === 0) {
      console.log("Invalid or empty file buffer.");
    }

    // PDF extraction
    if (mimeType === "application/pdf") {
      // Ensure pdfjs is configured correctly
      const loadingTask = getDocument({
        data: new Uint8Array(fileBuffer),
        standardFontDataUrl:
          path.resolve("./node_modules/pdfjs-dist/standard_fonts/") + "/",
      });

      // Wait for the PDF to load
      const pdf = await loadingTask.promise;

      let fullText = "";

      // go through each page and extract text
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += pageText + "\n";
      }

      if (!fullText.trim()) {
        console.log("No text extracted from PDF.");
      }

      return fullText;
    }

    // Image OCR
    else if (mimeType.startsWith("image/")) {
      const {
        data: { text },
      } = await Tesseract.recognize(fileBuffer, "eng");

      if (!text.trim()) {
        console.log("OCR returned empty text.");
      }

      return text;
    }

    // Unsupported file type
    else {
      console.log("Unsupported file type.");
    }
  } catch (error) {
    console.log("Error in textExtractor:", error.message);
  }
};
