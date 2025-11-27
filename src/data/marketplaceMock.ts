import { Quiz, User } from "@/types";
import { mockQuizzes, mockUsers } from "./mock-data";

export type MarketplaceQuiz = {
  id: string;
  title: string;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
  creatorId: string;
  creatorName: string;
  price: number;
  rating?: number;
  reviews?: { teacherId: string; comment: string }[];
  description?: string;
  questionCount?: number;
  downloads?: number;
};

export const mockMarketplaceQuizzes: MarketplaceQuiz[] = mockQuizzes.map(
  (quiz, idx) => ({
    id: `market-${quiz.id}`,
    title: quiz.title,
    subject: quiz.title.includes("Math") ? "Mathematics" : "Programming",
    difficulty: idx % 2 === 0 ? "Easy" : "Medium",
    creatorId: quiz.creator.id,
    creatorName: quiz.creator.name,
    price: idx % 2 === 0 ? 0 : 5,
    rating: Math.floor(Math.random() * 5) + 1,
    reviews: [
      {
        teacherId: mockUsers[1].id,
        comment: "Very useful quiz!",
      },
    ],
    description: quiz.description,
    questionCount: quiz.questions.length,
    downloads: quiz.downloads,
  })
);
