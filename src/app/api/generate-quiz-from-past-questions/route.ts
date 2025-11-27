import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { pastQuestions, topic, course, numQuestions, difficulty, type } =
      await request.json();

    if (!pastQuestions) {
      return NextResponse.json(
        { error: "Past questions content is required" },
        { status: 400 }
      );
    }

    const prompt = `Generate ${numQuestions} ${difficulty} ${type} questions based on these past questions for ${course} - ${topic}.

PAST QUESTIONS EXAMPLES:
${pastQuestions.substring(0, 4000)} ${
      pastQuestions.length > 4000 ? "... [content truncated]" : ""
    }

REQUIREMENTS:
1. Create NEW questions that match the style, format, and difficulty of the past questions
2. NO repetition of questions or concepts from the past questions
3. Questions should be on similar topics but with different content
4. Ensure variety in question types and concepts
5. Make answers challenging but fair
6. Questions must be perfect without clues or repetitions
7. Maintain the same educational level as the past questions

FORMAT: Return as JSON array:
[
  {
    "question": "Question text?",
    "options": {"A": "Option 1", "B": "Option 2", "C": "Option 3", "D": "Option 4"},
    "answer": "A"
  }
]`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an expert educational quiz generator. Analyze past questions and generate NEW questions in the same style and format without repeating concepts.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.8, // Slightly higher for more creativity in style matching
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const questions = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Past questions generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate questions from past questions" },
      { status: 500 }
    );
  }
}
