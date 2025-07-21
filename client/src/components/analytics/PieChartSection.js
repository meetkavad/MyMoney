"use client";

import Card from "@/components/ui/Card";
import { useTheme } from "@/contexts/ThemeContext";
import { getCategoryColor } from "@/lib/categories";
import { formatCurrency } from "@/lib/utils";
import { Pie } from "react-chartjs-2";

export default function PieChartSection({ analyticsData, selectedView }) {
  const { isDarkMode, colors } = useTheme();
  const currentColors = isDarkMode ? colors.dark : colors.light;

  // Process analytics data for pie chart
  const getPieChartData = () => {
    if (!analyticsData || analyticsData.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 2,
          },
        ],
      };
    }

    const labels = analyticsData.map((item) => item.category);
    const data = analyticsData.map((item) => Math.abs(item.totalAmount));
    const backgroundColor = analyticsData.map(
      (item) =>
        getCategoryColor(item.category) ||
        (selectedView === "expense"
          ? currentColors.expense
          : currentColors.income)
    );

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderColor: backgroundColor.map((color) => color + "80"),
          borderWidth: 2,
        },
      ],
    };
  };

  // Chart options
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: currentColors.text,
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: currentColors.cardBackground,
        titleColor: currentColors.text,
        bodyColor: currentColors.text,
        borderColor: currentColors.border,
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            const data = analyticsData[context.dataIndex];
            return `${context.label}: ${formatCurrency(data.totalAmount)} (${
              data.percentage
            }%)`;
          },
        },
      },
    },
  };

  return (
    <div className="lg:col-span-2">
      <Card
        padding="md"
        style={{ backgroundColor: currentColors.cardBackground }}
      >
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: currentColors.text }}
        >
          {selectedView === "expense" ? "Expense" : "Income"} Breakdown
        </h2>
        <div className="h-80">
          <Pie data={getPieChartData()} options={pieChartOptions} />
        </div>
      </Card>
    </div>
  );
}
