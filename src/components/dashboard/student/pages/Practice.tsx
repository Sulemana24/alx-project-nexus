"use client";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import PDFUpload from "@/components/dashboard/student/pages/PDFUpload";

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

  const [pdfFileId, setPdfFileId] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [essayAnswers, setEssayAnswers] = useState<Record<number, string>>({});

  // NEW: Past Questions State
  const [pastQuestionsText, setPastQuestionsText] = useState<string>("");
  const [pastQuestionsFile, setPastQuestionsFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<
    "topic" | "pdf" | "past-questions"
  >("topic");

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
    switch (practiceForm.difficulty) {
      case "easy":
        return 60;
      case "medium":
        return 40;
      case "hard":
        return 30;
      default:
        return 40;
    }
  };

  // --- QUIZ GENERATION BY TOPIC ---
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
        headers: {
          "Content-Type": "application/json",
        },
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

      setQuizState((prev) => ({
        ...prev,
        questions: newQuestions,
        quizStarted: true,
        currentQuestionIndex: 0,
        userAnswers: {},
        timeLeft: getTimePerQuestion(),
        quizCompleted: false,
        score: 0,
        loading: false,
      }));
      setEssayAnswers({});
      setPdfFileId(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("PDF Quiz Generation Error:", message);
      setQuizState((prev) => ({
        ...prev,
        loading: false,
        error: "PDF quiz generation failed: " + message, // ✅ use message
      }));
    }
  };

  // --- PDF HANDLER ---
  const handlePDFProcessed = async (fileId: string, title: string) => {
    setPdfLoading(true);
    setQuizState((prev) => ({ ...prev, loading: true, error: "" }));
    setPdfFileId(fileId);

    try {
      console.log("Processing PDF with fileId:", fileId, "title:", title);

      const response = await fetch("/api/generate-quiz-from-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...practiceForm,
          fileId,
          topic: practiceForm.topic || "General", // Ensure topic is always provided
        }),
      });

      console.log("PDF API response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("PDF API error details:", errorData);
        throw new Error(
          errorData.error ||
            `Failed to generate quiz from PDF. Status: ${response.status}`
        );
      }

      const responseData = await response.json();
      console.log("PDF API response data:", responseData);

      // Handle different response formats
      let geminiQuizData: GeminiQuestionOutput[];

      if (Array.isArray(responseData)) {
        // Direct array response
        geminiQuizData = responseData;
      } else if (
        responseData.questions &&
        Array.isArray(responseData.questions)
      ) {
        // Nested questions array
        geminiQuizData = responseData.questions;
      } else if (responseData.quiz && Array.isArray(responseData.quiz)) {
        // Nested quiz array
        geminiQuizData = responseData.quiz;
      } else {
        // Try to find any array in the response
        const arrayKeys = Object.keys(responseData).filter((key) =>
          Array.isArray(responseData[key])
        );
        if (arrayKeys.length > 0) {
          geminiQuizData = responseData[arrayKeys[0]];
        } else {
          throw new Error("Invalid response format from PDF quiz generation");
        }
      }

      console.log("Processed quiz data:", geminiQuizData);

      if (!geminiQuizData || geminiQuizData.length === 0) {
        throw new Error(
          "No questions were generated from the PDF. Please try a different PDF or topic."
        );
      }

      const newQuestions = mapGeminiQuestions(geminiQuizData);

      setQuizState((prev) => ({
        ...prev,
        questions: newQuestions,
        quizStarted: true,
        currentQuestionIndex: 0,
        userAnswers: {},
        timeLeft: getTimePerQuestion(),
        quizCompleted: false,
        score: 0,
        loading: false,
      }));

      // Update the form with PDF context
      setPracticeForm((prev) => ({
        ...prev,
        course: "PDF Analysis",
        topic: title || "PDF Content",
      }));

      console.log(
        "✅ PDF quiz successfully loaded with",
        newQuestions.length,
        "questions"
      );
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

      // If file uploaded, read text
      if (pastQuestionsFile) {
        if (pastQuestionsFile.type === "application/pdf") {
          pastQuestionsContent = "PDF content would be extracted here"; // TODO
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

      setQuizState((prev) => ({
        ...prev,
        questions: newQuestions,
        quizStarted: true,
        currentQuestionIndex: 0,
        userAnswers: {},
        timeLeft: getTimePerQuestion(),
        quizCompleted: false,
        score: 0,
        loading: false,
      }));
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

  // Helper function to read text file
  const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  // Handle file upload for past questions
  const handlePastQuestionsFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setPastQuestionsFile(file);
    }
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
        timeLeft: getTimePerQuestion(),
      }));
    }
  };

  const handlePreviousQuestion = () => {
    if (quizState.currentQuestionIndex > 0) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
        timeLeft: getTimePerQuestion(),
      }));
    }
  };

  /*   const handleSubmitQuiz = () => {
    setQuizState((prev) => ({ ...prev, quizCompleted: true, timeLeft: 0 }));
  };
 */
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
    let timer: NodeJS.Timeout;
    if (
      quizState.quizStarted &&
      !quizState.quizCompleted &&
      quizState.timeLeft > 0
    ) {
      timer = setTimeout(() => {
        setQuizState((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (
      quizState.timeLeft === 0 &&
      quizState.quizStarted &&
      !quizState.quizCompleted
    ) {
      handleNextQuestion();
    }
    return () => clearTimeout(timer);
  }, [quizState.quizStarted, quizState.quizCompleted, quizState.timeLeft]);

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

  // --- RESULTS CALCULATION ---
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

  // Fix the handleSubmitQuiz to calculate results immediately
  const handleSubmitQuiz = () => {
    const results = calculateDetailedResults();
    setQuizState((prev) => ({
      ...prev,
      quizCompleted: true,
      timeLeft: 0,
      score: results.score,
    }));
  };

  // Remove or fix the problematic useEffect
  useEffect(() => {
    if (quizState.quizCompleted) {
      // This is now handled in handleSubmitQuiz
      console.log("Quiz completed with score:", quizState.score);
    }
  }, [quizState.quizCompleted]);

  // --- RENDER FUNCTIONS ---
  const renderCancelConfirmation = () => {
    if (!showCancelConfirm) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md mx-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Cancel Quiz?
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to quit this quiz? Your progress will be lost.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              onClick={() => setShowCancelConfirm(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              Continue Quiz
            </Button>
            <Button
              onClick={cancelQuiz}
              className="bg-red-600 hover:bg-red-700 text-white"
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
      <div className="bg-white rounded-xl border border-gray-200 p-6 relative">
        <button
          onClick={confirmCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Cancel quiz"
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

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {practiceForm.course} - {practiceForm.topic}
            </h3>
            <p className="text-gray-600">
              Question {quizState.currentQuestionIndex + 1} of{" "}
              {quizState.questions.length}
            </p>
            <p className="text-sm text-gray-500">
              Type: {practiceForm.type} • Difficulty: {practiceForm.difficulty}{" "}
              • Time: {getTimePerQuestion()}s
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div
              className={`px-4 py-2 rounded-lg font-semibold ${
                quizState.timeLeft <= 10
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              Time Left: {quizState.timeLeft}s
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {currentQuestion.question}
          </h4>

          <div className="space-y-3">
            {practiceForm.type === "essay" ? (
              <div className="space-y-4">
                <textarea
                  value={currentEssayAnswer}
                  onChange={(e) => handleEssayAnswer(e.target.value)}
                  placeholder="Type your essay response here..."
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black resize-vertical"
                />
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div>
                    {currentEssayAnswer.length > 20 && (
                      <span className="text-green-600 font-medium">
                        ✓ Response saved
                      </span>
                    )}
                  </div>
                  <div>
                    Characters: {currentEssayAnswer.length}
                    {currentEssayAnswer.length < 50 && (
                      <span className="text-red-500 ml-2">
                        (Write more for better evaluation)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              currentQuestion.options.map((option: string, index: number) => (
                <label
                  key={index}
                  className={`flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors ${
                    userAnswer === index ? "bg-blue-100 border-blue-300" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={`quiz-answer-${quizState.currentQuestionIndex}`}
                    value={index}
                    checked={userAnswer === index}
                    onChange={() => handleAnswerSelect(index)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-900">{option}</span>
                </label>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            <Button
              onClick={handlePreviousQuestion}
              disabled={quizState.currentQuestionIndex === 0}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              Previous
            </Button>
          </div>

          {quizState.currentQuestionIndex === quizState.questions.length - 1 ? (
            <Button
              onClick={handleSubmitQuiz}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Next Question
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    // Calculate results directly instead of relying on state
    const results = calculateDetailedResults();
    const { correct: correctCount, incorrect, skipped, score } = results;

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Quiz Results
        </h3>

        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {Math.round(score)}%
          </div>
          <div className="text-lg text-gray-600">
            {correctCount} out of {quizState.questions.length} correct
          </div>
          <div
            className={`text-lg font-semibold mt-2 ${
              score >= 80
                ? "text-green-600"
                : score >= 60
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {score >= 80
              ? "Excellent! 🎉"
              : score >= 60
              ? "Good Job! 👍"
              : "Keep Practicing! 💪"}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-700">
              {correctCount}
            </div>
            <div className="text-sm font-medium text-green-800">
              Correct Answers
            </div>
          </div>
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-700">{incorrect}</div>
            <div className="text-sm font-medium text-red-800">
              Incorrect Answers
            </div>
          </div>
          <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-700">{skipped}</div>
            <div className="text-sm font-medium text-gray-800">
              Skipped Questions
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button
            onClick={restartQuiz}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Start New Quiz
          </Button>
        </div>
      </div>
    );
  };

  // --- MAIN RENDER ---
  return (
    <div className="p-4 md:p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">
        🧠 Practice Session Generator
      </h2>

      {quizState.loading && (
        <div className="text-lg text-blue-600 mb-4">
          Generating quiz... This may take a moment for high-quality,
          non-repetitive questions.
        </div>
      )}

      {quizState.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          Error: {quizState.error}
        </div>
      )}

      {quizState.quizStarted || quizState.loading ? (
        renderQuiz()
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-md">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "topic"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("topic")}
            >
              📝 By Topic
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "pdf"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("pdf")}
            >
              📚 From PDF Notes
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "past-questions"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("past-questions")}
            >
              🎯 From Past Questions
            </button>
          </div>

          {/* Shared Quiz Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <label className="block">
              <span className="text-gray-700">Number of Questions</span>
              <select
                value={practiceForm.numQuestions}
                onChange={(e) =>
                  handlePracticeFormChange("numQuestions", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-black"
              >
                <option value="5">5 Questions</option>
                <option value="10">10 Questions</option>
                <option value="15">15 Questions</option>
              </select>
            </label>

            <label className="block">
              <span className="text-gray-700">Difficulty</span>
              <select
                value={practiceForm.difficulty}
                onChange={(e) =>
                  handlePracticeFormChange("difficulty", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-black"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>

            <label className="block">
              <span className="text-gray-700">Question Type</span>
              <select
                value={practiceForm.type}
                onChange={(e) =>
                  handlePracticeFormChange(
                    "type",
                    e.target.value as PracticeForm["type"]
                  )
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-black"
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-false">True/False</option>
                <option value="fill-in">Fill-in-the-Blank</option>
                <option value="essay">Essay / Free Response</option>
              </select>
            </label>
          </div>

          {/* Tab Content */}
          {activeTab === "topic" && (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Generate Quiz by Topic
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <label className="block">
                  <span className="text-gray-700">Course / Subject</span>
                  <input
                    type="text"
                    value={practiceForm.course}
                    onChange={(e) =>
                      handlePracticeFormChange("course", e.target.value)
                    }
                    placeholder="e.g., Organic Chemistry"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-black"
                  />
                </label>

                <label className="block">
                  <span className="text-gray-700">Topic / Sub-topic</span>
                  <input
                    type="text"
                    value={practiceForm.topic}
                    onChange={(e) =>
                      handlePracticeFormChange("topic", e.target.value)
                    }
                    placeholder="e.g., Alkanes Naming Conventions"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-black"
                  />
                </label>
              </div>
              <Button
                onClick={generateRandomQuiz}
                disabled={
                  quizState.loading ||
                  !practiceForm.topic ||
                  !practiceForm.course
                }
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {quizState.loading
                  ? "Generating..."
                  : "Generate Quiz from Topic"}
              </Button>
            </div>
          )}

          {activeTab === "pdf" && (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Generate Quiz from PDF Notes
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                The AI will generate questions based *only* on the content of
                your uploaded file.
              </p>
              <PDFUpload
                onProcessed={handlePDFProcessed}
                loading={pdfLoading}
                setLoading={setPdfLoading}
                formCriteria={practiceForm}
              />
            </div>
          )}

          {activeTab === "past-questions" && (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Generate Quiz from Past Questions
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload past questions or paste them below. The AI will generate
                new questions in the same style and format.
              </p>

              <div className="mb-4">
                <label className="block mb-2">
                  <span className="text-gray-700">
                    Upload Past Questions File
                  </span>
                </label>
                <input
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={handlePastQuestionsFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: TXT, PDF, DOC, DOCX
                </p>
                {pastQuestionsFile && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ File selected: {pastQuestionsFile.name}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block mb-2">
                  <span className="text-gray-700">Or Paste Past Questions</span>
                </label>
                <textarea
                  value={pastQuestionsText}
                  onChange={(e) => setPastQuestionsText(e.target.value)}
                  placeholder="Paste your past questions here...&#10;Example:&#10;1. What is the derivative of x²?&#10;A) x&#10;B) 2x&#10;C) 2&#10;D) x²&#10;Answer: B&#10;&#10;2. Solve for x: 2x + 5 = 15&#10;A) 5&#10;B) 10&#10;C) 7.5&#10;D) 2.5&#10;Answer: A"
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black resize-vertical"
                />
              </div>

              <Button
                onClick={handlePastQuestionsProcessed}
                disabled={
                  quizState.loading ||
                  (!pastQuestionsText && !pastQuestionsFile)
                }
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {quizState.loading
                  ? "Generating..."
                  : "Generate Quiz from Past Questions"}
              </Button>
            </div>
          )}
        </div>
      )}
      {renderCancelConfirmation()}
    </div>
  );
};

export default Practice;
