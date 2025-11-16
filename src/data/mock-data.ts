import {
  User,
  UserRole,
  StudentProfile,
  TeacherProfile,
  Quiz,
  Question,
  QuizAttempt,
  PracticeSession,
  VideoResource,
  Playlist,
  StudentAnalytics,
  TeacherAnalytics,
  SubscriptionPlan,
  UserSubscription,
  PlatformStats,
  RevenueReport,
  SubscriptionStatus,
} from "@/types";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "sulemana@university.edu",
    name: "Iddrisu Sulemana",
    role: UserRole.STUDENT,
    avatar: "/avatars/student1.jpg",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "user-2",
    email: "sarah.teacher@university.edu",
    name: "Prof. Sarah Smith",
    role: UserRole.TEACHER,
    avatar: "/avatars/teacher1.jpg",
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "user-3",
    email: "admin@learnify.com",
    name: "Admin User",
    role: UserRole.ADMIN,
    avatar: "/avatars/admin1.jpg",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "user-4",
    email: "emma.wilson@university.edu",
    name: "Emma Wilson",
    role: UserRole.STUDENT,
    avatar: "/avatars/student2.jpg",
    createdAt: new Date("2024-01-20"),
  },
];

export const mockStudentProfiles: StudentProfile[] = [
  {
    id: "student-1",
    studentId: "STU001",
    department: "Computer Science",
    year: 2,
    userId: "user-1",
  },
  {
    id: "student-2",
    studentId: "STU002",
    department: "Mathematics",
    year: 1,
    userId: "user-4",
  },
];

export const mockTeacherProfiles: TeacherProfile[] = [
  {
    id: "teacher-1",
    employeeId: "TCH001",
    department: "Computer Science",
    userId: "user-2",
  },
];

// Mock Quizzes & Questions
export const mockQuizzes: Quiz[] = [
  {
    id: "quiz-1",
    title: "Introduction to Programming",
    description: "Basic programming concepts and fundamentals",
    duration: 30,
    accessCode: "PROG101",
    isActive: true,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
    creatorId: "user-2",
    creator: mockUsers[1],
    totalMarks: 20,
    participantCount: 45,
    questions: [
      {
        id: "q-1",
        question: 'What is the output of console.log(2 + "2")?',
        options: ['"22"', "4", '"4"', "Error"],
        correctAnswer: 0,
        explanation:
          "In JavaScript, when you add a number and a string, it converts the number to a string and concatenates them.",
        marks: 1,
        quizId: "quiz-1",
      },
      {
        id: "q-2",
        question: "Which of the following is NOT a programming paradigm?",
        options: ["Object-Oriented", "Functional", "Procedural", "Linguistic"],
        correctAnswer: 3,
        explanation:
          "Linguistic is not a programming paradigm. The main paradigms are Object-Oriented, Functional, and Procedural.",
        marks: 1,
        quizId: "quiz-1",
      },
      {
        id: "q-3",
        question: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Hyper Transfer Markup Language",
          "Home Tool Markup Language",
        ],
        correctAnswer: 0,
        explanation:
          "HTML stands for Hyper Text Markup Language, which is the standard markup language for web pages.",
        marks: 1,
        quizId: "quiz-1",
      },
    ],
  },
  {
    id: "quiz-2",
    title: "Mathematics Final Exam",
    description:
      "Comprehensive mathematics assessment covering algebra and calculus",
    duration: 45,
    accessCode: "MATH202",
    isActive: true,
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-02-05"),
    creatorId: "user-2",
    creator: mockUsers[1],
    totalMarks: 15,
    participantCount: 38,
    questions: [
      {
        id: "q-4",
        question: "What is the derivative of x²?",
        options: ["2x", "x²", "2", "x"],
        correctAnswer: 0,
        explanation:
          "The derivative of x² is 2x, using the power rule of differentiation.",
        marks: 1,
        quizId: "quiz-2",
      },
      {
        id: "q-5",
        question: "Solve for x: 2x + 5 = 13",
        options: ["4", "5", "6", "7"],
        correctAnswer: 0,
        explanation: "2x + 5 = 13 → 2x = 8 → x = 4",
        marks: 1,
        quizId: "quiz-2",
      },
    ],
  },
];

