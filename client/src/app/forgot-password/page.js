"use client";

import {
  DollarSign,
  ArrowLeft,
  Mail,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { authAPI } from "@/lib/api";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: email, 2: code verification, 3: password reset
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await authAPI.forgotPassword(email);
      setStep(2);
      setSuccess("Verification code sent to your email!");
    } catch (error) {
      if (error.message.includes("User not found")) {
        setError(
          "No account found with this email address. Please check your email or sign up for a new account."
        );
      } else {
        setError(
          error.message || "Failed to send verification code. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await authAPI.verifyEmail(verificationCode);
      setStep(3);
      setSuccess("Code verified successfully!");
    } catch (error) {
      setError(error.message || "Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long!");
      return;
    }

    setIsLoading(true);

    try {
      await authAPI.resetPassword(newPassword);
      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      setError(error.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    setError("");
    try {
      await authAPI.forgotPassword(email);
      setSuccess("Verification code sent to your email!");
      setTimeout(() => setSuccess(""), 3000); // Clear success message after 3 seconds
    } catch (error) {
      setError(error.message || "Failed to resend code. Please try again.");
    }
  };

  const passwordsMatch = newPassword === confirmPassword;
  const isPasswordValid = newPassword.length >= 8;

  // Step 2: Code Verification
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

        <div className="w-full max-w-lg relative z-10">
          <button
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-2 mb-6 text-sm font-medium hover:underline"
            style={{ color: "#757575", background: "none", border: "none" }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Email
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
              Enter Verification Code
            </h1>

            <p className="mb-6" style={{ color: "#757575" }}>
              We&apos;ve sent a 6-digit verification code to{" "}
              <span style={{ color: "#212121", fontWeight: "500" }}>
                {email}
              </span>
            </p>

            <form onSubmit={handleCodeVerification} className="space-y-6">
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
                className="w-full"
                disabled={verificationCode.length !== 6 || isLoading}
              >
                {isLoading ? "Verifying..." : "Verify Code"}
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
          </Card>
        </div>
      </div>
    );
  }

  // Step 3: Password Reset
  if (step === 3) {
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

        <div className="w-full max-w-lg relative z-10">
          <Card className="w-full" padding="lg">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <DollarSign
                  className="h-10 w-10 mr-3"
                  style={{ color: "#4DB6AC" }}
                />
                <span
                  className="text-2xl font-bold"
                  style={{ color: "#212121" }}
                >
                  My<span style={{ color: "#4DB6AC" }}>Money</span>
                </span>
              </div>
              <h1
                className="text-2xl font-bold mb-2"
                style={{ color: "#212121" }}
              >
                Reset Your Password
              </h1>
              <p style={{ color: "#757575" }}>Enter your new password below</p>
            </div>

            <form onSubmit={handlePasswordReset} className="space-y-6">
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

              {/* New Password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#212121" }}
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    style={{ color: "#757575" }}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {newPassword && (
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

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#212121" }}
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                    style={{
                      borderColor: "#E0E0E0",
                      focusRingColor: "#4DB6AC",
                      backgroundColor: "white",
                      minHeight: "52px",
                    }}
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    style={{ color: "#757575" }}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {confirmPassword && (
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

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={!passwordsMatch || !isPasswordValid || isLoading}
              >
                {isLoading ? "Resetting Password..." : "Reset Password"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  // Step 1: Email Input
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

      <div className="w-full max-w-lg relative z-10">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 mb-6 text-sm font-medium hover:underline"
          style={{ color: "#757575", textDecoration: "none" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>

        <Card className="w-full" padding="lg">
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
              Reset Your Password
            </h1>
            <p style={{ color: "#757575" }}>
              Enter your email address and we&apos;ll send you a link to reset
              your password
            </p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-6">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                style={{
                  borderColor: "#E0E0E0",
                  focusRingColor: "#4DB6AC",
                  backgroundColor: "white",
                  minHeight: "52px",
                }}
                placeholder="Enter your email address"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Sending Code..." : "Send Verification Code"}
            </Button>
          </form>

          <div
            className="text-center mt-6 pt-6 border-t"
            style={{ borderTopColor: "#E0E0E0" }}
          >
            <p style={{ color: "#757575" }}>
              Remember your password?{" "}
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
