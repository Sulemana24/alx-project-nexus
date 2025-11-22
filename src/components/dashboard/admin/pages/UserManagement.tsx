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
  Search,
  Filter,
  Download,
  UserPlus,
  Shield,
  UserCheck,
} from "lucide-react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
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
  createdAt?: Timestamp;
}

type RoleFilter = "all" | "student" | "teacher";
type PlanFilter = "all" | "free" | "pro";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [planFilter, setPlanFilter] = useState<PlanFilter>("all");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.institution.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesPlan =
      planFilter === "all" ||
      (planFilter === "free" && user.plan === "free") ||
      (planFilter === "pro" && user.plan !== "free");

    return matchesSearch && matchesRole && matchesPlan;
  });

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
    setActiveDropdown(null);
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
        "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 shadow-sm",
      teacher_pro:
        "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200 shadow-sm",
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
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked
          ? "bg-green-500 shadow-lg shadow-green-200"
          : "bg-gray-300 shadow-inner"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-all duration-300 ${
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
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage users and their subscription plans
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search users by name, email, or institution..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 bg-white min-w-[120px]"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="teacher">Teachers</option>
            </select>

            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value as PlanFilter)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 bg-white min-w-[120px]"
            >
              <option value="all">All Plans</option>
              <option value="free">Free</option>
              <option value="pro">Pro</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            label: "Total Users",
            value: statsUsers.length,
            icon: Users,
            color: "blue",
            bg: "from-blue-50 to-blue-100",
            iconBg: "bg-blue-100",
          },
          {
            label: "Teachers",
            value: statsUsers.filter((u) => u.role === "teacher").length,
            icon: GraduationCap,
            color: "green",
            bg: "from-green-50 to-green-100",
            iconBg: "bg-green-100",
          },
          {
            label: "Students",
            value: statsUsers.filter((u) => u.role === "student").length,
            icon: Users,
            color: "blue",
            bg: "from-blue-50 to-blue-100",
            iconBg: "bg-blue-100",
          },
          {
            label: "Pro Users",
            value: statsUsers.filter((u) => u.plan !== "free").length,
            icon: Crown,
            color: "purple",
            bg: "from-purple-50 to-purple-100",
            iconBg: "bg-purple-100",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">
                  {stat.label}
                </div>
              </div>
              <div
                className={`p-2 sm:p-3 rounded-xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-200`}
              >
                <stat.icon
                  className={`h-4 w-4 sm:h-6 sm:w-6 text-${stat.color}-600`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4 p-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setActiveDropdown(
                      activeDropdown === user.id ? null : user.id
                    )
                  }
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-gray-500 text-xs">Role</div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.role === "teacher"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Plan</div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${getPlanColor(
                      user.plan
                    )}`}
                  >
                    {getPlanDisplay(user.plan)}
                  </span>
                </div>
                <div className="col-span-2">
                  <div className="text-gray-500 text-xs">Institution</div>
                  <div className="text-gray-900 font-medium">
                    {user.institution}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Pro Plan:</span>
                  <ToggleSwitch
                    checked={user.plan !== "free"}
                    onChange={() => handlePlanToggle(user.id)}
                  />
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              {/* Dropdown Menu for Mobile */}
              {activeDropdown === user.id && (
                <div className="mt-3 p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <button
                    onClick={() =>
                      handleRoleChange(
                        user.id,
                        user.role === "student" ? "teacher" : "student"
                      )
                    }
                    className="flex items-center space-x-2 w-full p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <Shield className="h-4 w-4" />
                    <span>
                      Change to{" "}
                      {user.role === "student" ? "Teacher" : "Student"}
                    </span>
                  </button>
                  <button className="flex items-center space-x-2 w-full p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                    <Mail className="h-4 w-4" />
                    <span>Send Email</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="p-6 text-left text-sm font-semibold text-gray-900">
                  User
                </th>
                <th className="p-6 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="p-6 text-left text-sm font-semibold text-gray-900">
                  Institution
                </th>
                <th className="p-6 text-left text-sm font-semibold text-gray-900">
                  Role
                </th>
                <th className="p-6 text-left text-sm font-semibold text-gray-900">
                  Plan
                </th>
                <th className="p-6 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <td className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-gray-900">
                    <div className="truncate max-w-[200px]">{user.email}</div>
                  </td>
                  <td className="p-6 text-gray-900">
                    <div className="truncate max-w-[150px]">
                      {user.institution}
                    </div>
                  </td>
                  <td className="p-6">
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
                  <td className="p-6">
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
                  <td className="p-6">
                    <div className="flex items-center space-x-2">
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

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No users found</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchTerm || roleFilter !== "all" || planFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Users will appear here once they register"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
