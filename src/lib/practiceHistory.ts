import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";

export interface FirestoreQuizAttempt {
  course: string;
  topic: string;
  subtopic?: string;
  score: number;
  totalQuestions: number;
  questionType: string;
  difficulty: string;
  attemptedAt: number;
}

export const saveQuizAttempt = async (
  userId: string,
  quizAttempt: FirestoreQuizAttempt
) => {
  const colRef = collection(db, "users", userId, "quizHistory");
  await addDoc(colRef, quizAttempt);
};

export const getQuizHistory = async (
  userId: string,
  limitCount = 10
): Promise<FirestoreQuizAttempt[]> => {
  const colRef = collection(db, "users", userId, "quizHistory");
  const q = query(colRef, orderBy("attemptedAt", "desc"), limit(limitCount));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as FirestoreQuizAttempt);
};
