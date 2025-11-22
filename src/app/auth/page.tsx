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

  const { user, login, logout, signup, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      switch (user.role) {
        case "student":
          router.push("/dashboard/student");
          break;
        case "teacher":
          router.push("/dashboard/teacher");
          break;
        case "admin":
          router.push("/dashboard/admin");
          break;
      }
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

  // Role selection
  const handleRoleSelect = (role: "student" | "teacher") => {
    setSelectedRole(role);
    setCurrentView("signup");
    setAuthError("");
  };

  // Switch views
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

  // LOGIN
  const handleLogin = async (
    email: string,
    password: string,
    role: "student" | "teacher"
  ) => {
    setAuthError("");
    try {
      const success = await login(email, password, role);
      if (!success) {
        setAuthError("Invalid email, password, or role selection");
      }
      // else, onAuthStateChanged will redirect
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAuthError(err.message);
      } else {
        setAuthError("Login failed");
      }
    }
  };

  // SIGNUP
  const handleSignup = async (data: SignupData) => {
    setAuthError("");
    try {
      const result = await signup(data); // returns { success: boolean, message: string }

      if (result.success) {
        // ✅ Show success message
        alert(result.message); // or use toast.success(result.message)

        // ✅ Redirect based on role
        if (data.role === "student") {
          router.push("/dashboard/student");
        } else if (data.role === "teacher") {
          router.push("/dashboard/teacher");
        }
      } else {
        setAuthError(result.message || "Signup failed");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAuthError(err.message);
      } else {
        setAuthError("Signup failed");
      }
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
