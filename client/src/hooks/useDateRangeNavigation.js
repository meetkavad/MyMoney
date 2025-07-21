"use client";

import { useState } from "react";

export function useDateRangeNavigation(
  initialDate = new Date(),
  initialRange = "monthly"
) {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [dateRange, setDateRange] = useState(initialRange);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Navigate date range
  const navigateDate = (direction, onPageReset) => {
    const newDate = new Date(currentDate);

    switch (dateRange) {
      case "daily":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
        break;
      case "weekly":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
        break;
      case "monthly":
        newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
        break;
      case "yearly":
        newDate.setFullYear(
          newDate.getFullYear() + (direction === "next" ? 1 : -1)
        );
        break;
    }

    setCurrentDate(newDate);

    // Reset page to 1 if callback provided
    if (onPageReset) {
      onPageReset(1);
    }
  };

  const toggleFilterMenu = () => setShowFilterMenu(!showFilterMenu);
  const closeFilterMenu = () => setShowFilterMenu(false);

  return {
    currentDate,
    setCurrentDate,
    dateRange,
    setDateRange,
    showFilterMenu,
    navigateDate,
    toggleFilterMenu,
    closeFilterMenu,
  };
}
