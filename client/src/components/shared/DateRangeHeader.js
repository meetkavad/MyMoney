"use client";

import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function DateRangeHeader({
  currentDate,
  dateRange,
  onNavigateDate,
  onDateRangeChange,
  showFilterMenu,
  onToggleFilterMenu,
  onCloseFilterMenu,
}) {
  const { isDarkMode, colors } = useTheme();
  const currentColors = isDarkMode ? colors.dark : colors.light;

  const periods = ["daily", "weekly", "monthly", "yearly"];

  // Simple hover handler for buttons
  const handleHover = (
    e,
    isEntering,
    bgColor = currentColors.cardBackground
  ) => {
    e.target.style.backgroundColor = isEntering ? bgColor : "transparent";
  };

  // Get date range text (Indian timezone)
  const getDateRangeText = () => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Convert to Indian timezone for display
    const istDate = new Date(
      currentDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    switch (dateRange) {
      case "daily":
        return istDate.toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "Asia/Kolkata",
        });
      case "weekly":
        const weekStart = new Date(istDate);
        weekStart.setDate(weekStart.getDate() - 6); // 6 days ago + today = 7 days

        const formatWeekDate = (date) => {
          return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            timeZone: "Asia/Kolkata",
          });
        };

        return `${formatWeekDate(weekStart)} - ${formatWeekDate(istDate)}`;
      case "monthly":
        return `${monthNames[istDate.getMonth()]}, ${istDate.getFullYear()}`;
      case "yearly":
        return istDate.getFullYear().toString();
      default:
        return `${monthNames[istDate.getMonth()]}, ${istDate.getFullYear()}`;
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        {/* Date Navigation */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigateDate("prev")}
            className="p-2 rounded-lg transition-colors"
            style={{ color: currentColors.textSecondary }}
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <h1
            className="text-2xl font-bold"
            style={{ color: currentColors.text }}
          >
            {getDateRangeText()}
          </h1>

          <button
            onClick={() => onNavigateDate("next")}
            className="p-2 rounded-lg transition-colors"
            style={{ color: currentColors.textSecondary }}
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filter Menu */}
      <div className="relative">
        <button
          onClick={onToggleFilterMenu}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
          style={{ color: currentColors.textSecondary }}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          <Filter className="h-5 w-5" />
          <span className="text-sm font-medium capitalize">{dateRange}</span>
        </button>

        {showFilterMenu && (
          <div
            className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-10"
            style={{
              backgroundColor: currentColors.cardBackground,
              borderColor: currentColors.border,
            }}
          >
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => {
                  onDateRangeChange(period);
                  onCloseFilterMenu();
                }}
                className={`block w-full text-left px-4 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  dateRange === period ? "font-medium" : ""
                }`}
                style={{
                  color:
                    dateRange === period
                      ? currentColors.primary
                      : currentColors.text,
                }}
                onMouseEnter={(e) => handleHover(e, true, currentColors.hover)}
                onMouseLeave={(e) => handleHover(e, false)}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
