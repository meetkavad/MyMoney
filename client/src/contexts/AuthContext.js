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

  // Check authentication status on mount and route changes
  useEffect(() => {
    const checkAuth = () => {
      const token = authHelpers.getToken();

      if (token) {
        setIsAuthenticated(true);
        setUser({ token });
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const handleAuthError = (event) => {
      // Force logout only if we're currently authenticated
      if (isAuthenticated) {
        setIsAuthenticated(false);
        setUser(null);
        router.push("/login");
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("auth-error", handleAuthError);

      return () => {
        window.removeEventListener("auth-error", handleAuthError);
      };
    }
  }, [isAuthenticated, router]);

  // Handle route protection
  useEffect(() => {
    if (isLoading) return; // Don't redirect while loading

    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    const isAuthRedirectRoute = AUTH_REDIRECT_ROUTES.some(
      (route) => pathname === route
    );

    // Redirect unauthenticated users from protected routes to login
    if (!isAuthenticated && isProtectedRoute) {
      router.push("/login");
      return;
    }

    // Redirect authenticated users from auth pages to dashboard
    if (isAuthenticated && isAuthRedirectRoute) {
      router.push("/dashboard");
      return;
    }
  }, [isAuthenticated, pathname, router, isLoading]);

  const login = (token, userData = null) => {
    authHelpers.saveToken(token);
    setIsAuthenticated(true);
    setUser(userData || { token });
    router.push("/dashboard");
  };

  const logout = () => {
    authHelpers.clearAuth();
    setIsAuthenticated(false);
    setUser(null);
    router.push("/login");
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
