// When a new transaction is created or edited, this modal handles the input
"use client";

import { X, Check, ChevronDown, Calendar, Clock } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { formatDate, formatTime } from "@/lib/utils";
import { useHover } from "@/hooks/useHover";
import { Calculator, Calendar as CalendarPicker, TimePicker } from "../ui";
import { getCategoryIcon, getCategoriesByType } from "@/lib/categories";

export default function NewTransactionModal({
  isOpen,
  onClose,
  editData = null,
  onSave,
}) {
  const { isDarkMode, colors } = useTheme();
  const currentColors = isDarkMode ? colors.dark : colors.light;
  const { createHoverHandlers, createOpacityHoverHandlers } =
    useHover(currentColors);

  // Initialize state with edit data if provided
  const [transactionType, setTransactionType] = useState(
    editData?.type || "expense"
  );
  const [selectedCategory, setSelectedCategory] = useState(
    editData?.category || ""
  );
  const [amount, setAmount] = useState(
    editData?.amount ? Math.abs(editData.amount).toString() : "0"
  );
  const [notes, setNotes] = useState(editData?.description || "");

  // Initialize date/time - use edit data or current IST time
  const getInitialDateTime = () => {
    return editData?.date
      ? new Date(editData.date)
      : new Date(
          new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        );
  };

  const [selectedDate, setSelectedDate] = useState(getInitialDateTime);
  const [selectedTime, setSelectedTime] = useState(getInitialDateTime);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [amountError, setAmountError] = useState(false);

  const isEditMode = !!editData;

  // Get categories based on transaction type
  const categories = getCategoriesByType(transactionType);

  const handleCalculatorInput = (value) => {
    if (value === "ERROR_ANIMATION") {
      setAmountError(true);
      setTimeout(() => setAmountError(false), 600);
      return;
    }
    setAmount(value);
  };

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

      return Math.round(result * 100) / 100;
    } catch (error) {
      return "Error";
    }
  };

  const handleSave = () => {
    // If amount contains an expression, evaluate it first
    let finalAmount;
    if (/[+\-*/]/.test(amount)) {
      const result = safeEvaluate(amount);
      if (result === "Error") {
        setAmountError(true);
        setTimeout(() => setAmountError(false), 600);
        return;
      }
      finalAmount = result;
    } else {
      finalAmount = Math.round((parseFloat(amount) || 0) * 100) / 100;
    }

    // Validate that we have a valid amount and category
    if (finalAmount <= 0) {
      setAmountError(true);
      setTimeout(() => setAmountError(false), 600);
      return;
    }

    if (!selectedCategory) {
      alert("Please select a category");
      return;
    }

    // Combine date and time into a single Date object
    const combinedDateTime = new Date(selectedDate);
    combinedDateTime.setHours(
      selectedTime.getHours(),
      selectedTime.getMinutes(),
      0,
      0
    );

    const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
    const utcDateTime = new Date(combinedDateTime.getTime() - istOffset);

    const transactionData = {
      type: transactionType,
      category: selectedCategory,
      amount:
        transactionType === "expense"
          ? -Math.abs(finalAmount)
          : Math.abs(finalAmount),
      description: notes || "",
      date: utcDateTime.toISOString(),
    };

    if (onSave) {
      onSave(transactionData);
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="w-full max-w-6xl max-h-[90vh] rounded-lg overflow-hidden"
        style={{ backgroundColor: currentColors.cardBackground }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderBottomColor: currentColors.border }}
        >
          <button
            onClick={onClose}
            className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300"
          >
            <X className="h-5 w-5" />
            <span className="font-medium">CANCEL</span>
          </button>

          <h2
            className="text-lg font-semibold"
            style={{ color: currentColors.text }}
          >
            {isEditMode ? "Edit Transaction" : "New Transaction"}
          </h2>

          <button
            onClick={handleSave}
            className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300"
          >
            <Check className="h-5 w-5" />
            <span className="font-medium">{isEditMode ? "EDIT" : "SAVE"}</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Form */}
            <div className="space-y-6">
              {/* Transaction Type */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setTransactionType("income")}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                    transactionType === "income"
                      ? "bg-green-600 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  INCOME
                </button>
                <button
                  onClick={() => setTransactionType("expense")}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                    transactionType === "expense"
                      ? "bg-green-600 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  EXPENSE
                </button>
              </div>

              {/* Category Selection */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: currentColors.textSecondary }}
                >
                  Category
                </label>
                <div className="relative">
                  <button
                    onClick={() =>
                      setShowCategoryDropdown(!showCategoryDropdown)
                    }
                    className="w-full p-4 rounded-lg border text-left flex items-center justify-between"
                    style={{
                      backgroundColor: currentColors.background,
                      borderColor: currentColors.border,
                      color: selectedCategory
                        ? currentColors.text
                        : currentColors.textSecondary,
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      {selectedCategory && (
                        <>
                          {(() => {
                            const IconComponent =
                              getCategoryIcon(selectedCategory);
                            return <IconComponent className="h-5 w-5" />;
                          })()}
                        </>
                      )}
                      <span>{selectedCategory || "Select Category"}</span>
                    </div>
                    <ChevronDown className="h-5 w-5" />
                  </button>

                  {showCategoryDropdown && (
                    <div
                      className="absolute top-full left-0 right-0 mt-2 rounded-lg border shadow-lg z-10 max-h-60 overflow-y-auto"
                      style={{
                        backgroundColor: currentColors.cardBackground,
                        borderColor: currentColors.border,
                      }}
                    >
                      {categories.map((category) => {
                        const IconComponent = getCategoryIcon(category);
                        return (
                          <button
                            key={category}
                            onClick={() => {
                              setSelectedCategory(category);
                              setShowCategoryDropdown(false);
                            }}
                            className="w-full p-3 text-left flex items-center space-x-3 transition-colors first:rounded-t-lg last:rounded-b-lg hover:bg-opacity-10"
                            style={{ color: currentColors.text }}
                            {...createHoverHandlers("transparent")}
                          >
                            <IconComponent className="h-5 w-5" />
                            <span>{category}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: currentColors.textSecondary }}
                >
                  Add notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes"
                  rows={4}
                  className="w-full p-4 rounded-lg border resize-none"
                  style={{
                    backgroundColor: currentColors.background,
                    borderColor: currentColors.border,
                    color: currentColors.text,
                  }}
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowCalendar(true)}
                  className="p-4 rounded-lg border text-left flex items-center justify-between hover:bg-opacity-10"
                  style={{
                    backgroundColor: currentColors.background,
                    borderColor: currentColors.border,
                    color: currentColors.text,
                  }}
                  {...createHoverHandlers(currentColors.background)}
                >
                  <span>{formatDate(selectedDate)}</span>
                  <Calendar className="h-5 w-5" />
                </button>

                <button
                  onClick={() => setShowTimePicker(true)}
                  className="p-4 rounded-lg border text-left flex items-center justify-between hover:bg-opacity-10"
                  style={{
                    backgroundColor: currentColors.background,
                    borderColor: currentColors.border,
                    color: currentColors.text,
                  }}
                  {...createHoverHandlers(currentColors.background)}
                >
                  <span>{formatTime(selectedTime)}</span>
                  <Clock className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Right Side - Calculator */}
            <div className="flex justify-center items-start">
              <Calculator
                amount={amount}
                onInput={handleCalculatorInput}
                amountError={amountError}
              />
            </div>
          </div>
        </div>

        {/* Modals */}
        <CalendarPicker
          isOpen={showCalendar}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onClose={() => setShowCalendar(false)}
        />
        <TimePicker
          isOpen={showTimePicker}
          selectedTime={selectedTime}
          onTimeChange={setSelectedTime}
          onClose={() => setShowTimePicker(false)}
        />
      </div>
    </div>
  );
}
