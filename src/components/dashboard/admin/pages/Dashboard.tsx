"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Download,
  Eye,
  BarChart3,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "student" | "teacher" | "admin";
  plan: "free" | "student_pro" | "teacher_pro";
  institution: string;
  createdAt: Timestamp | string;
}

interface PastQuestion {
  id: string;
  title: string;
  createdAt: Timestamp | string;
}

interface Activity {
  id: string;
  action: string;
  user?: string;
  institution?: string;
  amount?: string;
  status: "pending" | "new" | "success" | "error";
  time: string;
}

const Dashboard: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [userGrowth, setUserGrowth] = useState("+0 this week");

  const [pastQuestionsCount, setPastQuestionsCount] = useState(0);
  const [pastQuestionsGrowth, setPastQuestionsGrowth] = useState(0);

  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  const toDate = (value: Timestamp | string) =>
    value instanceof Timestamp ? value.toDate() : new Date(value);

  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const allUsers: User[] = snapshot.docs
      .map((doc) => ({ id: doc.id, ...(doc.data() as Omit<User, "id">) }))
      .filter((user) => user.role !== "admin");

    setTotalUsers(allUsers.length);

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const usersThisWeek = allUsers.filter(
      (u) => toDate(u.createdAt) > oneWeekAgo
    );
    setUserGrowth(`+${usersThisWeek.length} this week`);
  };

  const fetchPastQuestions = async () => {
    const snapshot = await getDocs(collection(db, "pastQuestions"));
    const allQuestions: PastQuestion[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<PastQuestion, "id">),
    }));

    setPastQuestionsCount(allQuestions.length);

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const questionsThisWeek = allQuestions.filter(
      (q) => q.createdAt && toDate(q.createdAt) > oneWeekAgo
    );

    setPastQuestionsGrowth(questionsThisWeek.length);
  };

  const fetchRecentActivity = async () => {
    const q = query(
      collection(db, "activity"),
      orderBy("time", "desc"),
      limit(5)
    );
    const snapshot = await getDocs(q);

    const activities: Activity[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Activity, "id">),
    }));

    setRecentActivity(activities);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchUsers();
        await fetchPastQuestions();
        await fetchRecentActivity();
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    };

    loadData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "new":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BarChart3 className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Dashboard Overview
                </h1>
                <p className="text-gray-600 text-lg mt-1">
                  Monitor your platform performance and activity
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 px-6 py-3 rounded-xl cursor-pointer">
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </Button>
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 flex items-center gap-2 px-6 py-3 rounded-xl cursor-pointer"
            >
              <Eye className="h-4 w-4" />
              <span>View Analytics</span>
            </Button>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-600">
                    Total Users
                  </span>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalUsers.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <p className="text-sm font-medium text-green-600">
                      {userGrowth}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Past Questions Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-600">
                    Past Questions
                  </span>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    {pastQuestionsCount.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <p className="text-sm font-medium text-green-600">
                      +{pastQuestionsGrowth} this week
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Stat Cards - Placeholder for future metrics */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-600">
                    Active Sessions
                  </span>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">1,234</p>
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <p className="text-sm font-medium text-green-600">
                      +12% today
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Download className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-600">
                    Downloads
                  </span>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">8,567</p>
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <p className="text-sm font-medium text-green-600">
                      +24% this month
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Recent Activity - Takes 2/3 on large screens */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Recent Activity
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Latest actions and events on your platform
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-xl"
                >
                  View All
                </Button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group border border-transparent hover:border-gray-200"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(activity.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="text-base font-semibold text-gray-900">
                            {activity.action}
                          </p>
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              activity.status
                            )}`}
                          >
                            {activity.status.charAt(0).toUpperCase() +
                              activity.status.slice(1)}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {activity.user && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">User:</span>{" "}
                              {activity.user}
                            </p>
                          )}
                          {activity.institution && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Institution:</span>{" "}
                              {activity.institution}
                            </p>
                          )}
                          {activity.amount && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Amount:</span>{" "}
                              {activity.amount}
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2 font-medium">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Activity className="h-8 w-8 text-gray-300" />
                    </div>
                    <p className="text-gray-500 text-lg font-semibold mb-2">
                      No recent activity
                    </p>
                    <p className="text-gray-400 text-sm">
                      Activity will appear here as users interact with your
                      platform
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-6">
            {/* Platform Health */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    Platform Status
                  </h4>
                  <p className="text-sm text-gray-600">
                    All systems operational
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-sm font-medium text-green-800">
                    API Services
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-sm font-medium text-green-800">
                    Database
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-sm font-medium text-green-800">
                    File Storage
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h4 className="text-lg font-bold text-gray-900 mb-4">
                Quick Actions
              </h4>
              <div className="space-y-3">
                <Button className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors rounded-xl py-3">
                  <Users className="h-4 w-4 mr-3" />
                  Manage Users
                </Button>
                <Button className="w-full justify-start bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 transition-colors rounded-xl py-3">
                  <FileText className="h-4 w-4 mr-3" />
                  View Questions
                </Button>
                <Button className="w-full justify-start bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors rounded-xl py-3">
                  <BarChart3 className="h-4 w-4 mr-3" />
                  Analytics Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
