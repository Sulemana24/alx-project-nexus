"use client";

import { useState } from "react";

interface SimpleFileUploadProps {
  onFileSelect: (file: File) => void;
}

export function SimpleFileUpload({ onFileSelect }: SimpleFileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      onFileSelect(file);
    } else {
      alert("Please select a PDF file");
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      onFileSelect(file);
    } else {
      alert("Please drop a PDF file");
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors ${
        isDragging
          ? "border-primary-blue bg-blue-50"
          : "border-gray-300 bg-gray-50 hover:border-gray-400"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer bg-primary-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Choose PDF File
      </label>
      <p className="mt-2 text-sm text-gray-500">or drag and drop PDF here</p>
      <p className="text-xs text-gray-400 mt-1">PDF up to 4MB</p>
    </div>
  );
}
