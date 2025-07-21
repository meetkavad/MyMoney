"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { DateRangeHeader } from "@/components/shared";

export default function AnalyticsHeader({
  currentDate,
  dateRange,
  selectedView,
  onNavigateDate,
  onDateRangeChange,
  onViewChange,
  showFilterMenu,
  onToggleFilterMenu,
  onCloseFilterMenu,
}) {
  const { isDarkMode, colors } = useTheme();
  const currentColors = isDarkMode ? colors.dark : colors.light;

  const viewOptions = [
    { value: "expense", label: "Expense Overview" },
    { value: "income", label: "Income Overview" },
  ];

  return (
    <>
      {/* Header with Date Range Controls */}
      <DateRangeHeader
        currentDate={currentDate}
        dateRange={dateRange}
        onNavigateDate={onNavigateDate}
        onDateRangeChange={onDateRangeChange}
        showFilterMenu={showFilterMenu}
        onToggleFilterMenu={onToggleFilterMenu}
        onCloseFilterMenu={onCloseFilterMenu}
      />

      {/* View Selector */}
      <div className="mb-6">
        <div className="flex space-x-2">
          {viewOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onViewChange(option.value)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedView === option.value
                  ? "font-medium"
                  : "hover:bg-opacity-80"
              }`}
              style={{
                backgroundColor:
                  selectedView === option.value
                    ? currentColors.primary
                    : currentColors.cardBackground,
                color:
                  selectedView === option.value ? "white" : currentColors.text,
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
