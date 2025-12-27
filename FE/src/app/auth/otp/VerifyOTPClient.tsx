"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import SideToast from "@/ui/Toast";
import { ToastType } from "@/constants/toastData";

export default function VerifyOTPClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams?.get("email") || "";
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ visible: boolean; type: ToastType; title: string; desc: string }>({
    visible: false,
    type: "success",
    title: "",
    desc: "",
  });

  const showToast = (type: ToastType, title: string, desc: string) => {
    setToast({ visible: true, type, title, desc });
  };

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
        showToast("success", "Verified", "Your account has been verified. Redirecting to login...");
        setTimeout(() => router.push("/auth/login"), 800);
      } else {
        const msg = data?.message || "Invalid code. Please try again.";
        setError(msg);
        showToast("error", "Verification failed", msg);
      }
    } catch (err) {
      const message = (err as Error).message || "Network error";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 p-4 font-sans relative overflow-hidden">
      
      {/* Background Ambient Glows (Matches Login Page) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/5 dark:bg-emerald-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-500/5 dark:bg-teal-900/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Main Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden p-8 text-center z-10"
      >
        {/* Back Button */}
        <div className="absolute top-6 left-6">
            <Link href="/auth/login" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <ArrowLeft className="w-5 h-5" />
            </Link>
        </div>

        {/* Icon Circle */}
        <div className="mx-auto w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-6 border border-emerald-100 dark:border-emerald-800">
          <Mail className="w-8 h-8 text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Check your email</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm md:text-base">
          We sent a verification code to <br />
          <span className="font-bold text-gray-900 dark:text-white">{emailFromQuery || "your email"}</span>
        </p>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-300 text-sm font-medium"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 sm:gap-3 mb-8">
            {otp.map((digit, index) => (
              <motion.input
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl border transition-all outline-none 
                    ${digit 
                        ? 'border-emerald-500 dark:border-emerald-400 ring-1 ring-emerald-500 dark:ring-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' 
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20'
                    }`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <>
                Verify Account <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Didn`t receive the code?{" "}
          {timer > 0 ? (
            <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">00:{timer < 10 ? `0${timer}` : timer}</span>
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
                  if (!res.ok) {
                    const msg = data?.message || 'Failed to resend code';
                    setError(msg);
                    showToast("error", "Resend failed", msg);
                  } else {
                    showToast("success", "Code sent", "A new verification code was sent to your email.");
                  }
                } catch (err) {
                  const message = (err as Error).message || 'Network error';
                  setError(message);
                } finally {
                  setIsLoading(false);
                }
              }}
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline decoration-2 underline-offset-4 transition-all"
            >
              Resend Code
            </button>
          )}
        </div>
      </motion.div>
      {/* Side Toast */}
      <SideToast
        isVisible={toast.visible}
        type={toast.type}
        title={toast.title}
        description={toast.desc}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
}