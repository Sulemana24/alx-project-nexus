"use client";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { mockQuizzes, mockQuizAttempts } from "@/data/mock-data";

interface Quiz {
  id: string;
  title: string;
  duration: number;
  totalMarks: number;
  creator: {
    name: string;
  };
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
    marks: number;
  }[];
  createdAt: Date;
}

const MyQuizzes = () => {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizStarted, setQuizStarted] = useState(false);

  const handleSubmitQuiz = () => {
    // Calculate score
    if (!currentQuiz) return;

    const score = currentQuiz.questions.reduce(
      (total: number, question, index) => {
        if (answers[index] === question.correctAnswer) {
          return total + question.marks;
        }
        return total;
      },
      0
    );

    // Show results
    alert(`Quiz submitted! Your score: ${score}/${currentQuiz.totalMarks}`);

    // Reset quiz state
    setCurrentQuiz(null);
    setQuizStarted(false);
    setTimeLeft(0);
  };

  // Timer effect
  useEffect(() => {
    if (!quizStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, timeLeft]);

  const startQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestionIndex(0);
    setTimeLeft(quiz.duration * 60);
    setAnswers({});
    setQuizStarted(true);
  };

  const handleAnswerSelect = (optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleNextQuestion = () => {
    if (
      currentQuiz &&
      currentQuestionIndex < currentQuiz.questions.length - 1
    ) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Quizzes</h2>
        <p className="text-gray-600">
          Track your quiz performance and upcoming assessments
        </p>

        {/* Join Quiz Form */}
        <div className="mt-4 bg-white border border-gray-200 rounded-xl p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Join a Quiz
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const quizCode = formData.get("quizCode") as string;
              const studentName = formData.get("studentName") as string;

              // Handle join quiz logic here
              console.log("Joining quiz:", { quizCode, studentName });
              alert(`Joining quiz ${quizCode} as ${studentName}`);
            }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="quizCode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quiz Code
              </label>
              <input
                type="text"
                id="quizCode"
                name="quizCode"
                placeholder="Enter quiz code"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
              />
            </div>
            <div>
              <label
                htmlFor="studentName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Name
              </label>
              <input
                type="text"
                id="studentName"
                name="studentName"
                placeholder="Enter your name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
              />
            </div>
            <div>
              <label
                htmlFor="studentIndex"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Index Number
              </label>
              <input
                type="text"
                id="studentNumber"
                name="studentNumber"
                placeholder="Enter your index number"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
              />
            </div>
            <Button type="submit" className="w-full">
              Join Quiz
            </Button>
          </form>
        </div>
      </div>

      {/* Quiz Interface */}
      {currentQuiz ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {/* Quiz Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {currentQuiz.title}
              </h3>
              <p className="text-gray-600">
                Question {currentQuestionIndex + 1} of{" "}
                {currentQuiz.questions.length}
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg font-semibold">
                Time Left: {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, "0")}
              </div>
            </div>
          </div>

          {/* Current Question */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              {currentQuiz.questions[currentQuestionIndex].question}
            </h4>

            <div className="space-y-3">
              {currentQuiz.questions[currentQuestionIndex].options.map(
                (option: string, index: number) => (
                  <label
                    key={index}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="quiz-answer"
                      value={index}
                      checked={answers[currentQuestionIndex] === index}
                      onChange={() => handleAnswerSelect(index)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-900">{option}</span>
                  </label>
                )
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              Previous
            </Button>

            {currentQuestionIndex === currentQuiz.questions.length - 1 ? (
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
      ) : (
        <>
          {/* Upcoming Quiz */}
          <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Upcoming Quiz
            </h3>
            {mockQuizzes.slice(0, 1).map((quiz) => (
              <div
                key={quiz.id}
                className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0"
              >
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900">{quiz.title}</p>
                  <p className="text-sm text-gray-600">
                    Date: {quiz.createdAt.toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Duration: {quiz.duration} mins
                  </p>
                  <p className="text-sm text-gray-600">
                    Questions: {quiz.questions.length}
                  </p>
                  <p className="text-sm text-gray-600">
                    Lecturer: {quiz.creator.name}
                  </p>
                </div>
                <Button
                  onClick={() => startQuiz(quiz)}
                  className="w-full md:w-auto "
                >
                  Start Quiz
                </Button>
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
                <div key={attempt.id} className="p-4">
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
                          Duration: {Math.floor(attempt.timeSpent / 60)} mins
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
                        {Math.round((attempt.score / attempt.totalMarks) * 100)}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyQuizzes;
