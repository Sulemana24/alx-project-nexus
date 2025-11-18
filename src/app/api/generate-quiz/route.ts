import { NextRequest, NextResponse } from "next/server";

type QuestionOption = {
  [key: string]: string;
};

interface QuizQuestion {
  question: string;
  options: QuestionOption;
  answer: string;
}

export async function POST(request: NextRequest) {
  try {
    const { course, topic, numQuestions, difficulty, type } =
      await request.json();

    console.log("Received request:", {
      course,
      topic,
      numQuestions,
      difficulty,
      type,
    });

    if (!course || !topic) {
      return NextResponse.json(
        { error: "Course and topic are required" },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: "Google API key not configured" },
        { status: 500 }
      );
    }

    return await generateWithGemini(
      course,
      topic,
      numQuestions,
      difficulty,
      type
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error occurred";
    console.error("Quiz generation error:", message);

    return NextResponse.json(
      { error: "Failed to generate quiz: " + message },
      { status: 500 }
    );
  }
}

function generatePrompt(
  course: string,
  topic: string,
  numQuestions: string,
  difficulty: string,
  type: string
): string {
  const basePrompt = `As an expert educational quiz generator, create exactly ${numQuestions} high-quality ${difficulty} ${type} questions about "${topic}" in the context of "${course}".

CRITICAL REQUIREMENTS:
- No repetition
- No clues
- Strictly JSON output
  `;

  switch (type) {
    case "true-false":
      return (
        basePrompt +
        `
FORMAT:
[
  {
    "question": "statement?",
    "options": { "A": "True", "B": "False" },
    "answer": "A"
  }
]`
      );

    case "fill-in":
      return (
        basePrompt +
        `
FORMAT:
[
  {
    "question": "Sentence with _____?",
    "options": {
      "A": "Correct answer",
      "B": "Wrong option",
      "C": "Wrong option",
      "D": "Wrong option"
    },
    "answer": "A"
  }
]`
      );

    case "essay":
      return (
        basePrompt +
        `
FORMAT:
[
  {
    "question": "Open-ended question?",
    "options": { "A": "Essay required" },
    "answer": "A"
  }
]`
      );

    default:
      return (
        basePrompt +
        `
FORMAT:
[
  {
    "question": "MCQ?",
    "options": {
      "A": "Option",
      "B": "Option",
      "C": "Option",
      "D": "Correct"
    },
    "answer": "D"
  }
]`
      );
  }
}

async function generateWithGemini(
  course: string,
  topic: string,
  numQuestions: string,
  difficulty: string,
  type: string
) {
  const prompt = generatePrompt(course, topic, numQuestions, difficulty, type);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: type === "essay" ? 0.8 : 0.7,
            maxOutputTokens: 2000,
            topP: 0.8,
            topK: 40,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || "Gemini API Error");
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) throw new Error("Empty content returned from Gemini");

    const questions = processGeminiResponse(rawText);

    const validQuestions = validateQuestionsByType(questions, type);

    return NextResponse.json(validQuestions);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown Gemini error";
    console.error("Gemini generation failed:", message);
    throw new Error(message);
  }
}

function validateQuestionsByType(
  questions: QuizQuestion[],
  type: string
): QuizQuestion[] {
  return questions.filter((q) => {
    if (!q.question || !q.options || !q.answer) return false;

    const keys = Object.keys(q.options);

    switch (type) {
      case "true-false":
        return (
          keys.length === 2 &&
          (q.answer === "A" || q.answer === "B") &&
          keys.includes("A") &&
          keys.includes("B")
        );

      case "fill-in":
        return keys.length === 4 && q.question.includes("_____");

      case "essay":
        return q.question.length > 20 && q.answer === "A";

      default:
        return keys.length === 4;
    }
  });
}

function processGeminiResponse(content: string): QuizQuestion[] {
  let cleaned = content.trim();
  cleaned = cleaned.replace(/```json|```/g, "");

  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed;
  } catch {}

  const match = cleaned.match(/\[\s*{[\s\S]+?}\s*\]/);
  if (match) {
    return JSON.parse(match[0]);
  }

  throw new Error("Could not extract JSON quiz questions");
}