// Mock Quiz Attempts
export const mockQuizAttempts: QuizAttempt[] = [
  {
    id: "attempt-1",
    score: 18,
    totalMarks: 20,
    timeSpent: 1420, // 23 minutes 40 seconds
    completedAt: new Date("2024-02-02T10:30:00"),
    studentId: "user-1",
    student: mockUsers[0],
    quizId: "quiz-1",
    quiz: mockQuizzes[0],
    answers: [
      {
        id: "ans-1",
        questionId: "q-1",
        selectedOption: 0,
        isCorrect: true,
        attemptId: "attempt-1",
      },
      {
        id: "ans-2",
        questionId: "q-2",
        selectedOption: 3,
        isCorrect: true,
        attemptId: "attempt-1",
      },
      {
        id: "ans-3",
        questionId: "q-3",
        selectedOption: 0,
        isCorrect: true,
        attemptId: "attempt-1",
      },
    ],
  },
];

// Mock Practice Sessions
export const mockPracticeSessions: PracticeSession[] = [
  {
    id: "practice-1",
    title: "Mathematics Practice from PDF",
    pdfUrl: "/pdfs/math-practice.pdf",
    score: 17,
    total: 20,
    createdAt: new Date("2024-02-03"),
    studentId: "user-1",
    student: mockUsers[0],
    questions: mockQuizzes[0].questions,
  },
  {
    id: "practice-2",
    title: "Science Quiz Practice",
    score: 14,
    total: 15,
    createdAt: new Date("2024-02-01"),
    studentId: "user-1",
    student: mockUsers[0],
    questions: mockQuizzes[1].questions,
  },
];

// Mock E-Learning Content
export const mockVideos: VideoResource[] = [
  {
    id: "video-1",
    title: "React Basics Tutorial",
    description:
      "Learn the fundamentals of React including components, props, and state",
    youtubeUrl: "https://youtube.com/watch?v=abcdefg",
    thumbnail: "/thumbnails/react-basics.jpg",
    duration: "25:30",
    category: "Programming",
    views: 1250,
    uploadDate: new Date("2024-01-15"),
    createdBy: "user-2",
  },
  {
    id: "video-2",
    title: "JavaScript Fundamentals",
    description: "Complete guide to JavaScript basics and essential concepts",
    youtubeUrl: "https://youtube.com/watch?v=hijklmn",
    thumbnail: "/thumbnails/js-fundamentals.jpg",
    duration: "18:45",
    category: "Programming",
    views: 890,
    uploadDate: new Date("2024-01-20"),
    createdBy: "user-2",
  },
  {
    id: "video-3",
    title: "Calculus for Beginners",
    description: "Introduction to calculus concepts and basic differentiation",
    youtubeUrl: "https://youtube.com/watch?v=opqrst",
    thumbnail: "/thumbnails/calculus-basics.jpg",
    duration: "32:15",
    category: "Mathematics",
    views: 670,
    uploadDate: new Date("2024-01-25"),
    createdBy: "user-2",
  },
];

export const mockPlaylists: Playlist[] = [
  {
    id: "playlist-1",
    title: "Web Development Bootcamp",
    description: "Complete web development course from beginner to advanced",
    videos: [mockVideos[0], mockVideos[1]],
    createdBy: "user-2",
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "playlist-2",
    title: "Mathematics Fundamentals",
    description: "Essential mathematics concepts for computer science",
    videos: [mockVideos[2]],
    createdBy: "user-2",
    createdAt: new Date("2024-01-12"),
  },
];

// Mock Analytics
export const mockStudentAnalytics: StudentAnalytics = {
  totalQuizzes: 12,
  averageScore: 78,
  totalPracticeSessions: 8,
  streak: 15,
  performanceBySubject: [
    {
      subject: "Programming",
      averageScore: 85,
      quizzesTaken: 6,
      improvement: 12,
    },
    {
      subject: "Mathematics",
      averageScore: 72,
      quizzesTaken: 4,
      improvement: 8,
    },
    { subject: "Science", averageScore: 65, quizzesTaken: 2, improvement: 5 },
  ],
  recentActivity: [
    {
      id: "act-1",
      type: "quiz",
      title: "Programming Midterm",
      score: 85,
      date: new Date("2024-02-02"),
    },
    {
      id: "act-2",
      type: "practice",
      title: "Math Practice",
      score: 92,
      date: new Date("2024-02-01"),
    },
    {
      id: "act-3",
      type: "video",
      title: "React Basics",
      date: new Date("2024-01-31"),
    },
  ],
};

