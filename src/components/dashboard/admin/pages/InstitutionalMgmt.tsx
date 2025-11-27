"use client";

import React from "react";

const InstitutionalMgmt: React.FC = () => {
  const mockInstitutions = [
    { id: 1, name: "Harvard University", users: 1200 },
    { id: 2, name: "Stanford University", users: 950 },
    { id: 3, name: "MIT", users: 800 },
    { id: 4, name: "Oxford University", users: 670 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-black">
        Institutional Management
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockInstitutions.map((inst) => (
          <div
            key={inst.id}
            className="bg-white rounded-xl p-4 shadow border border-gray-200"
          >
            <p className="text-gray-600">Institution</p>
            <p className="text-lg font-semibold text-gray-900">{inst.name}</p>
            <p className="text-sm text-gray-500">{inst.users} users</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstitutionalMgmt;
