// components/auth/LoginForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

interface LoginFormProps {
  onSwitchToSignup: () => void;
  onLogin: (
    email: string,
    password: string,
    role: "student" | "teacher"
  ) => void;
  defaultRole?: "student" | "teacher";
  isLoading?: boolean;
  error?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToSignup,
  onLogin,
  defaultRole = "student",
  isLoading = false,
  error,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: defaultRole,
    rememberMe: false,
  });

  // 🔵 Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const togglePassword = () => setShowPassword((p) => !p);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs before submitting
    if (!formData.email || !formData.password) {
      return; // Let the browser handle required field validation
    }

    setLocalLoading(true);

    try {
      await onLogin(formData.email, formData.password, formData.role);
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const isActuallyLoading = isLoading || localLoading;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex flex-col items-center justify-center mb-8">
            <div
              className="bg-[#3b82f6] text-white w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg mb-4 cursor-pointer transition-all duration-300 hover:scale-110 hover:rotate-12 hover:bg-blue-700 active:scale-95"
              onClick={() => (window.location.href = "/")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  window.location.href = "/";
                }
              }}
              tabIndex={0}
              role="button"
            >
              <span className="filter drop-shadow-sm">L</span>
            </div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Learnify
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {isActuallyLoading ? "Signing you in..." : "Welcome back"}
            </h2>
            <p className="text-gray-500 text-sm">
              {isActuallyLoading
                ? "Please wait while we authenticate..."
                : "Sign in to continue your learning journey"}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card
          className={`shadow-xl border-0 rounded-2xl backdrop-blur-sm bg-white/70 transition-all duration-300 ${
            isActuallyLoading ? "opacity-90 scale-[0.995]" : ""
          }`}
        >
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message - Using the existing error prop */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm animate-pulse">
                  🔴 {error}
                </div>
              )}

              {/* Loading Overlay */}
              {isActuallyLoading && (
                <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center z-10 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">
                      Authenticating...
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Checking credentials
                    </p>
                  </div>
                </div>
              )}

              {/* Role Selection */}
              <div className={isActuallyLoading ? "opacity-50" : ""}>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  I am a
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, role: "student" }))
                    }
                    className={`p-4 border-2 rounded-xl text-center transition-all duration-200 ${
                      formData.role === "student"
                        ? "border-blue-500 bg-blue-50 text-blue-600 shadow-md"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:shadow-sm"
                    } ${isActuallyLoading ? "cursor-not-allowed" : ""}`}
                    disabled={isActuallyLoading}
                  >
                    <div className="text-xl mb-2">🎓</div>
                    <div className="text-sm font-semibold">Student</div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, role: "teacher" }))
                    }
                    className={`p-4 border-2 rounded-xl text-center transition-all duration-200 ${
                      formData.role === "teacher"
                        ? "border-blue-500 bg-blue-50 text-blue-600 shadow-md"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:shadow-sm"
                    } ${isActuallyLoading ? "cursor-not-allowed" : ""}`}
                    disabled={isActuallyLoading}
                  >
                    <div className="text-xl mb-2">👨‍🏫</div>
                    <div className="text-sm font-semibold">Teacher</div>
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className={isActuallyLoading ? "opacity-50" : ""}>
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="rounded-lg text-black border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                  disabled={isActuallyLoading}
                  icon={
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  }
                />
              </div>

              {/* Password (with toggle added) */}
              <div
                className={`relative ${isActuallyLoading ? "opacity-50" : ""}`}
              >
                <Input
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="rounded-lg text-black border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                  disabled={isActuallyLoading}
                  icon={
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  }
                />

                {/* 👁 Toggle Button (right side) */}
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-[42px] text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  tabIndex={-1}
                  disabled={isActuallyLoading}
                >
                  {showPassword ? (
                    // Eye Open
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    // Eye Closed
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a10.05 10.05 0 012.223-3.592M6.18 6.18A9.96 9.96 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.953 9.953 0 01-4.109 5.06M3 3l18 18"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Remember Me */}
              <div
                className={`flex items-center justify-between ${
                  isActuallyLoading ? "opacity-50" : ""
                }`}
              >
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={isActuallyLoading}
                  />
                  <span className="text-sm text-gray-700 font-medium">
                    Remember me
                  </span>
                </label>

                <a
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
                >
                  Forgot password?
                </a>
              </div>

              {/* Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 relative overflow-hidden"
                isLoading={isActuallyLoading}
                disabled={isActuallyLoading}
              >
                {isActuallyLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  "Sign In to Your Account"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Switch */}
        <div className={`text-center ${isActuallyLoading ? "opacity-50" : ""}`}>
          <p className="text-gray-600">
            Don&apos;t have an account?{" "}
            <button
              onClick={onSwitchToSignup}
              className="text-blue-500 hover:text-blue-600 font-semibold hover:underline transition-colors duration-200"
              disabled={isActuallyLoading}
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
