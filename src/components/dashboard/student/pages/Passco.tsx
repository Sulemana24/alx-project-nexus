"use client";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { universities } from "@/data/universityFaculties";
import {
  collection,
  getDocs,
  query,
  orderBy,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type UniversityKey = keyof typeof universities;

interface PastQuestion {
  id: string;
  university: string;
  faculty: string;
  department: string;
  courseName: string;
  courseCode: string;
  year: number;
  level: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  organizedPath: string;
  uploadedAt: Date;
  searchKeywords?: string[];
}

// Full Screen PDF Viewer
function FullScreenPDFViewer({
  fileUrl,
  fileName,
  onClose,
}: {
  fileUrl: string;
  fileName: string;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(true);

  // Prevent escape key from closing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
            {fileName}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Full Screen View - Download disabled for preview
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 ml-4">
          <span className="text-xs sm:text-sm text-gray-500 hidden sm:block">
            💡 Use download button for full access
          </span>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-lg font-bold transition-colors flex-shrink-0"
            title="Close Viewer"
          >
            ✕
          </button>
        </div>
      </div>

      {/* PDF Container */}
      <div className="flex-1 bg-gray-900 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-white mx-auto mb-3 sm:mb-4"></div>
              <p className="text-base sm:text-lg">Loading PDF...</p>
              <p className="text-xs sm:text-sm text-gray-300 mt-1 sm:mt-2">
                Please wait while we load the document
              </p>
            </div>
          </div>
        )}

        <iframe
          src={fileUrl}
          className="w-full h-full border-0"
          title={`PDF Viewer - ${fileName}`}
          onLoad={() => setIsLoading(false)}
        />
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white px-4 sm:px-6 py-2 sm:py-3 text-center">
        <p className="text-xs sm:text-sm">
          🔒 This is a preview-only view. To save this file, use the download
          button from the main page.
        </p>
      </div>
    </div>
  );
}

