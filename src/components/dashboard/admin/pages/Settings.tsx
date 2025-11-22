"use client";

import React from "react";

const Settings: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-black">Settings</h1>
      <p className="text-gray-600">
        Configure your admin account, system preferences, and other settings
        here.
      </p>

      <div className="mt-6 space-y-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Profile Settings
          </h2>
          <p className="text-sm text-gray-500">
            Update your name, email, and password.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            System Preferences
          </h2>
          <p className="text-sm text-gray-500">
            Configure notifications, themes, and preferences.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Security</h2>
          <p className="text-sm text-gray-500">
            Manage admin access, 2FA, and roles.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
