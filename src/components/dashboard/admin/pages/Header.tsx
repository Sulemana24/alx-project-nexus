"use client";

import { FC } from "react";

interface HeaderProps {
  userName: string;
  userEmail: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  onLogout: () => void;
}

const Header: FC<HeaderProps> = ({
  userName,
  userEmail,
  isSidebarOpen,
  setIsSidebarOpen,
  onLogout,
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed w-full z-50 backdrop-blur-sm bg-white/95">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left Section - Menu Button & Brand */}
        <div className="flex items-center space-x-4">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 active:scale-95"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <span
                className={`block h-0.5 w-6 bg-gray-600 transition-all duration-200 ${
                  isSidebarOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-gray-600 transition-all duration-200 ${
                  isSidebarOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-gray-600 transition-all duration-200 ${
                  isSidebarOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              />
            </div>
          </button>

          {/* Brand/Logo - Hidden on mobile, visible on desktop */}
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
        </div>

        {/* Center Section - User Info */}
        <div className="flex-1 flex justify-center sm:justify-end lg:justify-center">
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* User Avatar */}
            <div className="hidden xs:flex w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full items-center justify-center shadow-md">
              <span className="text-white font-semibold text-sm sm:text-base">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* User Info */}
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <div className="text-sm sm:text-base font-semibold text-gray-800 truncate max-w-[120px] xs:max-w-[150px] sm:max-w-none">
                  {userName}
                </div>
                {/* Online Indicator */}
                <div className="hidden sm:flex w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[120px] xs:max-w-[150px] sm:max-w-[200px]">
                {userEmail}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 group"
          >
            {/* Logout Icon - Hidden on mobile */}
            <svg
              className="w-4 h-4 hidden xs:block"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
