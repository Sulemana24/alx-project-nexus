"use client";
import CountUp from "react-countup";
import { mockStudentAnalytics } from "@/data/mock-data";

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col items-center">
          <p className="text-gray-500">Total Quizzes</p>
          <p className="text-2xl font-bold text-gray-900">
            <CountUp end={mockStudentAnalytics.totalQuizzes} duration={1.5} />
          </p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-6 flex flex-col items-center">
          <p className="text-gray-500">Average Score</p>
          <p className="text-2xl font-bold text-gray-900">
            <CountUp end={mockStudentAnalytics.averageScore} duration={1.5} />%
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 flex flex-col items-center">
          <p className="text-gray-500">Practice Sessions</p>
          <p className="text-2xl font-bold text-gray-900">
            <CountUp
              end={mockStudentAnalytics.totalPracticeSessions}
              duration={1.5}
            />
          </p>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-gray-900 mb-2">Recent Activity</h3>
        <div className="space-y-2 text-gray-600">
          {mockStudentAnalytics.recentActivity.map((act) => (
            <div
              key={act.id}
              className="p-3 rounded-lg border border-gray-200 flex justify-between items-center"
            >
              <span>{act.title}</span>
              {act.score && <span className="font-bold">{act.score}%</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
