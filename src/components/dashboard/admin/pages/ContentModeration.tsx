"use client";

import React from "react";

const ContentModeration: React.FC = () => {
  const mockContent = [
    { id: 1, title: "Quiz: Algebra Basics", flagged: true },
    { id: 2, title: "Course: Physics 101", flagged: false },
    { id: 3, title: "Quiz: Advanced Calculus", flagged: true },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-black">Content Moderation</h1>
      <table className="w-full border border-gray-200 rounded-lg text-black">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Content</th>
            <th className="p-3 text-left">Flagged</th>
          </tr>
        </thead>
        <tbody>
          {mockContent.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-3">{item.title}</td>
              <td className="p-3">{item.flagged ? "⚠️ Yes" : "✅ No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContentModeration;
