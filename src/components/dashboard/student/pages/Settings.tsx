"use client";
import { useState } from "react";

interface SettingsState {
  notifications: boolean;
  darkMode: boolean;
  autoPlay: boolean;
  downloadQuality: string;
  emailUpdates: boolean;
  soundEffects: boolean;
}

const Settings = () => {
  const [settings, setSettings] = useState<SettingsState>({
    notifications: true,
    darkMode: false,
    autoPlay: true,
    downloadQuality: "high",
    emailUpdates: true,
    soundEffects: false,
  });

  const toggleSetting = (setting: keyof SettingsState) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleSaveChanges = () => {
    // Save settings logic here
    console.log("Saving settings:", settings);
    alert("Settings saved successfully!");
  };

  const handleResetToDefault = () => {
    setSettings({
      notifications: true,
      darkMode: false,
      autoPlay: true,
      downloadQuality: "high",
      emailUpdates: true,
      soundEffects: false,
    });
    alert("Settings reset to default!");
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Customize your learning experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-600">
                  Receive alerts for new quizzes
                </p>
              </div>
              <button
                onClick={() => toggleSetting("notifications")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notifications ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Email Updates</p>
                <p className="text-sm text-gray-600">
                  Get weekly progress reports
                </p>
              </div>
              <button
                onClick={() => toggleSetting("emailUpdates")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailUpdates ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailUpdates ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Appearance
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Dark Mode</p>
                <p className="text-sm text-gray-600">Switch to dark theme</p>
              </div>
              <button
                onClick={() => toggleSetting("darkMode")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.darkMode ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.darkMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Video Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Video & Audio
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Auto-play Videos</p>
                <p className="text-sm text-gray-600">
                  Videos play automatically when opened
                </p>
              </div>
              <button
                onClick={() => toggleSetting("autoPlay")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoPlay ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.autoPlay ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Sound Effects</p>
                <p className="text-sm text-gray-600">
                  Play sounds for interactions
                </p>
              </div>
              <button
                onClick={() => toggleSetting("soundEffects")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.soundEffects ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.soundEffects ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Download Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Download Quality
          </h3>
          <div className="space-y-4">
            <select
              value={settings.downloadQuality}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  downloadQuality: e.target.value,
                }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            >
              <option value="low">Low Quality (Save Data)</option>
              <option value="medium">Medium Quality</option>
              <option value="high">High Quality</option>
            </select>
            <p className="text-sm text-gray-600">
              Choose the quality for downloaded materials
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center pt-6">
        <button
          onClick={handleSaveChanges}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Save Changes
        </button>
        <button
          onClick={handleResetToDefault}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
};

export default Settings;
