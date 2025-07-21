"use client";

import { X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function Calculator({ amount, onInput, amountError }) {
  const { isDarkMode, colors } = useTheme();
  const currentColors = isDarkMode ? colors.dark : colors.light;

  const roundToTwoDecimals = (value) => {
    return Math.round(value * 100) / 100;
  };

  // Helper function to trigger error animation
  const triggerErrorAnimation = () => {
    // This will be handled by parent component
    if (onInput) onInput("ERROR_ANIMATION");
  };

  // Safe evaluation function to replace eval
  const safeEvaluate = (expression) => {
    try {
      // Remove any non-mathematical characters
      const cleanExpression = expression.replace(/[^0-9+\-*/.() ]/g, "");

      // Check for division by zero
      if (cleanExpression.includes("/0")) {
        return "Error";
      }

      // Use Function constructor as safer alternative to eval
      const result = new Function("return " + cleanExpression)();

      if (isNaN(result) || !isFinite(result)) {
        return "Error";
      }

      return roundToTwoDecimals(result);
    } catch (error) {
      return "Error";
    }
  };

  const handleCalculatorInput = (value) => {
    // Check for maximum length limit (15 characters including operators and decimals)
    if (amount.length >= 15 && !["=", "C", "⌫"].includes(value)) {
      triggerErrorAnimation();
      return;
    }

    if (value === "=") {
      const result = safeEvaluate(amount);
      if (result === "Error") {
        triggerErrorAnimation();
        onInput("0");
      } else {
        onInput(result.toString());
      }
      return;
    }

    if (value === "C") {
      onInput("0");
      return;
    }

    if (value === "⌫") {
      if (amount.length <= 1 || amount === "Error") {
        onInput("0");
      } else {
        onInput(amount.slice(0, -1));
      }
      return;
    }

    // Handle decimal point
    if (value === ".") {
      // Get the current number (last number in expression)
      const lastNumber = amount.split(/[+\-*/]/).pop();

      // Don't allow decimal if current number already has one
      if (lastNumber.includes(".")) {
        triggerErrorAnimation();
        return;
      }

      // If amount is "0" or ends with operator, add "0."
      if (amount === "0" || /[+\-*/]$/.test(amount)) {
        onInput(amount === "0" ? "0." : amount + "0.");
      } else {
        onInput(amount + ".");
      }
      return;
    }

    // Handle operators
    if (["+", "-", "*", "/"].includes(value)) {
      // Don't allow consecutive operators
      if (/[+\-*/]$/.test(amount)) {
        // Replace the last operator with the new one
        onInput(amount.slice(0, -1) + value);
      } else if (amount !== "0" && amount !== "Error") {
        onInput(amount + value);
      }
      return;
    }

    // Handle digits
    if (/^\d$/.test(value)) {
      // Get the current number being typed
      const parts = amount.split(/[+\-*/]/);
      const currentNumber = parts[parts.length - 1];

      // Check decimal places only for the current number
      if (currentNumber.includes(".")) {
        const decimalPart = currentNumber.split(".")[1];
        if (decimalPart && decimalPart.length >= 2) {
          triggerErrorAnimation();
          return;
        }
      }

      // Add the digit
      if (amount === "0" || amount === "Error") {
        onInput(value);
      } else {
        onInput(amount + value);
      }
    }
  };

  return (
    <div className="w-full max-w-sm">
      {/* Amount Label */}
      <div className="mb-4">
        <label
          className="block text-sm font-medium text-center"
          style={{ color: currentColors.textSecondary }}
        >
          Amount
        </label>
      </div>

      {/* Amount Display */}
      <div
        className="p-4 rounded-lg mb-4 text-right"
        style={{ backgroundColor: currentColors.background }}
      >
        <div className="flex items-center justify-between">
          <span
            className={`font-light text-yellow-400 transition-transform duration-300 break-all ${
              amountError ? "animate-pulse transform scale-110" : ""
            } ${
              amount.length <= 6
                ? "text-5xl"
                : amount.length <= 10
                ? "text-4xl"
                : amount.length <= 12
                ? "text-3xl"
                : "text-2xl"
            }`}
            style={{
              transform: amountError ? "scale(1.1)" : "scale(1)",
              transition: "transform 0.3s ease-in-out",
              wordBreak: "break-all",
              lineHeight: "1.2",
              maxWidth: "calc(100% - 60px)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {amount}
          </span>
          <button
            onClick={() => handleCalculatorInput("⌫")}
            className="p-2 rounded-lg hover:bg-opacity-20 flex-shrink-0"
            style={{ color: currentColors.textSecondary }}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-4 gap-3">
        {/* Row 1 */}
        <button
          onClick={() => handleCalculatorInput("C")}
          className="h-12 rounded-lg font-medium transition-colors hover:opacity-80"
          style={{
            backgroundColor: currentColors.primary,
            color: currentColors.textPrimary,
          }}
        >
          C
        </button>
        <button
          onClick={() => handleCalculatorInput("/")}
          className="h-12 rounded-lg font-medium transition-colors hover:opacity-80"
          style={{
            backgroundColor: currentColors.primary,
            color: currentColors.textPrimary,
          }}
        >
          ÷
        </button>
        <button
          onClick={() => handleCalculatorInput("*")}
          className="h-12 rounded-lg font-medium transition-colors hover:opacity-80"
          style={{
            backgroundColor: currentColors.primary,
            color: currentColors.textPrimary,
          }}
        >
          ×
        </button>
        <button
          onClick={() => handleCalculatorInput("⌫")}
          className="h-12 rounded-lg font-medium transition-colors hover:opacity-80"
          style={{
            backgroundColor: currentColors.primary,
            color: currentColors.textPrimary,
          }}
        >
          ⌫
        </button>

        {/* Row 2 */}
        <button
          onClick={() => handleCalculatorInput("7")}
          className="h-12 rounded-lg font-medium transition-colors hover:opacity-80"
          style={{
            backgroundColor: currentColors.secondary,
            color: currentColors.text,
          }}
        >
          7
        </button>
        <button
          onClick={() => handleCalculatorInput("8")}
          className="h-12 rounded-lg font-medium transition-colors hover:opacity-80"
          style={{
            backgroundColor: currentColors.secondary,
            color: currentColors.text,
          }}
        >
          8
        </button>
        <button
          onClick={() => handleCalculatorInput("9")}
          className="h-12 rounded-lg font-medium transition-colors hover:opacity-80"
          style={{
            backgroundColor: currentColors.secondary,
            color: currentColors.text,
          }}
        >
          9
        </button>
        <button
          onClick={() => handleCalculatorInput("-")}
          className="h-12 rounded-lg font-medium transition-colors hover:opacity-80"
          style={{
            backgroundColor: currentColors.primary,
            color: currentColors.textPrimary,
          }}
        >
          -
        </button>

        {/* Row 3 */}
        <button
          onClick={() => handleCalculatorInput("4")}
          className="h-12 rounded-lg font-medium transition-colors hover:opacity-80"
          style={{
            backgroundColor: currentColors.secondary,
            color: currentColors.text,
          }}
        >
          4
        </button>
        <button
          onClick={() => handleCalculatorInput("5")}
          className="h-12 rounded-lg font-medium transition-colors hover:opacity-80"
          style={{
            backgroundColor: currentColors.secondary,
            color: currentColors.text,
          }}
        >
          5
        </button>
        <button
          onClick={() => handleCalculatorInput("6")}
          className="h-12 rounded-lg font-medium transition-colors hover:opacity-80"
          style={{
            backgroundColor: currentColors.secondary,
            color: currentColors.text,
          }}
        >
          6
        </button>
        <button
          onClick={() => handleCalculatorInput("+")}
          className="h-12 rounded-lg font-medium transition-colors hover:opacity-80"
          style={{
            backgroundColor: currentColors.primary,
            color: currentColors.textPrimary,
          }}
        >
          +
        </button>

        {/* Row 4 */}
        <button
          onClick={() => handleCalculatorInput("1")}
          className="h-12 rounded-lg font-medium transition-colors hover:opacity-80"
          style={{
            backgroundColor: currentColors.secondary,
            color: currentColors.text,
          }}
        >
          1
        </button>
        <button
          onClick={() => handleCalculatorInput("2")}
          className="h-12 rounded-lg font-medium transition-colors hover:opacity-80"
          style={{
            backgroundColor: currentColors.secondary,
            color: currentColors.text,
          }}
        >
          2
        </button>
        <button
          onClick={() => handleCalculatorInput("3")}
          className="h-12 rounded-lg font-medium transition-colors hover:opacity-80"
          style={{
            backgroundColor: currentColors.secondary,
            color: currentColors.text,
          }}
        >
          3
        </button>
        <button
          onClick={() => handleCalculatorInput("=")}
          className="h-24 rounded-lg font-medium transition-colors hover:opacity-80 row-span-2"
          style={{
            backgroundColor: "#FFC107",
            color: "#000000",
          }}
        >
          =
        </button>

        {/* Row 5 */}
        <button
          onClick={() => handleCalculatorInput("0")}
          className="h-12 rounded-lg font-medium transition-colors hover:opacity-80 col-span-2"
          style={{
            backgroundColor: currentColors.secondary,
            color: currentColors.text,
          }}
        >
          0
        </button>
        <button
          onClick={() => handleCalculatorInput(".")}
          className="h-12 rounded-lg font-medium transition-colors hover:opacity-80"
          style={{
            backgroundColor: currentColors.secondary,
            color: currentColors.text,
          }}
        >
          .
        </button>
      </div>
    </div>
  );
}
