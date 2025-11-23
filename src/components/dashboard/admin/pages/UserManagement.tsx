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
  Search,
  Download,
  Shield,
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  User Management
                </h1>
                <p className="text-gray-600 text-lg mt-1">
                  Manage users and their subscription plans
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 px-6 py-3 rounded-xl cursor-pointer">
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </Button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users by name, email, or institution..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white min-w-[140px]"
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="teacher">Teachers</option>
              </select>

              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value as PlanFilter)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white min-w-[140px]"
              >
                <option value="all">All Plans</option>
                <option value="free">Free</option>
                <option value="pro">Pro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Users",
              value: statsUsers.length,
              icon: Users,
              color: "blue",
              bg: "from-blue-50 to-blue-100",
              border: "border-blue-200",
              iconBg: "bg-blue-100",
              iconColor: "text-blue-600",
            },
            {
              label: "Teachers",
              value: statsUsers.filter((u) => u.role === "teacher").length,
              icon: GraduationCap,
              color: "green",
              bg: "from-green-50 to-green-100",
              border: "border-green-200",
              iconBg: "bg-green-100",
              iconColor: "text-green-600",
            },
            {
              label: "Students",
              value: statsUsers.filter((u) => u.role === "student").length,
              icon: Users,
              color: "blue",
              bg: "from-blue-50 to-blue-100",
              border: "border-blue-200",
              iconBg: "bg-blue-100",
              iconColor: "text-blue-600",
            },
            {
              label: "Pro Users",
              value: statsUsers.filter((u) => u.plan !== "free").length,
              icon: Crown,
              color: "purple",
              bg: "from-purple-50 to-purple-100",
              border: "border-purple-200",
              iconBg: "bg-purple-100",
              iconColor: "text-purple-600",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
                <div
                  className={`p-3 rounded-xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-200`}
                >
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Users Table/Cards */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Results Count */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600 font-medium">
              Showing {filteredUsers.length} user
              {filteredUsers.length !== 1 ? "s" : ""}
              {searchTerm || roleFilter !== "all" || planFilter !== "all"
                ? " (filtered)"
                : ""}
            </p>
          </div>

          {/* Mobile Cards with Scroll */}
          <div className="block lg:hidden">
            <div className="max-h-[600px] overflow-y-auto p-6 space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-semibold text-base shadow-lg">
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === user.id ? null : user.id
                        )
                      }
                      className="p-2 hover:bg-gray-200 rounded-xl transition-colors"
                    >
                      <MoreVertical className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <div className="text-gray-500 text-xs font-medium mb-1">
                        Role
                      </div>
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                          user.role === "teacher"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-blue-100 text-blue-800 border border-blue-200"
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs font-medium mb-1">
                        Plan
                      </div>
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getPlanColor(
                          user.plan
                        )}`}
                      >
                        {getPlanDisplay(user.plan)}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <div className="text-gray-500 text-xs font-medium mb-1">
                        Institution
                      </div>
                      <div className="text-gray-900 font-semibold">
                        {user.institution}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600 font-medium">
                        Pro Plan:
                      </span>
                      <ToggleSwitch
                        checked={user.plan !== "free"}
                        onChange={() => handlePlanToggle(user.id)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="primary"
                        size="sm"
                        className="text-blue-600 hover:bg-blue-50 transition-colors rounded-xl"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Dropdown Menu for Mobile */}
                  {activeDropdown === user.id && (
                    <div className="mt-4 p-4 bg-white border border-gray-200 rounded-xl shadow-lg">
                      <button
                        onClick={() =>
                          handleRoleChange(
                            user.id,
                            user.role === "student" ? "teacher" : "student"
                          )
                        }
                        className="flex items-center space-x-3 w-full p-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Shield className="h-4 w-4" />
                        <span>
                          Change to{" "}
                          {user.role === "student" ? "Teacher" : "Student"}
                        </span>
                      </button>
                      <button className="flex items-center space-x-3 w-full p-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <Mail className="h-4 w-4" />
                        <span>Send Email</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Table with Responsive Layout */}
          <div className="hidden lg:block">
            <div className="max-h-[600px] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <th className="p-4 text-left text-sm font-semibold text-gray-900 sticky top-0 bg-gray-50 min-w-[200px]">
                      User
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900 sticky top-0 bg-gray-50 min-w-[250px]">
                      Email
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900 sticky top-0 bg-gray-50 min-w-[200px]">
                      Institution
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900 sticky top-0 bg-gray-50 min-w-[150px]">
                      Role
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900 sticky top-0 bg-gray-50 min-w-[200px]">
                      Plan
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900 sticky top-0 bg-gray-50 min-w-[150px]">
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
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                              {user.firstName[0]}
                              {user.lastName[0]}
                            </div>
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-gray-900 text-sm truncate max-w-[150px]">
                              {user.firstName} {user.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-900">
                        <div className="text-sm font-medium truncate max-w-[220px]">
                          {user.email}
                        </div>
                      </td>
                      <td className="p-4 text-gray-900">
                        <div className="text-sm font-medium truncate max-w-[180px]">
                          {user.institution}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.role === "teacher"
                                ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200"
                                : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200"
                            }`}
                          >
                            {user.role === "teacher" ? "Teacher" : "Student"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getPlanColor(
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
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="primary"
                            size="sm"
                            className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 rounded-lg"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors duration-200 rounded-lg"
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
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-gray-300" />
              </div>
              <p className="text-gray-500 text-xl font-semibold mb-2">
                No users found
              </p>
              <p className="text-gray-400 text-base">
                {searchTerm || roleFilter !== "all" || planFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Users will appear here once they register"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
