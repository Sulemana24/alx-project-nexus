// components/auth/AdminAuthForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth, SignupData } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export const AdminAuthForm: React.FC = () => {
  const { login, signup } = useAuth();
  const router = useRouter();

  const [isLoginView, setIsLoginView] = useState(true);

  // Shared states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Signup-specific states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = () => setShowPassword((p) => !p);
  const toggleConfirmPassword = () => setShowConfirmPassword((p) => !p);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const success = await login(email, password, "admin");
    setIsLoading(false);

    if (success) {
      router.push("/dashboard/admin");
    } else {
      setError("Invalid credentials or not an admin.");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    const data: SignupData = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      agreeToTerms: true,
      role: "admin",
    };

    const success = await signup(data);
    setIsLoading(false);

    if (success) {
      // Auto-login admin after signup
      const loggedIn = await login(email, password, "admin");
      if (loggedIn) router.push("/dashboard/admin");
      else setError("Signup successful, but auto-login failed.");
    } else {
      setError("Signup failed. Email may already exist.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={isLoginView ? handleLogin : handleSignup}
        className="bg-white p-8 rounded-2xl shadow-md space-y-4 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center text-black">
          {isLoginView ? "Admin Login" : "Admin Signup"}
        </h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}

        {!isLoginView && (
          <>
            <Input
              className="text-black"
              label="First Name"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              className="text-black"
              label="Last Name"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </>
        )}

        <Input
          className="text-black"
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password Input with Toggle */}
        <div className="relative">
          <Input
            className="text-black pr-10"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="*************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
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

        {/* Confirm Password Input with Toggle (only in signup) */}
        {!isLoginView && (
          <div className="relative">
            <Input
              className="text-black pr-10"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="*************"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={toggleConfirmPassword}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
              tabIndex={-1}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
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
        )}

        <Button type="submit" className="w-full" isLoading={isLoading}>
          {isLoading
            ? isLoginView
              ? "Logging in..."
              : "Signing up..."
            : isLoginView
            ? "Login"
            : "Signup"}
        </Button>

        <div className="text-center text-sm text-gray-600">
          {isLoginView ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => setIsLoginView(false)}
              >
                Signup
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => setIsLoginView(true)}
              >
                Login
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};
