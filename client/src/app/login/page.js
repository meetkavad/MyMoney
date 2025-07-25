"use client";

import { Eye, EyeOff, DollarSign, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { authAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear previous errors

    try {
      const response = await authAPI.login(formData.email, formData.password);

      // Use auth context to handle login
      login(response.token, response.user);

      setSuccess("Login successful! Redirecting to dashboard...");
    } catch (error) {
      if (error.message.includes("User not found")) {
        setError(
          "No account found with this email address. Please check your email or sign up for a new account."
        );
      } else if (error.message.includes("Email not verified")) {
        setError(
          "Please verify your email address before logging in. Check your inbox for the verification email."
        );
      } else if (error.message.includes("Invalid credentials")) {
        setError("Invalid password. Please check your password and try again.");
      } else {
        setError(
          error.message || "Invalid email or password. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{
        backgroundColor: "#F5F5F5",
        padding: "20px",
      }}
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: "linear-gradient(135deg, #4DB6AC 0%, #26A69A 100%)",
          opacity: 0.05,
        }}
      />

      <div className="w-full max-w-lg relative z-10">
        {/* Back to home link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-6 text-sm font-medium hover:underline"
          style={{ color: "#757575", textDecoration: "none" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Card className="w-full" padding="lg">
          {/* Logo and heading */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <DollarSign
                className="h-10 w-10 mr-3"
                style={{ color: "#4DB6AC" }}
              />
              <span className="text-2xl font-bold" style={{ color: "#212121" }}>
                My<span style={{ color: "#4DB6AC" }}>Money</span>
              </span>
            </div>
            <h1
              className="text-2xl font-bold mb-2"
              style={{ color: "#212121" }}
            >
              Welcome Back
            </h1>
            <p style={{ color: "#757575" }}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message */}
            {error && (
              <div
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: "#FFEBEE",
                  border: "1px solid #FFCDD2",
                }}
              >
                <p className="text-sm" style={{ color: "#D32F2F" }}>
                  {error}
                </p>
              </div>
            )}

            {/* Success message */}
            {success && (
              <div
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: "#E8F5E8",
                  border: "1px solid #C8E6C9",
                }}
              >
                <p className="text-sm" style={{ color: "#2E7D32" }}>
                  {success}
                </p>
              </div>
            )}

            {/* Email input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
                style={{ color: "#212121" }}
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                style={{
                  borderColor: "#E0E0E0",
                  focusRingColor: "#4DB6AC",
                  backgroundColor: "white",
                  minHeight: "52px",
                  padding: "8px 12px",
                }}
                placeholder="Enter your email"
              />
            </div>

            {/* Password input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
                style={{ color: "#212121" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                  style={{
                    borderColor: "#E0E0E0",
                    focusRingColor: "#4DB6AC",
                    backgroundColor: "white",
                    minHeight: "52px",
                  }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  style={{ color: "#757575" }}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me and forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="rounded mr-2"
                  style={{ accentColor: "#4DB6AC" }}
                />
                <span className="text-sm" style={{ color: "#757575" }}>
                  Remember me
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium hover:underline"
                style={{ color: "#4DB6AC", textDecoration: "none" }}
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* Sign up link */}
          <div
            className="text-center mt-6 pt-6 border-t"
            style={{ borderTopColor: "#E0E0E0" }}
          >
            <p style={{ color: "#757575" }}>
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium hover:underline"
                style={{ color: "#4DB6AC", textDecoration: "none" }}
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
