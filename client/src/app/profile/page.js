"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Edit3, Save, X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { userAPI } from "@/lib/api";
import AuthNavbar from "@/components/layout/AuthNavbar";
import Card from "@/components/ui/Card";

export default function ProfilePage() {
  const { isDarkMode, colors } = useTheme();
  const currentColors = isDarkMode ? colors.dark : colors.light;
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [updating, setUpdating] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        const data = await userAPI.getProfile();
        setProfile(data);
        setEditedName(data.name);
      } catch (error) {
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated]);

  const handleEditClick = () => {
    setIsEditing(true);
    setError("");
    setSuccess("");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedName(profile?.name || "");
    setError("");
  };

  const handleSaveProfile = async () => {
    if (!editedName.trim()) {
      setError("Name is required");
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const updatedProfile = await userAPI.updateProfile({
        name: editedName.trim(),
      });
      setProfile(updatedProfile);
      setIsEditing(false);
      setSuccess("Profile updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.message || "Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  // Show loading state
  if (authLoading || loading) {
    return (
      <div
        style={{
          backgroundColor: currentColors.background,
          minHeight: "100vh",
        }}
      >
        <AuthNavbar currentPage="profile" />
        <div className="container mx-auto px-6 py-8">
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
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      style={{ backgroundColor: currentColors.background, minHeight: "100vh" }}
    >
      <AuthNavbar currentPage="profile" />

      <div className="container mx-auto px-6 py-8 max-w-2xl">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: currentColors.text }}
          >
            Profile Settings
          </h1>
          <p className="text-lg" style={{ color: currentColors.textSecondary }}>
            Manage your account information
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div
            className="mb-6 p-4 rounded-lg border"
            style={{
              backgroundColor: currentColors.incomeLight,
              borderColor: currentColors.income,
              color: currentColors.income,
            }}
          >
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            className="mb-6 p-4 rounded-lg border"
            style={{
              backgroundColor: currentColors.expenseLight,
              borderColor: currentColors.expense,
              color: currentColors.expense,
            }}
          >
            {error}
          </div>
        )}

        <Card style={{ backgroundColor: currentColors.cardBackground }}>
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div
                className="p-3 rounded-full"
                style={{ backgroundColor: currentColors.primaryLight }}
              >
                <User
                  className="h-8 w-8"
                  style={{ color: currentColors.primary }}
                />
              </div>
              <div>
                <h2
                  className="text-xl font-semibold"
                  style={{ color: currentColors.text }}
                >
                  Personal Information
                </h2>
                <p
                  className="text-sm"
                  style={{ color: currentColors.textSecondary }}
                >
                  Update your personal details
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: currentColors.textSecondary }}
                >
                  Full Name
                </label>

                {isEditing ? (
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: currentColors.background,
                        borderColor: currentColors.border,
                        color: currentColors.text,
                        focusRingColor: currentColors.primary,
                      }}
                      placeholder="Enter your full name"
                      disabled={updating}
                    />

                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveProfile}
                        disabled={updating}
                        className="p-2 rounded-lg transition-colors"
                        style={{
                          backgroundColor: currentColors.income,
                          color: "white",
                        }}
                        title="Save changes"
                      >
                        {updating ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                      </button>

                      <button
                        onClick={handleCancelEdit}
                        disabled={updating}
                        className="p-2 rounded-lg transition-colors"
                        style={{
                          backgroundColor: currentColors.expense,
                          color: "white",
                        }}
                        title="Cancel editing"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg border flex-1"
                      style={{
                        backgroundColor: currentColors.hover,
                        borderColor: currentColors.border,
                      }}
                    >
                      <User
                        className="h-4 w-4"
                        style={{ color: currentColors.textSecondary }}
                      />
                      <span
                        className="text-base"
                        style={{ color: currentColors.text }}
                      >
                        {profile?.name || "Not provided"}
                      </span>
                    </div>

                    <button
                      onClick={handleEditClick}
                      className="ml-3 p-2 rounded-lg transition-colors"
                      style={{
                        backgroundColor: currentColors.primary,
                        color: "white",
                      }}
                      title="Edit name"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Email Field (Read-only) */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: currentColors.textSecondary }}
                >
                  Email Address
                </label>

                <div
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg border"
                  style={{
                    backgroundColor: currentColors.hover,
                    borderColor: currentColors.border,
                    opacity: 0.8,
                  }}
                >
                  <Mail
                    className="h-4 w-4"
                    style={{ color: currentColors.textSecondary }}
                  />
                  <span
                    className="text-base"
                    style={{ color: currentColors.text }}
                  >
                    {profile?.email?.address ||
                      profile?.email ||
                      "Not provided"}
                  </span>
                  <span
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      backgroundColor: currentColors.textTertiary,
                      color: currentColors.background,
                    }}
                  >
                    Read-only
                  </span>
                </div>

                <p
                  className="text-xs mt-1"
                  style={{ color: currentColors.textTertiary }}
                >
                  Email address cannot be changed for security reasons
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
