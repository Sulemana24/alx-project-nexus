"use client";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { universities } from "@/data/universityFaculties";

export type UniversityKey = keyof typeof universities;

interface PastQuestion {
  id: string;
  courseTitle: string;
  schoolName: string;
  year: number;
  department: string;
  fileUrl: string;
  accessedAt?: string;
}

interface UploadedPDF {
  id: string;
  title: string;
  subject: string;
  uploadedAt: string;
  fileUrl: string;
  size: string;
}

const Passco = () => {
  const [selectedUniversity, setSelectedUniversity] = useState<
    UniversityKey | ""
  >("");
  const [selectedFaculty, setSelectedFaculty] = useState("");

  const facultyList = selectedUniversity
    ? universities[selectedUniversity]
    : [];

  const mockPastQuestions: PastQuestion[] = [
    {
      id: "pq-1",
      courseTitle: "Introduction to Programming",
      schoolName: "School of Computing",
      year: 2023,
      department: "Computer Science",
      fileUrl: "/pdfs/prog-2023.pdf",
      accessedAt: "2024-02-01",
    },
    {
      id: "pq-2",
      courseTitle: "Calculus I",
      schoolName: "School of Mathematics",
      year: 2023,
      department: "Mathematics",
      fileUrl: "/pdfs/calculus-2023.pdf",
      accessedAt: "2024-01-28",
    },
    {
      id: "pq-3",
      courseTitle: "Data Structures",
      schoolName: "School of Computing",
      year: 2022,
      department: "Computer Science",
      fileUrl: "/pdfs/ds-2022.pdf",
    },
  ];

  const mockUploadedPDFs: UploadedPDF[] = [
    {
      id: "pdf-1",
      title: "Mathematics Notes",
      subject: "Mathematics",
      uploadedAt: "2024-02-03",
      fileUrl: "/pdfs/math-notes.pdf",
      size: "2.4 MB",
    },
    {
      id: "pdf-2",
      title: "Programming Concepts",
      subject: "Computer Science",
      uploadedAt: "2024-02-01",
      fileUrl: "/pdfs/prog-concepts.pdf",
      size: "1.8 MB",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8 px-2 sm:px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Past Questions
        </h2>
        <p className="text-gray-600">
          Access previous examination questions and study materials
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter course name, school, dept, faculty..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-2 gap-2 w-full sm:w-auto">
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black w-full sm:w-auto">
              <option value="">All Years</option>
              {Array.from({ length: 2026 - 2010 + 1 }, (_, i) => 2026 - i).map(
                (year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              )}
            </select>
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black w-full sm:w-auto"
              value={selectedUniversity}
              onChange={(e) => {
                setSelectedUniversity(e.target.value as UniversityKey | "");
                setSelectedFaculty("");
              }}
            >
              <option value="">All Universities</option>
              {Object.keys(universities)
                .sort()
                .map((key) => (
                  <option value={key} key={key}>
                    {key.toUpperCase()}
                  </option>
                ))}
            </select>
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black w-full sm:w-auto"
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              disabled={!selectedUniversity}
            >
              <option value="">
                {selectedUniversity
                  ? "Select Faculty"
                  : "Select a university first"}
              </option>

              {facultyList.map((faculty: string) => (
                <option
                  key={faculty}
                  value={faculty.toLowerCase().replace(/\s+/g, "-")}
                >
                  {faculty}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Past Questions List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockPastQuestions.map((pq) => (
            <div
              key={pq.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h4 className="font-semibold text-gray-900 mb-2">
                {pq.courseTitle}
              </h4>
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <p>School: {pq.schoolName}</p>
                <p>Year: {pq.year}</p>
                <p>Department: {pq.department}</p>
              </div>
              <Button className="w-full">View</Button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Access */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recently Accessed
        </h3>
        <div className="space-y-3">
          {mockPastQuestions
            .filter((pq) => pq.accessedAt)
            .map((pq) => (
              <div
                key={pq.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border border-gray-100 rounded-lg gap-2"
              >
                <div>
                  <p className="font-medium text-gray-900">{pq.courseTitle}</p>
                  <p className="text-sm text-gray-500">
                    Accessed: {pq.accessedAt}
                  </p>
                </div>
                <Button>View</Button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Passco;
