"use client";

import { useState, useEffect, useCallback } from "react";
import NewTransactionModal from "@/components/modals/NewTransactionModal";
import TransactionDetailsModal from "@/components/modals/TransactionDetailsModal";
import UploadModal from "@/components/modals/UploadModal";
import AuthNavbar from "@/components/layout/AuthNavbar";
import { transactionAPI, userAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { getDateRange } from "@/lib/dateUtils";
import { useDateRangeNavigation } from "@/hooks/useDateRangeNavigation";
import {
  DateRangeControls,
  GreetingSection,
  SummaryCards,
  TransactionsList,
  FloatingActionMenu,
} from "@/components/dashboard";

export default function Dashboard() {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const currentColors = isDarkMode ? colors.dark : colors.light;

  // Use shared date range navigation hook
  const {
    currentDate,
    setCurrentDate,
    dateRange,
    setDateRange,
    showFilterMenu,
    navigateDate,
    toggleFilterMenu,
    closeFilterMenu,
  } = useDateRangeNavigation();

  // State for UI controls
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [editTransactionData, setEditTransactionData] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState("receipt"); // "receipt" or "history"
  const [hoverTimeout, setHoverTimeout] = useState(null);

  // State for API data
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [summaryData, setSummaryData] = useState({
    income: 0,
    expense: 0,
    total: 0,
  });

  // State for user data
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const transactionsPerPage = 10;

  // Fetch transactions from API
  const fetchTransactions = useCallback(async () => {
    // Don't fetch if user is not authenticated
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { start, end } = getDateRange(currentDate, dateRange);

      const response = await transactionAPI.getTransactions({
        start,
        end,
        page: currentPage,
        limit: transactionsPerPage,
      });

      if (response.data) {
        setTransactions(response.data);
        setTotalPages(response.totalPages || 1);

        // Update summary data from API response
        if (response.totalAmount) {
          const income = response.totalAmount.income || 0;
          const expense = response.totalAmount.expense || 0;

          // Use absolute values from backend for display
          const absoluteIncome =
            response.totalAmount.income_absolute || Math.abs(income);
          const absoluteExpense =
            response.totalAmount.expense_absolute || Math.abs(expense);

          setSummaryData({
            income: absoluteIncome, // Use absolute income
            expense: absoluteExpense, // Use absolute expense
            total: absoluteIncome - absoluteExpense, // Calculate net total
          });
        } else {
          // Set default values if no totalAmount
          setSummaryData({
            income: 0,
            expense: 0,
            total: 0,
          });
        }
      }
    } catch (err) {
      setError(err.message || "Failed to fetch transactions");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, currentDate, dateRange, currentPage]);

  // Effect to fetch data when dependencies change
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchTransactions();
    }
  }, [fetchTransactions, isAuthenticated, authLoading]);

  // Search effect - reset to page 1 when searching
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      // If already on page 1, fetch data
      fetchTransactions();
    }
  }, [
    searchQuery,
    isAuthenticated,
    authLoading,
    currentPage,
    fetchTransactions,
  ]);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (authLoading || !isAuthenticated) return;

      try {
        setUserLoading(true);
        const userData = await userAPI.getProfile();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        // Don't show error to user for profile fetch failure
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, authLoading]);

  // Handle floating menu hover with delay
  const handleFloatingMenuEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setShowFloatingMenu(true);
  };

  const handleFloatingMenuLeave = () => {
    const timeout = setTimeout(() => {
      setShowFloatingMenu(false);
    }, 300);
    setHoverTimeout(timeout);
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetails(true);
  };

  const handleTransactionEdit = (transaction) => {
    setEditTransactionData(transaction);
    setShowTransactionDetails(false);
    setShowNewTransactionModal(true);
  };

  const handleTransactionDelete = async (transactionId) => {
    try {
      const result = await transactionAPI.deleteTransaction(transactionId);

      // Refresh data after deletion
      await fetchTransactions();
      setShowTransactionDetails(false);
    } catch (err) {
      alert(`Failed to delete transaction: ${err.message}`);
    }
  };

  const handleTransactionSave = async (transactionData) => {
    try {
      if (editTransactionData) {
        // Update existing transaction
        const result = await transactionAPI.updateTransaction(
          editTransactionData._id || editTransactionData.id,
          transactionData
        );
      } else {
        // Create new transaction
        const result = await transactionAPI.createTransaction(transactionData);
      }

      // Refresh data after save
      await fetchTransactions();
      setShowNewTransactionModal(false);
      setEditTransactionData(null);
    } catch (err) {
      alert(`Failed to save transaction: ${err.message}`);
    }
  };

  // Handle file upload
  const handleFileUpload = async (file, type) => {
    try {
      setIsLoading(true);
      await transactionAPI.extractTransactions(file, type);
      // Refresh data after upload
      await fetchTransactions();
      setShowUploadModal(false);
      alert("Transactions extracted and saved successfully!");
    } catch (err) {
      alert("Failed to process file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Display loading screen while authentication is being checked
  if (authLoading) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: currentColors.background }}
      >
        <AuthNavbar currentPage="dashboard" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div
            className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent"
            style={{
              borderColor: currentColors.primary,
              borderTopColor: "transparent",
            }}
          ></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: currentColors.background }}
    >
      {/* Navbar */}
      <AuthNavbar currentPage="dashboard" />

      {/* Greeting Section with Search */}
      <GreetingSection
        user={user}
        userLoading={userLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Date Range Controls */}
        <DateRangeControls
          currentDate={currentDate}
          dateRange={dateRange}
          onNavigateDate={(direction) =>
            navigateDate(direction, setCurrentPage)
          }
          onDateRangeChange={setDateRange}
          showFilterMenu={showFilterMenu}
          onToggleFilterMenu={toggleFilterMenu}
          onCloseFilterMenu={closeFilterMenu}
        />

        {/* Summary Cards */}
        <SummaryCards summaryData={summaryData} />

        {/* Transactions List */}
        <TransactionsList
          transactions={filteredTransactions}
          isLoading={isLoading}
          error={error}
          searchQuery={searchQuery}
          currentPage={currentPage}
          totalPages={totalPages}
          onTransactionClick={handleTransactionClick}
          onPageChange={setCurrentPage}
          onRetry={fetchTransactions}
        />

        {/* Floating Action Menu */}
        <FloatingActionMenu
          showFloatingMenu={showFloatingMenu}
          onFloatingMenuEnter={handleFloatingMenuEnter}
          onFloatingMenuLeave={handleFloatingMenuLeave}
          onNewTransaction={() => {
            setShowNewTransactionModal(true);
            setShowFloatingMenu(false);
          }}
          onUploadReceipt={() => {
            setUploadType("receipt");
            setShowUploadModal(true);
            setShowFloatingMenu(false);
          }}
          onUploadHistory={() => {
            setUploadType("history");
            setShowUploadModal(true);
            setShowFloatingMenu(false);
          }}
        />
      </div>

      {/* New Transaction Modal */}
      {showNewTransactionModal && (
        <NewTransactionModal
          isOpen={showNewTransactionModal}
          onClose={() => {
            setShowNewTransactionModal(false);
            setEditTransactionData(null);
          }}
          editData={editTransactionData}
          onSave={handleTransactionSave}
        />
      )}

      {/* Transaction Details Modal */}
      {showTransactionDetails && (
        <TransactionDetailsModal
          isOpen={showTransactionDetails}
          onClose={() => setShowTransactionDetails(false)}
          transaction={selectedTransaction}
          onEdit={handleTransactionEdit}
          onDelete={handleTransactionDelete}
        />
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          uploadType={uploadType}
          onUpload={handleFileUpload}
        />
      )}
    </div>
  );
}
