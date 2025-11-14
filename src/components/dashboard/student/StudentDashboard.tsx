"use client";

import { Button } from "@/components/ui/Button";
import { useState, useRef } from "react";
import CountUp from "react-countup";
import {
  mockQuizAttempts,
  mockPracticeSessions,
  mockVideos,
  mockStudentAnalytics,
  mockQuizzes,
  mockUserSubscriptions,
} from "@/data/mock-data";
import { UserRole, SubscriptionStatus } from "@/types";
import { universities } from "@/data/universityFaculties";

export type UniversityKey = keyof typeof universities;
interface StudentDashboardProps {
  userName: string;
  userEmail: string;
  userPlan: "free" | "student pro";
}

// Extended interfaces for new features
interface PastQuestion {
  id: string;
  courseTitle: string;
  schoolName: string;
  year: number;
  department: string;
  fileUrl: string;
  accessedAt?: string;
}

interface UploadedPDF {
  id: string;
  title: string;
  subject: string;
  uploadedAt: string;
  fileUrl: string;
  size: string;
}

interface VideoProgress {
  [key: string]: number;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  userName,
  userEmail,
  userPlan,
}) => {
  const [activeSidebarItem, setActiveSidebarItem] = useState("dashboard");
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [selectedUniversity, setSelectedUniversity] = useState<
    UniversityKey | ""
  >("");

  const [selectedFaculty, setSelectedFaculty] = useState("");

  const facultyList = selectedUniversity
    ? universities[selectedUniversity]
    : [];

  // State for practice section
  const [practiceForm, setPracticeForm] = useState({
    course: "",
    topic: "",
    numQuestions: "10",
    difficulty: "medium",
    type: "multiple-choice",
  });

  // State for e-learning section
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [videoProgress, setVideoProgress] = useState<VideoProgress>({
    "video-1": 65,
    "video-2": 30,
    "video-3": 85,
  });

  // State for settings section
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoPlay: true,
    downloadQuality: "high",
    emailUpdates: true,
    soundEffects: false,
  });

  // Mock data for new features
  const mockPastQuestions: PastQuestion[] = [
    {
      id: "pq-1",
      courseTitle: "Introduction to Programming",
      schoolName: "School of Computing",
      year: 2023,
      department: "Computer Science",
      fileUrl: "/pdfs/prog-2023.pdf",
      accessedAt: "2024-02-01",
    },
    {
      id: "pq-2",
      courseTitle: "Calculus I",
      schoolName: "School of Mathematics",
      year: 2023,
      department: "Mathematics",
      fileUrl: "/pdfs/calculus-2023.pdf",
      accessedAt: "2024-01-28",
    },
    {
      id: "pq-3",
      courseTitle: "Data Structures",
      schoolName: "School of Computing",
      year: 2022,
      department: "Computer Science",
      fileUrl: "/pdfs/ds-2022.pdf",
    },
  ];

  const mockUploadedPDFs: UploadedPDF[] = [
    {
      id: "pdf-1",
      title: "Mathematics Notes",
      subject: "Mathematics",
      uploadedAt: "2024-02-03",
      fileUrl: "/pdfs/math-notes.pdf",
      size: "2.4 MB",
    },
    {
      id: "pdf-2",
      title: "Programming Concepts",
      subject: "Computer Science",
      uploadedAt: "2024-02-01",
      fileUrl: "/pdfs/prog-concepts.pdf",
      size: "1.8 MB",
    },
  ];

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "my-quizzes", label: "My Quizzes", icon: "📝" },
    { id: "passco", label: "Passco", icon: "🎯" },
    { id: "practice", label: "Practice", icon: "💪" },
    { id: "e-learning", label: "E-Learning", icon: "📚" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const handlePracticeFormChange = (field: string, value: string) => {
    setPracticeForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateRandomQuiz = () => {
    // Validate required fields
    if (!practiceForm.topic || !practiceForm.course) {
      alert(
        "Please select a course and enter a topic before generating a quiz."
      );
      return; // Stop execution
    }

    console.log("Generating quiz with:", practiceForm);

    alert(
      `Generating ${practiceForm.numQuestions} ${practiceForm.difficulty} ${practiceForm.type} questions for ${practiceForm.course} - ${practiceForm.topic}`
    );
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
  };

  // Filter videos based on search query
  const filteredVideos = mockVideos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentVideo = mockVideos.find((v) => v.id === selectedVideo);
  const videoId = currentVideo
    ? getYouTubeVideoId(currentVideo.youtubeUrl)
    : null;

  // Toggle settings
  const toggleSetting = (setting: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  // Update video progress (simulated)
  const updateVideoProgress = (videoId: string, progress: number) => {
    setVideoProgress((prev) => ({
      ...prev,
      [videoId]: progress,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-6 h-6 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="bg-blue-500 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">
              L
            </div>
            <span className="hidden sm:block text-lg font-semibold text-gray-900">
              Student Dashboard
            </span>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {userPlan === "free" && (
              <button className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Upgrade Plan
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center space-x-2 sm:space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">{userName}</p>
                    <p className="text-sm text-gray-600">{userEmail}</p>
                  </div>
                  <div className="px-4 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Plan</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          userPlan === "student pro"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {userPlan === "student pro" ? "Student Pro" : "Free"}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={() => {
                        localStorage.clear();

                        window.location.href = "/auth";
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar + Content */}
      <div className="flex relative">
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-opacity-50 lg:hidden z-20 transition-opacity"
          ></div>
        )}

        <aside
          className={`bg-white shadow-sm border-r border-gray-200 fixed top-0 left-0 h-full z-30 transform transition-transform duration-300
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 lg:relative lg:w-64`}
        >
          <nav className="p-4 pt-24 lg:pt-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSidebarItem(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeSidebarItem === item.id
                        ? "bg-gradient-to-r from-blue-50 to-violet-50 text-blue-600 border border-blue-100"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium hidden lg:inline">
                      {item.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main
          className={`flex-1 p-4 sm:p-6 lg:ml-0 transition-all duration-300 relative ${
            isSidebarOpen && "lg:ml-0 opacity-80"
          }`}
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
            {/* Dashboard Section */}
            {activeSidebarItem === "dashboard" && (
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
                        <CountUp
                          end={mockStudentAnalytics.totalQuizzes}
                          duration={1.5}
                        />
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
                        <div
                          key={quiz.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
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
                          <Button className="w-full ">Start Quiz</Button>
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
                            <p className="font-medium text-gray-900">
                              {activity.title}
                            </p>
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
            )}

            {/* My Quizzes Section */}
            {activeSidebarItem === "my-quizzes" && (
              <div className="space-y-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    My Quizzes
                  </h2>
                  <p className="text-gray-600">
                    Track your quiz performance and upcoming assessments
                  </p>
                  <Button className="mt-4">Join Quiz</Button>
                </div>

                {/* Upcoming Quiz */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Upcoming Quiz
                  </h3>
                  {mockQuizzes.slice(0, 1).map((quiz) => (
                    <div
                      key={quiz.id}
                      className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0"
                    >
                      <div className="space-y-2">
                        <p className="font-semibold text-gray-900">
                          {quiz.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          Date: {quiz.createdAt.toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Duration: {quiz.duration} mins
                        </p>
                        <p className="text-sm text-gray-600">
                          Lecturer: {quiz.creator.name}
                        </p>
                      </div>
                      <Button className=" w-full md:w-auto">Join Quiz</Button>
                    </div>
                  ))}
                </div>

                {/* Recent History */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent History
                  </h3>
                  <div className="space-y-4">
                    {mockQuizAttempts.map((attempt) => (
                      <div
                        key={attempt.id}
                        className="p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
                          <div className="space-y-1">
                            <p className="font-medium text-gray-900">
                              {attempt.quiz.title}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              <span>
                                Date: {attempt.completedAt.toLocaleDateString()}
                              </span>
                              <span>
                                Duration: {Math.floor(attempt.timeSpent / 60)}{" "}
                                mins
                              </span>
                              <span>Lecturer: {attempt.quiz.creator.name}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                attempt.score >= 70
                                  ? "bg-green-100 text-green-800"
                                  : attempt.score >= 50
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              Grade:{" "}
                              {Math.round(
                                (attempt.score / attempt.totalMarks) * 100
                              )}
                              %
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Passco Section */}
            {activeSidebarItem === "passco" && (
              <div className="space-y-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Past Questions
                  </h2>
                  <p className="text-gray-600">
                    Access previous examination questions and study materials
                  </p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Enter course name, school, dept, faculty..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      />
                    </div>
                    <div className="flex gap-2">
                      <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black">
                        <option value="">All Years</option>
                        {Array.from(
                          { length: 2026 - 2010 + 1 },
                          (_, i) => 2026 - i
                        ).map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      <select
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        value={selectedUniversity}
                        onChange={(e) => {
                          setSelectedUniversity(
                            e.target.value as UniversityKey | ""
                          );
                          setSelectedFaculty("");
                        }}
                      >
                        <option value="">All Universities</option>
                        {Object.keys(universities)
                          .sort()
                          .map((key) => (
                            <option value={key} key={key}>
                              {key.toUpperCase()}
                            </option>
                          ))}
                      </select>
                      <select
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        value={selectedFaculty}
                        onChange={(e) => setSelectedFaculty(e.target.value)}
                        disabled={!selectedUniversity}
                      >
                        <option value="">
                          {selectedUniversity
                            ? "Select Faculty"
                            : "Select a university first"}
                        </option>

                        {facultyList.map((faculty: string) => (
                          <option
                            key={faculty}
                            value={faculty.toLowerCase().replace(/\s+/g, "-")}
                          >
                            {faculty}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Past Questions List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockPastQuestions.map((pq) => (
                      <div
                        key={pq.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {pq.courseTitle}
                        </h4>
                        <div className="space-y-1 text-sm text-gray-600 mb-4">
                          <p>School: {pq.schoolName}</p>
                          <p>Year: {pq.year}</p>
                          <p>Department: {pq.department}</p>
                        </div>
                        <Button className="w-full ">View</Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Access */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recently Accessed
                  </h3>
                  <div className="space-y-3">
                    {mockPastQuestions
                      .filter((pq) => pq.accessedAt)
                      .map((pq) => (
                        <div
                          key={pq.id}
                          className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {pq.courseTitle}
                            </p>
                            <p className="text-sm text-gray-500">
                              Accessed: {pq.accessedAt}
                            </p>
                          </div>
                          <Button>View</Button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Practice Section */}
            {activeSidebarItem === "practice" && (
              <div className="space-y-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Practice & Study
                  </h2>
                  <p className="text-gray-600">
                    Upload PDFs and generate custom practice quizzes
                  </p>
                  <Button className="mt-4">Upload PDF</Button>
                </div>

                {/* Random Quiz Generator */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Generate Random Quiz
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Course/Subject
                      </label>
                      <input
                        type="text"
                        value={practiceForm.course}
                        onChange={(e) =>
                          handlePracticeFormChange("course", e.target.value)
                        }
                        placeholder="Enter course or subject"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Topic/Sub-topic
                      </label>
                      <input
                        type="text"
                        value={practiceForm.topic}
                        onChange={(e) =>
                          handlePracticeFormChange("topic", e.target.value)
                        }
                        placeholder="Enter topic or sub-topic"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Questions
                      </label>
                      <select
                        value={practiceForm.numQuestions}
                        onChange={(e) =>
                          handlePracticeFormChange(
                            "numQuestions",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      >
                        <option value="5">5 Questions</option>
                        <option value="10">10 Questions</option>
                        <option value="15">15 Questions</option>
                        <option value="20">20 Questions</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Difficulty
                      </label>
                      <select
                        value={practiceForm.difficulty}
                        onChange={(e) =>
                          handlePracticeFormChange("difficulty", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question Type
                      </label>
                      <select
                        value={practiceForm.type}
                        onChange={(e) =>
                          handlePracticeFormChange("type", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      >
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="fill-in">Fill in the Blank</option>
                        <option value="true-false">True/False</option>
                      </select>
                    </div>
                  </div>
                  <Button
                    onClick={generateRandomQuiz}
                    className="w-full font-medium"
                  >
                    Generate Questions
                  </Button>
                </div>

                {/* Recent Uploads and Generated Quizzes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Recent Uploaded PDFs */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Recent PDFs
                    </h3>
                    <div className="space-y-3">
                      {mockUploadedPDFs.map((pdf) => (
                        <div
                          key={pdf.id}
                          className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {pdf.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {pdf.subject} • {pdf.size}
                            </p>
                          </div>
                          <Button>View</Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Generated Quizzes */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Recent Quizzes
                    </h3>
                    <div className="space-y-3">
                      {mockPracticeSessions.map((session) => (
                        <div
                          key={session.id}
                          className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {session.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {session.questions.length} Questions • Score:{" "}
                              {session.score}/{session.total}
                            </p>
                          </div>
                          <Button className="">View</Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* E-Learning Section - Enhanced */}
            {activeSidebarItem === "e-learning" && (
              <div className="space-y-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    E-Learning Resources
                  </h2>
                  <p className="text-gray-600">
                    Watch educational videos and track your learning progress
                  </p>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search videos by title, description, or category..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                      Search
                    </button>
                  </div>

                  {/* Video Player */}
                  {selectedVideo && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Now Playing:{" "}
                        {mockVideos.find((v) => v.id === selectedVideo)?.title}
                      </h3>
                      <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                            mockVideos.find((v) => v.id === selectedVideo)
                              ?.youtubeUrl || ""
                          )}?autoplay=1`}
                          className="w-full h-64 md:h-96"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => setSelectedVideo(null)}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Close Player
                        </button>
                        <button
                          onClick={() =>
                            updateVideoProgress(selectedVideo, 100)
                          }
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Mark as Completed
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Video Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVideos.map((video) => (
                      <div
                        key={video.id}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div
                          className="aspect-w-16 aspect-h-9 bg-gray-200 cursor-pointer"
                          onClick={() => setSelectedVideo(video.id)}
                        >
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                              <svg
                                className="w-8 h-8 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {video.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {video.description}
                          </p>
                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>{video.duration}</span>
                            <span>{video.views} views</span>
                          </div>
                          <div className="mt-3">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{videoProgress[video.id] || 0}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                                style={{
                                  width: `${videoProgress[video.id] || 0}%`,
                                }}
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedVideo(video.id)}
                            className="w-full mt-3 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Watch Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Access Videos */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Continue Watching
                  </h3>
                  <div className="space-y-4">
                    {mockVideos
                      .filter(
                        (video) =>
                          videoProgress[video.id] > 0 &&
                          videoProgress[video.id] < 100
                      )
                      .map((video) => (
                        <div
                          key={video.id}
                          className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-20 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {video.title}
                            </p>
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{videoProgress[video.id]}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-2 bg-green-500 rounded-full transition-all duration-300"
                                style={{ width: `${videoProgress[video.id]}%` }}
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedVideo(video.id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Continue
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Section */}
            {activeSidebarItem === "analytics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col items-center">
                    <p className="text-gray-500">Total Quizzes</p>
                    <p className="text-2xl font-bold text-gray-900">
                      <CountUp
                        end={mockStudentAnalytics.totalQuizzes}
                        duration={1.5}
                      />
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-xl p-6 flex flex-col items-center">
                    <p className="text-gray-500">Average Score</p>
                    <p className="text-2xl font-bold text-gray-900">
                      <CountUp
                        end={mockStudentAnalytics.averageScore}
                        duration={1.5}
                      />
                      %
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
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Recent Activity
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    {mockStudentAnalytics.recentActivity.map((act) => (
                      <div
                        key={act.id}
                        className="p-3 rounded-lg border border-gray-200 flex justify-between items-center"
                      >
                        <span>{act.title}</span>
                        {act.score && (
                          <span className="font-bold">{act.score}%</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Section - Enhanced with Toggle Buttons */}
            {activeSidebarItem === "settings" && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Settings
                  </h2>
                  <p className="text-gray-600">
                    Customize your learning experience
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Notification Settings */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Notifications
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">
                            Push Notifications
                          </p>
                          <p className="text-sm text-gray-600">
                            Receive alerts for new quizzes
                          </p>
                        </div>
                        <button
                          onClick={() => toggleSetting("notifications")}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.notifications
                              ? "bg-blue-500"
                              : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.notifications
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">
                            Email Updates
                          </p>
                          <p className="text-sm text-gray-600">
                            Get weekly progress reports
                          </p>
                        </div>
                        <button
                          onClick={() => toggleSetting("emailUpdates")}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.emailUpdates
                              ? "bg-blue-500"
                              : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.emailUpdates
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Appearance Settings */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Appearance
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">Dark Mode</p>
                          <p className="text-sm text-gray-600">
                            Switch to dark theme
                          </p>
                        </div>
                        <button
                          onClick={() => toggleSetting("darkMode")}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.darkMode ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.darkMode
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Video Settings */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Video & Audio
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">
                            Auto-play Videos
                          </p>
                          <p className="text-sm text-gray-600">
                            Videos play automatically when opened
                          </p>
                        </div>
                        <button
                          onClick={() => toggleSetting("autoPlay")}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.autoPlay ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.autoPlay
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">
                            Sound Effects
                          </p>
                          <p className="text-sm text-gray-600">
                            Play sounds for interactions
                          </p>
                        </div>
                        <button
                          onClick={() => toggleSetting("soundEffects")}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.soundEffects
                              ? "bg-blue-500"
                              : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.soundEffects
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Download Settings */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Download Quality
                    </h3>
                    <div className="space-y-4">
                      <select
                        value={settings.downloadQuality}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            downloadQuality: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      >
                        <option value="low">Low Quality (Save Data)</option>
                        <option value="medium">Medium Quality</option>
                        <option value="high">High Quality</option>
                      </select>
                      <p className="text-sm text-gray-600">
                        Choose the quality for downloaded materials
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center pt-6">
                  <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
                    Save Changes
                  </button>
                  <button className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors">
                    Reset to Default
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
