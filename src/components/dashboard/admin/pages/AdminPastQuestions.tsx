"use client";

import { useState } from "react";
import { universities } from "@/data/universityFaculties";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/Button";
import { useUploadThing } from "@/lib/uploadthing";

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

  // Use UploadThing hook with organized file naming
  const { startUpload } = useUploadThing("pastQuestionUploader", {
    onClientUploadComplete: (data) => {
      if (data && data[0]) {
        // Save to Firestore after successful upload
        saveToFirestore(data[0].url, data[0].name, data[0].size);
      }
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
      setUploading(false);
      alert("Upload failed. Please try again.");
    },
  });

  const facultyList = selectedUniversity
    ? universities[selectedUniversity]
    : [];

  // Generate organized file name with path structure
  const generateOrganizedFileName = (originalFile: File): File => {
    const extension = originalFile.name.split(".").pop();

    // Clean and format each part for file naming
    const cleanUniversity = selectedUniversity
      .replace(/\s+/g, "_")
      .toLowerCase();
    const cleanFaculty = selectedFaculty.replace(/\s+/g, "_").toLowerCase();
    const cleanDepartment = department.replace(/\s+/g, "_").toLowerCase();
    const cleanCourseCode =
      courseCode.replace(/\s+/g, "_").toUpperCase() ||
      courseName.replace(/\s+/g, "_").toLowerCase();
    const cleanCourseName = courseName.replace(/\s+/g, "_").toLowerCase();

    // Create organized file name with path structure
    const organizedFileName = `${cleanUniversity}/${cleanFaculty}/${cleanDepartment}/${cleanCourseCode}_${year}_${
      level || "all"
    }.${extension}`;

    // Return new File object with organized name
    return new File([originalFile], organizedFileName, {
      type: originalFile.type,
      lastModified: originalFile.lastModified,
    });
  };

  const saveToFirestore = async (
    fileUrl: string,
    fileName: string,
    fileSize: number
  ) => {
    try {
      await addDoc(collection(db, "pastQuestions"), {
        // Basic information
        university: selectedUniversity,
        faculty: selectedFaculty,
        department,
        courseName,
        courseCode,
        year,
        level: level || "All Levels",

        // File information
        fileUrl,
        fileName,
        fileSize,
        organizedPath: fileName, // This contains the full organized path

        // Metadata
        uploadedAt: serverTimestamp(),
        storageProvider: "uploadthing",

        // Search optimization
        searchKeywords: [
          selectedUniversity.toLowerCase(),
          selectedFaculty.toLowerCase(),
          department.toLowerCase(),
          courseName.toLowerCase(),
          courseCode.toUpperCase(),
          year.toString(),
          level.toLowerCase(),
        ],

        // Organization fields for easy querying
        organization: {
          university: selectedUniversity,
          faculty: selectedFaculty,
          department,
          course: courseCode || courseName,
          year,
          level: level || "All Levels",
        },
      });

      alert(
        "Past question uploaded successfully! 🎉\nFile organized by: University → Faculty → Department"
      );
      resetForm();
    } catch (err) {
      console.error("Firestore error:", err);
      alert(
        "File uploaded but failed to save metadata. Please contact support."
      );
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setSelectedUniversity("");
    setSelectedFaculty("");
    setDepartment("");
    setCourseName("");
    setCourseCode("");
    setYear(new Date().getFullYear());
    setLevel("");
  };

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
      // Generate organized file name and upload
      const organizedFile = generateOrganizedFileName(file);
      await startUpload([organizedFile]);
    } catch (err) {
      console.error("Upload error:", err);
      setUploading(false);
      alert("Upload failed. Please try again.");
    }
  };

  // Get organized path preview
  const getOrganizedPathPreview = () => {
    if (!selectedUniversity || !selectedFaculty || !department || !courseName)
      return null;

    const cleanUniversity = selectedUniversity
      .replace(/\s+/g, "_")
      .toLowerCase();
    const cleanFaculty = selectedFaculty.replace(/\s+/g, "_").toLowerCase();
    const cleanDepartment = department.replace(/\s+/g, "_").toLowerCase();
    const cleanCourseCode =
      courseCode.replace(/\s+/g, "_").toUpperCase() ||
      courseName.replace(/\s+/g, "_").toLowerCase();

    return `${cleanUniversity} / ${cleanFaculty} / ${cleanDepartment} / ${cleanCourseCode}_${year}_${
      level || "all"
    }.pdf`;
  };

  const pathPreview = getOrganizedPathPreview();

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Upload Past Questions
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Files are automatically organized by University → Faculty →
            Department
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Organization Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Organization Structure
              </h3>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      University
                    </p>
                    <p className="text-xs text-gray-500">
                      Top-level organization
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Faculty</p>
                    <p className="text-xs text-gray-500">Academic division</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Department
                    </p>
                    <p className="text-xs text-gray-500">Specific department</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    4
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Course</p>
                    <p className="text-xs text-gray-500">
                      Course & year details
                    </p>
                  </div>
                </div>
              </div>

              {/* Path Preview */}
              {pathPreview && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    File will be saved as:
                  </h4>
                  <div className="bg-white p-3 rounded border font-mono text-xs text-gray-600 break-all">
                    {pathPreview}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Upload Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 md:p-8 rounded-lg border border-gray-200">
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
                    required
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
                    required
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
                    required
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
                    required
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
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800"
                  >
                    <option value="">All Levels</option>
                    <option value="100">100 Level</option>
                    <option value="200">200 Level</option>
                    <option value="300">300 Level</option>
                    <option value="400">400 Level</option>
                    <option value="500">500 Level</option>
                    <option value="graduate">Graduate</option>
                  </select>
                </div>

                {/* File Upload */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    PDF File <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) =>
                        e.target.files && setFile(e.target.files[0])
                      }
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer block"
                    >
                      <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-blue-600"
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
                          <p className="text-xs text-gray-500 mt-1">
                            PDF files only (max 4MB)
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>

                  {file && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                        <div className="flex items-center space-x-3">
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
                          <div>
                            <span className="text-sm font-medium text-green-800 block">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
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
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <div className="md:col-span-2 pt-4">
                  <Button
                    onClick={handleUpload}
                    disabled={uploading || !file}
                    className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {uploading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Uploading and Organizing...</span>
                      </div>
                    ) : (
                      "Upload Past Question"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPastQuestionUploader;
