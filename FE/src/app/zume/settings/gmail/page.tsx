"use client";

import React, { useState, useEffect } from "react";
import { Mail, Calendar, Settings, Play, CheckCircle, XCircle } from "lucide-react";

interface GmailStatus {
  connected: boolean;
  email: string | null;
  is_active: boolean;
  scan_schedule: string;
  scan_time: string;
  job_ids: string[];
  keywords: string[];
  last_scan_at: string | null;
  last_scan_status: string | null;
  last_scan_count: number;
  send_notifications: boolean;
  notification_email: string | null;
}

interface Job {
  id: string;
  title: string;
}

export default function GmailIntegrationPage() {
  const [status, setStatus] = useState<GmailStatus | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Configuration state
  const [scanSchedule, setScanSchedule] = useState("daily");
  const [scanTime, setScanTime] = useState("09:00");
  const [isActive, setIsActive] = useState(true);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [sendNotifications, setSendNotifications] = useState(true);

  useEffect(() => {
    fetchStatus();
    fetchJobs();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/gmail/status");
      const data = await response.json();
      
      if (data.status === "success") {
        setStatus(data.data);
        
        if (data.data.connected) {
          setScanSchedule(data.data.scan_schedule);
          setScanTime(data.data.scan_time);
          setIsActive(data.data.is_active);
          setSelectedJobs(data.data.job_ids || []);
          setKeywords(data.data.keywords || []);
          setSendNotifications(data.data.send_notifications);
        }
      }
    } catch {
      console.error("Error fetching Gmail status");
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/jobs");
      const data = await response.json();
      
      if (data.status === "success") {
        setJobs(data.data);
      }
    } catch {
      console.error("Error fetching jobs");
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const response = await fetch("/api/gmail/connect", { method: "POST" });
      const data = await response.json();
      
      if (data.status === "success") {
        // Redirect to Google OAuth
        window.location.href = data.data.auth_url;
      } else {
        showToast("Failed to initiate Gmail connection", "error");
      }
    } catch {
      showToast("Error connecting to Gmail", "error");
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect Gmail? All scanning will be stopped.")) {
      return;
    }

    try {
      const response = await fetch("/api/gmail/disconnect", { method: "POST" });
      const data = await response.json();
      
      if (data.status === "success") {
        showToast("Gmail disconnected successfully", "success");
        fetchStatus();
      } else {
        showToast("Failed to disconnect Gmail", "error");
      }
    } catch {
      showToast("Error disconnecting Gmail", "error");
    }
  };

  const handleSaveConfig = async () => {
    try {
      const response = await fetch("/api/gmail/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scan_schedule: scanSchedule,
          scan_time: scanTime,
          is_active: isActive,
          job_ids: selectedJobs,
          keywords: keywords,
          send_notifications: sendNotifications
        })
      });
      
      const data = await response.json();
      
      if (data.status === "success") {
        showToast("Configuration saved successfully", "success");
        fetchStatus();
      } else {
        showToast("Failed to save configuration", "error");
      }
    } catch {
      showToast("Error saving configuration", "error");
    }
  };

  const handleScanNow = async () => {
    setScanning(true);
    try {
      const response = await fetch("/api/gmail/scan-now", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_ids: selectedJobs.length > 0 ? selectedJobs : undefined
        })
      });
      
      const data = await response.json();
      
      if (data.status === "success") {
        showToast("Email scan started! You'll receive a notification when complete.", "success");
      } else {
        showToast("Failed to start scan", "error");
      }
    } catch {
      showToast("Error starting scan", "error");
    } finally {
      setScanning(false);
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Mail className="w-8 h-8" />
        Gmail Integration
      </h1>

      {/* Connection Status Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          {status?.connected ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
          Connection Status
        </h2>

        {status?.connected ? (
          <div className="space-y-3">
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Connected Email:</span> {status.email}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Status:</span>{" "}
              <span className={status.is_active ? "text-green-600" : "text-gray-500"}>
                {status.is_active ? "Active" : "Paused"}
              </span>
            </p>
            {status.last_scan_at && (
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Last Scan:</span>{" "}
                {new Date(status.last_scan_at).toLocaleString()} 
                {status.last_scan_status === "success" && (
                  <span className="ml-2 text-green-600">
                    ({status.last_scan_count} CVs analyzed)
                  </span>
                )}
                {status.last_scan_status === "error" && (
                  <span className="ml-2 text-red-600">(Failed)</span>
                )}
              </p>
            )}
            <button
              onClick={handleDisconnect}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Disconnect Gmail
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Connect your Gmail account to automatically scan for resumes based on your job openings.
            </p>
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              {connecting ? "Connecting..." : "Connect Gmail"}
            </button>
          </div>
        )}
      </div>

      {/* Configuration (only show if connected) */}
      {status?.connected && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Scan Schedule
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Frequency</label>
                <select
                  value={scanSchedule}
                  onChange={(e) => setScanSchedule(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="hourly">Every Hour</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly (Mondays)</option>
                </select>
              </div>

              {(scanSchedule === "daily" || scanSchedule === "weekly") && (
                <div>
                  <label className="block text-sm font-medium mb-2">Time</label>
                  <input
                    type="time"
                    value={scanTime}
                    onChange={(e) => setScanTime(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Enable automatic scanning
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sendNotifications"
                  checked={sendNotifications}
                  onChange={(e) => setSendNotifications(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="sendNotifications" className="text-sm font-medium">
                  Send email notification after scan
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Filtering Options
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Scan for specific jobs (leave empty for all jobs)
                </label>
                <select
                  multiple
                  value={selectedJobs}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setSelectedJobs(values);
                  }}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 h-32"
                >
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Additional Keywords</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addKeyword()}
                    placeholder="Add keyword (e.g., Python, React)"
                    className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                  <button
                    onClick={addKeyword}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {keywords.map(keyword => (
                    <span
                      key={keyword}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-2"
                    >
                      {keyword}
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSaveConfig}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Save Configuration
            </button>

            <button
              onClick={handleScanNow}
              disabled={scanning}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              {scanning ? "Scanning..." : "Scan Now"}
            </button>
          </div>
        </>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
