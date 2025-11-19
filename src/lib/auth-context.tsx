"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

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

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string,
    role: "student" | "teacher"
  ) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for Firebase auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

        if (userDoc.exists()) {
          const data = userDoc.data();

          setUser({
            id: firebaseUser.uid,
            firstName: data.firstName,
            lastName: data.lastName,
            email: firebaseUser.email!,
            role: data.role,
            institution: data.institution,
          });
        }
      } else {
        setUser(null);
      }

      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // SIGNUP
  const signup = async (userData: SignupData): Promise<boolean> => {
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      const userDoc = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        institution: userData.institution || null,
      };

      await setDoc(doc(db, "users", cred.user.uid), userDoc);

      // OPTIONAL: prevent auto-login
      await signOut(auth);

      return true;
    } catch (err) {
      console.error("Signup error:", err);
      return false;
    }
  };

  // LOGIN
  const login = async (
    email: string,
    password: string,
    role: "student" | "teacher"
  ): Promise<boolean> => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      const userDoc = await getDoc(doc(db, "users", cred.user.uid));

      if (!userDoc.exists()) return false;

      const data = userDoc.data();

      // Ensure that the role matches
      if (data.role !== role) {
        return false;
      }

      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  // LOGOUT
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
