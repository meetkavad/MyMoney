"use client";

import { Search } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function GreetingSection({
  user,
  userLoading,
  searchQuery,
  onSearchChange,
}) {
  const { isDarkMode, colors } = useTheme();
  const currentColors = isDarkMode ? colors.dark : colors.light;

  // Helper function to get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Helper function to get first name from full name
  const getFirstName = (fullName) => {
    if (!fullName) return "";
    return fullName.split(" ")[0];
  };

  return (
    <div
      className="border-b"
      style={{
        backgroundColor: currentColors.navbar,
        borderBottomColor: currentColors.border,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Greeting Message */}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h1
                className="text-xl font-semibold"
                style={{ color: currentColors.text }}
              >
                {userLoading ? (
                  <div className="flex items-center space-x-2">
                    <div
                      className="animate-pulse h-6 w-32 rounded"
                      style={{ backgroundColor: currentColors.hover }}
                    ></div>
                  </div>
                ) : (
                  <>
                    {getGreeting()}
                    {user?.name ? `, ${getFirstName(user.name)}!` : "!"}
                  </>
                )}
              </h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-shrink-0 ml-6">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search
                  className="h-5 w-5"
                  style={{ color: currentColors.textTertiary }}
                />
              </div>
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border rounded-md leading-5 placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-opacity-50 sm:text-sm transition-colors"
                style={{
                  backgroundColor: currentColors.cardBackground,
                  borderColor: currentColors.border,
                  color: currentColors.text,
                  focusRingColor: currentColors.primary,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
