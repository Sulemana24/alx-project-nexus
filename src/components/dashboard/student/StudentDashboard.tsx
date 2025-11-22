"use client";

import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import MyQuizzes from "./pages/MyQuizzes";
import Passco from "./pages/Passco";
import Practice from "./pages/Practice";
import ELearning from "./pages/ELearning";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

import Sidebar from "../student/pages/Sidebar";
import Header from "../student/pages/Header";
import { useAuth } from "@/lib/auth-context";

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
  const { user, isLoading } = useAuth();
  const [activeSidebarItem, setActiveSidebarItem] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading) {
    return <p className="text-center p-8">Loading...</p>;
  }

  if (!user) {
    return <p className="text-center p-8">You are not logged in.</p>;
  }

  const renderActivePage = () => {
    switch (activeSidebarItem) {
      case "dashboard":
        return (
          <Dashboard
            userId={user.id}
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
            userId={user.id}
            userName={userName}
            setActiveSidebarItem={setActiveSidebarItem}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        userName={userName}
        userEmail={userEmail}
        userPlan={userPlan}
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
          <div className="sm:p-6 lg:p-8">
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
