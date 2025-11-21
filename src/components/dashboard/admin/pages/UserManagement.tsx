"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import {
  MoreVertical,
  Edit,
  Mail,
  Users,
  GraduationCap,
  Crown,
  Loader,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "student" | "teacher" | "admin";
  plan: "free" | "student_pro" | "teacher_pro";
  institution: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const usersCollection = collection(db, "users");

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(usersCollection);
        const usersData: User[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];
        // Exclude admin users
        setUsers(usersData.filter((user) => user.role !== "admin"));
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (
    userId: string,
    newRole: "student" | "teacher"
  ) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { role: newRole });
  };

  const handlePlanToggle = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const newPlan =
      user.plan === "free"
        ? user.role === "teacher"
          ? "teacher_pro"
          : "student_pro"
        : "free";

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, plan: newPlan } : u))
    );

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { plan: newPlan });
  };

  const getPlanColor = (plan: string) => {
    const colorMap = {
      free: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300",
      student_pro:
        "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200",
      teacher_pro:
        "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200",
    };
    return (
      colorMap[plan as keyof typeof colorMap] || "bg-gray-100 text-gray-700"
    );
  };

  const getPlanDisplay = (plan: string) => {
    const planMap = {
      free: "Free",
      student_pro: "Student Pro",
      teacher_pro: "Teacher Pro",
    };
    return planMap[plan as keyof typeof planMap] || plan;
  };

  const ToggleSwitch = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked
          ? "bg-green-500 shadow-lg shadow-green-200"
          : "bg-gray-300 shadow-inner"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-all duration-300 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  // Filter out admin users for stats
  const statsUsers = users.filter((u) => u.role !== "admin");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-gray-600 text-lg">
            Manage users and their subscription plans
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <Mail className="h-4 w-4 mr-2" />
          Export Users
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {statsUsers.length}
              </div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {statsUsers.filter((u) => u.role === "teacher").length}
              </div>
              <div className="text-sm text-gray-600">Teachers</div>
            </div>
            <div className="bg-green-50 p-3 rounded-xl">
              <GraduationCap className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {statsUsers.filter((u) => u.role === "student").length}
              </div>
              <div className="text-sm text-gray-600">Students</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {statsUsers.filter((u) => u.plan !== "free").length}
              </div>
              <div className="text-sm text-gray-600">Pro Users</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-xl">
              <Crown className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="p-4 sm:p-6 text-left text-sm font-semibold text-gray-900">
                  User
                </th>
                <th className="p-4 sm:p-6 text-left text-sm font-semibold text-gray-900 hidden sm:table-cell">
                  Email
                </th>
                <th className="p-4 sm:p-6 text-left text-sm font-semibold text-gray-900">
                  Role
                </th>
                <th className="p-4 sm:p-6 text-left text-sm font-semibold text-gray-900">
                  Plan
                </th>
                <th className="p-4 sm:p-6 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {statsUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <td className="p-4 sm:p-6">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 truncate">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500 truncate sm:hidden">
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {user.institution}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 sm:p-6 text-gray-900 hidden sm:table-cell">
                    <div className="truncate max-w-[200px]">{user.email}</div>
                  </td>
                  <td className="p-4 sm:p-6">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                          user.role === "teacher"
                            ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200"
                            : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200"
                        }`}
                      >
                        {user.role === "teacher" ? "Teacher" : "Student"}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 sm:p-6">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getPlanColor(
                          user.plan
                        )}`}
                      >
                        {getPlanDisplay(user.plan)}
                      </span>
                      <ToggleSwitch
                        checked={user.plan !== "free"}
                        onChange={() => handlePlanToggle(user.id)}
                      />
                    </div>
                  </td>
                  <td className="p-4 sm:p-6">
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="primary"
                        size="sm"
                        className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {statsUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No users found</p>
            <p className="text-gray-400 text-sm mt-1">
              Users will appear here once they register
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
