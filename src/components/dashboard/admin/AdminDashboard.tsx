"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

// Admin pages
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import Revenue from "./pages/Revenue";
import ContentModeration from "./pages/ContentModeration";
import SystemAnalytics from "./pages/SystemAnalytics";
import InstitutionalMgmt from "./pages/InstitutionalMgmt";
import Settings from "./pages/Settings";
import AdminPastQuestions from "./pages/AdminPastQuestions"; // <-- Admin uploader
import Sidebar from "./pages/Sidebar";
import Header from "./pages/Header";
import { adminSidebarItems } from "./pages/adminSidebarItems";

interface AdminDashboardProps {
  userName: string;
  userEmail: string;
  userRole?: string;
}

const AdminDashboard = ({
  userName,
  userEmail,
  userRole = "Administrator",
}: AdminDashboardProps) => {
  const { logout } = useAuth();
  const [activeSidebarItem, setActiveSidebarItem] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/auth/admin";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const renderActivePage = () => {
    const commonProps = { userName, userEmail, userRole };

    switch (activeSidebarItem) {
      case "dashboard":
        return <Dashboard />;
      case "user-management":
        return <UserManagement />;
      case "revenue":
        return <Revenue />;
      case "content-moderation":
        return <ContentModeration />;
      case "system-analytics":
        return <SystemAnalytics />;
      case "institutional-mgmt":
        return <InstitutionalMgmt />;
      case "past-questions":
        return <AdminPastQuestions />; // <-- Admin uploader page
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        userName={userName}
        userEmail={userEmail}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onLogout={handleLogout}
      />

      <div className="flex pt-16">
        <Sidebar
          sidebarItems={adminSidebarItems}
          activeSidebarItem={activeSidebarItem}
          setActiveSidebarItem={setActiveSidebarItem}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen && !isMobile ? "lg:ml-64" : "ml-0"
          }`}
        >
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
              {renderActivePage()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
