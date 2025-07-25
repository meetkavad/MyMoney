"use client";

import AuthNavbar from "@/components/layout/AuthNavbar";
import { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { transactionAPI } from "@/lib/api";
import { getDateRange } from "@/lib/dateUtils";
import { useDateRangeNavigation } from "@/hooks/useDateRangeNavigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import {
  AnalyticsHeader,
  PieChartSection,
  CategoryList,
  FlowChart,
  LoadingErrorStates,
} from "@/components/analytics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Analytics() {
  const { isDarkMode, colors } = useTheme();
  const currentColors = isDarkMode ? colors.dark : colors.light;

  // date range navigation hook
  const {
    currentDate,
    dateRange,
    setDateRange,
    showFilterMenu,
    navigateDate,
    toggleFilterMenu,
    closeFilterMenu,
  } = useDateRangeNavigation();

  // State for UI controls
  const [selectedView, setSelectedView] = useState("expense");

  // State for API data
  const [analyticsData, setAnalyticsData] = useState([]);
  const [flowData, setFlowData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAmount, setTotalAmount] = useState({ income: 0, expense: 0 });

  // Fetch analytics data from API
  const fetchAnalyticsData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { start, end } = getDateRange(currentDate, dateRange);

      // Fetch analytics data for the selected view type
      const analyticsResponse = await transactionAPI.getAnalytics(
        selectedView,
        start,
        end
      );

      if (analyticsResponse.analytics) {
        setAnalyticsData(analyticsResponse.analytics);
        setTotalAmount(
          analyticsResponse.totalAmount || { income: 0, expense: 0 }
        );
      }

      // Fetch flow data (transactions for line chart)
      const flowResponse = await transactionAPI.getTransactions({
        start,
        end,
        page: 1,
        limit: 1000,
      });

      if (flowResponse.data) {
        setFlowData(flowResponse.data);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch analytics data");
    } finally {
      setIsLoading(false);
    }
  }, [currentDate, dateRange, selectedView]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: currentColors.background }}
    >
      {/* Navbar */}
      <AuthNavbar currentPage="analytics" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Analytics Header with Date Range Controls and View Selector */}
        <AnalyticsHeader
          currentDate={currentDate}
          dateRange={dateRange}
          selectedView={selectedView}
          onNavigateDate={navigateDate}
          onDateRangeChange={setDateRange}
          onViewChange={setSelectedView}
          showFilterMenu={showFilterMenu}
          onToggleFilterMenu={toggleFilterMenu}
          onCloseFilterMenu={closeFilterMenu}
        />

        {/* Loading/Error States */}
        <LoadingErrorStates
          isLoading={isLoading}
          error={error}
          onRetry={fetchAnalyticsData}
        />

        {/* Analytics Content */}
        {!isLoading && !error && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pie Chart */}
              <PieChartSection
                analyticsData={analyticsData}
                selectedView={selectedView}
              />

              {/* Category List */}
              <CategoryList analyticsData={analyticsData} />
            </div>

            {/* Flow Chart */}
            <FlowChart flowData={flowData} selectedView={selectedView} />
          </>
        )}
      </div>
    </div>
  );
}
