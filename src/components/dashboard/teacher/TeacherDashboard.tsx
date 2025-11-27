"use client";

import React, { useState } from "react";
import Sidebar from "./pages/Sidebar";
import Header from "./pages/Header";

import DashboardPage from "./pages/Dashboard";
import { MyQuizzesPage } from "./pages/MyQuizzes";
import { QuizMarketplace } from "./pages/QuizMarketplace";
import ELearningPage from "./pages/ELearning";
import AnalyticsPage from "./pages/Analytics";
import SettingsPage from "./pages/Settings";

interface TeacherDashboardProps {
  userName: string;
  userEmail: string;
  userPlan: string;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  userName,
  userEmail,
  userPlan,
}) => {
  const [activeSidebarItem, setActiveSidebarItem] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderActivePage = () => {
    switch (activeSidebarItem) {
      case "dashboard":
        return <DashboardPage userName={userName} />;
      case "my-quizzes":
        return <MyQuizzesPage />;
      case "marketplace":
        return <QuizMarketplace />;
      case "e-learning":
        return <ELearningPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage userName={userName} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex pt-16">
        <Sidebar
          activeSidebarItem={activeSidebarItem}
          setActiveSidebarItem={setActiveSidebarItem}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
          }`}
        >
          <div className="p-6 sm:p-8">{renderActivePage()}</div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;
