"use client";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import PDFUpload from "@/components/dashboard/student/pages/PDFUpload";
import { useAuth } from "@/lib/auth-context";
import {
  saveQuizAttempt,
  FirestoreQuizAttempt,
  getQuizHistory,
} from "@/lib/practiceHistory";
import {
  Clock,
  FileText,
  Upload,
  BookOpen,
  Brain,
  Zap,
  Target,
  CheckCircle,
  XCircle,
  HelpCircle,
  RotateCcw,
  AlertTriangle,
  Sparkles,
  BarChart3,
  User,
  Calendar,
} from "lucide-react";

// --- INTERFACES ---
interface GeminiQuestionOutput {
  question: string;
  options: { [key: string]: string };
  answer: string;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface PracticeForm {
  course: string;
  topic: string;
  numQuestions: string;
  difficulty: "easy" | "medium" | "hard";
  type: "multiple-choice" | "true-false" | "fill-in" | "essay";
}

interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<number, number>;
  timeLeft: number;
  quizStarted: boolean;
  quizCompleted: boolean;
  score: number;
  loading: boolean;
  error: string;
}

const Practice = () => {
  const [practiceForm, setPracticeForm] = useState<PracticeForm>({
    course: "",
    topic: "",
    numQuestions: "10",
    difficulty: "medium",
    type: "multiple-choice",
  });

  const { user } = useAuth();

  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: {},
    timeLeft: 0,
    quizStarted: false,
    quizCompleted: false,
    score: 0,
    loading: false,
    error: "",
  });

  const [practiceHistory, setPracticeHistory] = useState<
    FirestoreQuizAttempt[]
  >([]);
  const [pdfFileId, setPdfFileId] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [essayAnswers, setEssayAnswers] = useState<Record<number, string>>({});
  const [pastQuestionsText, setPastQuestionsText] = useState<string>("");
  const [pastQuestionsFile, setPastQuestionsFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<
    "topic" | "pdf" | "past-questions"
  >("topic");

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.id) return;
      const history = await getQuizHistory(user.id, 5);
      setPracticeHistory(history);
    };
    fetchHistory();
  }, [user, quizState.quizCompleted]);

  // --- HELPER FUNCTIONS ---
  const mapGeminiQuestions = (
    geminiQuestions: GeminiQuestionOutput[]
  ): Question[] => {
    return geminiQuestions.map((gq, index) => {
      const optionsArray = Object.values(gq.options);
      const correctOptionText = gq.options[gq.answer];
      const correctAnswerIndex = optionsArray.indexOf(correctOptionText);

      return {
        question: `${index + 1}. ${gq.question}`,
        options: optionsArray,
        correctAnswer: correctAnswerIndex >= 0 ? correctAnswerIndex : 0,
        explanation: `The correct answer is ${gq.answer}.`,
      };
    });
  };

  const getTimePerQuestion = () => {
    return 30;
  };

  // --- QUIZ GENERATION ---
  const generateRandomQuiz = async () => {
    if (!practiceForm.topic || !practiceForm.course) {
      setQuizState((prev) => ({
        ...prev,
        error: "Please enter course and topic before generating a quiz.",
      }));
      return;
    }

    setQuizState((prev) => ({
      ...prev,
      loading: true,
      error: "",
      quizStarted: false,
      quizCompleted: false,
      questions: [],
    }));

    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(practiceForm),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            `Failed to generate quiz. Status: ${response.status}`
        );
      }

      const geminiQuizData: GeminiQuestionOutput[] = await response.json();

      if (!geminiQuizData || geminiQuizData.length === 0) {
        throw new Error(
          "No questions were generated. Please try adjusting your topic or settings."
        );
      }

      const newQuestions = mapGeminiQuestions(geminiQuizData);
      const totalQuizTime =
        getTimePerQuestion() * Number(practiceForm.numQuestions);

      setQuizState((prev) => ({
        ...prev,
        questions: newQuestions,
        quizStarted: true,
        currentQuestionIndex: 0,
        userAnswers: {},
        timeLeft: totalQuizTime,
        quizCompleted: false,
        score: 0,
        loading: false,
      }));

      setEssayAnswers({});
      setPdfFileId(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Quiz Generation Error:", message);
      setQuizState((prev) => ({
        ...prev,
        loading: false,
        error: "Quiz generation failed: " + message,
      }));
    }
  };

  // --- PDF HANDLER ---
  const handlePDFProcessed = async (fileId: string, title: string) => {
    setPdfLoading(true);
    setQuizState((prev) => ({ ...prev, loading: true, error: "" }));
    setPdfFileId(fileId);

    try {
      const response = await fetch("/api/generate-quiz-from-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...practiceForm,
          fileId,
          topic: practiceForm.topic || "General",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            `Failed to generate quiz from PDF. Status: ${response.status}`
        );
      }

      const responseData = await response.json();
      let geminiQuizData: GeminiQuestionOutput[];

      if (Array.isArray(responseData)) {
        geminiQuizData = responseData;
      } else if (
        responseData.questions &&
        Array.isArray(responseData.questions)
      ) {
        geminiQuizData = responseData.questions;
      } else if (responseData.quiz && Array.isArray(responseData.quiz)) {
        geminiQuizData = responseData.quiz;
      } else {
        const arrayKeys = Object.keys(responseData).filter((key) =>
          Array.isArray(responseData[key])
        );
        if (arrayKeys.length > 0) {
          geminiQuizData = responseData[arrayKeys[0]];
        } else {
          throw new Error("Invalid response format from PDF quiz generation");
        }
      }

      if (!geminiQuizData || geminiQuizData.length === 0) {
        throw new Error(
          "No questions were generated from the PDF. Please try a different PDF or topic."
        );
      }

      const newQuestions = mapGeminiQuestions(geminiQuizData);
      const totalQuizTime =
        getTimePerQuestion() * Number(practiceForm.numQuestions);

      setQuizState((prev) => ({
        ...prev,
        questions: newQuestions,
        quizStarted: true,
        currentQuestionIndex: 0,
        userAnswers: {},
        timeLeft: totalQuizTime,
        quizCompleted: false,
        score: 0,
        loading: false,
      }));

      setPracticeForm((prev) => ({
        ...prev,
        course: "PDF Analysis",
        topic: title || "PDF Content",
      }));
      setEssayAnswers({});
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("PDF Quiz Generation Error:", message);
      setQuizState((prev) => ({
        ...prev,
        loading: false,
        error: "PDF quiz generation failed: " + message,
      }));
    } finally {
      setPdfLoading(false);
    }
  };

  // --- PAST QUESTIONS HANDLER ---
  const handlePastQuestionsProcessed = async () => {
    if (!pastQuestionsText && !pastQuestionsFile) {
      setQuizState((prev) => ({
        ...prev,
        error: "Please provide past questions either by text or file upload.",
      }));
      return;
    }

    setQuizState((prev) => ({
      ...prev,
      loading: true,
      error: "",
    }));

    try {
      let pastQuestionsContent = pastQuestionsText;

      if (pastQuestionsFile) {
        if (pastQuestionsFile.type === "application/pdf") {
          pastQuestionsContent = "PDF content would be extracted here";
        } else {
          pastQuestionsContent = await readTextFile(pastQuestionsFile);
        }
      }

      const response = await fetch("/api/generate-quiz-from-past-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pastQuestions: pastQuestionsContent,
          topic: practiceForm.topic,
          course: practiceForm.course,
          numQuestions: practiceForm.numQuestions,
          difficulty: practiceForm.difficulty,
          type: practiceForm.type,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate quiz from past questions.");
      }

      const geminiQuizData: GeminiQuestionOutput[] = await response.json();

      if (!geminiQuizData || geminiQuizData.length === 0) {
        setQuizState((prev) => ({
          ...prev,
          loading: false,
          error:
            "No questions were generated. Try providing different past questions.",
        }));
        return;
      }

      const newQuestions = mapGeminiQuestions(geminiQuizData);
      const totalQuizTime =
        getTimePerQuestion() * Number(practiceForm.numQuestions);

      setQuizState((prev) => ({
        ...prev,
        questions: newQuestions,
        quizStarted: true,
        currentQuestionIndex: 0,
        userAnswers: {},
        timeLeft: totalQuizTime,
        quizCompleted: false,
        score: 0,
        loading: false,
      }));

      setEssayAnswers({});
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Past Questions Quiz Generation Error:", message);
      setQuizState((prev) => ({
        ...prev,
        loading: false,
        error:
          message ||
          "An error occurred generating the quiz from past questions.",
      }));
    }
  };

  const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handlePastQuestionsFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) setPastQuestionsFile(file);
  };

  // --- QUIZ NAVIGATION ---
  const handlePracticeFormChange = (field: string, value: string) => {
    setPracticeForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAnswerSelect = (optionIndex: number) => {
    setQuizState((prev) => ({
      ...prev,
      userAnswers: {
        ...prev.userAnswers,
        [prev.currentQuestionIndex]: optionIndex,
      },
    }));
  };

  const handleEssayAnswer = (answer: string) => {
    const currentIndex = quizState.currentQuestionIndex;
    setEssayAnswers((prev) => ({ ...prev, [currentIndex]: answer }));
  };

  const handleNextQuestion = () => {
    if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
    }
  };

  const handlePreviousQuestion = () => {
    if (quizState.currentQuestionIndex > 0) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }));
    }
  };

  const restartQuiz = () => {
    setQuizState({
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: {},
      timeLeft: 0,
      quizStarted: false,
      quizCompleted: false,
      score: 0,
      loading: false,
      error: "",
    });
    setEssayAnswers({});
    setPdfFileId(null);
    setPastQuestionsText("");
    setPastQuestionsFile(null);
  };

  // --- TIMER ---
  useEffect(() => {
    if (!quizState.quizStarted || quizState.quizCompleted) return;

    const timer = setInterval(() => {
      setQuizState((prev) => {
        if (prev.timeLeft <= 1) {
          clearInterval(timer);
          const correct = prev.questions.reduce((acc, q, idx) => {
            const answer = prev.userAnswers[idx];
            return acc + (answer === q.correctAnswer ? 1 : 0);
          }, 0);
          return {
            ...prev,
            quizCompleted: true,
            timeLeft: 0,
            score: (correct / prev.questions.length) * 100,
          };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    quizState.quizStarted,
    quizState.quizCompleted,
    quizState.questions,
    quizState.userAnswers,
  ]);

  // --- CANCEL CONFIRMATION ---
  const cancelQuiz = () => {
    setQuizState({
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: {},
      timeLeft: 0,
      quizStarted: false,
      quizCompleted: false,
      score: 0,
      loading: false,
      error: "",
    });
    setEssayAnswers({});
    setShowCancelConfirm(false);
    setPdfFileId(null);
    setPastQuestionsText("");
    setPastQuestionsFile(null);
  };

  const confirmCancel = () => setShowCancelConfirm(true);

  // --- RESULTS ---
  const calculateDetailedResults = (): {
    correct: number;
    incorrect: number;
    skipped: number;
    score: number;
  } => {
    let correct = 0,
      incorrect = 0,
      skipped = 0;

    quizState.questions.forEach((question, index) => {
      const userAnswer = quizState.userAnswers[index];
      const essayAnswer = essayAnswers[index];

      if (practiceForm.type === "essay") {
        if (essayAnswer && essayAnswer.length > 20) correct++;
        else if (!essayAnswer) skipped++;
        else incorrect++;
      } else {
        if (userAnswer === undefined) skipped++;
        else if (userAnswer === question.correctAnswer) correct++;
        else incorrect++;
      }
    });

    const score = (correct / quizState.questions.length) * 100;
    return { correct, incorrect, skipped, score };
  };

  const handleSubmitQuiz = async () => {
    const results = calculateDetailedResults();
    setQuizState((prev) => ({
      ...prev,
      quizCompleted: true,
      timeLeft: 0,
      score: results.score,
    }));

    if (user?.id) {
      await saveQuizAttempt(user.id, {
        course: practiceForm.course,
        topic: practiceForm.topic,
        subtopic: practiceForm.topic,
        score: results.score,
        totalQuestions: quizState.questions.length,
        questionType: practiceForm.type,
        difficulty: practiceForm.difficulty,
        attemptedAt: Date.now(),
      });
    }
  };

  useEffect(() => {
    if (quizState.quizCompleted) {
      console.log("Quiz completed with score:", quizState.score);
    }
  }, [quizState.quizCompleted]);

  // --- RENDER FUNCTIONS ---
  const renderCancelConfirmation = () => {
    if (!showCancelConfirm) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Cancel Quiz?
            </h3>
          </div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to quit this quiz? Your progress will be lost.
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <Button
              onClick={() => setShowCancelConfirm(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white w-full sm:w-auto"
            >
              Continue Quiz
            </Button>
            <Button
              onClick={cancelQuiz}
              className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
            >
              Quit Quiz
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderQuiz = () => {
    if (!quizState.quizStarted || quizState.questions.length === 0) return null;
    if (quizState.quizCompleted) return renderResults();

    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const userAnswer = quizState.userAnswers[quizState.currentQuestionIndex];
    const currentEssayAnswer =
      essayAnswers[quizState.currentQuestionIndex] || "";

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Quiz Header */}
            <div className="bg-blue-500 p-6 text-white">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Brain className="h-7 w-7" />
                    <h3 className="text-2xl font-bold">
                      {practiceForm.course} - {practiceForm.topic}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-4 text-blue-100">
                    <div className="flex items-center space-x-1">
                      <FileText className="h-4 w-4" />
                      <span>
                        Question {quizState.currentQuestionIndex + 1} of{" "}
                        {quizState.questions.length}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Zap className="h-4 w-4" />
                      <span>Type: {practiceForm.type}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="h-4 w-4" />
                      <span>Difficulty: {practiceForm.difficulty}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div
                    className={`px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 backdrop-blur-sm ${
                      quizState.timeLeft <= 10
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-white text-black"
                    }`}
                  >
                    <Clock className="h-4 w-4" />
                    <span>Time Left: {quizState.timeLeft}s</span>
                  </div>
                  <button
                    onClick={confirmCancel}
                    className="p-2 text-white cursor-pointer rounded-xl transition-colors"
                    aria-label="Cancel quiz"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Question Content */}
            <div className="p-6">
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 mb-6 border border-gray-200">
                <h4 className="text-xl font-semibold text-gray-900 mb-6 leading-relaxed">
                  {currentQuestion.question}
                </h4>

                <div className="space-y-4">
                  {practiceForm.type === "essay" ? (
                    <div className="space-y-4">
                      <textarea
                        value={currentEssayAnswer}
                        onChange={(e) => handleEssayAnswer(e.target.value)}
                        placeholder="Type your essay response here..."
                        rows={8}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 resize-vertical bg-white shadow-sm"
                      />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-500 gap-2">
                        <div>
                          {currentEssayAnswer.length > 20 && (
                            <span className="text-green-600 font-medium flex items-center space-x-1">
                              <CheckCircle className="h-4 w-4" />
                              <span>Response saved</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>Characters: {currentEssayAnswer.length}</span>
                          {currentEssayAnswer.length < 50 && (
                            <span className="text-red-500 text-xs">
                              (Write more for better evaluation)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    currentQuestion.options.map(
                      (option: string, index: number) => (
                        <label
                          key={index}
                          className={`flex items-center space-x-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 group ${
                            userAnswer === index
                              ? "bg-blue-50 border-blue-500 shadow-md scale-[1.02]"
                              : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md"
                          }`}
                        >
                          <input
                            type="radio"
                            name="quiz-answer"
                            checked={userAnswer === index}
                            onChange={() => handleAnswerSelect(index)}
                            className="hidden"
                          />
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              userAnswer === index
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300 group-hover:border-blue-400"
                            }`}
                          >
                            {userAnswer === index && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                          <span className="text-gray-900 font-medium flex-1 text-lg">
                            {option}
                          </span>
                        </label>
                      )
                    )
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                <Button
                  onClick={handlePreviousQuestion}
                  disabled={quizState.currentQuestionIndex === 0}
                  className="bg-gray-600 hover:bg-gray-700 text-white w-full sm:w-auto px-8 py-3 rounded-xl font-semibold"
                >
                  Previous
                </Button>

                {quizState.currentQuestionIndex ===
                quizState.questions.length - 1 ? (
                  <Button
                    onClick={handleSubmitQuiz}
                    className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto px-8 py-3 rounded-xl font-semibold flex items-center space-x-2"
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>Submit Quiz</span>
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto px-8 py-3 rounded-xl font-semibold"
                  >
                    Next Question
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity - Display below quiz on all screens */}
          {practiceHistory.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-3">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <span>Recent Quiz Attempts</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {practiceHistory.map((q, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-white hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">
                          {q.course}
                        </p>
                        <p className="text-sm text-gray-500">
                          Topic: {q.topic}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          q.score >= 80
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : q.score >= 60
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {Math.round(q.score)}%
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{q.questionType}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{q.totalQuestions} Qs</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const results = calculateDetailedResults();
    const { correct: correctCount, incorrect, skipped, score } = results;

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">
                  {Math.round(score)}%
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                Quiz Completed!
              </h3>
              <p className="text-xl text-gray-600 mb-6">
                {correctCount} out of {quizState.questions.length} correct
              </p>
              <div
                className={`text-xl font-semibold px-6 py-3 rounded-full inline-block shadow-sm ${
                  score >= 80
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : score >= 60
                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                {score >= 80
                  ? "🎉 Excellent Work!"
                  : score >= 60
                  ? "👍 Good Job!"
                  : "💪 Keep Practicing!"}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-6 text-center shadow-sm">
                <CheckCircle className="h-10 w-10 text-green-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-green-700">
                  {correctCount}
                </div>
                <div className="text-base font-semibold text-green-800">
                  Correct
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6 text-center shadow-sm">
                <XCircle className="h-10 w-10 text-red-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-red-700">
                  {incorrect}
                </div>
                <div className="text-base font-semibold text-red-800">
                  Incorrect
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-6 text-center shadow-sm">
                <HelpCircle className="h-10 w-10 text-gray-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-700">
                  {skipped}
                </div>
                <div className="text-base font-semibold text-gray-800">
                  Skipped
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={restartQuiz}
                className="bg-blue-500 hover:bg-blue-600 text-white flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg"
              >
                <RotateCcw className="h-5 w-5" />
                <span>Start New Quiz</span>
              </Button>
            </div>
          </div>

          {/* Recent Activity - Display below results on all screens */}
          {practiceHistory.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-3">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <span>Recent Quiz Attempts</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {practiceHistory.map((q, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-white hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">
                          {q.course}
                        </p>
                        <p className="text-sm text-gray-500">
                          Topic: {q.topic}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          q.score >= 80
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : q.score >= 60
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {Math.round(q.score)}%
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{q.questionType}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{q.totalQuestions} Qs</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen ">
      {/* Quiz Interface */}
      {quizState.quizStarted || quizState.loading ? (
        renderQuiz()
      ) : (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="p-4 bg-white rounded-2xl shadow-lg">
                <Sparkles className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              AI Practice Session Generator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Generate personalized quizzes from topics, PDFs, or past questions
              using advanced AI
            </p>
          </div>

          {/* Loading State */}
          {quizState.loading && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 text-center mb-8 shadow-sm">
              <div className="flex items-center justify-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-blue-700 font-semibold text-lg">
                  Generating quiz... This may take a moment for high-quality
                  questions.
                </span>
              </div>
            </div>
          )}

          {/* Error State */}
          {quizState.error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 mb-8 shadow-sm">
              <div className="flex items-center space-x-4">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-red-700 font-semibold text-lg">Error</p>
                  <p className="text-red-600">{quizState.error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Quiz Generator */}
            <div className="xl:col-span-3">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                {/* Tab Navigation */}
                <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                  <div className="flex overflow-x-auto">
                    {[
                      {
                        id: "topic" as const,
                        label: "By Topic",
                        icon: BookOpen,
                      },
                      { id: "pdf" as const, label: "From PDF", icon: FileText },
                      {
                        id: "past-questions" as const,
                        label: "Past Questions",
                        icon: Target,
                      },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        className={`flex items-center space-x-3 px-8 py-5 font-semibold whitespace-nowrap transition-all duration-200 ${
                          activeTab === tab.id
                            ? "border-b-2 border-blue-600 text-blue-600 bg-white shadow-sm"
                            : "text-gray-500 hover:text-gray-700 hover:bg-white hover:bg-opacity-50"
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <tab.icon className="h-5 w-5" />
                        <span className="text-lg">{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-8">
                  {/* Shared Quiz Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 shadow-sm"
                      >
                        {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((num) => (
                          <option key={num} value={num.toString()}>
                            {num} Questions
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">
                        Difficulty
                      </label>
                      <select
                        value={practiceForm.difficulty}
                        onChange={(e) =>
                          handlePracticeFormChange("difficulty", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 shadow-sm"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">
                        Question Type
                      </label>
                      <select
                        value={practiceForm.type}
                        onChange={(e) =>
                          handlePracticeFormChange(
                            "type",
                            e.target.value as PracticeForm["type"]
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 shadow-sm"
                      >
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="true-false">True/False</option>
                        <option value="fill-in">Fill-in-the-Blank</option>
                        <option value="essay">Essay / Free Response</option>
                      </select>
                    </div>
                  </div>

                  {/* Tab Content */}
                  {activeTab === "topic" && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-gray-700">
                            Course / Subject
                          </label>
                          <input
                            type="text"
                            value={practiceForm.course}
                            onChange={(e) =>
                              handlePracticeFormChange("course", e.target.value)
                            }
                            placeholder="e.g., Organic Chemistry"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 shadow-sm"
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-gray-700">
                            Topic / Sub-topic
                          </label>
                          <input
                            type="text"
                            value={practiceForm.topic}
                            onChange={(e) =>
                              handlePracticeFormChange("topic", e.target.value)
                            }
                            placeholder="e.g., Alkanes Naming Conventions"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 shadow-sm"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={generateRandomQuiz}
                        disabled={
                          quizState.loading ||
                          !practiceForm.topic ||
                          !practiceForm.course
                        }
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-200"
                      >
                        {quizState.loading
                          ? "Generating..."
                          : "Generate Quiz from Topic"}
                      </Button>
                    </div>
                  )}

                  {activeTab === "pdf" && (
                    <div className="space-y-8">
                      <div className="text-center">
                        <FileText className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                          Generate Quiz from PDF Notes
                        </h3>
                        <p className="text-gray-600 text-lg">
                          The AI will generate questions based on the content of
                          your uploaded file
                        </p>
                      </div>
                      <PDFUpload
                        onProcessed={handlePDFProcessed}
                        loading={pdfLoading}
                        setLoading={setPdfLoading}
                        formCriteria={practiceForm}
                      />
                    </div>
                  )}

                  {activeTab === "past-questions" && (
                    <div className="space-y-8">
                      <div className="text-center">
                        <Target className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                          Generate Quiz from Past Questions
                        </h3>
                        <p className="text-gray-600 text-lg">
                          Upload past questions or paste them below. The AI will
                          generate new questions in the same style.
                        </p>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-4">
                            Upload Past Questions File
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors bg-gray-50">
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <input
                              type="file"
                              accept=".txt,.pdf,.doc,.docx"
                              onChange={handlePastQuestionsFileUpload}
                              className="hidden"
                              id="past-questions-file"
                            />
                            <label
                              htmlFor="past-questions-file"
                              className="cursor-pointer"
                            >
                              <p className="text-gray-600 text-lg mb-3">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-sm text-gray-500">
                                TXT, PDF, DOC, DOCX files supported
                              </p>
                            </label>
                          </div>
                          {pastQuestionsFile && (
                            <p className="text-green-600 text-base mt-3 flex items-center space-x-2">
                              <CheckCircle className="h-5 w-5" />
                              <span>
                                File selected: {pastQuestionsFile.name}
                              </span>
                            </p>
                          )}
                        </div>

                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-gray-700">
                            Or Paste Past Questions
                          </label>
                          <textarea
                            value={pastQuestionsText}
                            onChange={(e) =>
                              setPastQuestionsText(e.target.value)
                            }
                            placeholder={`Paste your past questions here...\n\nExample:\n1. What is the derivative of x²?\nA) x\nB) 2x\nC) 2\nD) x²\nAnswer: B\n\n2. Solve for x: 2x + 5 = 15\nA) 5\nB) 10\nC) 7.5\nD) 2.5\nAnswer: A`}
                            rows={8}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 resize-vertical shadow-sm"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={handlePastQuestionsProcessed}
                        disabled={
                          quizState.loading ||
                          (!pastQuestionsText && !pastQuestionsFile)
                        }
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-200"
                      >
                        {quizState.loading
                          ? "Generating..."
                          : "Generate Quiz from Past Questions"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity - Display below quiz generator on all screens */}
          {practiceHistory.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-3">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <span>Recent Quiz Attempts</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {practiceHistory.map((q, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-white hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">
                          {q.course}
                        </p>
                        <p className="text-sm text-gray-500">
                          Topic: {q.topic}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          q.score >= 80
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : q.score >= 60
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {Math.round(q.score)}%
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{q.questionType}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{q.totalQuestions} Qs</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {renderCancelConfirmation()}
    </div>
  );
};

export default Practice;
