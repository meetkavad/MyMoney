"use client";

import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import Card from "@/components/ui/Card";

export default function TimePicker({
  isOpen,
  selectedTime,
  onTimeChange,
  onClose,
}) {
  const { isDarkMode, colors } = useTheme();
  const currentColors = isDarkMode ? colors.dark : colors.light;

  const [tempHour, setTempHour] = useState(selectedTime.getHours() % 12 || 12);
  const [tempMinute, setTempMinute] = useState(selectedTime.getMinutes());
  const [isAM, setIsAM] = useState(selectedTime.getHours() < 12);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleSave = () => {
    const newTime = new Date(selectedTime);
    const hour24 = isAM
      ? tempHour === 12
        ? 0
        : tempHour
      : tempHour === 12
      ? 12
      : tempHour + 12;
    newTime.setHours(hour24, tempMinute);
    onTimeChange(newTime);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <Card
        className="w-80 max-w-90vw"
        style={{ backgroundColor: currentColors.cardBackground }}
      >
        <div className="p-6">
          <div className="text-center mb-6">
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: currentColors.text }}
            >
              Select Time
            </h2>
            <div className="text-4xl font-light text-yellow-400 mb-6">
              {tempHour}:{tempMinute.toString().padStart(2, "0")}{" "}
              {isAM ? "AM" : "PM"}
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: currentColors.textSecondary }}
              >
                Hour
              </label>
              <select
                value={tempHour}
                onChange={(e) => setTempHour(parseInt(e.target.value))}
                className="w-full p-3 rounded-lg border"
                style={{
                  backgroundColor: currentColors.background,
                  borderColor: currentColors.border,
                  color: currentColors.text,
                }}
              >
                {hours.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: currentColors.textSecondary }}
              >
                Minute
              </label>
              <select
                value={tempMinute}
                onChange={(e) => setTempMinute(parseInt(e.target.value))}
                className="w-full p-3 rounded-lg border"
                style={{
                  backgroundColor: currentColors.background,
                  borderColor: currentColors.border,
                  color: currentColors.text,
                }}
              >
                {minutes.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: currentColors.textSecondary }}
              >
                Period
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsAM(true)}
                  className="flex-1 py-3 px-4 rounded-lg font-medium transition-colors"
                  style={{
                    backgroundColor: isAM ? "#FFC107" : currentColors.secondary,
                    color: isAM ? "#000000" : currentColors.text,
                  }}
                >
                  AM
                </button>
                <button
                  onClick={() => setIsAM(false)}
                  className="flex-1 py-3 px-4 rounded-lg font-medium transition-colors"
                  style={{
                    backgroundColor: !isAM
                      ? "#FFC107"
                      : currentColors.secondary,
                    color: !isAM ? "#000000" : currentColors.text,
                  }}
                >
                  PM
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg font-medium text-yellow-400"
            >
              CANCEL
            </button>
            <button
              onClick={handleSave}
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
