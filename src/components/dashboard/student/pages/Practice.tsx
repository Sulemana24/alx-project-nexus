"use client";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { mockPracticeSessions } from "@/data/mock-data";
import PDFUpload from "@/components/dashboard/student/pages/PDFUpload";

interface PracticeForm {
  course: string;
  topic: string;
  numQuestions: string;
  difficulty: "easy" | "medium" | "hard";
  type: "multiple-choice" | "true-false" | "fill-in" | "essay";
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
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

  const [pdfLoading, setPdfLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [essayAnswers, setEssayAnswers] = useState<Record<number, string>>({});

  // Updated time per question based on difficulty
  const getTimePerQuestion = () => {
    switch (practiceForm.difficulty) {
      case "easy":
        return 60; // Changed from 40 to 60
      case "medium":
        return 40; // Changed from 20 to 40
      case "hard":
        return 30; // Changed from 10 to 30
      default:
        return 40;
    }
  };

  // Handle PDF processing results
  const handlePDFProcessed = (pdfData: {
    title: string;
    content: string;
    questions: Question[];
  }) => {
    setQuizState((prev) => ({
      ...prev,
      questions: pdfData.questions,
      quizStarted: true,
      currentQuestionIndex: 0,
      userAnswers: {},
      timeLeft: getTimePerQuestion(),
      quizCompleted: false,
      score: 0,
    }));

    setPracticeForm((prev) => ({
      ...prev,
      course: "PDF Content",
      topic: pdfData.title,
    }));
  };

  // Cancel/quit the current quiz
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
    localStorage.removeItem("quizProgress");
    localStorage.removeItem("practiceForm");
    localStorage.removeItem("essayAnswers");
  };

  // Show confirmation dialog before canceling
  const confirmCancel = () => {
    setShowCancelConfirm(true);
  };

