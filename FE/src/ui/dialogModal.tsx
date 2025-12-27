"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Check, AlertTriangle, Info } from "lucide-react";

export type DialogState = "idle" | "confirm" | "loading" | "success";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;

  // Content
  title: string;
  description?: string;
  
  // Visual Mode
  type?: "danger" | "info" | "success"; // Affects colors (Red vs Blue vs Green)
  isLoading?: boolean; // Overrides everything to show spinner
  isSuccess?: boolean; // Overrides everything to show checkmark
  
  // Actions
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

export default function Dialog({
  isOpen,
  onClose,
  title,
  description,
  type = "info",
  isLoading = false,
  isSuccess = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
}: DialogProps) {
  
  // Determine Icon & Color Scheme
  let Icon = Info;
  let iconBg = "bg-blue-100 dark:bg-blue-900/20";
  let iconColor = "text-blue-600 dark:text-blue-400";
  let buttonColor = "bg-blue-600 hover:bg-blue-700";

  if (type === "danger") {
    Icon = AlertTriangle;
    iconBg = "bg-red-100 dark:bg-red-900/20";
    iconColor = "text-red-600 dark:text-red-500";
    buttonColor = "bg-red-600 hover:bg-red-700";
  } else if (isSuccess) {
    Icon = Check;
    iconBg = "bg-green-100 dark:bg-green-900/20";
    iconColor = "text-green-600 dark:text-green-500";
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isLoading || isSuccess ? undefined : onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 z-10 overflow-hidden"
          >
            <div className="flex flex-col items-center text-center">
              
              {/* Dynamic Icon Area */}
              <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${iconBg} ${iconColor}`}>
                {isLoading ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : isSuccess ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                    <Check className="w-8 h-8" />
                  </motion.div>
                ) : (
                  <Icon className="w-8 h-8" />
                )}
              </div>

              {/* Text Content */}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {title}
              </h3>
              {description && (
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                  {description}
                </p>
              )}

              {/* Buttons (Hidden if Loading or Success) */}
              {!isLoading && !isSuccess && (
                <div className="flex gap-3 w-full">
                  <button
                    onClick={onClose}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    {cancelText}
                  </button>
                  {onConfirm && (
                    <button
                      onClick={onConfirm}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-white font-medium shadow-lg transition-all active:scale-95 ${buttonColor}`}
                    >
                      {confirmText}
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}