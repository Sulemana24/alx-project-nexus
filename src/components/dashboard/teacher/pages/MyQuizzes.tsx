"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  orderBy,
  query,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import {
  Plus,
  FileText,
  Upload,
  Zap,
  Clock,
  Calendar,
  Copy,
  CheckCircle,
  Edit3,
  Trash2,
  Share2,
  Users,
  Eye,
  MoreVertical,
} from "lucide-react";

// Helper to generate 6-digit PIN
const generatePin = () => Math.floor(100000 + Math.random() * 900000);

export type QuestionForm = {
  question: string;
  options: string[];
  correctAnswer: string | number | null;
  type: "multiple-choice" | "true-false" | "fill-in" | "open-ended";
};

export interface QuizSettings {
  addToMarketplace: boolean;
  preventCopying: boolean;
  allowMultipleResponses: boolean;
}

export interface RecentQuiz {
  id: string;
  title: string;
  questionsCount: number;
  duration: number;
  date: string;
  time: string;
  status: "upcoming" | "ongoing" | "finished";
  pin: number | null;
  questions?: QuestionForm[];
  instructions?: string;
  settings?: QuizSettings;
}

export interface FullQuiz {
  id: string;
  title: string;
  duration: number;
  startDate: string;
  startTime: string;
  instructions: string;
  settings: {
    addToMarketplace: boolean;
    preventCopying: boolean;
    allowMultipleResponses: boolean;
  };
  questions: QuestionForm[];
  questionsCount: number;
  pin: number | null;
}

