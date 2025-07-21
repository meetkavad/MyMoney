"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useTheme } from "@/contexts/ThemeContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getCategoryIcon, getCategoryColor } from "@/lib/categories";

export default function TransactionsList({
  transactions,
  isLoading,
  error,
  searchQuery,
  currentPage,
  totalPages,
  onTransactionClick,
  onPageChange,
  onRetry,
}) {
  const { isDarkMode, colors } = useTheme();
  const currentColors = isDarkMode ? colors.dark : colors.light;

  // Group transactions by date (Indian timezone)
  const groupTransactionsByDate = (transactions) => {
    const grouped = {};
    transactions.forEach((transaction) => {
      // Convert transaction date to Indian timezone for grouping
      let dateKey;
      if (transaction.date) {
        const transactionDate = new Date(transaction.date);
        // Get date in IST and format as YYYY-MM-DD
        dateKey = transactionDate.toLocaleDateString("en-CA", {
          timeZone: "Asia/Kolkata",
        });
      } else {
        // Fallback to current date in IST
        const now = new Date();
        dateKey = now.toLocaleDateString("en-CA", {
          timeZone: "Asia/Kolkata",
        });
      }

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(transaction);
    });
    return grouped;
  };

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group filtered transactions by date
  const groupedTransactions = groupTransactionsByDate(filteredTransactions);
  const transactionDates = Object.keys(groupedTransactions).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  return (
    <Card
      padding="none"
      style={{ backgroundColor: currentColors.cardBackground }}
    >
      <div
        className="p-4 border-b"
        style={{ borderBottomColor: currentColors.border }}
      >
        <h2
          className="text-lg font-semibold"
          style={{ color: currentColors.text }}
        >
          Recent Transactions
        </h2>
      </div>

      <div>
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p style={{ color: currentColors.textSecondary }}>
              Loading transactions...
            </p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p style={{ color: currentColors.expense }} className="mb-2">
              {error}
            </p>
            <button
              onClick={onRetry}
              className="text-yellow-400 hover:text-yellow-300 text-sm"
            >
              Try again
            </button>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-8 text-center">
            <p style={{ color: currentColors.textSecondary }}>
              {searchQuery
                ? "No transactions found matching your search."
                : "No transactions found for this period."}
            </p>
          </div>
        ) : (
          transactionDates.map((date) => {
            const dayTransactions = groupedTransactions[date];

            return (
              <div key={date}>
                {/* Date Header */}
                <div
                  className="px-4 py-3 border-b text-sm font-medium"
                  style={{
                    backgroundColor: currentColors.hover,
                    borderBottomColor: currentColors.border,
                    color: currentColors.text,
                  }}
                >
                  {formatDate(date)}
                </div>

                {/* Transactions for this date */}
                <div>
                  {dayTransactions.map((transaction) => {
                    const IconComponent = getCategoryIcon(transaction.category);
                    const categoryColor = getCategoryColor(
                      transaction.category
                    );

                    return (
                      <div
                        key={transaction._id || transaction.id}
                        className="px-4 py-3 transition-colors border-b hover:bg-opacity-50"
                        style={{
                          cursor: "pointer",
                          borderBottomColor: currentColors.border,
                          backgroundColor: "transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            currentColors.hover;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                        onClick={() => onTransactionClick(transaction)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {/* Category Icon */}
                            <div
                              className="p-2 rounded-full flex-shrink-0"
                              style={{
                                backgroundColor: categoryColor + "20",
                              }}
                            >
                              <IconComponent
                                className="h-5 w-5"
                                style={{
                                  color: categoryColor,
                                }}
                              />
                            </div>

                            {/* Transaction Details */}
                            <div className="min-w-0 flex-1">
                              <h3
                                className="font-medium text-sm"
                                style={{ color: currentColors.text }}
                              >
                                {transaction.category}
                              </h3>
                              <p
                                className="text-xs truncate"
                                style={{
                                  color: currentColors.textSecondary,
                                }}
                              >
                                {transaction.description}
                              </p>
                            </div>
                          </div>

                          {/* Amount Only */}
                          <div className="text-right flex-shrink-0">
                            <p
                              className="text-sm font-semibold"
                              style={{
                                color:
                                  transaction.type === "income"
                                    ? currentColors.income
                                    : currentColors.expense,
                              }}
                            >
                              {transaction.type === "expense" ? "-" : "+"}
                              {formatCurrency(Math.abs(transaction.amount))}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {!isLoading && !error && totalPages > 1 && (
        <div
          className="p-4 border-t flex items-center justify-between"
          style={{ borderTopColor: currentColors.border }}
        >
          <p className="text-sm" style={{ color: currentColors.textSecondary }}>
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }

              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "primary" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
