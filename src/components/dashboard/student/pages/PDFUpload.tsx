"use client";
import { useState } from "react";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface PDFUploadProps {
  onPDFProcessed: (pdfData: {
    title: string;
    content: string;
    questions: Question[];
  }) => void;
  onLoadingChange: (loading: boolean) => void;
  userPreferences: {
    numQuestions: string;
    difficulty: "easy" | "medium" | "hard";
    type: "multiple-choice" | "true-false" | "fill-in" | "essay";
  };
}

interface UploadedPDF {
  id: string;
  title: string;
  subject: string;
  uploadedAt: string;
  fileUrl: string;
  size: string;
}

const PDFUpload = ({
  onPDFProcessed,
  onLoadingChange,
  userPreferences,
}: PDFUploadProps) => {
  const [uploadedPDFs, setUploadedPDFs] = useState<UploadedPDF[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    setTimeout(() => {
      const newPDF: UploadedPDF = {
        id: `pdf-${Date.now()}`,
        title: file.name.replace(".pdf", ""),
        subject: "General",
        uploadedAt: new Date().toISOString().split("T")[0],
        fileUrl: URL.createObjectURL(file),
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      };

      setUploadedPDFs((prev) => [newPDF, ...prev]);

      // Auto-generate mock questions based on user preferences
      processPDF(newPDF);

      setUploading(false);
    }, 1500);
  };

  const processPDF = (pdfFile: UploadedPDF) => {
    onLoadingChange(true);

    setTimeout(() => {
      const numQuestions = parseInt(userPreferences.numQuestions);

      const questions: Question[] = Array.from({ length: numQuestions }).map(
        (_, i) => {
          const concept = `${pdfFile.subject} concept ${i + 1}`;
          let options: string[];
          switch (userPreferences.type) {
            case "multiple-choice":
              options = [
                `Correct understanding of ${concept}`,
                `Common misconception about ${concept}`,
                `Unrelated ${pdfFile.subject} concept`,
                `Partial understanding`,
              ];
              break;
            case "true-false":
              options = ["True", "False"];
              break;
            case "fill-in":
              options = [
                concept,
                `Key ${pdfFile.subject} principle`,
                `Fundamental ${pdfFile.subject} concept`,
                `Core ${concept} theory`,
              ];
              break;
            case "essay":
              options = [
                "Comprehensive response covering key aspects",
                "Basic explanation with examples",
                "Advanced analysis with evaluation",
                "Practical applications",
              ];
              break;
            default:
              options = ["Option 1", "Option 2", "Option 3", "Option 4"];
          }

          return {
            question: `${i + 1}. Describe ${concept} in ${pdfFile.subject}`,
            options,
            correctAnswer: 0,
            explanation: `This ${userPreferences.difficulty} question covers ${concept}.`,
          };
        }
      );

      onPDFProcessed({
        title: pdfFile.title,
        content: `Summary of ${pdfFile.subject} PDF content.`,
        questions,
      });

      onLoadingChange(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload PDF</h3>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="pdf-upload"
            />
            <label htmlFor="pdf-upload" className="cursor-pointer block">
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Click to upload PDF
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF files only (max. 10MB)
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {userPreferences.numQuestions} {userPreferences.type}{" "}
                    questions ({userPreferences.difficulty})
                  </p>
                </div>
              </div>
            </label>
          </div>

          {uploading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">
                Uploading and processing PDF...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFUpload;
