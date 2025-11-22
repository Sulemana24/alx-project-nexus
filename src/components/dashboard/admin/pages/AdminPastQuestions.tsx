"use client";

import { useState } from "react";
import { universities } from "@/data/universityFaculties";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/Button";

type UniversityKey = keyof typeof universities;

export const AdminPastQuestionUploader = () => {
  const [selectedUniversity, setSelectedUniversity] = useState<
    UniversityKey | ""
  >("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [level, setLevel] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const facultyList = selectedUniversity
    ? universities[selectedUniversity]
    : [];

  const handleUpload = async () => {
    if (
      !file ||
      !selectedUniversity ||
      !selectedFaculty ||
      !department ||
      !courseName
    ) {
      alert("Please fill all required fields and select a file.");
      return;
    }

    setUploading(true);

    try {
      const storageRef = ref(
        storage,
        `pastQuestions/${selectedUniversity}/${selectedFaculty}/${file.name}`
      );
      await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, "pastQuestions"), {
        university: selectedUniversity,
        faculty: selectedFaculty,
        department,
        courseName,
        courseCode,
        year,
        level,
        fileUrl,
        createdAt: serverTimestamp(),
      });

      alert("Past question uploaded successfully!");
      // Reset form
      setFile(null);
      setSelectedUniversity("");
      setSelectedFaculty("");
      setDepartment("");
      setCourseName("");
      setCourseCode("");
      setYear(new Date().getFullYear());
      setLevel("");
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Upload Past Questions
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Share educational resources with students across universities
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* University Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                University <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedUniversity}
                onChange={(e) => {
                  setSelectedUniversity(e.target.value as UniversityKey);
                  setSelectedFaculty("");
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-800"
              >
                <option value="">Select University</option>
                {Object.keys(universities).map((uni) => (
                  <option key={uni} value={uni}>
                    {uni.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Faculty Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Faculty <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                disabled={!selectedUniversity}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {selectedUniversity
                    ? "Select Faculty"
                    : "Select University first"}
                </option>
                {facultyList.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Department <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter department name"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* Course Name & Code */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Course Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Introduction to Computer Science"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Course Code
              </label>
              <input
                type="text"
                placeholder="e.g., CSC101"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* Year & Level */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Year
              </label>
              <input
                type="number"
                placeholder="2024"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Level
              </label>
              <input
                type="text"
                placeholder="e.g., 100, 200, 300"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* File Upload */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                PDF File <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => e.target.files && setFile(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
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
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-blue-600">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF files only</p>
                    </div>
                  </div>
                </label>
              </div>
              {file && (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-green-800">
                      {file.name}
                    </span>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div className="md:col-span-2 pt-4">
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {uploading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Uploading...</span>
                  </div>
                ) : (
                  "Upload Past Question"
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            All uploaded past questions will be reviewed before being made
            available to students.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPastQuestionUploader;