  // Function to shuffle array (Fisher-Yates algorithm)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Enhanced mock question generator with varied questions
  const generateMockQuestions = (): Question[] => {
    const numQuestions = parseInt(practiceForm.numQuestions);
    const questions: Question[] = [];

    // Different question templates for variety based on type
    const questionTemplates = {
      "multiple-choice": [
        "What is the primary concept behind {topic} in {course}?",
        "Which of the following best describes {topic}?",
        "How does {topic} relate to fundamental principles in {course}?",
        "What is the main application of {topic} in real-world {course} scenarios?",
        "Which statement accurately characterizes {topic}?",
        "What distinguishes {topic} from similar concepts in {course}?",
        "How would you implement {topic} in a practical {course} setting?",
        "What are the key components of {topic}?",
        "Which principle is most essential for understanding {topic}?",
        "How does {topic} contribute to the broader field of {course}?",
        "What historical development led to the understanding of {topic}?",
        "Which methodology is commonly used when studying {topic}?",
        "What are the limitations of current approaches to {topic}?",
        "How has {topic} evolved in modern {course} practice?",
        "What ethical considerations are associated with {topic}?",
      ],
      "true-false": [
        "{topic} is a fundamental concept in {course}.",
        "Understanding {topic} requires advanced mathematical knowledge.",
        "{topic} has been proven to be ineffective in modern applications.",
        "The principles of {topic} apply universally across all {course} domains.",
        "{topic} was first discovered in the 21st century.",
        "Most experts agree that {topic} is essential for {course} mastery.",
        "{topic} contradicts established theories in {course}.",
        "Recent research has invalidated the core principles of {topic}.",
        "{topic} can be applied to solve complex problems in {course}.",
        "The study of {topic} is primarily theoretical with few practical applications.",
      ],
      "fill-in": [
        "The fundamental principle of ______ is central to understanding {topic}.",
        "In {course}, the concept of ______ is closely related to {topic}.",
        "The primary method for analyzing {topic} involves ______.",
        "______ represents the key innovation in the field of {topic}.",
        "The relationship between ______ and {topic} is crucial in {course}.",
        "Modern approaches to {topic} emphasize the importance of ______.",
        "The theoretical framework for {topic} is based on ______.",
        "______ demonstrates the practical application of {topic} in {course}.",
        "The main challenge in implementing {topic} is ______.",
        "Recent advancements in {topic} have focused on ______.",
      ],
      essay: [
        "Explain the significance of {topic} in the context of {course} and provide examples of its applications.",
        "Compare and contrast {topic} with related concepts in {course}, highlighting key differences and similarities.",
        "Describe the historical development of {topic} and its impact on modern {course} practices.",
        "Analyze the strengths and limitations of current approaches to {topic} in {course}.",
        "Discuss how {topic} integrates with other fundamental concepts in {course}.",
        "Evaluate the ethical implications of applying {topic} in real-world {course} scenarios.",
        "Propose a research study that would advance our understanding of {topic} in {course}.",
        "Explain how {topic} has evolved over time and predict its future direction in {course}.",
        "Describe the step-by-step process for implementing {topic} in a practical {course} setting.",
        "Critically assess the role of {topic} in shaping contemporary {course} methodologies.",
      ],
    };

    // Different option patterns based on question type
    const optionGenerators = {
      "multiple-choice": (index: number) => [
        `Correct explanation of ${practiceForm.topic} focusing on core principles`,
        `Common misunderstanding about ${practiceForm.topic}`,
        `Unrelated concept that sometimes gets confused with ${practiceForm.topic}`,
        `Partially correct but incomplete description of ${practiceForm.topic}`,
      ],
      "true-false": () => ["True", "False"],
      "fill-in": (index: number) => [
        practiceForm.topic,
        `Core ${practiceForm.topic} principle`,
        `Essential ${practiceForm.course} concept`,
        `Fundamental ${practiceForm.topic} theory`,
      ],
      essay: (index: number) => [
        "Sample comprehensive response covering key concepts",
        "Basic explanation with limited depth",
        "Advanced theoretical analysis",
        "Practical application-focused answer",
      ],
    };

    const templates =
      questionTemplates[practiceForm.type as keyof typeof questionTemplates] ||
      questionTemplates["multiple-choice"];
    const optionGenerator =
      optionGenerators[practiceForm.type as keyof typeof optionGenerators] ||
      optionGenerators["multiple-choice"];

    for (let i = 0; i < numQuestions; i++) {
      const templateIndex = i % templates.length;
      const questionText = templates[templateIndex]
        .replace(/{topic}/g, practiceForm.topic)
        .replace(/{course}/g, practiceForm.course);

      const originalOptions = optionGenerator(i);
      const shuffledOptions = shuffleArray(originalOptions);
      const correctAnswer = shuffledOptions.indexOf(originalOptions[0]);

      // Vary the explanation based on question type and index
      const explanations = {
        "multiple-choice": [
          `This question tests your understanding of ${practiceForm.topic}'s core concepts.`,
          `This assesses your ability to distinguish ${practiceForm.topic} from related ideas.`,
          `This evaluates your knowledge of ${practiceForm.topic}'s practical applications.`,
          `This examines your grasp of ${practiceForm.topic}'s theoretical foundations.`,
          `This question focuses on the fundamental principles behind ${practiceForm.topic}.`,
          `This tests your comprehension of how ${practiceForm.topic} functions in ${practiceForm.course}.`,
        ],
        "true-false": [
          `This statement about ${practiceForm.topic} reflects current understanding in ${practiceForm.course}.`,
          `This assesses factual knowledge about ${practiceForm.topic} in ${practiceForm.course}.`,
          `This tests common misconceptions about ${practiceForm.topic}.`,
          `This evaluates your understanding of ${practiceForm.topic}'s established principles.`,
          `This question verifies your knowledge of ${practiceForm.topic}'s validity in ${practiceForm.course}.`,
          `This examines whether you can identify accurate statements about ${practiceForm.topic}.`,
        ],
        "fill-in": [
          `This fill-in question assesses your recall of key ${practiceForm.topic} concepts.`,
          `This tests your ability to identify the central idea related to ${practiceForm.topic}.`,
          `This evaluates your understanding of ${practiceForm.topic}'s fundamental principles.`,
          `This examines your knowledge of ${practiceForm.topic} terminology in ${practiceForm.course}.`,
          `This question focuses on the essential components of ${practiceForm.topic}.`,
          `This assesses your grasp of ${practiceForm.topic}'s core methodology.`,
        ],
        essay: [
          `This essay question evaluates your comprehensive understanding of ${practiceForm.topic}.`,
          `This assesses your ability to analyze and synthesize information about ${practiceForm.topic}.`,
          `This tests your critical thinking skills regarding ${practiceForm.topic} applications.`,
          `This examines your capacity to articulate complex ideas about ${practiceForm.topic}.`,
          `This question evaluates your depth of knowledge about ${practiceForm.topic} in ${practiceForm.course}.`,
          `This assesses your ability to connect ${practiceForm.topic} with broader ${practiceForm.course} concepts.`,
        ],
      };

      const explanationType =
        explanations[practiceForm.type as keyof typeof explanations] ||
        explanations["multiple-choice"];
      const explanation = explanationType[i % explanationType.length];

      questions.push({
        question: `${i + 1}. ${questionText}`,
        options: shuffledOptions,
        correctAnswer: correctAnswer,
        explanation,
      });
    }

    return questions;
  };

