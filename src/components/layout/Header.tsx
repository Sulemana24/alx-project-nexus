"use client";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { useState, useRef, useEffect } from "react";

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = () => {
    console.log("Login clicked");
    // For Next.js, you might want to use:
    // router.push('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40"
      ref={mobileMenuRef}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Site Name */}
          <div className="flex items-center space-x-3">
            <div className="shrink-0">
              <Link href="/" className="flex items-center">
                <div className="bg-[#3B82F6] text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl">
                  L
                </div>
              </Link>
            </div>
            <Link
              href="/"
              className="text-2xl font-bold text-gray-900 hover:text-[#3B82F6] transition-colors duration-200"
            >
              Learnify
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="/features"
              className="text-gray-700 hover:text-[#3B82F6] transition-colors duration-200 font-medium"
            >
              Features
            </a>
            <a
              href="/about"
              className="text-gray-700 hover:text-[#3B82F6] transition-colors duration-200 font-medium"
            >
              About
            </a>
            <a
              href="/contact"
              className="text-gray-700 hover:text-[#3B82F6] transition-colors duration-200 font-medium"
            >
              Contact
            </a>
          </nav>

          {/* Desktop Login Button and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => (window.location.href = "/auth")}
              className="hidden md:flex shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              Login
            </Button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - Conditionally rendered */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2 px-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-2">
            <a
              href="/features"
              className="text-gray-700 hover:text-[#3B82F6] py-2 px-3 rounded-md hover:bg-gray-50 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="/about"
              className="text-gray-700 hover:text-[#3B82F6] py-2 px-3 rounded-md hover:bg-gray-50 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </a>
            <a
              href="/contact"
              className="text-gray-700 hover:text-[#3B82F6] py-2 px-3 rounded-md hover:bg-gray-50 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </a>
            <div className="pt-2 border-t border-gray-200">
              <Button
                onClick={() => {
                  window.location.href = "/auth";
                  setIsMobileMenuOpen(false);
                }}
                className="w-full justify-center"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
