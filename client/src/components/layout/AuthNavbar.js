"use client";

import { DollarSign, Sun, Moon, LogOut, Menu, X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import Link from "next/link";

export default function AuthNavbar({ currentPage = "dashboard" }) {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const currentColors = isDarkMode ? colors.dark : colors.light;
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  return (
    <nav
      className="shadow-sm border-b"
      style={{
        backgroundColor: currentColors.navbar,
        borderBottomColor: currentColors.border,
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center cursor-pointer">
              <DollarSign
                className="h-8 w-8 mr-2"
                style={{ color: currentColors.primary }}
              />
              <span
                className="text-xl font-bold"
                style={{ color: currentColors.text }}
              >
                My<span style={{ color: currentColors.primary }}>Money</span>
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-6">
              <Link
                href="/dashboard"
                className="px-3 py-2 rounded-md text-sm font-medium"
                style={{
                  color:
                    currentPage === "dashboard"
                      ? currentColors.primary
                      : currentColors.textSecondary,
                  backgroundColor:
                    currentPage === "dashboard"
                      ? currentColors.primaryLight
                      : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== "dashboard") {
                    e.target.style.backgroundColor = currentColors.hover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== "dashboard") {
                    e.target.style.backgroundColor = "transparent";
                  }
                }}
              >
                Dashboard
              </Link>
              <Link
                href="/analytics"
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                style={{
                  color:
                    currentPage === "analytics"
                      ? currentColors.primary
                      : currentColors.textSecondary,
                  backgroundColor:
                    currentPage === "analytics"
                      ? currentColors.primaryLight
                      : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== "analytics") {
                    e.target.style.backgroundColor = currentColors.hover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== "analytics") {
                    e.target.style.backgroundColor = "transparent";
                  }
                }}
              >
                Analytics
              </Link>
              <Link
                href="/profile"
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                style={{
                  color:
                    currentPage === "profile"
                      ? currentColors.primary
                      : currentColors.textSecondary,
                  backgroundColor:
                    currentPage === "profile"
                      ? currentColors.primaryLight
                      : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== "profile") {
                    e.target.style.backgroundColor = currentColors.hover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== "profile") {
                    e.target.style.backgroundColor = "transparent";
                  }
                }}
              >
                Profile
              </Link>
            </div>
          </div>

          {/* Right side - Theme Toggle and Logout */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors"
              style={{
                color: currentColors.textSecondary,
              }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = currentColors.hover)
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Logout Button - Desktop */}
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors"
              style={{
                color: currentColors.textSecondary,
              }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = currentColors.hover)
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md transition-colors"
                style={{ color: currentColors.textSecondary }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = currentColors.hover)
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div
              className="px-2 pt-2 pb-3 space-y-1 border-t"
              style={{ borderTopColor: currentColors.border }}
            >
              {/* Navigation Links */}
              <div className="space-y-1">
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  style={{
                    color:
                      currentPage === "dashboard"
                        ? currentColors.primary
                        : currentColors.textSecondary,
                    backgroundColor:
                      currentPage === "dashboard"
                        ? currentColors.primaryLight
                        : "transparent",
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/analytics"
                  className="block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  style={{
                    color:
                      currentPage === "analytics"
                        ? currentColors.primary
                        : currentColors.textSecondary,
                    backgroundColor:
                      currentPage === "analytics"
                        ? currentColors.primaryLight
                        : "transparent",
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Analytics
                </Link>
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  style={{
                    color:
                      currentPage === "profile"
                        ? currentColors.primary
                        : currentColors.textSecondary,
                    backgroundColor:
                      currentPage === "profile"
                        ? currentColors.primaryLight
                        : "transparent",
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
              </div>

              {/* Mobile Logout Button */}
              <div
                className="pt-4 border-t"
                style={{ borderTopColor: currentColors.border }}
              >
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg transition-colors text-left"
                  style={{
                    color: currentColors.textSecondary,
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-base font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
