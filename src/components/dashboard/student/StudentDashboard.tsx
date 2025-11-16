"use client";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import MyQuizzes from "./pages/MyQuizzes";
import Passco from "./pages/Passco";
import Practice from "./pages/Practice";
import ELearning from "./pages/ELearning";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

// Import layout components
import Sidebar from "../student/pages/Sidebar";
import Header from "../student/pages/Header";

interface StudentDashboardProps {
  userName: string;
  userEmail: string;
  userPlan: string;
}

const StudentDashboard = ({
  userName,
  userEmail,
  userPlan,
}: StudentDashboardProps) => {
  const [activeSidebarItem, setActiveSidebarItem] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Render the active page component
  const renderActivePage = () => {
    switch (activeSidebarItem) {
      case "dashboard":
        return (
          <Dashboard
            userName={userName}
            setActiveSidebarItem={setActiveSidebarItem}
          />
        );
      case "my-quizzes":
        return <MyQuizzes />;
      case "passco":
        return <Passco />;
      case "practice":
        return <Practice />;
      case "e-learning":
        return <ELearning />;
      case "analytics":
        return <Analytics />;
      case "settings":
        return <Settings />;
      default:
        return (
          <Dashboard
            userName={userName}
            setActiveSidebarItem={setActiveSidebarItem}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        userName={userName}
        userEmail={userEmail}
        userPlan={userPlan}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex pt-16">
        {/* Sidebar */}
        <Sidebar
          activeSidebarItem={activeSidebarItem}
          setActiveSidebarItem={setActiveSidebarItem}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
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

export default StudentDashboard;
