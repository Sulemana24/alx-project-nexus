"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoPlay: true,
    downloadQuality: "high",
  });

  const toggleSetting = (key: keyof typeof settings) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Customize your teaching experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="font-semibold mb-4">Notifications</h3>
          <div className="flex justify-between items-center">
            <p>Student Submissions</p>
            <button
              onClick={() => toggleSetting("notifications")}
              className={`h-6 w-11 rounded-full ${
                settings.notifications ? "bg-blue-500" : "bg-gray-300"
              }`}
            ></button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <h3 className="font-semibold mb-4">Appearance</h3>
          <div className="flex justify-between items-center">
            <p>Dark Mode</p>
            <button
              onClick={() => toggleSetting("darkMode")}
              className={`h-6 w-11 rounded-full ${
                settings.darkMode ? "bg-blue-500" : "bg-gray-300"
              }`}
            ></button>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-center pt-6">
        <Button>Save Changes</Button>
        <Button variant="outline">Reset to Default</Button>
      </div>
    </div>
  );
};

export default Settings;