export const MyQuizzesPage: React.FC = () => {
  const [viewingQuiz, setViewingQuiz] = useState<RecentQuiz | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<RecentQuiz | null>(null);
  const [newPin, setNewPin] = useState<number | null>(null);

  const [recentQuizzes, setRecentQuizzes] = useState<RecentQuiz[]>([]);
  const [showNewQuiz, setShowNewQuiz] = useState(false);
  const [quizTab, setQuizTab] = useState<"manual" | "pdf" | "ai">("manual");
  const [questions, setQuestions] = useState<QuestionForm[]>([]);
  const [duration, setDuration] = useState(20);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [quizPin, setQuizPin] = useState<number | null>(null);
  const [copiedPin, setCopiedPin] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<string | null>(null);
  const [addToMarketplace, setAddToMarketplace] = useState(false);
  const [preventCopying, setPreventCopying] = useState(true);
  const [allowMultipleResponses, setAllowMultipleResponses] = useState(false);
  const [quizInstructions, setQuizInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const q = query(
          collection(db, "quizzes"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);

        const quizzes = snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            title: data.title,
            duration: data.duration,
            date: data.startDate,
            time: data.startTime,
            status: determineStatus(data.startDate, data.startTime),
            questionsCount: data.questionsCount || data.questions?.length || 0,
            pin: data.pin,
          };
        });

        setRecentQuizzes(quizzes);
      } catch (error) {
        console.error("Failed to load quizzes:", error);
      }
    };

    loadQuizzes();
  }, []);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question: "",
        options: ["", ""],
        correctAnswer: null,
        type: "multiple-choice",
      },
    ]);
  };

  const updateQuestion = (index: number, field: Partial<QuestionForm>) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, ...field } : q))
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "finished":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Upcoming";
      case "ongoing":
        return "Ongoing";
      case "finished":
        return "Finished";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const determineStatus = (
    date: string,
    time: string
  ): "upcoming" | "ongoing" | "finished" => {
    const now = new Date();
    const quizDateTime = new Date(`${date}T${time}`);

    if (quizDateTime > now) return "upcoming";
    if (quizDateTime < now) return "finished";
    return "ongoing";
  };

  const saveQuizToFirebase = async (pin: number) => {
    try {
      const settings = {
        addToMarketplace,
        preventCopying,
        allowMultipleResponses,
      };

      const quizData = {
        title: quizTitle,
        duration,
        startDate,
        startTime,
        instructions: quizInstructions,
        settings,
        questions: questions.map((q) => ({
          question: q.question,
          type: q.type,
          options: q.options,
          correctAnswer: q.correctAnswer,
        })),
        questionsCount: questions.length,
        pin,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "quizzes"), quizData);

      console.log("Quiz saved to Firestore with ID:", docRef.id);

      return docRef.id;
    } catch (error) {
      console.error("Error saving quiz:", error);
    }
  };

  const submitQuiz = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Generate a new PIN
      const pin = generatePin();
      setQuizPin(pin);

      // Save quiz to Firestore
      const savedId = await saveQuizToFirebase(pin);

      if (!savedId) throw new Error("Failed to save quiz");

      // Add the quiz to recentQuizzes state
      setRecentQuizzes((prev) => [
        {
          id: savedId,
          title: quizTitle,
          questionsCount: questions.length,
          duration,
          date: startDate,
          time: startTime,
          status: determineStatus(startDate, startTime),
          pin,
        },
        ...prev,
      ]);

      // Show summary page
      setShowSummary(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPinToClipboard = () => {
    if (quizPin) {
      navigator.clipboard.writeText(quizPin.toString());
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2000);
    }
  };

  const deleteRecentQuiz = (id: string) => {
    setRecentQuizzes((prev) => prev.filter((quiz) => quiz.id !== id));
  };

  const fetchQuizById = async (quizId: string): Promise<FullQuiz> => {
    const docRef = doc(db, "quizzes", quizId);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) throw new Error("Quiz not found");

    const data = snapshot.data();

    return {
      id: snapshot.id,
      title: data.title as string,
      duration: data.duration as number,
      startDate: data.startDate as string,
      startTime: data.startTime as string,
      instructions: data.instructions as string,
      settings: data.settings as {
        addToMarketplace: boolean;
        preventCopying: boolean;
        allowMultipleResponses: boolean;
      },
      questions: data.questions as QuestionForm[],
      questionsCount: data.questionsCount as number,
      pin: data.pin as number | null,
    };
  };

  const generateNewPin = async (quizId: string) => {
    const newPin = Math.floor(100000 + Math.random() * 900000);
    const quizRef = doc(db, "quizzes", quizId);
    await updateDoc(quizRef, { pin: newPin, updatedAt: serverTimestamp() });
    return newPin;
  };

  const handleSaveQuiz = async () => {
    if (!editingQuiz) return;

    const quizRef = doc(db, "quizzes", editingQuiz.id);
    await updateDoc(quizRef, {
      title: editingQuiz.title,
      instructions: editingQuiz.instructions,
      duration: editingQuiz.duration,
      startDate: editingQuiz.date,
      startTime: editingQuiz.time,
      questions: editingQuiz.questions,
      settings: editingQuiz.settings,
      updatedAt: serverTimestamp(),
    });

    setRecentQuizzes((prev) =>
      prev.map((q) => (q.id === editingQuiz.id ? editingQuiz : q))
    );
    setEditingQuiz(null);

    // Optional: preview saved quiz
    setViewingQuiz(editingQuiz);

    // Generate new PIN
    const pin = await generateNewPin(editingQuiz.id);
    setNewPin(pin);
  };

  if (showNewQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-3 sm:p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <button
              onClick={() => setShowNewQuiz(false)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-3 sm:mb-4 transition-colors text-sm sm:text-base"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-200 rounded-full flex items-center justify-center">
                ←
              </div>
              <span>Back to My Quizzes</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Create New Quiz
            </h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
              Build engaging quizzes for your students
            </p>
          </div>

          {!showSummary ? (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Quiz Title Input */}
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Title
                </label>
                <input
                  type="text"
                  placeholder="Enter quiz title..."
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                />

                {/* Quiz Instructions Field */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quiz Instructions{" "}
                    <span className="text-gray-400 text-xs font-normal">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    placeholder="Add instructions for students (e.g., time limits, allowed resources, special guidelines)..."
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-500 resize-none"
                    rows={3}
                    value={quizInstructions}
                    onChange={(e) => setQuizInstructions(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    These instructions will be shown to students before they
                    start the quiz
                  </p>
                </div>
              </div>

              {/* Tab Selector */}
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto space-x-1 p-3 sm:p-4 scrollbar-hide">
                  {[
                    {
                      id: "manual" as const,
                      label: "Manual Entry",
                      icon: Edit3,
                    },
                    { id: "pdf" as const, label: "PDF Upload", icon: Upload },
                    { id: "ai" as const, label: "AI Generate", icon: Zap },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      className={`flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                        quizTab === tab.id
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      onClick={() => setQuizTab(tab.id)}
                    >
                      <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <div className="p-4 sm:p-6">
                {quizTab === "manual" && (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                          Manual Quiz Builder
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Total Questions: {questions.length}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                      {questions.map((q, idx) => (
                        <div
                          key={idx}
                          className="border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-5 bg-white hover:border-blue-300 transition-colors"
                        >
                          {/* Question Header */}
                          <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                              Question {idx + 1}
                            </h4>
                            {questions.length > 1 && (
                              <button
                                onClick={() => {
                                  setQuestions(
                                    questions.filter((_, i) => i !== idx)
                                  );
                                }}
                                className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          {/* Question Input and Type Selection */}
                          <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Question Text
                              </label>
                              <input
                                type="text"
                                placeholder="Enter your question here..."
                                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                value={q.question}
                                onChange={(e) =>
                                  updateQuestion(idx, {
                                    question: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Answer Type
                              </label>
                              <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-sm sm:text-base"
                                value={q.type}
                                onChange={(e) =>
                                  updateQuestion(idx, {
                                    type: e.target.value as
                                      | "multiple-choice"
                                      | "true-false"
                                      | "fill-in"
                                      | "open-ended",
                                    options:
                                      e.target.value === "multiple-choice"
                                        ? ["", ""]
                                        : e.target.value === "true-false"
                                        ? ["True", "False"]
                                        : [],
                                    correctAnswer: null,
                                  })
                                }
                              >
                                <option value="multiple-choice">
                                  Multiple Choice
                                </option>
                                <option value="true-false">True/False</option>
                                <option value="fill-in">Fill-in Blank</option>
                                <option value="open-ended">Essay</option>
                              </select>
                            </div>
                          </div>

                          {/* Answer Options Based on Type */}
                          {q.type === "multiple-choice" && (
                            <div className="space-y-3">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Options (Select the correct answer)
                              </label>
                              {q.options.map((opt, i) => (
                                <div
                                  key={i}
                                  className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                                    <input
                                      type="radio"
                                      name={`correct-${idx}`}
                                      checked={q.correctAnswer === i}
                                      onChange={() =>
                                        updateQuestion(idx, {
                                          correctAnswer: i,
                                        })
                                      }
                                      className="text-blue-600 focus:ring-blue-500 flex-shrink-0"
                                    />
                                    <input
                                      type="text"
                                      placeholder={`Option ${i + 1}`}
                                      className="flex-1 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-400 focus:outline-none shadow-sm min-w-0 text-sm sm:text-base"
                                      value={opt}
                                      onChange={(e) =>
                                        updateQuestion(idx, {
                                          options: q.options.map((o, j) =>
                                            i === j ? e.target.value : o
                                          ),
                                        })
                                      }
                                    />
                                  </div>
                                  {q.options.length > 2 && (
                                    <button
                                      onClick={() => {
                                        const newOptions = q.options.filter(
                                          (_, j) => j !== i
                                        );
                                        updateQuestion(idx, {
                                          options: newOptions,
                                          correctAnswer:
                                            q.correctAnswer === i
                                              ? null
                                              : typeof q.correctAnswer ===
                                                  "number" &&
                                                q.correctAnswer > i
                                              ? q.correctAnswer - 1
                                              : q.correctAnswer,
                                        });
                                      }}
                                      className="text-red-500 hover:text-red-700 p-1 rounded transition-colors flex-shrink-0"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              ))}
                              <button
                                onClick={() => {
                                  updateQuestion(idx, {
                                    options: [...q.options, ""],
                                  });
                                }}
                                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors text-sm sm:text-base"
                              >
                                <Plus className="w-4 h-4" />
                                <span>Add Another Option</span>
                              </button>
                            </div>
                          )}

                          {q.type === "true-false" && (
                            <div className="space-y-3">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select the correct answer
                              </label>
                              {q.options.map((opt, i) => (
                                <div
                                  key={i}
                                  className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                  onClick={() =>
                                    updateQuestion(idx, { correctAnswer: i })
                                  }
                                >
                                  <input
                                    type="radio"
                                    name={`correct-${idx}`}
                                    checked={q.correctAnswer === i}
                                    onChange={() =>
                                      updateQuestion(idx, { correctAnswer: i })
                                    }
                                    className="text-blue-600 focus:ring-blue-500 flex-shrink-0"
                                  />
                                  <span
                                    className={`font-medium text-sm sm:text-base ${
                                      q.correctAnswer === i
                                        ? "text-blue-600"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {opt}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {(q.type === "fill-in" ||
                            q.type === "open-ended") && (
                            <div className="space-y-3">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {q.type === "fill-in"
                                  ? "Correct Answer"
                                  : "Model Answer"}
                              </label>
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  placeholder={
                                    q.type === "fill-in"
                                      ? "Enter the exact correct answer..."
                                      : "Enter the model answer for automatic grading..."
                                  }
                                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-sm sm:text-base"
                                  value={(q.correctAnswer as string) || ""}
                                  onChange={(e) =>
                                    updateQuestion(idx, {
                                      correctAnswer: e.target.value,
                                    })
                                  }
                                />
                                <p className="text-xs sm:text-sm text-gray-500">
                                  {q.type === "fill-in"
                                    ? "Students must type this exact answer to get it correct"
                                    : "This will be used for automatic essay grading"}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Question Validation Status */}
                          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                              <span className="text-gray-600">
                                Status:{" "}
                                <span
                                  className={
                                    q.question &&
                                    ((q.type === "multiple-choice" &&
                                      q.correctAnswer !== null) ||
                                      (q.type === "true-false" &&
                                        q.correctAnswer !== null) ||
                                      (q.type === "fill-in" &&
                                        q.correctAnswer) ||
                                      (q.type === "open-ended" &&
                                        q.correctAnswer))
                                      ? "text-green-600 font-medium"
                                      : "text-orange-600 font-medium"
                                  }
                                >
                                  {q.question &&
                                  ((q.type === "multiple-choice" &&
                                    q.correctAnswer !== null) ||
                                    (q.type === "true-false" &&
                                      q.correctAnswer !== null) ||
                                    (q.type === "fill-in" && q.correctAnswer) ||
                                    (q.type === "open-ended" &&
                                      q.correctAnswer))
                                    ? "Complete ✓"
                                    : "Incomplete - needs answer"}
                                </span>
                              </span>
                              <span className="text-gray-500">
                                {idx + 1} of {questions.length}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {questions.length === 0 && (
                      <div className="text-center py-8 sm:py-12">
                        <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                          No questions yet
                        </h3>
                        <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                          Start building your quiz by adding the first question
                        </p>
                        <button
                          onClick={addQuestion}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base"
                        >
                          Add Question
                        </button>
                      </div>
                    )}

                    {/* Add Question Button at Bottom */}
                    {questions.length > 0 && (
                      <div className="flex justify-center mt-6 sm:mt-8">
                        <button
                          onClick={addQuestion}
                          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base"
                        >
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>Add Question</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {quizTab === "pdf" && (
                  <div className="text-center py-8 sm:py-12">
                    <Upload className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                      Upload PDF
                    </h3>
                    <p className="text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
                      Upload a PDF document and we&apos;ll automatically extract
                      questions for your quiz
                    </p>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-md mx-auto hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        id="pdf-upload"
                      />
                      <label htmlFor="pdf-upload" className="cursor-pointer">
                        <div className="bg-blue-50 text-blue-600 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                          <Upload className="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">
                          Choose PDF File
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          or drag and drop here
                        </p>
                      </label>
                    </div>
                  </div>
                )}

                {quizTab === "ai" && (
                  <div className="text-center py-8 sm:py-12">
                    <Zap className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                      AI Quiz Generator
                    </h3>
                    <p className="text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
                      Let AI generate quiz questions automatically from your
                      content
                    </p>
                    <div className="max-w-md mx-auto space-y-3 sm:space-y-4">
                      <input
                        type="file"
                        accept=".pdf,.doc,.txt"
                        className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-black text-sm sm:text-base"
                      />
                      <select className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 text-black text-sm sm:text-base">
                        <option value="multiple-choice">
                          Multiple Choice Questions
                        </option>
                        <option value="true-false">True/False Questions</option>
                        <option value="fill-in">Fill-in-the-Blank</option>
                      </select>
                      <button className="w-full bg-blue-500 text-white py-2 sm:py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 text-sm sm:text-base">
                        Generate with AI
                      </button>
                    </div>
                  </div>
                )}

                {/* Quiz Settings */}
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Quiz Settings
                  </h4>

                  {/* Basic Settings Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <Clock className="w-4 h-4" />
                        <span>Duration(minutes)</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Minutes"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-black text-sm"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <Calendar className="w-4 h-4" />
                        <span>Start Date</span>
                      </label>
                      <input
                        type="date"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-black text-sm"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <Clock className="w-4 h-4" />
                        <span>Start Time</span>
                      </label>
                      <input
                        type="time"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-black text-sm"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Toggle Settings */}
                  <div className="border-t border-gray-200 pt-4 sm:pt-6">
                    <h5 className="text-md font-semibold text-gray-900 mb-3 sm:mb-4">
                      Advanced Settings
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {/* Add to Quiz Marketplace Toggle */}
                      <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <label className="text-sm font-medium text-gray-900 block mb-1">
                            Add to Quiz Marketplace
                          </label>
                          <p className="text-xs text-gray-500">
                            Make this quiz available for other teachers to use
                          </p>
                        </div>
                        <button
                          onClick={() => setAddToMarketplace(!addToMarketplace)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            addToMarketplace ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              addToMarketplace
                                ? "translate-x-5"
                                : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Prevent Copying Toggle */}
                      <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <label className="text-sm font-medium text-gray-900 block mb-1">
                            Prevent Copying
                          </label>
                          <p className="text-xs text-gray-500">
                            Disable copy-paste and right-click during the quiz
                          </p>
                        </div>
                        <button
                          onClick={() => setPreventCopying(!preventCopying)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            preventCopying ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              preventCopying ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Allow Multiple Responses Toggle */}
                      <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <label className="text-sm font-medium text-gray-900 block mb-1">
                            Allow Multiple Responses
                          </label>
                          <p className="text-xs text-gray-500">
                            Let students submit the quiz multiple times
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            setAllowMultipleResponses(!allowMultipleResponses)
                          }
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            allowMultipleResponses
                              ? "bg-blue-600"
                              : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              allowMultipleResponses
                                ? "translate-x-5"
                                : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6 sm:mt-8 flex justify-end">
                  <button
                    onClick={submitQuiz}
                    disabled={questions.length === 0 || isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg text-sm sm:text-base w-full sm:w-auto"
                  >
                    {isSubmitting ? "Creating..." : "Create Quiz"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Summary Page - Made responsive
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-3 sm:mb-4" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Quiz Created Successfully!
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Your quiz is ready to share with students
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Quiz Details
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200">
                      <span className="text-gray-600 text-sm sm:text-base">
                        Duration
                      </span>
                      <span className="font-semibold text-gray-600 text-sm sm:text-base">
                        {duration} minutes
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200">
                      <span className="text-gray-600 text-sm sm:text-base">
                        Start Date & Time
                      </span>
                      <span className="font-semibold text-gray-600 text-sm sm:text-base">
                        {startDate} at {startTime}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200">
                      <span className="text-gray-600 text-sm sm:text-base">
                        Total Questions
                      </span>
                      <span className="font-semibold text-gray-600 text-sm sm:text-base">
                        {questions.length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg sm:rounded-xl p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                    Share with Students
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Access PIN
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          readOnly
                          value={quizPin || ""}
                          className="flex-1 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 font-mono text-base sm:text-lg font-bold text-center bg-white text-gray-600 text-sm sm:text-base"
                        />
                        <button
                          onClick={copyPinToClipboard}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors flex-shrink-0"
                        >
                          {copiedPin ? (
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                          ) : (
                            <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 mt-2">
                        Students will use this PIN to access the quiz
                      </p>
                    </div>
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base">
                      <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Share Quiz Link</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 sm:pt-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  Questions Preview
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {questions.map((q, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5"
                    >
                      <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-gray-600">
                        Q{idx + 1}: {q.question}
                      </h4>
                      {q.options.length > 0 && (
                        <div className="space-y-2">
                          {q.options.map((opt, i) => (
                            <div
                              key={i}
                              className={`p-2 sm:p-3 rounded-lg border text-sm sm:text-base ${
                                q.correctAnswer === i
                                  ? "bg-green-50 border-green-200 text-green-800"
                                  : "bg-gray-50 border-gray-200 text-gray-700"
                              }`}
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}
                      {q.type === "fill-in" && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3 text-green-800 text-sm sm:text-base">
                          Correct answer: {q.correctAnswer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 sm:space-x-4 mt-6 sm:mt-8">
                <button
                  onClick={() => {
                    setShowSummary(false);
                    setShowNewQuiz(false);
                    setQuestions([]);
                    setQuizTitle("");
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base"
                >
                  Back to My Quizzes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main page return - Made fully responsive
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              My Quizzes
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage and create quizzes for your students
            </p>
          </div>
          <button
            onClick={() => setShowNewQuiz(true)}
            className="mt-3 sm:mt-4 lg:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 hover:shadow-lg flex items-center space-x-2 w-full lg:w-auto justify-center text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Create New Quiz</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[
            {
              count: recentQuizzes.length,
              label: "Total Quizzes",
              icon: FileText,
              bgColor: "bg-blue-100",
              iconColor: "text-blue-600",
            },
            {
              count: "1.2k",
              label: "Total Participants",
              icon: Users,
              bgColor: "bg-green-100",
              iconColor: "text-green-600",
            },
            {
              count: recentQuizzes.filter((q) => q.status === "ongoing").length,
              label: "Active Now",
              icon: Clock,
              bgColor: "bg-orange-100",
              iconColor: "text-orange-600",
            },
            {
              count: recentQuizzes.filter((q) => q.status === "upcoming")
                .length,
              label: "Upcoming",
              icon: Calendar,
              bgColor: "bg-purple-100",
              iconColor: "text-purple-600",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 shadow-sm border border-gray-100"
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div
                  className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${stat.bgColor}`}
                >
                  <stat.icon
                    className={`w-4 h-4 sm:w-5 sm:h-6 ${stat.iconColor}`}
                  />
                </div>
                <div>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                    {stat.count}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Quizzes Section - Made fully responsive */}
        {recentQuizzes.length > 0 && (
          <div className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Recent Quizzes
            </h2>
            <div className="bg-white rounded-lg sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Mobile Cards View */}
              <div className="block md:hidden">
                <div className="p-3 max-h-[400px] overflow-auto">
                  {recentQuizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="border border-gray-200 rounded-lg p-3 mb-3 bg-white"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {quiz.title}
                          </h3>
                          <p className="text-xs text-gray-700 font-bold">
                            PIN: {quiz.pin}
                          </p>
                        </div>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setMobileMenuOpen(
                                mobileMenuOpen === quiz.id ? null : quiz.id
                              )
                            }
                            className="text-gray-700 hover:text-gray-600 p-1"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {mobileMenuOpen === quiz.id && (
                            <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                              <button
                                onClick={async () => {
                                  const q = await fetchQuizById(quiz.id);
                                  setViewingQuiz({
                                    id: q.id,
                                    title: q.title,
                                    questionsCount: q.questionsCount,
                                    duration: q.duration,
                                    date: q.startDate,
                                    time: q.startTime,
                                    status: determineStatus(
                                      q.startDate,
                                      q.startTime
                                    ),
                                    pin: q.pin,
                                    questions: q.questions,
                                    instructions: q.instructions,
                                    settings: q.settings,
                                  });
                                  setNewPin(q.pin);
                                  setMobileMenuOpen(null);
                                }}
                                className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50"
                              >
                                <Eye className="w-4 h-4" />
                                <span>View</span>
                              </button>
                              <button
                                onClick={async () => {
                                  const q = await fetchQuizById(quiz.id);
                                  setEditingQuiz({
                                    id: q.id,
                                    title: q.title,
                                    questionsCount: q.questionsCount,
                                    duration: q.duration,
                                    date: q.startDate,
                                    time: q.startTime,
                                    status: determineStatus(
                                      q.startDate,
                                      q.startTime
                                    ),
                                    pin: q.pin,
                                    questions: q.questions,
                                    instructions: q.instructions,
                                    settings: q.settings,
                                  });
                                  setMobileMenuOpen(null);
                                }}
                                className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-green-600 hover:bg-green-50"
                              >
                                <Edit3 className="w-4 h-4" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => deleteRecentQuiz(quiz.id)}
                                className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-black font-bold">
                            Questions:
                          </span>
                          <span className="ml-1 font-medium text-gray-700">
                            {quiz.questionsCount}
                          </span>
                        </div>
                        <div>
                          <span className="text-black font-bold">
                            Duration:
                          </span>
                          <span className="ml-1 font-medium text-gray-700">
                            {quiz.duration}min
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-black font-bold">Date:</span>
                          <span className="ml-1 font-medium text-gray-700">
                            {formatDate(quiz.date)}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-black font-bold">Time:</span>
                          <span className="ml-1 font-medium text-gray-700">
                            {quiz.time || "Not set"}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            quiz.status
                          )}`}
                        >
                          {getStatusText(quiz.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block max-h-[500px] overflow-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quiz Details
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Questions
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentQuizzes.map((quiz) => (
                      <tr
                        key={quiz.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 lg:px-6 py-3 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {quiz.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              PIN: {quiz.pin}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {quiz.questionsCount} questions
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Clock className="w-4 h-4 mr-1 text-gray-400" />
                            {quiz.duration} min
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(quiz.date)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {quiz.time || "Not set"}
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              quiz.status
                            )}`}
                          >
                            {getStatusText(quiz.status)}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-3 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <button
                              onClick={async () => {
                                const q = await fetchQuizById(quiz.id);
                                setViewingQuiz({
                                  id: q.id,
                                  title: q.title,
                                  questionsCount: q.questionsCount,
                                  duration: q.duration,
                                  date: q.startDate,
                                  time: q.startTime,
                                  status: determineStatus(
                                    q.startDate,
                                    q.startTime
                                  ),
                                  pin: q.pin,
                                  questions: q.questions,
                                  instructions: q.instructions,
                                  settings: q.settings,
                                });
                                setNewPin(q.pin);
                                setMobileMenuOpen(null);
                              }}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={async () => {
                                const q = await fetchQuizById(quiz.id);
                                setEditingQuiz({
                                  id: q.id,
                                  title: q.title,
                                  questionsCount: q.questionsCount,
                                  duration: q.duration,
                                  date: q.startDate,
                                  time: q.startTime,
                                  status: determineStatus(
                                    q.startDate,
                                    q.startTime
                                  ),
                                  pin: q.pin,
                                  questions: q.questions,
                                  instructions: q.instructions,
                                  settings: q.settings,
                                });
                                setMobileMenuOpen(null);
                              }}
                              className="text-green-600 hover:text-green-900 p-1 rounded transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteRecentQuiz(quiz.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {viewingQuiz && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50 overflow-auto">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative">
              <button
                onClick={() => setViewingQuiz(null)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold mb-4">{viewingQuiz.title}</h2>
              <p className="text-gray-600 mb-2">
                Duration: {viewingQuiz.duration} mins
              </p>
              <p className="text-gray-600 mb-2">
                Date: {viewingQuiz.date} Time: {viewingQuiz.time}
              </p>

              <div className="space-y-4">
                {viewingQuiz.questions?.map((q, idx) => (
                  <div key={idx} className="border p-3 rounded-lg bg-gray-50">
                    <p className="font-medium">
                      {idx + 1}. {q.question}
                    </p>
                    {q.options?.map((opt: string, i: number) => (
                      <p
                        key={i}
                        className={`ml-4 ${
                          q.correctAnswer === i
                            ? "text-green-600 font-semibold"
                            : ""
                        }`}
                      >
                        {opt}
                      </p>
                    ))}
                    {(q.type === "fill-in" || q.type === "open-ended") && (
                      <p className="ml-4 text-green-600 font-semibold">
                        {q.correctAnswer}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={async () => {
                  const pin = await generateNewPin(viewingQuiz.id);
                  setNewPin(pin);
                }}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Generate New Access PIN
              </button>

              {newPin && (
                <p className="mt-2 text-gray-700">Current PIN: {newPin}</p>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {recentQuizzes.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <FileText className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No quizzes yet
            </h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Create your first quiz to get started
            </p>
            <button
              onClick={() => setShowNewQuiz(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base"
            >
              Create Your First Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
