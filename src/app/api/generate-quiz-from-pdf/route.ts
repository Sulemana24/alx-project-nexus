import { NextRequest, NextResponse } from "next/server";
import path from "path";

// Types
interface QuestionOption {
  [key: string]: string;
}

interface QuizQuestion {
  question: string;
  options: QuestionOption;
  answer: string;
}

const UPLOAD_DIR = path.join(process.cwd(), "uploads/pdfs");

export async function POST(request: NextRequest) {
  try {
    const { fileId, topic, numQuestions, difficulty, type } =
      await request.json();

    console.log("📄 PDF Quiz Generation Request:", {
      fileId,
      topic,
      numQuestions,
      difficulty,
      type,
    });

    if (!fileId) {
      return NextResponse.json(
        { error: "PDF file ID is required" },
        { status: 400 }
      );
    }

    const pdfContext = await getPDFContext(fileId, topic);

    const prompt = generateQuizPrompt(
      topic || "General",
      numQuestions,
      difficulty,
      type,
      pdfContext
    );

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Gemini API error:", errorData);
      throw new Error(errorData.error?.message || "AI error");
    }

    const data = await response.json();
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const questions = processGeminiResponse(content);

    return NextResponse.json(questions);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";

    console.error("❌ PDF quiz generation error:", message);

    return NextResponse.json(
      {
        error:
          "Failed to generate quiz from PDF. Try again with a different topic or file.",
      },
      { status: 500 }
    );
  }
}

// Load PDF metadata or fallback context
async function getPDFContext(fileId: string, topic: string): Promise<string> {
  try {
    // We are NOT reading file contents (pdf parsing not added yet)
    const pdfPath = path.join(UPLOAD_DIR, `${fileId}.pdf`);

    // Check if file exists
    // (Using fs.access instead of readFile)
    const fs = await import("fs/promises");

    try {
      await fs.access(pdfPath);
    } catch {
      console.warn("⚠ PDF file not found, using generic context");
    }

    if (topic && topic !== "General") {
      return `Educational content about ${topic}. Includes concepts, definitions, applications, and examples.`;
    }

    return "General course material covering key concepts, definitions, and explanations.";
  } catch {
    return "General educational material explaining concepts with examples.";
  }
}

function generateQuizPrompt(
  topic: string,
  numQuestions: string,
  difficulty: string,
  type: string,
  context: string
): string {
  const formats: Record<string, string> = {
    "multiple-choice": `[
      {
        "question": "Example question?",
        "options": {"A":"Correct", "B":"Wrong1", "C":"Wrong2", "D":"Wrong3"},
        "answer":"A"
      }
    ]`,
    "true-false": `[
      {
        "question": "Statement?",
        "options": {"A":"True", "B":"False"},
        "answer":"A"
      }
    ]`,
    "fill-in": `[
      {
        "question": "Sentence with _____?",
        "options": {"A":"Correct", "B":"Wrong1", "C":"Wrong2", "D":"Wrong3"},
        "answer":"A"
      }
    ]`,
    essay: `[
      {
        "question": "Explain ...?",
        "options":{"A":"Essay required"},
        "answer":"A"
      }
    ]`,
  };

  return `
Generate exactly ${numQuestions} ${difficulty} ${type} questions on "${topic}".

CONTEXT:
${context}

RULES:
- Questions must be aligned with the topic
- No repetition
- No clues in options
- Return ONLY valid JSON array
- Use the format below

FORMAT:
${formats[type]}

Generate the quiz now.
`;
}

function processGeminiResponse(content: string): QuizQuestion[] {
  const clean = content.trim().replace(/```json|```/g, "");

  try {
    // Attempt strict array extract
    const match = clean.match(/\[\s*{[\s\S]*?}\s*\]/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed)) return parsed as QuizQuestion[];
    }

    // Direct parse fallback
    const direct = JSON.parse(clean);
    if (Array.isArray(direct)) return direct as QuizQuestion[];
  } catch (e) {
    console.warn("⚠ AI JSON parsing failed, using fallback questions");
  }

  // Fallback backup questions
  return [
    {
      question: "What is the purpose of educational materials?",
      options: {
        A: "To teach concepts",
        B: "To entertain",
        C: "To confuse learners",
        D: "To collect data",
      },
      answer: "A",
    },
    {
      question: "Which method improves learning?",
      options: {
        A: "Active practice",
        B: "Guessing randomly",
        C: "Ignoring mistakes",
        D: "Skipping reading",
      },
      answer: "A",
    },
  ];
}
