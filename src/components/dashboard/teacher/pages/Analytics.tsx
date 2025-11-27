"use client";

import React from "react";
import CountUp from "react-countup";
import { mockTeacherAnalytics } from "@/data/mock-data";

const Analytics = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Teaching Analytics
        </h2>
        <p className="text-gray-600">Insights into your teaching performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col items-center">
          <p>Total Students</p>
          <p className="text-2xl font-bold">
            <CountUp end={mockTeacherAnalytics.totalStudents} duration={1.5} />
          </p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-6 flex flex-col items-center">
          <p>Quizzes Created</p>
          <p className="text-2xl font-bold">
            <CountUp end={mockTeacherAnalytics.totalQuizzes} duration={1.5} />
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 flex flex-col items-center">
          <p>Avg Class Score</p>
          <p className="text-2xl font-bold">
            <CountUp
              end={mockTeacherAnalytics.averageClassScore}
              duration={1.5}
            />
            %
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
