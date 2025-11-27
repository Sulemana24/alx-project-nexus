"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  orderBy,
  limit,
} from "firebase/firestore";
import { Delete, Trash, Trash2, TrashIcon } from "lucide-react";

// -----------------------
// Types
// -----------------------
interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  type: string;
}

interface Quiz {
  id?: string;
  title: string;
  duration: number;
  questions: Question[];
  startDate: string;
  startTime: string;
  questionsCount: number;
  instructions?: string;
  pin: number;
  description?: string;
}

interface StudentQuiz {
  id: string;
  quizId: number;
  quizTitle: string;
  startDate: string;
  startTime: string;
  duration: number;
  studentName: string;
  indexNumber: string;
  status: string;
  addedAt: Date | { toDate: () => Date } | null;
  questionsCount?: number;
  description?: string;
}
interface SummaryData {
  quizTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpent: number;
  questions: Question[];
  answers: Record<number, number>;
}

const getQuizStatusForNow = (quiz: Quiz | StudentQuiz) => {
  const start = new Date(`${quiz.startDate}T${quiz.startTime}:00`);
  const end = new Date(start.getTime() + (quiz.duration || 0) * 60 * 1000);
  const now = new Date();
  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "ongoing";
  return "finished";
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "ongoing":
      return (
        <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full border border-green-200">
          Ongoing
        </span>
      );
    case "upcoming":
      return (
        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full border border-yellow-200">
          Upcoming
        </span>
      );
    case "finished":
      return (
        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full border border-gray-200">
          Finished
        </span>
      );
    default:
      return (
        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full border border-gray-200">
          Unknown
        </span>
      );
  }
};

// ------------------------------------------------------
//  SUMMARY COMPONENT
// ------------------------------------------------------
interface SummaryUIProps {
  summaryData: SummaryData | null;
  setShowSummary: (show: boolean) => void;
  setCurrentQuiz: (quiz: Quiz | null) => void;
  setSummaryData: (data: SummaryData | null) => void;
  setAnswers: (answers: Record<number, number>) => void;
  setQuizStatus: (status: "expired" | "future" | "present" | null) => void;
}

