// components/dashboard/AdminDashboard.tsx
"use client";

import { useState } from "react";

interface AdminDashboardProps {
  userName: string;
  userEmail: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  userName,
  userEmail,
}) => {
  const [activeSidebarItem, setActiveSidebarItem] = useState("dashboard");
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "user-mgt", label: "User Management", icon: "👥" },
    { id: "revenue", label: "Revenue & Billing", icon: "💰" },
    { id: "content", label: "Content Moderation", icon: "🛡️" },
    { id: "analytics", label: "System Analytics", icon: "📈" },
    { id: "institutional", label: "Institutional Mgmt", icon: "🏫" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-5 h-5"
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
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-violet-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">
                  L
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  Admin Dashboard
                </span>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Notification Icon */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-4.66-7.5 1 1 0 00-1.2-1.2 7.97 7.97 0 006.16 10.08 1 1 0 001.2-1.2 5.97 5.97 0 01-1.5-4.66zM15 17h5l-5 5v-5z"
                  />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {userName}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">{userName}</p>
                      <p className="text-sm text-gray-600">{userEmail}</p>
                      <div className="flex items-center mt-1">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          Administrator
                        </span>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`bg-white shadow-sm border-r border-gray-200 transition-all duration-300 ${
            isSidebarOpen ? "w-64" : "w-0 lg:w-20"
          }`}
        >
          <nav className="p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSidebarItem(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeSidebarItem === item.id
                        ? "bg-gradient-to-r from-blue-50 to-violet-50 text-blue-600 border border-blue-100"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {isSidebarOpen && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-gray-600 mb-8">
              Here&apos;s your system overview and quick statistics.
            </p>

            {/* Dashboard Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Stats Cards */}
              <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">2,847</p>
                    <p className="text-xs text-green-600 mt-1">
                      ↑ 12% this month
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">👥</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">$24.5K</p>
                    <p className="text-xs text-green-600 mt-1">
                      ↑ 8% this month
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">💰</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Institutions</p>
                    <p className="text-2xl font-bold text-gray-900">156</p>
                    <p className="text-xs text-green-600 mt-1">
                      ↑ 3% this month
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🏫</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Content Moderation</p>
                    <p className="text-2xl font-bold text-gray-900">23</p>
                    <p className="text-xs text-red-600 mt-1">
                      Attention needed
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🛡️</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-blue-600">👥</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    User Management
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage users and permissions
                  </p>
                </button>

                <button className="p-4 bg-white border border-gray-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all duration-200 text-left">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-green-600">💰</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Revenue Report
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    View financial analytics
                  </p>
                </button>

                <button className="p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all duration-200 text-left">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-purple-600">🛡️</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Moderation Queue
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Review flagged content
                  </p>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recent System Activity
              </h2>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600">+</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        New institution registered
                      </p>
                      <p className="text-sm text-gray-600">
                        Stanford University joined the platform
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 ml-auto">
                      2 hours ago
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600">💰</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Payment processed
                      </p>
                      <p className="text-sm text-gray-600">
                        Teacher Pro subscription - $99.99
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 ml-auto">
                      4 hours ago
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <span className="text-amber-600">⚠️</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Content flagged
                      </p>
                      <p className="text-sm text-gray-600">
                        Quiz &quot;Advanced Calculus&quot; requires review
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 ml-auto">
                      6 hours ago
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
