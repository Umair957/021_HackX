"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowRight, Loader2 } from "lucide-react";

export default function VerifyOTPClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams?.get("email") || "";
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    // focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").split("");
    if (data.length === 6 && data.every((char) => !isNaN(Number(char)))) {
      setOtp(data);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const code = otp.join("");

    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = { email: emailFromQuery, otp: code };
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        // verification successful — send user to login
        router.push("/auth/login");
      } else {
        setError(data?.message || "Invalid code. Please try again.");
      }
    } catch (err: any) {
      setError(err?.message || "Network error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-4">
      {/* Background Blobs (Animation required in tailwind.config) */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      {/* Glass Card */}
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl overflow-hidden p-8 text-center">

        {/* Icon Circle */}
        <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm shadow-inner ring-1 ring-white/30">
          <Mail className="w-8 h-8 text-white" strokeWidth={1.5} />
        </div>

        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Check your email</h2>
        <p className="text-blue-100 mb-8">
          We sent a verification code to <br />
          <span className="font-semibold text-white">{emailFromQuery || "your email"}</span>
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-3 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-2xl font-bold text-white bg-white/5 border border-white/10 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 focus:outline-none transition-all shadow-inner placeholder-white/10"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <>
                Verify Account <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-sm text-blue-100">
          Didn't receive the code?{" "}
          {timer > 0 ? (
            <span className="opacity-70 tabular-nums">00:{timer < 10 ? `0${timer}` : timer}</span>
          ) : (
            <button
              onClick={async () => {
                if (!emailFromQuery) return setError("No email to resend to.");
                setTimer(30);
                try {
                  setIsLoading(true);
                  const res = await fetch('/api/auth/resend-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: emailFromQuery }),
                  });
                  const data = await res.json().catch(() => null);
                  if (!res.ok) setError(data?.message || 'Failed to resend code');
                } catch (err) {
                  setError(err?.message || 'Network error');
                } finally {
                  setIsLoading(false);
                }
              }}
              className="text-white font-semibold hover:underline decoration-blue-400 underline-offset-4 transition-all"
            >
              Resend Code
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