const Passco = () => {
  const [selectedUniversity, setSelectedUniversity] = useState<
    UniversityKey | ""
  >("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [pastQuestions, setPastQuestions] = useState<PastQuestion[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<PastQuestion[]>(
    []
  );
  const [recentQuestions, setRecentQuestions] = useState<PastQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [viewingPdf, setViewingPdf] = useState<PastQuestion | null>(null);
  const [loadingFiles, setLoadingFiles] = useState<Set<string>>(new Set());
  const [hasSearched, setHasSearched] = useState(false);
  const [displayedQuestions, setDisplayedQuestions] = useState<PastQuestion[]>(
    []
  );

  const facultyList = selectedUniversity
    ? universities[selectedUniversity]
    : [];

  // Fetch all past questions from Firestore
  useEffect(() => {
    fetchPastQuestions();
  }, []);

  // Filter questions when filters or search change
  useEffect(() => {
    filterQuestions();
  }, [
    pastQuestions,
    selectedUniversity,
    selectedFaculty,
    selectedYear,
    selectedLevel,
    searchQuery,
  ]);

  const fetchPastQuestions = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "pastQuestions"),
        orderBy("uploadedAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const questions: PastQuestion[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        questions.push({
          id: doc.id,
          ...data,
        } as PastQuestion);
      });

      setPastQuestions(questions);
      loadRecentQuestions();
    } catch (error) {
      console.error("Error fetching past questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentQuestions = () => {
    try {
      const recentlyAccessed = JSON.parse(
        localStorage.getItem("recentlyAccessed") || "[]"
      );
      setRecentQuestions(recentlyAccessed);
    } catch (error) {
      console.error("Error loading recent questions:", error);
    }
  };

  const filterQuestions = () => {
    setSearchLoading(true);

    let filtered = [...pastQuestions];

    // Apply filters
    if (selectedUniversity) {
      filtered = filtered.filter(
        (q) => q.university.toLowerCase() === selectedUniversity.toLowerCase()
      );
    }

    if (selectedFaculty) {
      filtered = filtered.filter((q) =>
        q.faculty.toLowerCase().includes(selectedFaculty.toLowerCase())
      );
    }

    if (selectedYear) {
      filtered = filtered.filter((q) => q.year === parseInt(selectedYear));
    }

    if (selectedLevel) {
      filtered = filtered.filter((q) =>
        q.level.toLowerCase().includes(selectedLevel.toLowerCase())
      );
    }

    // Apply search query
    if (searchQuery.trim()) {
      setHasSearched(true);
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (q) =>
          q.courseName.toLowerCase().includes(query) ||
          q.courseCode.toLowerCase().includes(query) ||
          q.department.toLowerCase().includes(query) ||
          q.faculty.toLowerCase().includes(query) ||
          q.university.toLowerCase().includes(query) ||
          (q.searchKeywords &&
            q.searchKeywords.some((keyword) => keyword.includes(query)))
      );
    } else {
      setHasSearched(false);
    }

    // Show all filtered questions if user searched/filtered
    if (
      hasSearched ||
      selectedUniversity ||
      selectedFaculty ||
      selectedYear ||
      selectedLevel ||
      searchQuery
    ) {
      setDisplayedQuestions(filtered);
    } else {
      // Initial load: pick 6 random questions
      const shuffled = filtered.sort(() => 0.5 - Math.random());
      setDisplayedQuestions(shuffled.slice(0, 6));
    }

    setFilteredQuestions(filtered);
    setSearchLoading(false);
  };

  const handleViewFile = async (question: PastQuestion) => {
    setLoadingFiles((prev) => new Set(prev).add(question.id));

    try {
      // Track access in localStorage for recently accessed
      const recentlyAccessed = JSON.parse(
        localStorage.getItem("recentlyAccessed") || "[]"
      );

      // Remove if already exists
      const filtered = recentlyAccessed.filter(
        (item: PastQuestion) => item.id !== question.id
      );

      // Add to beginning and limit to 5
      const updated = [question, ...filtered].slice(0, 5);
      localStorage.setItem("recentlyAccessed", JSON.stringify(updated));
      loadRecentQuestions();

      // Open full screen viewer
      setViewingPdf(question);
    } catch (error) {
      console.error("Error viewing file:", error);
      alert("Unable to open the file. Please try the download option.");
    } finally {
      setLoadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(question.id);
        return newSet;
      });
    }
  };

  const handleDownload = async (question: PastQuestion) => {
    setLoadingFiles((prev) => new Set(prev).add(question.id));

    try {
      console.log("Attempting to download file:", question.fileUrl);

      // Test if the URL is accessible
      const response = await fetch(question.fileUrl);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        // Use the original file name or create one from course info
        const fileName =
          question.fileName ||
          `${question.courseCode || question.courseName}_${question.year}.pdf`
            .replace(/\s+/g, "_")
            .toLowerCase();

        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        // Also track as recent access
        const recentlyAccessed = JSON.parse(
          localStorage.getItem("recentlyAccessed") || "[]"
        );
        const filtered = recentlyAccessed.filter(
          (item: PastQuestion) => item.id !== question.id
        );
        const updated = [question, ...filtered].slice(0, 5);
        localStorage.setItem("recentlyAccessed", JSON.stringify(updated));
        loadRecentQuestions();
      } else {
        throw new Error(`Download failed: ${response.status}`);
      }
    } catch (error) {
      console.error("Error downloading file:", error);

      // Fallback: Direct download link
      const link = document.createElement("a");
      link.href = question.fileUrl;
      link.download = question.fileName || "past_question.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(
        "Download started. If it doesn't work automatically, check your downloads folder."
      );
    } finally {
      setLoadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(question.id);
        return newSet;
      });
    }
  };

  const clearFilters = () => {
    setSelectedUniversity("");
    setSelectedFaculty("");
    setSelectedYear("");
    setSelectedLevel("");
    setSearchQuery("");
    setHasSearched(false);
  };

  const getFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return "Unknown size";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Get unique years and levels for filters
  const availableYears = Array.from(
    new Set(pastQuestions.map((q) => q.year))
  ).sort((a, b) => b - a);
  const availableLevels = Array.from(
    new Set(pastQuestions.map((q) => q.level))
  ).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Full Screen PDF Viewer */}
      {viewingPdf && (
        <FullScreenPDFViewer
          fileUrl={viewingPdf.fileUrl}
          fileName={viewingPdf.fileName || viewingPdf.courseName}
          onClose={() => setViewingPdf(null)}
        />
      )}

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-black mb-3">
            Past Questions Bank
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover and access examination questions from various universities
          </p>
        </div>

        {/* Search and Filters Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Search by course name, code, department, faculty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-base placeholder-gray-400 transition-all duration-200"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-all duration-200"
            >
              <option value="">All Years</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-all duration-200"
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
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-all duration-200"
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              disabled={!selectedUniversity}
            >
              <option value="">
                {selectedUniversity ? "All Faculties" : "Select university"}
              </option>
              {facultyList.map((faculty: string) => (
                <option key={faculty} value={faculty}>
                  {faculty}
                </option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-all duration-200"
            >
              <option value="">All Levels</option>
              {availableLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>

            {(selectedUniversity ||
              selectedFaculty ||
              selectedYear ||
              selectedLevel ||
              searchQuery) && (
              <button
                onClick={clearFilters}
                className="px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>🗑️</span>
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          {/* Results Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <p className="text-sm text-gray-600">
              {searchLoading
                ? "🔍 Searching..."
                : hasSearched
                ? `📊 Found ${filteredQuestions.length} past question${
                    filteredQuestions.length !== 1 ? "s" : ""
                  }`
                : "💡 Use filters to find specific past questions"}
            </p>
            {loading && (
              <div className="text-sm text-blue-600 flex items-center gap-2">
                <p className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                Loading...
              </div>
            )}
          </div>
        </div>

        {/* Past Questions Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">
              Loading past questions library...
            </p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <p className="text-gray-500 text-lg mb-2">
              No past questions found matching your criteria.
            </p>
            {(selectedUniversity ||
              selectedFaculty ||
              selectedYear ||
              selectedLevel ||
              searchQuery) && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 font-medium text-lg transition-colors"
              >
                Clear filters to see all questions
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2  gap-6 mb-12">
            {displayedQuestions.map((pq) => (
              <div
                key={pq.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200 group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-6 h-6 text-black"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2">
                      {pq.courseName}
                    </h4>
                    {pq.courseCode && (
                      <p className="text-blue-600 font-semibold text-sm mt-1">
                        {pq.courseCode}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">🏫</span>
                    <span className="truncate">{pq.university}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">🎓</span>
                    <span className="truncate">{pq.faculty}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">📚</span>
                    <span className="truncate">{pq.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">📅</span>
                    <span>Year: {pq.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">📈</span>
                    <span>Level: {pq.level}</span>
                  </div>
                  {pq.fileSize && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">💾</span>
                      <span>{getFileSize(pq.fileSize)}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleViewFile(pq)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
                    disabled={loadingFiles.has(pq.id)}
                  >
                    {loadingFiles.has(pq.id) ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Opening...
                      </div>
                    ) : (
                      "View PDF"
                    )}
                  </Button>
                  <Button
                    onClick={() => handleDownload(pq)}
                    variant="outline"
                    className="flex-1 border-green-500 text-green-600 hover:bg-green-50 font-semibold py-3 rounded-lg transition-all duration-200"
                    disabled={loadingFiles.has(pq.id)}
                  >
                    {loadingFiles.has(pq.id) ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </div>
                    ) : (
                      "Download"
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recently Accessed Section */}
        {recentQuestions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600">📖</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Recently Accessed
              </h3>
            </div>
            <div className="space-y-4">
              {recentQuestions.map((pq) => (
                <div
                  key={pq.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl gap-4 hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-lg mb-1">
                      {pq.courseName}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {pq.university} • {pq.faculty} • {pq.year}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      onClick={() => handleViewFile(pq)}
                      disabled={loadingFiles.has(pq.id)}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-white"
                    >
                      {loadingFiles.has(pq.id) ? "..." : "View"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(pq)}
                      disabled={loadingFiles.has(pq.id)}
                      className="border-green-500 text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg transition-colors"
                    >
                      {loadingFiles.has(pq.id) ? "..." : "Download"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Passco;
