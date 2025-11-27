"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface User {
  role: "student" | "teacher" | "admin" | string;
  [key: string]: unknown;
}

const SystemAnalytics: React.FC = () => {
  const [activeUsers, setActiveUsers] = useState(0);
  const [revenue, setRevenue] = useState("$24.5K");
  const [institutions, setInstitutions] = useState(156);

  const [flaggedContent, setFlaggedContent] = useState(23);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const snapshot = await getDocs(usersCollection);
        const usersData: User[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as User),
        }));

        const count = usersData.filter(
          (u) => u.role === "teacher" || u.role === "student"
        ).length;

        setActiveUsers(count);
      } catch (err) {
        console.error("Error fetching active users:", err);
      }
    };

    fetchActiveUsers();
  }, []);

  const stats = [
    { id: 1, metric: "Active Users", value: activeUsers },
    { id: 2, metric: "Revenue", value: revenue },
    { id: 3, metric: "Institutions", value: institutions },
    { id: 4, metric: "Flagged Content", value: flaggedContent },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-black">System Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-black">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white rounded-xl p-4 shadow border border-gray-200"
          >
            <p className="text-gray-600">{stat.metric}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemAnalytics;
