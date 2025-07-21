"use client";

import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeWrapper({ children }) {
  const { isDarkMode, colors } = useTheme();
  const currentColors = isDarkMode ? colors.dark : colors.light;

  return (
    <div
      className="min-h-screen w-full transition-colors duration-200"
      style={{ backgroundColor: currentColors.background }}
    >
      {children}
    </div>
  );
}
