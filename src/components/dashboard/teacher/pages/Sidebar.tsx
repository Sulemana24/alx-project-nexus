"use client";

import React from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Store,
  GraduationCap,
  BarChart3,
  Settings,
} from "lucide-react";

interface SidebarProps {
  activeSidebarItem: string;
  setActiveSidebarItem: (item: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Sidebar = ({
  activeSidebarItem,
  setActiveSidebarItem,
  isSidebarOpen,
  setIsSidebarOpen,
}: SidebarProps) => {
  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      id: "my-quizzes",
      label: "My Quizzes",
      icon: <ClipboardList size={20} />,
    },
    {
      id: "marketplace",
      label: "Quiz Marketplace",
      icon: <Store size={20} />,
    },
    {
      id: "e-learning",
      label: "E-Learning",
      icon: <GraduationCap size={20} />,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <BarChart3 size={20} />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <>
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-opacity-50 lg:hidden z-20 transition-opacity"
        ></div>
      )}

      <aside
        className={`bg-white shadow-sm border-r border-gray-200 fixed top-0 left-0 h-full z-30 transform transition-transform duration-300 mt-2 md:mt-8
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative lg:w-64`}
      >
        <nav className="p-4 pt-24 lg:pt-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveSidebarItem(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeSidebarItem === item.id
                      ? "bg-gradient-to-r from-blue-50 to-violet-50 text-blue-600 border border-blue-100"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium hidden lg:inline">
                    {item.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
