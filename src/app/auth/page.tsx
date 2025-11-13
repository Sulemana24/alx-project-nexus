// app/auth/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { AuthSelection } from "@/components/auth/AuthSelection";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm, SignupData } from "@/components/auth/SignupForm";

type AuthView = "selection" | "login" | "signup";

export default function AuthPage() {
  const [currentView, setCurrentView] = useState<AuthView>("selection");
  const [selectedRole, setSelectedRole] = useState<"student" | "teacher">(
    "student"
  );
  const [authError, setAuthError] = useState<string>("");
  const { user, login, signup, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !isLoading) {
      router.push(
        user.role === "student" ? "/dashboard/student" : "/dashboard/teacher"
      );
    }
  }, [user, isLoading, router]);

  // Hide header and footer
  useEffect(() => {
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");

    if (header) header.style.display = "none";
    if (footer) footer.style.display = "none";

    return () => {
      if (header) header.style.display = "";
      if (footer) footer.style.display = "";
    };
  }, []);

  const handleRoleSelect = (role: "student" | "teacher") => {
    setSelectedRole(role);
    setCurrentView("signup");
    setAuthError("");
  };

  const handleSwitchToLogin = () => {
    setCurrentView("login");
    setAuthError("");
  };

  const handleSwitchToSignup = () => {
    setCurrentView("signup");
    setAuthError("");
  };

  const handleSwitchToSelection = () => {
    setCurrentView("selection");
    setAuthError("");
  };

  const handleLogin = async (
    email: string,
    password: string,
    role: "student" | "teacher"
  ) => {
    setAuthError("");
    const success = await login(email, password, role);

    if (success) {
      // Navigation will be handled by the useEffect above
    } else {
      setAuthError("Invalid email, password, or role selection");
    }
  };

  const handleSignup = async (data: SignupData) => {
    setAuthError("");
    const success = await signup(data);

    if (success) {
      // Navigation will be handled by the useEffect above
    } else {
      setAuthError("Email already exists or signup failed");
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "selection":
        return (
          <AuthSelection
            onRoleSelect={handleRoleSelect}
            onSwitchToLogin={handleSwitchToLogin}
          />
        );
      case "login":
        return (
          <LoginForm
            onSwitchToSignup={handleSwitchToSignup}
            onLogin={handleLogin}
            defaultRole={selectedRole}
            isLoading={isLoading}
            error={authError}
          />
        );
      case "signup":
        return (
          <SignupForm
            onSwitchToLogin={handleSwitchToLogin}
            onSignup={handleSignup}
            role={selectedRole}
            isLoading={isLoading}
            error={authError}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Back button for login/signup views */}
      {(currentView === "login" || currentView === "signup") && (
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={handleSwitchToSelection}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
            disabled={isLoading}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>
        </div>
      )}

      {renderCurrentView()}
    </div>
  );
}
