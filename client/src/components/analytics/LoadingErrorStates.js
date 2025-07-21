"use client";

import { useTheme } from "@/contexts/ThemeContext";

export default function LoadingErrorStates({ isLoading, error, onRetry }) {
  const { isDarkMode, colors } = useTheme();
  const currentColors = isDarkMode ? colors.dark : colors.light;

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
        <p style={{ color: currentColors.textSecondary }}>
          Loading analytics...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p style={{ color: currentColors.expense }} className="mb-4">
          {error}
        </p>
        <button
          onClick={onRetry}
          className="text-yellow-400 hover:text-yellow-300"
        >
          Try again
        </button>
      </div>
    );
  }

  return null;
}
