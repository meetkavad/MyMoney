"use client";

import { DateRangeHeader } from "@/components/shared";

export default function DateRangeControls({
  currentDate,
  dateRange,
  onNavigateDate,
  onDateRangeChange,
  showFilterMenu,
  onToggleFilterMenu,
  onCloseFilterMenu,
}) {
  return (
    <DateRangeHeader
      currentDate={currentDate}
      dateRange={dateRange}
      onNavigateDate={onNavigateDate}
      onDateRangeChange={onDateRangeChange}
      showFilterMenu={showFilterMenu}
      onToggleFilterMenu={onToggleFilterMenu}
      onCloseFilterMenu={onCloseFilterMenu}
    />
  );
}
