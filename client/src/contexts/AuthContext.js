"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authHelpers } from "../lib/api";

const AuthContext = createContext({});

const PROTECTED_ROUTES = [
  "/dashboard",
  "/analytics",
  "/new-transaction",
  "/profile",
];

// Routes that authenticated users must not access (redirect to dashboard)
const AUTH_REDIRECT_ROUTES = ["/login", "/signup"];

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  // Check authentication status on mount only
  useEffect(() => {
    const token = authHelpers.getToken();
    if (token) {
      setIsAuthenticated(true);
      setUser({ token });
    }
    setIsLoading(false);
  }, []);

  // Handle route protection - but only when not loading
  useEffect(() => {
    if (isLoading) return;

    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route)
    );
    const isAuthRedirectRoute = AUTH_REDIRECT_ROUTES.includes(pathname);

    if (!isAuthenticated && isProtectedRoute) {
      router.replace("/login");
    } else if (isAuthenticated && isAuthRedirectRoute) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, pathname, router, isLoading]);

  // Handle auth errors
  useEffect(() => {
    const handleAuthError = () => {
      if (isAuthenticated) {
        authHelpers.clearAuth();
        setIsAuthenticated(false);
        setUser(null);
        router.replace("/login");
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("auth-error", handleAuthError);
      return () => window.removeEventListener("auth-error", handleAuthError);
    }
  }, [isAuthenticated, router]);

  const login = (token, userData = null) => {
    authHelpers.saveToken(token);
    setIsAuthenticated(true);
    setUser(userData || { token });
    // Don't navigate here - let the useEffect handle it
  };

  const logout = () => {
    authHelpers.clearAuth();
    setIsAuthenticated(false);
    setUser(null);
    router.replace("/login");
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.log("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