export const mockTeacherAnalytics: TeacherAnalytics = {
  totalQuizzes: 5,
  totalStudents: 45,
  averageClassScore: 78,
  studentPerformance: [
    {
      student: mockUsers[0],
      averageScore: 85,
      quizzesCompleted: 6,
      lastActive: new Date("2024-02-02"),
    },
    {
      student: mockUsers[3],
      averageScore: 72,
      quizzesCompleted: 4,
      lastActive: new Date("2024-02-01"),
    },
  ],
  quizStatistics: [
    {
      quiz: mockQuizzes[0],
      averageScore: 82,
      completionRate: 89,
      timeSpentAverage: 25,
    },
    {
      quiz: mockQuizzes[1],
      averageScore: 75,
      completionRate: 84,
      timeSpentAverage: 32,
    },
  ],
};

// Mock Subscription Plans
export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: "plan-free",
    name: "Free",
    description: "Basic features for getting started",
    priceMonthly: 0,
    priceYearly: 0,
    popular: false,
    features: [
      "5 PDF processes per month",
      "Basic quiz generation",
      "Standard analytics",
      "Community support",
    ],
    limits: {
      pdfProcessesPerMonth: 5,
      quizGenerations: 10,
      analyticsAccess: false,
      customBranding: false,
      adFree: false,
      downloadCertificates: false,
      quizMarketplace: false,
      bulkManagement: false,
    },
  },
  {
    id: "plan-student-pro",
    name: "Student Pro",
    description: "Perfect for serious learners",
    priceMonthly: 5,
    priceYearly: 50,
    popular: true,
    features: [
      "Unlimited PDF processing",
      "Priority AI generation",
      "Advanced analytics",
      "Download certificates",
      "Ad-free experience",
      "Priority support",
    ],
    limits: {
      pdfProcessesPerMonth: -1, // unlimited
      quizGenerations: -1,
      analyticsAccess: true,
      customBranding: false,
      adFree: true,
      downloadCertificates: true,
      quizMarketplace: false,
      bulkManagement: false,
    },
  },
  {
    id: "plan-teacher-pro",
    name: "Teacher Pro",
    description: "Complete toolkit for educators",
    priceMonthly: 15,
    priceYearly: 150,
    popular: false,
    features: [
      "Everything in Student Pro",
      "Quiz marketplace",
      "Bulk student management",
      "Custom branding",
      "Advanced reporting",
      "Dedicated support",
    ],
    limits: {
      pdfProcessesPerMonth: -1,
      quizGenerations: -1,
      analyticsAccess: true,
      customBranding: true,
      adFree: true,
      downloadCertificates: true,
      quizMarketplace: true,
      bulkManagement: true,
    },
  },
];

export const mockUserSubscriptions: UserSubscription[] = [
  {
    id: "sub-1",
    userId: "user-1",
    planId: "plan-student-pro",
    status: SubscriptionStatus.ACTIVE,
    startDate: new Date("2024-01-15"),
    endDate: new Date("2025-01-15"),
    plan: mockSubscriptionPlans[1],
  },
];

// Mock Admin Data
export const mockPlatformStats: PlatformStats = {
  totalUsers: 1250,
  activeSubscriptions: 89,
  totalRevenue: 2340,
  totalQuizzes: 450,
  growthRate: 12,
};

export const mockRevenueReports: RevenueReport[] = [
  {
    period: "Jan 2024",
    revenue: 2340,
    newSubscriptions: 23,
    churnRate: 2.3,
    mostPopularPlan: "Student Pro",
  },
  {
    period: "Dec 2023",
    revenue: 2080,
    newSubscriptions: 18,
    churnRate: 3.1,
    mostPopularPlan: "Student Pro",
  },
];

// Utility function to get current user based on role
export const getCurrentUser = (role: UserRole): User => {
  return mockUsers.find((user) => user.role === role) || mockUsers[0];
};

// Utility function to get user-specific data
export const getUserData = (userId: string) => {
  const user = mockUsers.find((u) => u.id === userId);
  const studentProfile = mockStudentProfiles.find((sp) => sp.userId === userId);
  const teacherProfile = mockTeacherProfiles.find((tp) => tp.userId === userId);
  const subscription = mockUserSubscriptions.find(
    (sub) => sub.userId === userId
  );

  return {
    user,
    studentProfile,
    teacherProfile,
    subscription,
  };
};
