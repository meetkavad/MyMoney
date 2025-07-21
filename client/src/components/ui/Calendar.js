"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { formatDate } from "@/lib/utils";
import Card from "@/components/ui/Card";

export default function Calendar({
  isOpen,
  selectedDate,
  onDateChange,
  onClose,
}) {
  const { isDarkMode, colors } = useTheme();
  const currentColors = isDarkMode ? colors.dark : colors.light;

  const [viewDate, setViewDate] = useState(new Date(selectedDate));
  const [showYearPicker, setShowYearPicker] = useState(false);

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

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  // Generate year options (current year ± 10 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = currentYear - 10; year <= currentYear + 10; year++) {
    yearOptions.push(year);
  }

  const handleYearChange = (year) => {
    setViewDate(new Date(year, viewDate.getMonth(), viewDate.getDate()));
    setShowYearPicker(false);
  };

  const handleDateSelect = (day) => {
    if (day) {
      const newDate = new Date(
        viewDate.getFullYear(),
        viewDate.getMonth(),
        day
      );
      onDateChange(newDate);
    }
  };

  const days = getDaysInMonth(viewDate);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <Card
        className="w-[460px] max-w-95vw"
        style={{ backgroundColor: currentColors.cardBackground }}
      >
        <div className="p-6">
          {/* Year Selector */}
          <div className="text-center mb-4">
            <button
              onClick={() => setShowYearPicker(!showYearPicker)}
              className="text-sm text-gray-400 hover:text-yellow-400 transition-colors mb-2"
            >
              {viewDate.getFullYear()} ▼
            </button>
            {showYearPicker && (
              <div
                className="absolute z-10 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                style={{
                  backgroundColor: currentColors.cardBackground,
                  borderColor: currentColors.border,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "120px",
                }}
              >
                {yearOptions.map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearChange(year)}
                    className="block w-full px-3 py-2 text-sm hover:bg-gray-700 transition-colors"
                    style={{
                      color:
                        year === viewDate.getFullYear()
                          ? "#FFC107"
                          : currentColors.textSecondary,
                      backgroundColor:
                        year === viewDate.getFullYear()
                          ? "rgba(255, 193, 7, 0.1)"
                          : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (year !== viewDate.getFullYear()) {
                        e.target.style.backgroundColor = currentColors.hover;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (year !== viewDate.getFullYear()) {
                        e.target.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
            <h2 className="text-2xl font-bold text-yellow-400">
              {formatDate(selectedDate)}
            </h2>
          </div>

          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() =>
                setViewDate(
                  new Date(viewDate.getFullYear(), viewDate.getMonth() - 1)
                )
              }
              className="p-2 rounded-lg"
              style={{ color: currentColors.textSecondary }}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h3
              className="text-lg font-semibold"
              style={{ color: currentColors.text }}
            >
              {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
            </h3>
            <button
              onClick={() =>
                setViewDate(
                  new Date(viewDate.getFullYear(), viewDate.getMonth() + 1)
                )
              }
              className="p-2 rounded-lg"
              style={{ color: currentColors.textSecondary }}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-6 mb-4 justify-items-center">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, dayIndex) => (
              <div
                key={`day-header-${dayIndex}`}
                className="text-center text-sm font-medium p-2"
                style={{
                  color: currentColors.textSecondary,
                  minWidth: "52px",
                }}
              >
                {day}
              </div>
            ))}
            {days.map((day, index) => (
              <button
                key={`calendar-day-${index}`}
                onClick={() => handleDateSelect(day)}
                className={`text-center rounded-full transition-all duration-200 flex items-center justify-center ${
                  day
                    ? "hover:bg-yellow-400 hover:bg-opacity-20 hover:scale-105"
                    : ""
                }`}
                style={{
                  color: day ? currentColors.text : "transparent",
                  backgroundColor:
                    day === selectedDate.getDate() &&
                    viewDate.getMonth() === selectedDate.getMonth() &&
                    viewDate.getFullYear() === selectedDate.getFullYear()
                      ? "#FFC107"
                      : day
                      ? "rgba(255, 255, 255, 0.05)"
                      : "transparent",
                  height: "52px",
                  width: "52px",
                  fontSize: "14px",
                  fontWeight: "500",
                  border: "none",
                  outline: "none",
                }}
                disabled={!day}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg font-medium text-yellow-400"
            >
              CANCEL
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg font-medium text-yellow-400"
            >
              OK
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
