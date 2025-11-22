"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import CountUp from "react-countup";
import { getQuizHistory } from "@/lib/practiceHistory";
import { getRecentVideos } from "@/lib/recentVideos";
import {
  TrendingUp,
  Video,
  FileText,
  PlayCircle,
  Brain,
  Award,
  Zap,
  Target,
  Users,
  Activity,
  FileQuestion,
  BookMarked,
  History,
  Upload,
  Clock4,
} from "lucide-react";

interface DashboardProps {
  userName: string;
  setActiveSidebarItem: (item: string) => void;
  userId: string;
}

interface Activity {
  id: string;
  title: string;
  type: "quiz" | "practice" | "video";
  score?: number;
  timestamp: number;
}

const timeAgo = (timestamp: number) => {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
};

const Dashboard = ({
  userName,
  setActiveSidebarItem,
  userId,
}: DashboardProps) => {
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [practiceSessions, setPracticeSessions] = useState(0);
  const [videosWatched, setVideosWatched] = useState(0);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // --- Fetch Quiz History ---
        const quizHistory = await getQuizHistory(userId, 100);
        const total = quizHistory.length;
        const avgScore =
          total > 0
            ? quizHistory.reduce((acc, q) => acc + q.score, 0) / total
            : 0;

        setTotalQuizzes(total);
        setAverageScore(Math.round(avgScore));
        setPracticeSessions(total);

        // --- Fetch Video History ---
        const recentVideos = await getRecentVideos(userId, 100);
        setVideosWatched(recentVideos.length);

        // --- Combine into Recent Activity ---
        const combinedActivities: Activity[] = [
          ...quizHistory.map((q, idx) => ({
            id: `quiz-${idx}`,
            title: `${q.course} - ${q.topic}`,
            type: "quiz" as const,
            score: Math.round(q.score),
            timestamp: q.attemptedAt,
          })),
          ...recentVideos.map((v, idx) => ({
            id: `video-${idx}`,
            title: v.title,
            type: "video" as const,
            timestamp: v.completedAt ?? Date.now(),
          })),
        ];

        // Sort by most recent
        combinedActivities.sort((a, b) => b.timestamp - a.timestamp);

        setRecentActivity(combinedActivities.slice(0, 10));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [userId]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "quiz":
        return <FileQuestion className="h-5 w-5" />;
      case "practice":
        return <Brain className="h-5 w-5" />;
      case "video":
        return <PlayCircle className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "quiz":
        return "bg-blue-500";
      case "practice":
        return "bg-amber-500";
      case "video":
        return "bg-emerald-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 mt-4">
          Welcome back, {userName}! 👋
        </h1>
        <p className="text-gray-600 mb-8">
          Here&apos;s your learning overview for today.
        </p>
        {/* Quick Action Buttons */}{" "}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {" "}
          <Button
            onClick={() => setActiveSidebarItem("my-quizzes")}
            size="sm"
            className="text-lg h-auto flex flex-col items-center justify-center cursor-pointer"
          >
            {" "}
            Join Quiz{" "}
          </Button>{" "}
          <Button
            onClick={() => setActiveSidebarItem("passco")}
            size="sm"
            className="text-lg h-auto flex flex-col items-center justify-center cursor-pointer"
          >
            {" "}
            Passco{" "}
          </Button>{" "}
          <Button
            onClick={() => setActiveSidebarItem("practice")}
            size="sm"
            className="text-lg h-auto flex flex-col items-center justify-center cursor-pointer"
          >
            {" "}
            Upload PDF{" "}
          </Button>{" "}
          <Button
            onClick={() => setActiveSidebarItem("e-learning")}
            size="sm"
            className="text-lg h-auto flex flex-col items-center justify-center cursor-pointer"
          >
            {" "}
            E-Learning{" "}
          </Button>{" "}
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Quizzes Completed
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  <CountUp end={totalQuizzes} duration={1.5} />
                </p>
                <p className="text-xs text-gray-500 mt-1">Total attempts</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Average Score
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  <CountUp end={averageScore} duration={1.5} suffix="%" />
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Overall performance
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Practice Sessions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  <CountUp end={practiceSessions} duration={1.5} />
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Learning activities
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Brain className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Videos Watched
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  <CountUp end={videosWatched} duration={1.5} />
                </p>
                <p className="text-xs text-gray-500 mt-1">E-learning content</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlayCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                  <History className="h-5 w-5 text-blue-600" />
                  <span>Recent Activity</span>
                </h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {recentActivity.length} activities
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 group"
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${getActivityColor(
                          activity.type
                        )} group-hover:scale-105 transition-transform`}
                      >
                        {getActivityIcon(activity.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {activity.title}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                          <Clock4 className="h-4 w-4" />
                          <span>{timeAgo(activity.timestamp)}</span>
                        </div>
                      </div>
                    </div>

                    {activity.score !== undefined && (
                      <div
                        className={`px-3 py-2 rounded-lg font-semibold text-sm ${
                          activity.score >= 70
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : activity.score >= 50
                            ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        {activity.score}%
                      </div>
                    )}
                  </div>
                ))}

                {recentActivity.length === 0 && (
                  <div className="text-center py-12">
                    <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium mb-2">
                      No recent activity
                    </p>
                    <p className="text-gray-400 text-sm">
                      Start learning to see your activity here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Learning Insights */}
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Target className="h-5 w-5 text-purple-600" />
                <span>Learning Progress</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Quiz Mastery</span>
                    <span>{averageScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${averageScore}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Content Coverage</span>
                    <span>
                      {Math.min(
                        100,
                        Math.round(((totalQuizzes + videosWatched) / 10) * 100)
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(
                            ((totalQuizzes + videosWatched) / 10) * 100
                          )
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Consistency</span>
                    <span>{Math.min(100, practiceSessions * 10)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all duration-1000"
                      style={{
                        width: `${Math.min(100, practiceSessions * 10)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Weekly Summary</span>
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Active Days</span>
                  <span className="font-semibold">
                    {Math.min(7, practiceSessions)}/7
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Avg. Daily Time</span>
                  <span className="font-semibold">
                    {Math.round(practiceSessions * 0.5)}h
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Learning Streak</span>
                  <span className="font-semibold">
                    {Math.min(21, practiceSessions * 3)} days
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
