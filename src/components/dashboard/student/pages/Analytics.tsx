"use client";

import CountUp from "react-countup";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getQuizHistory } from "@/lib/practiceHistory";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { getRecentVideos } from "@/lib/recentVideos";

interface VideoHistory {
  title: string;
  watchedAt: number;
  duration: number;
}

interface Activity {
  id: string;
  title: string;
  type: "quiz" | "video";
  score?: number;
  timestamp: number;
}

const Analytics = () => {
  const { user } = useAuth();
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [practiceSessions, setPracticeSessions] = useState(0);
  const [videosWatched, setVideosWatched] = useState(0);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchAnalytics = async () => {
      // --- Fetch Quiz History ---
      const quizHistory = await getQuizHistory(user.id, 100);
      const total = quizHistory.length;
      const avgScore =
        total > 0
          ? quizHistory.reduce((acc, q) => acc + q.score, 0) / total
          : 0;
      setTotalQuizzes(total);
      setAverageScore(Math.round(avgScore));
      setPracticeSessions(total);

      // --- Fetch Video History using recentVideos system ---
      const recentVideos = await getRecentVideos(user.id, 100);
      setVideosWatched(recentVideos.length);

      // --- Combine into Recent Activity ---
      const recentActivities: Activity[] = [
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

      recentActivities.sort((a, b) => b.timestamp - a.timestamp);
      setRecentActivity(recentActivities.slice(0, 5));
    };

    fetchAnalytics();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col items-center">
          <p className="text-gray-500">Total Quizzes</p>
          <p className="text-2xl font-bold text-gray-900">
            <CountUp end={totalQuizzes} duration={1.5} />
          </p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-6 flex flex-col items-center">
          <p className="text-gray-500">Average Score</p>
          <p className="text-2xl font-bold text-gray-900">
            <CountUp end={averageScore} duration={1.5} />%
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 flex flex-col items-center">
          <p className="text-gray-500">Practice Sessions</p>
          <p className="text-2xl font-bold text-gray-900">
            <CountUp end={practiceSessions} duration={1.5} />
          </p>
        </div>
        <div className="bg-blue-50 border border-amber-100 rounded-xl p-6 flex flex-col items-center">
          <p className="text-gray-500">Videos Watched</p>
          <p className="text-2xl font-bold text-gray-900">
            <CountUp end={videosWatched} duration={1.5} />
          </p>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-gray-900 mb-2">Recent Activity</h3>
        <div className="space-y-2 text-gray-600">
          {recentActivity.map((act) => (
            <div
              key={act.id}
              className="p-3 rounded-lg border border-gray-200 flex justify-between items-center"
            >
              <span>{act.title}</span>
              {act.type === "quiz" && act.score !== undefined && (
                <span className="font-bold">{act.score}%</span>
              )}
              {act.type === "video" && (
                <span className="text-sm text-gray-500">Video</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
