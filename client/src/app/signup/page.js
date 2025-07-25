"use client";

import {
  Eye,
  EyeOff,
  DollarSign,
  ArrowLeft,
  CheckCircle,
  Mail,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { authAPI } from "@/lib/api";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: form, 2: email verification
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    setIsVerifying(true);

    try {
      // Call signup API
      await authAPI.signup({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
      });

      setStep(2);
    } catch (error) {
      // Display proper error message based on backend response
      if (error.message.includes("User already exists")) {
        setError(
          "An account with this email already exists. Please use a different email or try logging in."
        );
      } else {
        setError(
          error.message || "Failed to create account. Please try again."
        );
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setVerificationError(""); // Clear previous errors

    try {
      // Verify email with backend
      await authAPI.verifyEmail(verificationCode);

      setVerificationSuccess(
        "Account verified successfully! Redirecting to login..."
      );
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      setVerificationError(
        error.message || "Invalid verification code. Please try again."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const resendCode = async () => {
    setVerificationError(""); // Clear previous errors
    try {
      await authAPI.forgotPassword(formData.email);
      setVerificationSuccess("Verification code sent to your email!");
      setTimeout(() => setVerificationSuccess(""), 3000); // Clear success message after 3 seconds
    } catch (error) {
      setVerificationError(
        error.message || "Failed to resend code. Please try again."
      );
    }
  };

  const passwordsMatch = formData.password === formData.confirmPassword;
  const isPasswordValid = formData.password.length >= 8;

  // Email verification Modal
  if (step === 2) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center"
        style={{
          backgroundColor: "#F5F5F5",
          padding: "20px",
        }}
      >
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: "linear-gradient(135deg, #4DB6AC 0%, #26A69A 100%)",
            opacity: 0.05,
          }}
        />

        <div className="w-full max-w-md relative z-10">
          <button
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-2 mb-6 text-sm font-medium hover:underline"
            style={{ color: "#757575", background: "none", border: "none" }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Form
          </button>

          <Card className="w-full text-center" padding="lg">
            <div
              className="w-16 h-16 rounded-full mb-6 flex items-center justify-center mx-auto"
              style={{
                backgroundColor: "#E0F2F1",
              }}
            >
              <Mail className="h-8 w-8" style={{ color: "#4DB6AC" }} />
            </div>

            <h1
              className="text-2xl font-bold mb-2"
              style={{ color: "#212121" }}
            >
              Verify Your Email
            </h1>

            <p className="mb-6" style={{ color: "#757575" }}>
              We&apos;ve sent a 6-digit verification code to{" "}
              <span style={{ color: "#212121", fontWeight: "500" }}>
                {formData.email}
              </span>
            </p>

            <form onSubmit={handleVerificationSubmit} className="space-y-6">
              {/* Error message */}
              {verificationError && (
                <div
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: "#FFEBEE",
                    border: "1px solid #FFCDD2",
                  }}
                >
                  <p className="text-sm" style={{ color: "#D32F2F" }}>
                    {verificationError}
                  </p>
                </div>
              )}

              {/* Success message */}
              {verificationSuccess && (
                <div
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: "#E8F5E8",
                    border: "1px solid #C8E6C9",
                  }}
                >
                  <p className="text-sm" style={{ color: "#2E7D32" }}>
                    {verificationSuccess}
                  </p>
                </div>
              )}

              <div>
                <label
                  htmlFor="verificationCode"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#212121" }}
                >
                  Verification Code
                </label>
                <input
                  type="text"
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-center text-lg font-mono tracking-widest"
                  style={{
                    borderColor: "#E0E0E0",
                    focusRingColor: "#4DB6AC",
                    backgroundColor: "white",
                    minHeight: "56px",
                  }}
                  placeholder="000000"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full flex items-center justify-center gap-2"
                disabled={verificationCode.length !== 6 || isVerifying}
              >
                {isVerifying ? (
                  "Verifying..."
                ) : (
                  <>
                    Verify & Create Account
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            <div
              className="mt-6 pt-6 border-t"
              style={{ borderTopColor: "#E0E0E0" }}
            >
              <p className="text-sm mb-3" style={{ color: "#757575" }}>
                Didn&apos;t receive the code?
              </p>
              <button
                onClick={resendCode}
                className="text-sm font-medium hover:underline"
                style={{ color: "#4DB6AC", background: "none", border: "none" }}
              >
                Resend verification code
              </button>
            </div>

            <div className="mt-4">
              <p className="text-xs" style={{ color: "#9E9E9E" }}>
                For demo purposes, use code: <strong>123456</strong>
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

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
        </Link>{" "}
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
              Create Your Account
            </h1>
            <p style={{ color: "#757575" }}>
              Start your journey to better financial health
            </p>
          </div>

          {/* Signup form */}
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

            {/* Name inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#212121" }}
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                  style={{
                    borderColor: "#E0E0E0",
                    focusRingColor: "#4DB6AC",
                    backgroundColor: "white",
                    minHeight: "52px",
                  }}
                  placeholder="John"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#212121" }}
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                  style={{
                    borderColor: "#E0E0E0",
                    focusRingColor: "#4DB6AC",
                    backgroundColor: "white",
                    minHeight: "52px",
                  }}
                  placeholder="Doe"
                />
              </div>
            </div>

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
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                style={{
                  borderColor: "#E0E0E0",
                  focusRingColor: "#4DB6AC",
                  backgroundColor: "white",
                  minHeight: "52px",
                }}
                placeholder="john@example.com"
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
                  minLength={8}
                  className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                  style={{
                    borderColor: "#E0E0E0",
                    focusRingColor: "#4DB6AC",
                    backgroundColor: "white",
                    minHeight: "52px",
                  }}
                  placeholder="Minimum 8 characters"
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
              {formData.password && (
                <div className="mt-2 flex items-center gap-1">
                  <CheckCircle
                    className="h-4 w-4"
                    style={{ color: isPasswordValid ? "#4CAF50" : "#9E9E9E" }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: isPasswordValid ? "#4CAF50" : "#9E9E9E" }}
                  >
                    At least 8 characters
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2"
                style={{ color: "#212121" }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                  style={{
                    borderColor: "#E0E0E0",
                    focusRingColor: "#4DB6AC",
                    backgroundColor: "white",
                    minHeight: "52px",
                  }}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  style={{ color: "#757575" }}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && (
                <div className="mt-2 flex items-center gap-1">
                  <CheckCircle
                    className="h-4 w-4"
                    style={{ color: passwordsMatch ? "#4CAF50" : "#F44336" }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: passwordsMatch ? "#4CAF50" : "#F44336" }}
                  >
                    {passwordsMatch
                      ? "Passwords match"
                      : "Passwords don't match"}
                  </span>
                </div>
              )}
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={!passwordsMatch || !isPasswordValid || isVerifying}
            >
              {isVerifying ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Sign in link */}
          <div
            className="text-center mt-6 pt-6 border-t"
            style={{ borderTopColor: "#E0E0E0" }}
          >
            <p style={{ color: "#757575" }}>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium hover:underline"
                style={{ color: "#4DB6AC", textDecoration: "none" }}
              >
                Sign in here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
