// components/auth/AuthSelection.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

interface AuthSelectionProps {
  onRoleSelect: (role: "student" | "teacher") => void;
  onSwitchToLogin: () => void;
}

export const AuthSelection: React.FC<AuthSelectionProps> = ({
  onRoleSelect,
  onSwitchToLogin,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="bg-[#3B82F6] text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold text-2xl">
              L
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Learnify</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Join Learnify
          </h2>
          <p className="text-gray-600">Choose how you want to use Learnify</p>
        </div>

        {/* Role Selection Cards */}
        <div className="space-y-4">
          {/* Student Card */}
          <div
            className="cursor-pointer"
            onClick={() => onRoleSelect("student")}
          >
            <Card
              hover
              className="cursor-pointer border-2 border-transparent hover:border-[#3B82F6] transition-all duration-200"
            >
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-[#3B82F6] text-white w-12 h-12 rounded-lg flex items-center justify-center text-xl">
                    🎓
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Student
                    </h3>
                    <p className="text-blue-100 text-sm">
                      Practice with AI-generated quizzes and track your progress
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Teacher Card */}
          <div
            className="cursor-pointer"
            onClick={() => onRoleSelect("teacher")}
          >
            <Card
              hover
              className="cursor-pointer border-2 border-transparent hover:border-[#3B82F6] transition-all duration-200"
            >
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-[#3B82F6] text-white w-12 h-12 rounded-lg flex items-center justify-center text-xl">
                    👨‍🏫
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Teacher
                    </h3>
                    <p className="text-blue-100 text-sm">
                      Create quizzes, manage classes, and track student progress
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Switch to Login */}
        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-[#3B82F6] hover:text-blue-700 font-medium transition-colors duration-200"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
