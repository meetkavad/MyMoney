"use client";

import Card from "@/components/ui/Card";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { formatCurrency } from "@/lib/utils";

export default function SummaryCards({ summaryData }) {
  const { isDarkMode, colors } = useTheme();
  const currentColors = isDarkMode ? colors.dark : colors.light;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Income Card */}
      <Card
        className="text-center"
        padding="md"
        style={{ backgroundColor: currentColors.cardBackground }}
      >
        <div className="flex items-center justify-center mb-2">
          <div
            className="p-2 rounded-full"
            style={{ backgroundColor: currentColors.incomeLight }}
          >
            <TrendingUp
              className="h-5 w-5"
              style={{ color: currentColors.income }}
            />
          </div>
        </div>
        <p
          className="text-xs font-medium mb-1"
          style={{ color: currentColors.textSecondary }}
        >
          INCOME
        </p>
        <p
          className="text-xl font-bold"
          style={{ color: currentColors.income }}
        >
          {formatCurrency(summaryData.income)}
        </p>
      </Card>

      {/* Expense Card */}
      <Card
        className="text-center"
        padding="md"
        style={{ backgroundColor: currentColors.cardBackground }}
      >
        <div className="flex items-center justify-center mb-2">
          <div
            className="p-2 rounded-full"
            style={{ backgroundColor: currentColors.expenseLight }}
          >
            <TrendingDown
              className="h-5 w-5"
              style={{ color: currentColors.expense }}
            />
          </div>
        </div>
        <p
          className="text-xs font-medium mb-1"
          style={{ color: currentColors.textSecondary }}
        >
          EXPENSE
        </p>
        <p
          className="text-xl font-bold"
          style={{ color: currentColors.expense }}
        >
          {formatCurrency(summaryData.expense)}
        </p>
      </Card>

      {/* Total Card */}
      <Card
        className="text-center"
        padding="md"
        style={{ backgroundColor: currentColors.cardBackground }}
      >
        <div className="flex items-center justify-center mb-2">
          <div
            className="p-2 rounded-full"
            style={{ backgroundColor: currentColors.primaryLight }}
          >
            <DollarSign
              className="h-5 w-5"
              style={{ color: currentColors.primary }}
            />
          </div>
        </div>
        <p
          className="text-xs font-medium mb-1"
          style={{ color: currentColors.textSecondary }}
        >
          TOTAL
        </p>
        <p
          className="text-xl font-bold"
          style={{
            color:
              summaryData.total >= 0
                ? currentColors.income
                : currentColors.expense,
          }}
        >
          {summaryData.total >= 0 ? "" : "-"}
          {formatCurrency(Math.abs(summaryData.total))}
        </p>
      </Card>
    </div>
  );
}