const SummaryUI = ({
  summaryData,
  setShowSummary,
  setCurrentQuiz,
  setSummaryData,
  setAnswers,
  setQuizStatus,
}: SummaryUIProps) => {
  if (!summaryData) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-2xl mx-auto shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        {summaryData.quizTitle}
      </h2>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
        <p className="text-lg font-semibold text-gray-900">
          Score: {summaryData.score}/{summaryData.totalQuestions} (
          {summaryData.percentage}%)
        </p>

        <p className="text-gray-600 mt-2">
          Time Spent: {Math.floor(summaryData.timeSpent / 60)} mins{" "}
          {summaryData.timeSpent % 60}s
        </p>
      </div>

      <h3 className="text-xl font-bold mt-6 mb-4 text-gray-900">
        Question Breakdown
      </h3>

      <div className="space-y-4">
        {summaryData.questions.map((q: Question, idx: number) => {
          const userAnswer = summaryData.answers[idx];
          const isCorrect = userAnswer === q.correctAnswer;

          return (
            <div
              key={idx}
              className={`border rounded-xl p-4 ${
                isCorrect
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <p className="font-semibold text-gray-900 mb-3">{q.question}</p>

              <div className="space-y-2">
                <p className="text-sm">
                  Your Answer:{" "}
                  <span
                    className={
                      isCorrect
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium"
                    }
                  >
                    {q.options[userAnswer] ?? "No answer"}
                  </span>
                </p>

                {!isCorrect && (
                  <p className="text-sm">
                    Correct Answer:{" "}
                    <span className="text-green-600 font-medium">
                      {q.options[q.correctAnswer]}
                    </span>
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Button
        className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-200"
        onClick={() => {
          setShowSummary(false);
          setCurrentQuiz(null);
          setSummaryData(null);
          setAnswers({});
          setQuizStatus(null);
        }}
      >
        Return to Dashboard
      </Button>
    </div>
  );
};

// ------------------------------------------------------
//  RECENT QUIZZES COMPONENT
// ------------------------------------------------------
const RecentQuizzes = ({
  recentQuizzes,
  studentName,
  indexNumber,
  onStartQuiz,
  onDeleteQuiz,
}: {
  recentQuizzes: StudentQuiz[];
  studentName: string;
  indexNumber: string;
  onStartQuiz: (quiz: StudentQuiz) => void;
  onDeleteQuiz: (quizId: string) => void;
}) => {
  if (recentQuizzes.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-4xl mx-auto shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Quizzes</h2>
        <span className="bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-full">
          {recentQuizzes.length} quiz{recentQuizzes.length !== 1 ? "zes" : ""}
        </span>
      </div>

      <div className="space-y-6">
        {recentQuizzes.map((quiz) => {
          const status = getQuizStatusForNow(quiz);
          const canStart = status === "ongoing" && studentName && indexNumber;

          return (
            <div
              key={quiz.id}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 relative bg-gradient-to-r from-gray-50 to-white group"
            >
              {/* Delete Button */}
              <button
                onClick={() => onDeleteQuiz(quiz.id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50"
                title="Remove from dashboard"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>

              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-900 mb-2">
                    {quiz.quizTitle}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Added by: {quiz.studentName} ({quiz.indexNumber})
                  </p>
                </div>
                {getStatusBadge(status)}
              </div>

              {quiz.description && (
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {quiz.description}
                </p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <span className="font-semibold text-gray-900 block">
                    Date
                  </span>
                  <p className="text-gray-600 mt-1">{quiz.startDate}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <span className="font-semibold text-gray-900 block">
                    Time
                  </span>
                  <p className="text-gray-600 mt-1">{quiz.startTime}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <span className="font-semibold text-gray-900 block">
                    Duration
                  </span>
                  <p className="text-gray-600 mt-1">{quiz.duration} mins</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <span className="font-semibold text-gray-900 block">
                    Questions
                  </span>
                  <p className="text-gray-600 mt-1">
                    {quiz.questionsCount || "N/A"}
                  </p>
                </div>
              </div>

              {canStart && (
                <Button
                  onClick={() => onStartQuiz(quiz)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-sm"
                >
                  Start Quiz Now
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ------------------------------------------------------
//   MAIN COMPONENT
// ------------------------------------------------------
const MyQuizzes = () => {
  const [quizCode, setQuizCode] = useState("");
  const [studentName, setStudentName] = useState("");
  const [indexNumber, setIndexNumber] = useState("");

  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [quizStatus, setQuizStatus] = useState<
    "expired" | "future" | "present" | null
  >(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);

  // NEW STATE FOR RECENT QUIZZES
  const [recentQuizzes, setRecentQuizzes] = useState<StudentQuiz[]>([]);
  const [dashboardQuizzes, setDashboardQuizzes] = useState<StudentQuiz[]>([]);
  const [newlyAddedQuiz, setNewlyAddedQuiz] = useState<StudentQuiz | null>(
    null
  );

  // -----------------------------
  // FETCH RECENT QUIZZES (OPTIMIZED)
  // -----------------------------
  useEffect(() => {
    if (!indexNumber) return;

    const fetchRecentQuizzes = async () => {
      try {
        // First, get all quizzes for this student
        const q = query(
          collection(db, "studentQuizzes"),
          where("indexNumber", "==", indexNumber)
        );

        const snapshot = await getDocs(q);
        const allQuizzes = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as StudentQuiz)
        );

        // Sort and limit manually in memory
        const sortedQuizzes = allQuizzes
          .sort((a, b) => {
            const dateA =
              (a.addedAt as { toDate?: () => Date })?.toDate?.() || new Date(0);
            const dateB =
              (b.addedAt as { toDate?: () => Date })?.toDate?.() || new Date(0);
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, 5);

        setRecentQuizzes(sortedQuizzes);
        setDashboardQuizzes(allQuizzes);
      } catch (error) {
        console.error("Error fetching recent quizzes:", error);
        // Fallback: Use client-side filtering only
        const q = query(collection(db, "studentQuizzes"));
        const snapshot = await getDocs(q);
        const allQuizzes = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as StudentQuiz))
          .filter((quiz) => quiz.indexNumber === indexNumber)
          .sort((a, b) => {
            const dateA =
              (a.addedAt as { toDate?: () => Date })?.toDate?.() || new Date(0);
            const dateB =
              (b.addedAt as { toDate?: () => Date })?.toDate?.() || new Date(0);
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, 5);

        setRecentQuizzes(allQuizzes);
        setDashboardQuizzes(allQuizzes);
      }
    };

    fetchRecentQuizzes();
  }, [indexNumber]);

  // -----------------------------
  // CHECK IF QUIZ EXISTS IN DASHBOARD
  // -----------------------------
  const isQuizInDashboard = (quizPin: number) => {
    return dashboardQuizzes.some((quiz) => quiz.quizId === quizPin);
  };

  // -----------------------------
  // DELETE QUIZ FROM DASHBOARD
  // -----------------------------
  const handleDeleteQuiz = async (quizId: string) => {
    if (
      window.confirm(
        "Are you sure you want to remove this quiz from your dashboard?"
      )
    ) {
      try {
        await deleteDoc(doc(db, "studentQuizzes", quizId));
        // Update local state
        setRecentQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
        setDashboardQuizzes((prev) =>
          prev.filter((quiz) => quiz.id !== quizId)
        );
        if (newlyAddedQuiz?.id === quizId) {
          setNewlyAddedQuiz(null);
        }
      } catch (error) {
        console.error("Error deleting quiz:", error);
        alert("Failed to remove quiz from dashboard");
      }
    }
  };

  // -----------------------------
  // START QUIZ FROM RECENT LIST
  // -----------------------------
  const handleStartRecentQuiz = async (quiz: StudentQuiz) => {
    // Fetch the full quiz data using the PIN
    const q = query(collection(db, "quizzes"), where("pin", "==", quiz.quizId));

    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      alert("Quiz data not found!");
      return;
    }

    const quizData = snapshot.docs[0].data() as Quiz;
    setCurrentQuiz(quizData);
    setQuizStatus("present");

    // Start the quiz immediately
    startQuizWithData(quizData);
  };

  // -----------------------------
  // SUBMIT QUIZ
  // -----------------------------
  const handleSubmitQuiz = async () => {
    if (!currentQuiz) return;

    const totalQuestions = currentQuiz.questions.length;
    const score = currentQuiz.questions.reduce((total, q, i) => {
      return answers[i] === q.correctAnswer ? total + 1 : total;
    }, 0);

    const percentage = Math.round((score / totalQuestions) * 100);
    const timeSpent = currentQuiz.duration * 60 - timeLeft;

    setSummaryData({
      quizTitle: currentQuiz.title,
      score,
      totalQuestions,
      percentage,
      timeSpent,
      questions: currentQuiz.questions,
      answers,
    });

    setShowSummary(true);

    const attemptDocId = `${currentQuiz.pin}_${
      indexNumber || "noindex"
    }_${Date.now()}`;

    await setDoc(doc(db, "quizAttempts", attemptDocId), {
      quizId: currentQuiz.pin,
      quizTitle: currentQuiz.title,
      studentName,
      indexNumber,
      answers,
      score,
      totalQuestions,
      percentage,
      timeSpent,
      status: "finished",
      submittedAt: new Date(),
    });

    const studentQuizDocId = `${currentQuiz.pin}_${indexNumber}`;
    await setDoc(doc(db, "studentQuizzes", studentQuizDocId), {
      quizId: currentQuiz.pin,
      quizTitle: currentQuiz.title,
      studentName,
      indexNumber,
      status: "finished",
      submittedAt: new Date(),
    });

    setQuizStarted(false);
    setTimeLeft(0);
    setCurrentQuestionIndex(0);
  };

  // -----------------------------
  // FETCH QUIZ
  // -----------------------------
  const handleFetchQuiz = async () => {
    if (!quizCode) {
      alert("Please enter a quiz PIN");
      return;
    }

    // Check if quiz already exists in dashboard
    if (isQuizInDashboard(Number(quizCode))) {
      alert("This quiz is already in your dashboard!");
      return;
    }

    const q = query(
      collection(db, "quizzes"),
      where("pin", "==", Number(quizCode))
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      alert("Quiz not found!");
      return;
    }

    const quizData = snapshot.docs[0].data() as Quiz;

    const now = new Date();
    const quizDateTime = new Date(
      `${quizData.startDate}T${quizData.startTime}:00`
    );

    if (quizDateTime < now) setQuizStatus("expired");
    else if (quizDateTime > now) setQuizStatus("future");
    else setQuizStatus("present");

    setCurrentQuiz(quizData);
  };

  // -----------------------------
  // ADD TO DASHBOARD
  // -----------------------------
  const handleAddToDashboard = async () => {
    if (!currentQuiz) return;
    if (!indexNumber) {
      alert("Please enter your index number before adding to dashboard.");
      return;
    }

    // Prevent adding if already exists
    if (isQuizInDashboard(currentQuiz.pin)) {
      alert("This quiz is already in your dashboard!");
      return;
    }

    const computedStatus = getQuizStatusForNow(currentQuiz);

    const studentQuizDocId = `${currentQuiz.pin}_${indexNumber}`;

    const newQuiz: StudentQuiz = {
      id: studentQuizDocId,
      quizId: currentQuiz.pin,
      quizTitle: currentQuiz.title,
      startDate: currentQuiz.startDate,
      startTime: currentQuiz.startTime,
      duration: currentQuiz.duration,
      questionsCount: currentQuiz.questionsCount,
      description: currentQuiz.instructions,
      studentName,
      indexNumber,
      status: computedStatus,
      addedAt: new Date(),
    };

    await setDoc(doc(db, "studentQuizzes", studentQuizDocId), newQuiz);

    // Set the newly added quiz to display below join section
    setNewlyAddedQuiz(newQuiz);

    // Also update the recent quizzes list
    setRecentQuizzes((prev) => [newQuiz, ...prev.slice(0, 4)]);
    setDashboardQuizzes((prev) => [...prev, newQuiz]);

    alert("Quiz added to dashboard!");
  };

  // -----------------------------
  // START QUIZ (UPDATED)
  // -----------------------------
  const startQuizWithData = (quizData: Quiz) => {
    if (!studentName || !indexNumber) {
      alert("Enter your full name and index number.");
      return;
    }

    const shuffled = [...quizData.questions].sort(() => Math.random() - 0.5);

    setCurrentQuiz({ ...quizData, questions: shuffled });
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeLeft(quizData.duration * 60);
    setQuizStarted(true);

    const studentQuizDocId = `${quizData.pin}_${indexNumber}`;
    const statusNow = getQuizStatusForNow(quizData);

    setDoc(doc(db, "studentQuizzes", studentQuizDocId), {
      quizId: quizData.pin,
      quizTitle: quizData.title,
      startDate: quizData.startDate,
      startTime: quizData.startTime,
      duration: quizData.duration,
      studentName,
      indexNumber,
      status: statusNow,
      updatedAt: new Date(),
    });
  };

  const startQuiz = () => {
    if (!currentQuiz) return;
    startQuizWithData(currentQuiz);
  };

  // -----------------------------
  // LEAVE WARNING
  // -----------------------------
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (quizStarted) {
        e.preventDefault();
        e.returnValue = "Quiz will be submitted if you leave!";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [quizStarted]);

  // -----------------------------
  // TIMER
  // -----------------------------
  useEffect(() => {
    if (!quizStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, timeLeft]);

  // -----------------------------
  // ANSWERS & NAVIGATION
  // -----------------------------
  const handleAnswerSelect = (optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: optionIndex }));
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // ------------------------------------------------------
  // UI WITH JOIN QUIZ FIRST, THEN MY QUIZZES
  // ------------------------------------------------------
  return (
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8">
      {showSummary && (
        <SummaryUI
          summaryData={summaryData}
          setShowSummary={setShowSummary}
          setCurrentQuiz={setCurrentQuiz}
          setSummaryData={setSummaryData}
          setAnswers={setAnswers}
          setQuizStatus={setQuizStatus}
        />
      )}

      {!quizStarted && !showSummary && (
        <div className="space-y-8 max-w-6xl mx-auto">
          {/* Join Quiz Section */}
          <div className=" p-8  max-w-md mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Join a Quiz
              </h2>
              <p className="text-gray-600">
                Enter your details and quiz PIN to get started
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Quiz PIN
                </label>
                <input
                  type="text"
                  placeholder="Enter Quiz PIN"
                  value={quizCode}
                  onChange={(e) => setQuizCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Index Number
                </label>
                <input
                  type="text"
                  placeholder="Enter your index number"
                  value={indexNumber}
                  onChange={(e) => setIndexNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                />
              </div>

              <Button
                onClick={handleFetchQuiz}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-sm"
              >
                Fetch Quiz
              </Button>
            </div>

            {currentQuiz && (
              <div className="mt-6 p-6 border border-gray-200 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-gray-900">
                    {currentQuiz.title}
                  </h3>
                  {getStatusBadge(getQuizStatusForNow(currentQuiz))}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {currentQuiz.instructions || "No instructions provided"}
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white rounded-lg p-3">
                    <span className="font-semibold text-gray-900 block">
                      Date
                    </span>
                    <p className="text-gray-600">{currentQuiz.startDate}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <span className="font-semibold text-gray-900 block">
                      Time
                    </span>
                    <p className="text-gray-600">{currentQuiz.startTime}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <span className="font-semibold text-gray-900 block">
                      Duration
                    </span>
                    <p className="text-gray-600">{currentQuiz.duration} mins</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <span className="font-semibold text-gray-900 block">
                      Questions
                    </span>
                    <p className="text-gray-600">
                      {currentQuiz.questionsCount}
                    </p>
                  </div>
                </div>

                {quizStatus === "expired" && (
                  <p className="text-red-500 mt-4 text-center font-medium">
                    This quiz has expired
                  </p>
                )}

                {quizStatus === "future" &&
                  !isQuizInDashboard(currentQuiz.pin) && (
                    <Button
                      onClick={handleAddToDashboard}
                      className="mt-4 w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-200"
                    >
                      Add to Dashboard
                    </Button>
                  )}

                {quizStatus === "future" &&
                  isQuizInDashboard(currentQuiz.pin) && (
                    <p className="text-green-500 mt-4 text-center font-medium">
                      ✓ Already in Dashboard
                    </p>
                  )}

                {quizStatus === "present" && (
                  <Button
                    onClick={startQuiz}
                    className="mt-4 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all duration-200"
                  >
                    Start Quiz Now
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Newly Added Quiz Section */}
          {newlyAddedQuiz && (
            <div className="bg-white border rounded-2xl p-8 max-w-4xl mx-auto shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Quizzes</h2>
              </div>
              <div className="p-6 ">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-900 mb-2">
                      {newlyAddedQuiz.quizTitle}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Added by: {newlyAddedQuiz.studentName} (
                      {newlyAddedQuiz.indexNumber})
                    </p>
                  </div>
                  {getStatusBadge(newlyAddedQuiz.status)}
                </div>

                {newlyAddedQuiz.description && (
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {newlyAddedQuiz.description}
                  </p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div className="bg-white rounded-lg p-3 border border-green-100">
                    <span className="font-semibold text-gray-900 block">
                      Date
                    </span>
                    <p className="text-gray-600 mt-1">
                      {newlyAddedQuiz.startDate}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-100">
                    <span className="font-semibold text-gray-900 block">
                      Time
                    </span>
                    <p className="text-gray-600 mt-1">
                      {newlyAddedQuiz.startTime}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-100">
                    <span className="font-semibold text-gray-900 block">
                      Duration
                    </span>
                    <p className="text-gray-600 mt-1">
                      {newlyAddedQuiz.duration} mins
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-100 flex mr-2 justify-between items-center">
                    <div>
                      <span className="font-semibold text-gray-900 block">
                        Questions
                      </span>
                      <p className="text-gray-600 mt-1">
                        {newlyAddedQuiz.questionsCount || "N/A"}
                      </p>
                    </div>
                    <p className="text-red-600">
                      <Trash2 />
                    </p>
                  </div>
                </div>

                {getQuizStatusForNow(newlyAddedQuiz) === "ongoing" && (
                  <Button
                    onClick={() => handleStartRecentQuiz(newlyAddedQuiz)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-sm"
                  >
                    Start Quiz Now
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {quizStarted && !showSummary && currentQuiz && (
        <div className="bg-white rounded-2xl p-8 max-w-4xl mx-auto shadow-lg border border-gray-200 relative">
          <button
            className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50"
            onClick={() => {
              if (
                window.confirm("Quiz will be submitted if you close. Continue?")
              ) {
                handleSubmitQuiz();
              }
            }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentQuiz.title}
            </h2>
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-medium">
                Question {currentQuestionIndex + 1} of{" "}
                {currentQuiz.questions.length}
              </p>
              <div
                className={`px-4 py-2 rounded-full font-semibold ${
                  timeLeft < 300
                    ? "bg-red-100 text-red-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                Time: {Math.floor(timeLeft / 60)}:
                {seconds.toString().padStart(2, "0")}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 mb-8 border border-gray-200">
            <h4 className="text-xl font-semibold mb-6 text-gray-900 leading-relaxed">
              {currentQuiz.questions[currentQuestionIndex].question}
            </h4>

            <div className="space-y-4">
              {currentQuiz.questions[currentQuestionIndex].options.map(
                (opt, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center space-x-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      answers[currentQuestionIndex] === idx
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-25"
                    }`}
                  >
                    <input
                      type="radio"
                      checked={answers[currentQuestionIndex] === idx}
                      onChange={() => handleAnswerSelect(idx)}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-900 font-medium flex-1">
                      {opt}
                    </span>
                  </label>
                )
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button
              onClick={() =>
                currentQuestionIndex > 0 &&
                setCurrentQuestionIndex(currentQuestionIndex - 1)
              }
              disabled={currentQuestionIndex === 0}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </Button>

            {currentQuestionIndex === currentQuiz.questions.length - 1 ? (
              <Button
                onClick={handleSubmitQuiz}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-sm"
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                onClick={() =>
                  setCurrentQuestionIndex(currentQuestionIndex + 1)
                }
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-sm"
              >
                Next Question
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyQuizzes;
