import { useState, useEffect } from "react";
import {
  mockUsers,
  mockQuizzes,
  mockPracticeSessions,
  mockVideos,
  mockPlaylists,
  mockStudentAnalytics,
  mockTeacherAnalytics,
  mockSubscriptionPlans,
  mockPlatformStats,
  mockRevenueReports,
  getCurrentUser,
  getUserData,
} from "@/data/mock-data";
import { UserRole, User, Quiz, PracticeSession } from "@/types";

export const useMockData = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Simulate authentication
  const login = (role: UserRole) => {
    const user = getCurrentUser(role);
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Get user-specific quizzes
  const getUserQuizzes = (userId: string) => {
    if (getUserData(userId).user?.role === UserRole.TEACHER) {
      return mockQuizzes.filter((quiz) => quiz.creatorId === userId);
    } else {
      return mockQuizzes; // Students see all active quizzes
    }
  };

  // Get user practice sessions
  const getUserPracticeSessions = (userId: string) => {
    return mockPracticeSessions.filter(
      (session) => session.studentId === userId
    );
  };

  return {
    // Authentication
    currentUser,
    login,
    logout,

    // Data getters
    mockUsers,
    mockQuizzes,
    mockVideos,
    mockPlaylists,
    mockSubscriptionPlans,
    mockPlatformStats,
    mockRevenueReports,

    // User-specific data
    getUserQuizzes,
    getUserPracticeSessions,
    getUserAnalytics: () =>
      currentUser?.role === UserRole.STUDENT
        ? mockStudentAnalytics
        : mockTeacherAnalytics,
    getUserData: () => (currentUser ? getUserData(currentUser.id) : null),
  };
};
