"use client";

import { memo, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ThemeToggle = memo(() => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-[var(--slate-100)] dark:bg-[var(--slate-800)]" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[var(--slate-100)] to-[var(--slate-200)] dark:from-[var(--slate-800)] dark:to-[var(--slate-900)] flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 border border-[var(--slate-200)] dark:border-[var(--slate-700)]"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: isDark 
            ? "0 0 20px rgba(168, 85, 247, 0.4)" 
            : "0 0 20px rgba(234, 179, 8, 0.4)"
        }}
        transition={{ duration: 0.3 }}
      />
      
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Sun className="w-5 h-5 text-[var(--yellow-500)]" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Moon className="w-5 h-5 text-[var(--emerald-600)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
});

ThemeToggle.displayName = "ThemeToggle";

export default ThemeToggle;
