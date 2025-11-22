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
    <header className="bg-white shadow-sm border-b border-gray-200 fixed w-full z-90">
      <div className="flex items-center justify-between px-6 py-4">
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <span className="text-lg font-bold text-black">☰</span>
        </button>

        <div className="flex items-center space-x-4">
          <div className="text-lg font-semibold text-black">{userName}</div>
          <div className="text-sm text-gray-600">{userEmail}</div>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