  // Generate quiz using mock data
  const generateRandomQuiz = async () => {
    if (!practiceForm.topic || !practiceForm.course) {
      setQuizState((prev) => ({
        ...prev,
        error: "Please enter course and topic before generating a quiz.",
      }));
      return;
    }

    setQuizState((prev) => ({ ...prev, loading: true, error: "" }));

    setTimeout(() => {
      const mockQuestions = generateMockQuestions();
      setQuizState((prev) => ({
        ...prev,
        questions: mockQuestions,
        quizStarted: true,
        currentQuestionIndex: 0,
        userAnswers: {},
        timeLeft: getTimePerQuestion(),
        quizCompleted: false,
        score: 0,
        loading: false,
      }));
      setEssayAnswers({});
    }, 1000);
  };

  // Handle essay answer input
  const handleEssayAnswer = (answer: string) => {
    const currentIndex = quizState.currentQuestionIndex;
    setEssayAnswers((prev) => ({
      ...prev,
      [currentIndex]: answer,
    }));

    // For essay questions, mark as attempted if answer has sufficient length
    const isAttempted = answer.trim().length > 20;
    setQuizState((prev) => ({
      ...prev,
      userAnswers: {
        ...prev.userAnswers,
        [currentIndex]: isAttempted ? 0 : 1, // 0 for attempted, 1 for not attempted
      },
    }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    quizState.questions.forEach((question, index) => {
      if (practiceForm.type === "essay") {
        // For essay questions, consider any substantial answer as "correct" for scoring
        const essayAnswer = essayAnswers[index];
        if (essayAnswer && essayAnswer.trim().length > 20) {
          correctCount++;
        }
      } else {
        if (quizState.userAnswers[index] === question.correctAnswer) {
          correctCount++;
        }
      }
    });

    const finalScore = (correctCount / quizState.questions.length) * 100;

    setQuizState((prev) => ({
      ...prev,
      score: finalScore,
      quizCompleted: true,
    }));

    localStorage.removeItem("quizProgress");
    localStorage.removeItem("practiceForm");
    localStorage.removeItem("essayAnswers");
  };

  const handleNextQuestion = () => {
    setQuizState((prev) => {
      if (prev.currentQuestionIndex < prev.questions.length - 1) {
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          timeLeft: getTimePerQuestion(),
        };
      } else {
        handleSubmitQuiz();
        return prev;
      }
    });
  };

  // Timer effect
  useEffect(() => {
    if (
      !quizState.quizStarted ||
      quizState.quizCompleted ||
      quizState.questions.length === 0
    )
      return;

    const timer = setInterval(() => {
      setQuizState((prev) => {
        if (prev.timeLeft <= 1) {
          handleNextQuestion();
          return { ...prev, timeLeft: getTimePerQuestion() };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    quizState.quizStarted,
    quizState.quizCompleted,
    quizState.questions.length,
  ]);

  // Save progress to localStorage
  useEffect(() => {
    if (quizState.quizStarted && !quizState.quizCompleted) {
      localStorage.setItem("quizProgress", JSON.stringify(quizState));
      localStorage.setItem("practiceForm", JSON.stringify(practiceForm));
      localStorage.setItem("essayAnswers", JSON.stringify(essayAnswers));
    }
  }, [quizState, practiceForm, essayAnswers]);

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

  const handlePreviousQuestion = () => {
    setQuizState((prev) => {
      if (prev.currentQuestionIndex > 0) {
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex - 1,
          timeLeft: getTimePerQuestion(),
        };
      }
      return prev;
    });
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
    localStorage.removeItem("quizProgress");
    localStorage.removeItem("practiceForm");
    localStorage.removeItem("essayAnswers");
  };

  // Calculate detailed results
  const calculateDetailedResults = () => {
    const results = { correct: 0, incorrect: 0, skipped: 0 };
    quizState.questions.forEach((question, index) => {
      if (practiceForm.type === "essay") {
        const essayAnswer = essayAnswers[index];
        if (essayAnswer && essayAnswer.trim().length > 20) {
          results.correct++;
        } else if (essayAnswer === undefined) {
          results.skipped++;
        } else {
          results.incorrect++;
        }
      } else {
        const userAnswer = quizState.userAnswers[index];
        if (userAnswer === undefined) results.skipped++;
        else if (userAnswer === question.correctAnswer) results.correct++;
        else results.incorrect++;
      }
    });
    return results;
  };

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem("quizProgress");
    const savedForm = localStorage.getItem("practiceForm");
    const savedEssayAnswers = localStorage.getItem("essayAnswers");

    if (savedProgress || savedForm || savedEssayAnswers) {
      setTimeout(() => {
        if (savedProgress) setQuizState(JSON.parse(savedProgress));
        if (savedForm) setPracticeForm(JSON.parse(savedForm));
        if (savedEssayAnswers) setEssayAnswers(JSON.parse(savedEssayAnswers));
      }, 0);
    }
  }, []);

  // Cancel Confirmation Dialog
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

  // Render quiz interface
  const renderQuiz = () => {
    if (!quizState.quizStarted || quizState.questions.length === 0) return null;
    if (quizState.quizCompleted) return renderResults();

    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const userAnswer = quizState.userAnswers[quizState.currentQuestionIndex];
    const currentEssayAnswer =
      essayAnswers[quizState.currentQuestionIndex] || "";

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 relative">
        {/* Cancel Button - Top Right */}
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
              // Essay question input
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
              // Multiple choice, true/false, or fill-in questions
              currentQuestion.options.map((option: string, index: number) => (
                <label
                  key={index}
                  className={`flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors ${
                    userAnswer === index ? "bg-blue-100 border-blue-300" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="quiz-answer"
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

  // Render results - IMPROVED VERSION
  const renderResults = () => {
    const detailedResults = calculateDetailedResults();
    const correctCount = detailedResults.correct;

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Quiz Results
        </h3>

        {/* Score Overview */}
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {Math.round(quizState.score)}%
          </div>
          <div className="text-lg text-gray-600">
            {correctCount} out of {quizState.questions.length} correct
          </div>
          <div
            className={`text-lg font-semibold mt-2 ${
              quizState.score >= 80
                ? "text-green-600"
                : quizState.score >= 60
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {quizState.score >= 80
              ? "Excellent! 🎉"
              : quizState.score >= 60
              ? "Good Job! 👍"
              : "Keep Practicing! 💪"}
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-700">
              {detailedResults.correct}
            </div>
            <div className="text-sm font-medium text-green-800">
              Correct Answers
            </div>
          </div>
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-700">
              {detailedResults.incorrect}
            </div>
            <div className="text-sm font-medium text-red-800">
              Incorrect Answers
            </div>
          </div>
          <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-700">
              {detailedResults.skipped}
            </div>
            <div className="text-sm font-medium text-gray-800">
              Skipped Questions
            </div>
          </div>
        </div>

        {/* Question Review - IMPROVED LAYOUT */}
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {quizState.questions.map((question, index) => {
            const userAnswer = quizState.userAnswers[index];
            const essayAnswer = essayAnswers[index];
            let isCorrect = false;
            let isSkipped = false;

            if (practiceForm.type === "essay") {
              isCorrect = !!(essayAnswer && essayAnswer.trim().length > 20);
              isSkipped =
                essayAnswer === undefined || essayAnswer.trim() === "";
            } else {
              isCorrect = userAnswer === question.correctAnswer;
              isSkipped = userAnswer === undefined;
            }

            return (
              <div
                key={index}
                className={`border-2 rounded-lg p-4 ${
                  isCorrect
                    ? "border-green-200 bg-green-50"
                    : isSkipped
                    ? "border-yellow-200 bg-yellow-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                {/* Question Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                          isCorrect
                            ? "bg-green-500 text-white"
                            : isSkipped
                            ? "bg-yellow-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded ${
                          isCorrect
                            ? "bg-green-100 text-green-800"
                            : isSkipped
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {isCorrect
                          ? "Completed"
                          : isSkipped
                          ? "Skipped"
                          : "Insufficient"}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {question.question}
                    </h4>
                  </div>
                </div>

                {/* User's Answer for Essay */}
                {practiceForm.type === "essay" && essayAnswer && (
                  <div className="mb-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Your Essay Response:
                    </div>
                    <div
                      className={`p-3 rounded-lg border ${
                        isCorrect
                          ? "bg-green-100 border-green-300 text-green-800"
                          : "bg-red-100 border-red-300 text-red-800"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {isCorrect ? (
                          <svg
                            className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        <div className="flex-1">
                          <p className="whitespace-pre-wrap">{essayAnswer}</p>
                          <div className="text-xs text-gray-500 mt-2">
                            Character count: {essayAnswer.length}
                            {!isCorrect && (
                              <span className="text-red-500 ml-2">
                                (Minimum 20 characters required)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* User's Answer for other question types */}
                {practiceForm.type !== "essay" && !isSkipped && (
                  <div className="mb-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Your Answer:
                    </div>
                    <div
                      className={`p-3 rounded-lg border ${
                        isCorrect
                          ? "bg-green-100 border-green-300 text-green-800"
                          : "bg-red-100 border-red-300 text-red-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <svg
                            className="w-5 h-5 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5 text-red-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        {question.options[userAnswer]}
                      </div>
                    </div>
                  </div>
                )}

                {/* Correct Answer for non-essay questions */}
                {practiceForm.type !== "essay" && !isCorrect && (
                  <div className="mb-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Correct Answer:
                    </div>
                    <div className="p-3 rounded-lg bg-green-100 border border-green-300 text-green-800">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {question.options[question.correctAnswer]}
                      </div>
                    </div>
                  </div>
                )}

                {/* Explanation */}
                {question.explanation && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <strong className="text-blue-800">Explanation:</strong>
                    </div>
                    <p className="text-blue-700 text-sm">
                      {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-6">
          <Button
            onClick={restartQuiz}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            Generate New Quiz
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {renderCancelConfirmation()}

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Practice & Study
        </h2>
        <p className="text-gray-600">
          Upload PDFs and generate custom practice quizzes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - PDF Upload */}
        <div>
          <PDFUpload
            onPDFProcessed={handlePDFProcessed}
            onLoadingChange={setPdfLoading}
            userPreferences={{
              numQuestions: practiceForm.numQuestions,
              difficulty: practiceForm.difficulty,
              type: practiceForm.type,
            }}
          />
        </div>

        {/* Right Column - Manual Quiz Generator */}
        <div className="space-y-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Generate Custom Quiz
            </h3>
            {quizState.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {quizState.error}
              </div>
            )}
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
                    handlePracticeFormChange("numQuestions", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                >
                  <option value="5">5 Questions</option>
                  <option value="10">10 Questions</option>
                  <option value="15">15 Questions</option>
                  <option value="20">20 Questions</option>
                  <option value="25">25 Questions</option>
                  <option value="30">30 Questions</option>
                  <option value="35">35 Questions</option>
                  <option value="40">40 Questions</option>
                  <option value="45">45 Questions</option>
                  <option value="50">50 Questions</option>
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
                  <option value="easy">Easy (60s per question)</option>
                  <option value="medium">Medium (40s per question)</option>
                  <option value="hard">Hard (30s per question)</option>
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
                  <option value="essay">Essay</option>
                </select>
              </div>
            </div>
            <Button
              onClick={generateRandomQuiz}
              disabled={quizState.loading || pdfLoading}
              className="w-full font-medium"
            >
              {quizState.loading
                ? "Generating Questions..."
                : "Generate Questions"}
            </Button>
          </div>

          {/* Recent Generated Quizzes */}
          {!quizState.quizStarted && (
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
                    <Button>View</Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quiz Interface */}
      {renderQuiz()}
    </div>
  );
};

export default Practice;
