import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPDF, extractKeyConcepts } from "@/utils/pdfParser";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("pdf") as File | null;
    const numQuestions = parseInt(
      (formData.get("numQuestions") as string) || "5"
    );
    const difficulty = (formData.get("difficulty") as string) || "easy";
    const questionType =
      (formData.get("questionType") as string) || "multiple-choice";

    if (!file) {
      return NextResponse.json(
        { error: "No PDF file provided" },
        { status: 400 }
      );
    }

    // Step 1: Extract text from PDF
    const text = await extractTextFromPDF(file);

    // Step 2: Extract key concepts from text
    const keyConcepts = extractKeyConcepts(text);

    // Step 3: Generate questions dynamically
    const questions: Question[] = [];
    for (let i = 0; i < numQuestions; i++) {
      const concept = keyConcepts[i % keyConcepts.length] || `Concept ${i + 1}`;
      const question = generateQuestion(
        concept,
        questionType,
        difficulty,
        file.name
      );
      questions.push(question);
    }

    return NextResponse.json({
      title: file.name.replace(".pdf", ""),
      content: text.substring(0, 500) + (text.length > 500 ? "..." : ""),
      questions,
      pages: 1, // Since we don’t parse actual page count
      info: "PDF processed successfully",
    });
  } catch (error) {
    console.error("PDF processing error:", error);
    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 }
    );
  }
}

// Function to generate a single question
function generateQuestion(
  concept: string,
  type: string,
  difficulty: string,
  fileName: string
): Question {
  switch (type) {
    case "multiple-choice":
      return {
        question: `What is the primary focus of "${concept}" in this document?`,
        options: [
          `Correct understanding of ${concept}`,
          `Common misconception about ${concept}`,
          `Unrelated topic`,
          `Partial understanding`,
        ],
        correctAnswer: 0,
        explanation: `"${concept}" is discussed as a key aspect in ${fileName.replace(
          ".pdf",
          ""
        )}.`,
      };

    case "true-false":
      const isTrue = Math.random() > 0.5;
      return {
        question: `"${concept}" is a significant concept discussed in this document.`,
        options: ["True", "False"],
        correctAnswer: isTrue ? 0 : 1,
        explanation: isTrue
          ? `"${concept}" is mentioned in the content.`
          : `"${concept}" is not emphasized in the content.`,
      };

    case "fill-in":
      return {
        question: `The document emphasizes that ______ is crucial in understanding ${concept}.`,
        options: [
          concept,
          "Fundamental principle",
          "Key methodology",
          "Basic concept",
        ],
        correctAnswer: 0,
        explanation: `The correct answer is "${concept}" based on the document's content.`,
      };

    case "essay":
      return {
        question: `Discuss the significance of "${concept}" in the context of the document. Provide examples and references.`,
        options: [
          "Detailed analysis with examples",
          "General summary",
          "Minimal coverage",
          "Theoretical discussion",
        ],
        correctAnswer: 0,
        explanation: `An ideal response references "${concept}" and its application in the document.`,
      };

    default:
      return {
        question: `Explain the importance of "${concept}" in this document.`,
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correctAnswer: 0,
        explanation: `This question tests understanding of "${concept}".`,
      };
  }
}
