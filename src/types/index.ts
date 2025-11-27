// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

export enum UserRole {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
  ADMIN = "ADMIN",
}

export interface StudentProfile {
  id: string;
  studentId: string;
  department: string;
  year: number;
  userId: string;
}

export interface TeacherProfile {
  id: string;
  employeeId: string;
  department: string;
  userId: string;
}

// Quiz Types
export interface Quiz {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  accessCode: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
  creator: User;
  questions: Question[];
  attempts?: QuizAttempt[];
  totalMarks: number;
  participantCount: number;
  downloads?: number;
  courseCode?: string;
  averageScore?: number;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
  marks: number;
  quizId: string;
}

export interface QuizAttempt {
  id: string;
  score: number;
  totalMarks: number;
  timeSpent: number; // seconds
  completedAt: Date;
  studentId: string;
  student: User;
  quizId: string;
  quiz: Quiz;
  answers: Answer[];
}

export interface Answer {
  id: string;
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  attemptId: string;
}

// Practice Session Types
export interface PracticeSession {
  id: string;
  title: string;
  pdfUrl?: string;
  score?: number;
  total?: number;
  createdAt: Date;
  studentId: string;
  student: User;
  questions: Question[];
}

// E-Learning Types
export interface VideoResource {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnail: string;
  duration: string;
  category: string;
  views: number;
  uploadDate: Date;
  createdBy: string;
  creator?: User;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  videos: VideoResource[];
  createdBy: string;
  createdAt: Date;
}

// Analytics Types
export interface StudentAnalytics {
  totalQuizzes: number;
  averageScore: number;
  totalPracticeSessions: number;
  streak: number;
  performanceBySubject: PerformanceBySubject[];
  recentActivity: RecentActivity[];
}

export interface TeacherAnalytics {
  totalQuizzes: number;
  totalStudents: number;
  averageClassScore: number;
  studentPerformance: StudentPerformance[];
  quizStatistics: QuizStatistics[];
}

export interface PerformanceBySubject {
  subject: string;
  averageScore: number;
  quizzesTaken: number;
  improvement: number;
}

export interface RecentActivity {
  id: string;
  type: "quiz" | "practice" | "video";
  title: string;
  score?: number;
  date: Date;
}

export interface StudentPerformance {
  student: User;
  averageScore: number;
  quizzesCompleted: number;
  lastActive: Date;
}

export interface QuizStatistics {
  quiz: Quiz;
  averageScore: number;
  completionRate: number;
  timeSpentAverage: number;
}

// Subscription & Monetization Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  limits: PlanLimits;
  popular?: boolean;
}

export interface PlanLimits {
  pdfProcessesPerMonth: number;
  quizGenerations: number;
  analyticsAccess: boolean;
  customBranding: boolean;
  adFree: boolean;
  downloadCertificates: boolean;
  quizMarketplace: boolean;
  bulkManagement: boolean;
}
export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  EXPIRED = "EXPIRED",
  CANCELED = "CANCELED",
}
export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  plan: SubscriptionPlan;
}

// Admin Types
export interface PlatformStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  totalQuizzes: number;
  growthRate: number;
}

export interface RevenueReport {
  period: string;
  revenue: number;
  newSubscriptions: number;
  churnRate: number;
  mostPopularPlan: string;
}

// File Upload Types
export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  uploadedAt: Date;
  userId: string;
}
