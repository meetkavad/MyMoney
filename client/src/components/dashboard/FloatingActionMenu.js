"use client";

import { Plus, FileText, Receipt, Upload } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function FloatingActionMenu({
  showFloatingMenu,
  onFloatingMenuEnter,
  onFloatingMenuLeave,
  onNewTransaction,
  onUploadReceipt,
  onUploadHistory,
}) {
  const { isDarkMode, colors } = useTheme();
  const currentColors = isDarkMode ? colors.dark : colors.light;

  // Simple hover handler for buttons
  const handleButtonHover = (
    e,
    isEntering,
    bgColor = currentColors.cardBackground
  ) => {
    e.target.style.backgroundColor = isEntering ? bgColor : "transparent";
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-50"
      onMouseEnter={onFloatingMenuEnter}
      onMouseLeave={onFloatingMenuLeave}
    >
      {/* Hover Menu Options */}
      {showFloatingMenu && (
        <div className="absolute bottom-16 right-0 space-y-3 mb-2">
          <div
            className="flex items-center space-x-3 bg-white rounded-lg shadow-lg p-3 transform transition-all duration-200"
            style={{
              backgroundColor: currentColors.cardBackground,
              border: `1px solid ${currentColors.border}`,
            }}
          >
            <button
              onClick={onNewTransaction}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
              style={{
                color: currentColors.text,
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) =>
                handleButtonHover(e, true, currentColors.hover)
              }
              onMouseLeave={(e) => handleButtonHover(e, false)}
            >
              <FileText className="h-5 w-5" />
              <span className="text-sm font-medium">Create New</span>
            </button>
          </div>

          <div
            className="flex items-center space-x-3 bg-white rounded-lg shadow-lg p-3 transform transition-all duration-200"
            style={{
              backgroundColor: currentColors.cardBackground,
              border: `1px solid ${currentColors.border}`,
            }}
          >
            <button
              onClick={onUploadReceipt}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
              style={{
                color: currentColors.text,
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) =>
                handleButtonHover(e, true, currentColors.hover)
              }
              onMouseLeave={(e) => handleButtonHover(e, false)}
            >
              <Receipt className="h-5 w-5" />
              <span className="text-sm font-medium">Upload Receipt</span>
            </button>
          </div>

          <div
            className="flex items-center space-x-3 bg-white rounded-lg shadow-lg p-3 transform transition-all duration-200"
            style={{
              backgroundColor: currentColors.cardBackground,
              border: `1px solid ${currentColors.border}`,
            }}
          >
            <button
              onClick={onUploadHistory}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
              style={{
                color: currentColors.text,
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) =>
                handleButtonHover(e, true, currentColors.hover)
              }
              onMouseLeave={(e) => handleButtonHover(e, false)}
            >
              <Upload className="h-5 w-5" />
              <span className="text-sm font-medium">
                Upload Transaction History
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Button */}
      <button
        className="w-14 h-14 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center"
        style={{
          backgroundColor: currentColors.primary,
        }}
        onClick={onNewTransaction}
      >
        <Plus className="h-6 w-6" style={{ color: "white" }} />
      </button>
    </div>
  );
}
