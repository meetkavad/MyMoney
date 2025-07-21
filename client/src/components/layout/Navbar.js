"use client";

import { DollarSign, Menu, X } from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "white",
        borderBottomColor: "#E0E0E0",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ width: "100%" }}
      >
        <div
          className="flex justify-between items-center h-16"
          style={{ width: "100%" }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center flex-shrink-0 cursor-pointer"
          >
            <DollarSign className="h-8 w-8 mr-3" style={{ color: "#4DB6AC" }} />
            <span className="text-xl font-bold" style={{ color: "#212121" }}>
              My<span style={{ color: "#4DB6AC" }}>Money</span>
            </span>
          </Link>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary" size="sm">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md"
              style={{ color: "#757575" }}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div
              className="px-2 pt-2 pb-3 space-y-1 border-t"
              style={{ borderTopColor: "#E0E0E0" }}
            >
              <div className="flex flex-col space-y-2 pt-4">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
