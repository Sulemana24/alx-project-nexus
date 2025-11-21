"use client";
import { Button } from "@/components/ui/Button";
import CountUp from "react-countup";
import { mockStudentAnalytics, mockQuizzes } from "@/data/mock-data";

interface DashboardProps {
  userName: string;
  setActiveSidebarItem: (item: string) => void;
}

const Dashboard = ({ userName, setActiveSidebarItem }: DashboardProps) => {
  return (
    <div className="space-y-8">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
        Welcome back, {userName}! 👋
      </h1>
      <p className="text-gray-600 mb-8">
        Here&apos;s your learning overview for today.
      </p>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          onClick={() => setActiveSidebarItem("my-quizzes")}
          size="sm"
          className="text-lg h-auto flex flex-col items-center justify-center"
        >
          Join Quiz
        </Button>
        <Button
          onClick={() => setActiveSidebarItem("passco")}
          size="sm"
          className="text-lg h-auto flex flex-col items-center justify-center"
        >
          Passco
        </Button>
        <Button
          onClick={() => setActiveSidebarItem("practice")}
          size="sm"
          className="text-lg h-auto flex flex-col items-center justify-center"
        >
          Upload PDF
        </Button>
        <Button
          onClick={() => setActiveSidebarItem("e-learning")}
          size="sm"
          className="text-lg h-auto flex flex-col items-center justify-center"
        >
          E-Learning
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-linear-to-br from-blue-50 to-violet-50 border border-blue-100 rounded-xl p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Quizzes Completed</p>
            <p className="text-2xl font-bold text-gray-900">
              <CountUp end={mockStudentAnalytics.totalQuizzes} duration={1.5} />
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
            📝
          </div>
        </div>

        <div className="bg-linear-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Average Score</p>
            <p className="text-2xl font-bold text-gray-900">
              <CountUp
                end={mockStudentAnalytics.averageScore}
                duration={1.5}
                suffix="%"
              />
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
            📈
          </div>
        </div>

        <div className="bg-linear-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Learning Hours</p>
            <p className="text-2xl font-bold text-gray-900">
              <CountUp
                end={mockStudentAnalytics.totalPracticeSessions * 5}
                duration={1.5}
              />
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
            ⏱️
          </div>
        </div>
      </div>

      {/* Active Quizzes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Active Quizzes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockQuizzes
            .filter((quiz) => quiz.isActive)
            .map((quiz) => (
              <div key={quiz.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-bold text-gray-900">
                    {quiz.accessCode}
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Duration: {quiz.duration} mins
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Questions: {quiz.questions.length}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  Lecturer: {quiz.creator.name}
                </p>
                <Button className="w-full">Start Quiz</Button>
              </div>
            ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {mockStudentAnalytics.recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">
                  {activity.type === "quiz"
                    ? "📝"
                    : activity.type === "practice"
                    ? "💪"
                    : "📚"}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">
                    {activity.date.toLocaleDateString()}
                  </p>
                </div>
              </div>
              {activity.score && (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    activity.score >= 70
                      ? "bg-green-100 text-green-800"
                      : activity.score >= 50
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {activity.score}%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
