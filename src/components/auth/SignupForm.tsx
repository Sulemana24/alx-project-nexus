// components/auth/SignupForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

interface SignupFormProps {
  onSwitchToLogin: () => void;
  onSignup: (data: SignupData) => void;
  role: "student" | "teacher";
  isLoading?: boolean;
  error?: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "student" | "teacher";
  institution?: string;
  subject?: string;
  agreeToTerms: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSwitchToLogin,
  onSignup,
  role,
  isLoading = false,
  error,
}) => {
  const [formData, setFormData] = useState<SignupData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: role,
    institution: "",
    subject: "",
    agreeToTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!formData.agreeToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }
    onSignup(formData);
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
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
                  console.log("Logo activated via keyboard!");
                  window.location.href = "/";
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Learnify logo - click to go back home"
            >
              <span className="filter drop-shadow-sm">L</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Learnify
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Join as {role === "student" ? "Student" : "Teacher"}
            </h2>
            <p className="text-gray-500 text-sm">
              Start your learning journey with thousands of {role}s worldwide
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-xl border-0 rounded-2xl backdrop-blur-sm bg-white/70">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="First name"
                    className="rounded-lg border-gray-200 text-black focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Last name"
                    className="rounded-lg border-gray-200 text-black focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="rounded-lg text-black border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
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

              {/* Role-specific Fields */}
              {role === "teacher" && (
                <div>
                  <Input
                    label="Institution"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    placeholder="School or university"
                    className="rounded-lg border-gray-200 text-black focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
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
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    }
                  />
                </div>
              )}

              {role === "student" && (
                <div>
                  <Input
                    label="Institution (Optional)"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    placeholder="School or university"
                    className="rounded-lg border-gray-200 text-black focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
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
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    }
                  />
                </div>
              )}

              {/* Password Fields */}
              <div>
                <Input
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a password"
                  className="rounded-lg text-black border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                  icon={
                    <div onClick={() => setShowPassword((prev) => !prev)}>
                      {showPassword ? (
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      ) : (
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
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.225-3.568m3.123-2.432A9.986 9.986 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.97 9.97 0 01-1.357 2.568M15 12a3 3 0 00-3-3m0 0a3 3 0 013 3m-3-3L3 3"
                          />
                        </svg>
                      )}
                    </div>
                  }
                />
              </div>

              <div>
                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                  className="rounded-lg text-black border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                  icon={
                    <div
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? (
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      ) : (
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
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.225-3.568m3.123-2.432A9.986 9.986 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.97 9.97 0 01-1.357 2.568M15 12a3 3 0 00-3-3m0 0a3 3 0 013 3m-3-3L3 3"
                          />
                        </svg>
                      )}
                    </div>
                  }
                />
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5 flex-shrink-0"
                />
                <span className="text-sm text-gray-700">
                  I agree to the{" "}
                  <a
                    href="/terms-of-service"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy-policy"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Privacy Policy
                  </a>
                </span>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading
                  ? "Creating Account..."
                  : `Create ${
                      role === "student" ? "Student" : "Teacher"
                    } Account`}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Switch to Login */}
        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-blue-400 hover:text-blue-500 font-semibold transition-colors duration-200 hover:underline"
              disabled={isLoading}
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
