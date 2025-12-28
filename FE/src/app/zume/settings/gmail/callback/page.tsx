"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";

export default function GmailCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Processing Gmail connection...");

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const error = searchParams.get("error");

      if (error) {
        setStatus("error");
        setMessage("Connection cancelled or failed");
        setTimeout(() => router.push("/zume/settings/gmail"), 3000);
        return;
      }

      if (!code || !state) {
        setStatus("error");
        setMessage("Invalid callback parameters");
        setTimeout(() => router.push("/zume/settings/gmail"), 3000);
        return;
      }

      try {
        const response = await fetch(`/api/gmail/callback?code=${code}&state=${state}`);
        const data = await response.json();

        if (data.status === "success") {
          setStatus("success");
          setMessage("Gmail connected successfully!");
          setTimeout(() => router.push("/zume/settings/gmail"), 2000);
        } else {
          setStatus("error");
          setMessage(data.message || "Failed to connect Gmail");
          setTimeout(() => router.push("/zume/settings/gmail"), 3000);
        }
      } catch {
        setStatus("error");
        setMessage("Error connecting to Gmail");
        setTimeout(() => router.push("/zume/settings/gmail"), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
        {status === "loading" && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Connecting...</h2>
            <p className="text-gray-600 dark:text-gray-400">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-green-600">Success!</h2>
            <p className="text-gray-600 dark:text-gray-400">{message}</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting...</p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-red-600">Error</h2>
            <p className="text-gray-600 dark:text-gray-400">{message}</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting...</p>
          </div>
        )}
      </div>
    </div>
  );
}
