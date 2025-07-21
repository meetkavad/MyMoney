// When a particular transaction is selected, this modal displays its details
"use client";

import { X, Edit, Trash2, FileText } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { useHover } from "@/hooks/useHover";
import Card from "@/components/ui/Card";
import { getCategoryIcon } from "@/lib/categories";

export default function TransactionDetailsModal({
  isOpen,
  onClose,
  transaction,
  onEdit,
  onDelete,
}) {
  const { isDarkMode, colors } = useTheme();
  const currentColors = isDarkMode ? colors.dark : colors.light;
  const { createOpacityHoverHandlers, createHoverHandlers } =
    useHover(currentColors);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen || !transaction) return null;

  const IconComponent = getCategoryIcon(transaction.category);
  const isIncome = transaction.type === "income";

  const typeColor = isIncome ? currentColors.income : currentColors.expense;
  const typeBgColor = isIncome
    ? currentColors.incomeLight
    : currentColors.expenseLight;

  const handleDelete = () => {
    onDelete(transaction._id || transaction.id);
    onClose();
  };

  const handleEdit = () => {
    onEdit(transaction);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card
        className="w-full max-w-md mx-auto"
        style={{ backgroundColor: currentColors.cardBackground }}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2
            className="text-lg font-semibold"
            style={{ color: currentColors.text }}
          >
            Transaction Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: currentColors.textSecondary }}
            {...createHoverHandlers()}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Transaction Type and Amount */}
        <div
          className="text-center py-6 mx-6 rounded-lg mb-6"
          style={{ backgroundColor: typeBgColor }}
        >
          <div className="flex items-center justify-center mb-3">
            <div
              className="p-3 rounded-full"
              style={{ backgroundColor: typeColor }}
            >
              <IconComponent className="h-8 w-8 text-white" />
            </div>
          </div>

          <div
            className="text-sm font-medium mb-1"
            style={{
              color: typeColor,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {transaction.type}
          </div>

          <div
            className="text-3xl font-light mb-2"
            style={{ color: typeColor }}
          >
            {formatCurrency(transaction.amount)}
          </div>

          <div
            className="text-sm"
            style={{ color: currentColors.textSecondary }}
          >
            {formatDate(transaction.date)} {formatTime(transaction.date)}
          </div>
        </div>

        {/* Transaction Details */}
        <div className="px-6 space-y-4 mb-6">
          {/* Category */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: currentColors.hover }}
              >
                <IconComponent
                  className="h-5 w-5"
                  style={{ color: currentColors.textSecondary }}
                />
              </div>
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: currentColors.text }}
                >
                  Category
                </p>
                <p
                  className="text-xs"
                  style={{ color: currentColors.textSecondary }}
                >
                  Transaction Category
                </p>
              </div>
            </div>
            <div
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: typeBgColor }}
            >
              <span
                className="text-sm font-medium"
                style={{ color: typeColor }}
              >
                {transaction.category}
              </span>
            </div>
          </div>

          {/* Description/Notes */}
          {transaction.description && (
            <div>
              <div className="flex items-start space-x-3">
                <div
                  className="p-2 rounded-lg mt-1"
                  style={{ backgroundColor: currentColors.hover }}
                >
                  <FileText
                    className="h-5 w-5"
                    style={{ color: currentColors.textSecondary }}
                  />
                </div>
                <div className="flex-1">
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: currentColors.text }}
                  >
                    Description
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: currentColors.textSecondary }}
                  >
                    {transaction.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 p-6 pt-0">
          <button
            onClick={handleEdit}
            className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: currentColors.primary,
              color: "white",
            }}
            {...createOpacityHoverHandlers()}
          >
            <Edit className="h-5 w-5" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: currentColors.expense,
              color: "white",
            }}
            {...createOpacityHoverHandlers()}
          >
            <Trash2 className="h-5 w-5" />
            <span>Delete</span>
          </button>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
          <Card
            className="w-full max-w-sm mx-4"
            style={{ backgroundColor: currentColors.cardBackground }}
          >
            <div className="p-6 text-center">
              <div
                className="p-3 rounded-full mx-auto mb-4 w-fit"
                style={{ backgroundColor: currentColors.expenseLight }}
              >
                <Trash2
                  className="h-6 w-6"
                  style={{ color: currentColors.expense }}
                />
              </div>

              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: currentColors.text }}
              >
                Delete Transaction
              </h3>

              <p
                className="text-sm mb-6"
                style={{ color: currentColors.textSecondary }}
              >
                Are you sure you want to delete this transaction? This action
                cannot be undone.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2 px-4 rounded-lg font-medium transition-colors"
                  style={{
                    backgroundColor: currentColors.hover,
                    color: currentColors.text,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2 px-4 rounded-lg font-medium transition-colors"
                  style={{
                    backgroundColor: currentColors.expense,
                    color: "white",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
