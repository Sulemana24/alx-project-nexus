"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/use-toast";

interface AuthSelectionProps {
  onRoleSelect: (role: "student" | "teacher") => void;
  onSwitchToLogin: () => void;
}

export const AuthSelection: React.FC<AuthSelectionProps> = ({
  onRoleSelect,
  onSwitchToLogin,
}) => {
  const { toast } = useToast();

  const handleRoleSelect = (role: "student" | "teacher") => {
    onRoleSelect(role);

    // Show toast
    toast({
      title: `${role === "student" ? "Student" : "Teacher"} role selected`,
      description:
        role === "student"
          ? "You can now start practicing quizzes!"
          : "You can now start creating quizzes and managing classes!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div
              className="bg-[#3b82f6] text-white w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg mb-4 cursor-pointer transition-all duration-300 hover:scale-110 hover:rotate-12 hover:bg-blue-700 active:scale-95"
              onClick={() => (window.location.href = "/")}
              tabIndex={0}
              role="button"
              aria-label="Learnify logo - click to go back home"
            >
              L
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Learnify</h1>
          </div>
          <p className="text-gray-600">Choose how you want to use Learnify</p>
        </div>

        {/* Role Selection Cards */}
        <div className="space-y-4">
          {/* Student Card */}
          <div
            className="cursor-pointer"
            onClick={() => handleRoleSelect("student")}
          >
            <Card
              hover
              className="cursor-pointer border-2 border-transparent hover:border-[#3B82F6] transition-all duration-200"
            >
              <CardContent className="pt-6 flex items-center space-x-4">
                <div className="bg-[#3B82F6] text-white w-12 h-12 rounded-lg flex items-center justify-center text-xl">
                  🎓
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Student
                  </h3>
                  <p className="text-blue-100 text-sm">
                    Practice with AI-generated quizzes and track your progress
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Teacher Card */}
          <div
            className="cursor-pointer"
            onClick={() => handleRoleSelect("teacher")}
          >
            <Card
              hover
              className="cursor-pointer border-2 border-transparent hover:border-[#3B82F6] transition-all duration-200"
            >
              <CardContent className="pt-6 flex items-center space-x-4">
                <div className="bg-[#3B82F6] text-white w-12 h-12 rounded-lg flex items-center justify-center text-xl">
                  👨‍🏫
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Teacher
                  </h3>
                  <p className="text-blue-100 text-sm">
                    Create quizzes, manage classes, and track student progress
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Switch to Login */}
        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-[#3B82F6] hover:text-blue-700 font-medium transition-colors duration-200"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
