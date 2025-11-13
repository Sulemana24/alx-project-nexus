"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "student" | "teacher" | "admin";
  institution?: string;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  password: string;
  role: "student" | "teacher";
  institution?: string;
}

interface StoredUser extends SignupData {
  id: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string,
    role: "student" | "teacher"
  ) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("learnify_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const timer = setTimeout(() => setIsLoading(false), 0);

    return () => clearTimeout(timer);
  }, []);

  const login = async (
    email: string,
    password: string,
    role: "student" | "teacher"
  ): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const users: StoredUser[] = JSON.parse(
      localStorage.getItem("learnify_users") || "[]"
    );

    const foundUser = users.find(
      (u) => u.email === email && u.password === password && u.role === role
    );

    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        email: foundUser.email,
        role: foundUser.role,
        institution: foundUser.institution,
      };

      setUser(userData);
      localStorage.setItem("learnify_user", JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const users: StoredUser[] = JSON.parse(
      localStorage.getItem("learnify_users") || "[]"
    );

    if (users.find((u) => u.email === userData.email)) {
      setIsLoading(false);
      return false;
    }

    const newUser: StoredUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("learnify_users", JSON.stringify(users));

    const userWithoutPassword: User = {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
      institution: newUser.institution,
    };

    setUser(userWithoutPassword);
    localStorage.setItem("learnify_user", JSON.stringify(userWithoutPassword));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("learnify_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
