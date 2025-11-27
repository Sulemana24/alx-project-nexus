"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import CountUp from "react-countup";
import { mockTeacherAnalytics, mockQuizzes } from "@/data/mock-data";

interface DashboardProps {
  userName: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userName }) => {
  return (
    <div className="space-y-8">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
        Welcome, Professor {userName}! 👨‍🏫
      </h1>
      <p className="text-gray-600 mb-8">
        Manage your classes and track student progress.
      </p>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button size="sm">Create Quiz</Button>
        <Button size="sm">Manage Students</Button>
        <Button size="sm">Upload Content</Button>
        <Button size="sm">View Analytics</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-violet-50 border border-blue-100 rounded-xl p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Active Students</p>
            <p className="text-2xl font-bold text-gray-900">
              <CountUp
                end={mockTeacherAnalytics.totalStudents}
                duration={1.5}
              />
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
            👨‍🎓
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Quizzes Created</p>
            <p className="text-2xl font-bold text-gray-900">
              <CountUp end={mockTeacherAnalytics.totalQuizzes} duration={1.5} />
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
            📝
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Avg. Class Score</p>
            <p className="text-2xl font-bold text-gray-900">
              <CountUp
                end={mockTeacherAnalytics.averageClassScore}
                duration={1.5}
                suffix="%"
              />
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
            📊
          </div>
        </div>
      </div>

      {/* Active Quizzes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Your Active Quizzes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockQuizzes
            .filter((q) => q.isActive)
            .map((quiz) => (
              <div
                key={quiz.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="font-bold text-gray-900">
                    {quiz.courseCode}
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{quiz.title}</p>
                <p className="text-sm text-gray-600 mb-2">
                  Participants: {quiz.participantCount}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  Avg Score: {quiz.averageScore}%
                </p>
                <div className="flex gap-2">
                  <Button className="flex-1">View Results</Button>
                  <Button variant="outline">Edit</Button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
