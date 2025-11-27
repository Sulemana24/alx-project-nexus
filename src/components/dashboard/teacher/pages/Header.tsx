"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Header = ({ isSidebarOpen, setIsSidebarOpen }: HeaderProps) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [userPlan, setUserPlan] = useState<"free" | "teacher pro">("free");

  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch user data from Firebase
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        const docRef = doc(db, "users", user.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserName(`${data.firstName} ${data.lastName}`);
          setUserEmail(data.email);
          setUserPlan(data.plan ?? "free");
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };

    fetchUserData();
  }, [user?.id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
      <div className="px-4 sm:px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-6 h-6 text-black"
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
          </button>

          <div className="bg-blue-500 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">
            L
          </div>
          <span className="hidden sm:block text-lg font-semibold text-gray-900">
            Teacher Dashboard
          </span>
        </div>

        {/* Right: Upgrade & User */}
        <div
          className="flex items-center space-x-3 sm:space-x-4"
          ref={dropdownRef}
        >
          {userPlan === "free" && (
            <button className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Upgrade Plan
            </button>
          )}

          <div className="relative">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center space-x-2 sm:space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {userName.charAt(0).toUpperCase()}
              </div>
            </button>

            {isUserDropdownOpen && (
              <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-gray-900">{userName}</p>
                  <p className="text-sm text-gray-600">{userEmail}</p>
                </div>
                <div className="px-4 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Plan</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        userPlan === "teacher pro"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {userPlan === "teacher pro" ? "Teacher Pro" : "Free"}
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button
                    onClick={async () => {
                      try {
                        await logout();
                        localStorage.clear();
                        window.location.href = "/auth";
                      } catch (err) {
                        console.error("Logout failed:", err);
                      }
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
