"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth, db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export type UserRole = "student" | "teacher" | "admin";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  institution?: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  institution?: string;
  agreeToTerms: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  signup: (
    userData: SignupData
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
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
          } else {
            await signOut(auth);
            setUser(null);
          }
        } catch (err) {
          console.error("Error fetching user doc:", err);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // SIGNUP — Type-safe version
  const signup = async (
    userData: SignupData
  ): Promise<{ success: boolean; message: string }> => {
    try {
      // Check if email already registered
      const methods = await fetchSignInMethodsForEmail(auth, userData.email);
      if (methods.length > 0) {
        return {
          success: false,
          message: "This email is already registered.",
        };
      }

      // Create Firebase Auth user
      const cred = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      // Create Firestore user document
      const userDoc = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
        institution: userData.institution || null,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", cred.user.uid), userDoc);

      // Auto-login user
      setUser({
        id: cred.user.uid,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
        institution: userData.institution,
      });

      // 🎉 SUCCESS
      return {
        success: true,
        message: "Account created successfully! Logging you in...",
      };
    } catch (err) {
      if (err instanceof FirebaseError) {
        let errorMessage = "Signup failed. Please try again.";

        switch (err.code) {
          case "auth/email-already-in-use":
            errorMessage = "This email is already registered.";
            break;
          case "auth/weak-password":
            errorMessage = "Your password is too weak.";
            break;
          case "auth/invalid-email":
            errorMessage = "Invalid email address.";
            break;
        }

        return { success: false, message: errorMessage };
      }

      return {
        success: false,
        message: "Unexpected error occurred.",
      };
    }
  };

  // LOGIN — Type-safe version
  const login = async (
    email: string,
    password: string,
    role: UserRole
  ): Promise<boolean> => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", cred.user.uid));

      if (!userDoc.exists()) {
        console.error("User document not found in Firestore");
        await signOut(auth);
        return false;
      }

      const data = userDoc.data();

      if (data.role !== role) {
        console.error(`Role mismatch: Expected ${role}, got ${data.role}`);
        await signOut(auth);
        return false;
      }

      setUser({
        id: cred.user.uid,
        firstName: data.firstName,
        lastName: data.lastName,
        email: cred.user.email!,
        role: data.role,
        institution: data.institution,
      });

      return true;
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        console.error("Login error:", err.code, err.message);

        switch (err.code) {
          case "auth/user-not-found":
            console.error("User not found");
            break;
          case "auth/wrong-password":
            console.error("Incorrect password");
            break;
          case "auth/invalid-email":
            console.error("Invalid email");
            break;
        }
      } else {
        console.error("Unknown login error:", err);
      }

      return false;
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
