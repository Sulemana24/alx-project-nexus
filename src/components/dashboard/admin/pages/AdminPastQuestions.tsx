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
      // Upload file to Firebase Storage
      const storageRef = ref(
        storage,
        `pastQuestions/${selectedUniversity}/${selectedFaculty}/${file.name}`
      );
      await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(storageRef);

      // Save document in Firestore
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
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-black">Upload Past Question</h2>

      <select
        value={selectedUniversity}
        onChange={(e) => {
          setSelectedUniversity(e.target.value as UniversityKey);
          setSelectedFaculty("");
        }}
        className="border p-2 rounded text-black"
      >
        <option value="">Select University</option>
        {Object.keys(universities).map((uni) => (
          <option key={uni} value={uni}>
            {uni.toUpperCase()}
          </option>
        ))}
      </select>

      <select
        value={selectedFaculty}
        onChange={(e) => setSelectedFaculty(e.target.value)}
        disabled={!selectedUniversity}
        className="border p-2 rounded text-black"
      >
        <option value="">
          {selectedUniversity ? "Select Faculty" : "Select University first"}
        </option>
        {facultyList.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Department"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        className="border p-2 rounded w-full text-black"
      />

      <input
        type="text"
        placeholder="Course Name"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
        className="border p-2 rounded w-full text-black"
      />

      <input
        type="text"
        placeholder="Course Code"
        value={courseCode}
        onChange={(e) => setCourseCode(e.target.value)}
        className="border p-2 rounded w-full text-black"
      />

      <input
        type="number"
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        className="border p-2 rounded w-full text-black"
      />

      <input
        type="text"
        placeholder="Level (e.g. 100, 200, 300)"
        value={level}
        onChange={(e) => setLevel(e.target.value)}
        className="border p-2 rounded w-full text-black"
      />

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => e.target.files && setFile(e.target.files[0])}
        className="border p-2 rounded w-full text-black"
      />

      <Button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
};

export default AdminPastQuestionUploader;
