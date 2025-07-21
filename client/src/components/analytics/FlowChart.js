"use client";

import Card from "@/components/ui/Card";
import { useTheme } from "@/contexts/ThemeContext";
import { formatCurrency } from "@/lib/utils";
import { Line } from "react-chartjs-2";

export default function FlowChart({ flowData, selectedView }) {
  const { isDarkMode, colors } = useTheme();
  const currentColors = isDarkMode ? colors.dark : colors.light;

  // Process flow data for line chart
  const getLineChartData = () => {
    if (!flowData || flowData.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: "Daily Flow",
            data: [],
            borderColor: currentColors.primary,
            backgroundColor: currentColors.primaryLight,
            tension: 0.4,
          },
        ],
      };
    }

    // Group transactions by date and sum amounts
    const dailyTotals = {};
    flowData.forEach((transaction) => {
      if (transaction.type === selectedView) {
        const date = new Date(transaction.date).toLocaleDateString("en-CA", {
          timeZone: "Asia/Kolkata",
        });
        dailyTotals[date] =
          (dailyTotals[date] || 0) + Math.abs(transaction.amount);
      }
    });

    // Sort dates and create chart data
    const sortedDates = Object.keys(dailyTotals).sort();
    const labels = sortedDates.map((date) => {
      const d = new Date(date + "T00:00:00Z");
      return d.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        timeZone: "Asia/Kolkata",
      });
    });
    const data = sortedDates.map((date) => dailyTotals[date]);

    return {
      labels,
      datasets: [
        {
          label: `Daily ${
            selectedView.charAt(0).toUpperCase() + selectedView.slice(1)
          }`,
          data,
          borderColor:
            selectedView === "expense"
              ? currentColors.expense
              : currentColors.income,
          backgroundColor:
            selectedView === "expense"
              ? currentColors.expenseLight
              : currentColors.incomeLight,
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: currentColors.text,
        },
      },
      tooltip: {
        backgroundColor: currentColors.cardBackground,
        titleColor: currentColors.text,
        bodyColor: currentColors.text,
        borderColor: currentColors.border,
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: currentColors.textSecondary,
        },
        grid: {
          color: currentColors.border,
        },
      },
      y: {
        ticks: {
          color: currentColors.textSecondary,
          callback: function (value) {
            return formatCurrency(value);
          },
        },
        grid: {
          color: currentColors.border,
        },
      },
    },
  };

  return (
    <div className="mt-6">
      <Card
        padding="md"
        style={{ backgroundColor: currentColors.cardBackground }}
      >
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: currentColors.text }}
        >
          {selectedView === "expense" ? "Expense" : "Income"} Flow
        </h2>
        <div className="h-80">
          <Line data={getLineChartData()} options={lineChartOptions} />
        </div>
      </Card>
    </div>
  );
}
