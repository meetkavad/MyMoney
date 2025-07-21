// For Dark/Light mode toggle and theming
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    console.log("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if user has a saved theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    } else {
      // Default to system preference
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      // Light theme colors
      light: {
        background: "#F5F5F5",
        cardBackground: "#FFFFFF",
        text: "#212121",
        textSecondary: "#757575",
        textTertiary: "#9E9E9E",
        border: "#E0E0E0",
        navbar: "#FFFFFF",
        primary: "#4DB6AC",
        primaryLight: "#E0F2F1",
        income: "#4CAF50",
        incomeLight: "#E8F5E8",
        expense: "#F44336",
        expenseLight: "#FFEBEE",
        hover: "#F5F5F5",
      },
      // Dark theme colors
      dark: {
        background: "#1E1E1E",
        cardBackground: "#2D2D2D",
        text: "#FFFFFF",
        textSecondary: "#B0B0B0",
        textTertiary: "#808080",
        border: "#404040",
        navbar: "#2D2D2D",
        primary: "#4DB6AC",
        primaryLight: "#263238",
        income: "#4CAF50",
        incomeLight: "#1B5E20",
        expense: "#F44336",
        expenseLight: "#B71C1C",
        hover: "#404040",
      },
    },
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
