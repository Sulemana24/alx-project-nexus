"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  FileText,
  TrendingUp,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "student" | "teacher" | "admin";
  plan: "free" | "student_pro" | "teacher_pro";
  institution: string;
  createdAt: string;
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
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  const [previousUsers, setPreviousUsers] = useState(0);
  const [userGrowth, setUserGrowth] = useState("+0%");

  // Fetch total users (excluding admins)
  const fetchUsers = async () => {
    const usersCollection = collection(db, "users");
    const snapshot = await getDocs(usersCollection);

    const usersData: User[] = snapshot.docs
      .map((doc) => {
        const { id: _discardedId, ...data } = doc.data() as User; // discard Firestore 'id'
        return {
          id: doc.id, // always use Firestore doc ID
          ...data,
        };
      })
      .filter((user) => user.role !== "admin");

    const currentCount = usersData.length;
    setTotalUsers(currentCount);

    const prevCount = previousUsers || currentCount - 10;
    setUserGrowth(
      `${(((currentCount - prevCount) / prevCount) * 100).toFixed(1)}%`
    );
  };

  // Fetch recent activity (latest 5 entries)
  const fetchRecentActivity = async () => {
    const activityCollection = collection(db, "activity");
    const q = query(activityCollection, orderBy("time", "desc"), limit(5));
    const snapshot = await getDocs(q);

    const activities: Activity[] = snapshot.docs.map((doc) => {
      // Destructure and discard any 'id' from Firestore data
      const { id: _discardedId, ...data } = doc.data() as Activity;
      return {
        id: doc.id, // use Firestore document ID
        ...data,
      };
    });

    setRecentActivity(activities);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchUsers();
        await fetchRecentActivity();
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    };

    loadData();
  }, []);

  const dashboardData = {
    totalUsers: totalUsers.toLocaleString(),
    userGrowth,
    totalQuestions: "45,120",
    questionGrowth: "150",
    revenue: "$48,250",
    revenueGrowth: "+5.1%",
    pendingActions: 17,
    activeSessions: "892",
    systemUptime: "99.98%",
    responseTime: "1.2s",
  };

  const contentStats = [
    { label: "Flagged Content", value: "12", color: "text-blue-600" },
    { label: "Pending Reviews", value: "5", color: "text-amber-600" },
    { label: "New Institutions", value: "3", color: "text-green-600" },
    { label: "Active Licenses", value: "152", color: "text-purple-600" },
  ];

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Platform Overview
          </h2>
          <p className="text-gray-600 mt-2">
            Welcome back! Here&apos;s what&apos;s happening with your platform
            today.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Users Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {dashboardData.totalUsers}
              </p>
              <p className="text-sm text-green-600 mt-1">
                {dashboardData.userGrowth} this month
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Questions Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Past Questions
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {dashboardData.totalQuestions}
              </p>
              <p className="text-sm text-green-600 mt-1">
                +{dashboardData.questionGrowth} this week
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Monthly Revenue
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {dashboardData.revenue}
              </p>
              <p className="text-sm text-green-600 mt-1">
                {dashboardData.revenueGrowth} vs last month
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* System Health Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending Actions
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {dashboardData.pendingActions}
              </p>
              <p className="text-sm text-amber-600 mt-1">Attention required</p>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Performance */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Platform Performance
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Sessions</span>
              <span className="font-semibold text-gray-900">{totalUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">System Uptime</span>
              <span className="font-semibold text-green-600">
                {dashboardData.systemUptime}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg. Response Time</span>
              <span className="font-semibold text-gray-900">
                {dashboardData.responseTime}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Partner Institutions
              </span>
              <span className="font-semibold text-gray-900">48</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {getStatusIcon(activity.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.user && `User: ${activity.user}`}
                    {activity.institution &&
                      `Institution: ${activity.institution}`}
                    {activity.amount && `Amount: ${activity.amount}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Statistics */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Content Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {contentStats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          System Health & Alerts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-800">
                API Status
              </span>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <span className="text-sm font-medium text-amber-800">
                Moderation Queue
              </span>
              <span className="text-amber-600 font-semibold">17 items</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-800">
                Outstanding Payments
              </span>
              <span className="text-blue-600 font-semibold">$7,500</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-800">
                Database Health
              </span>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
