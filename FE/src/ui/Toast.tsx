"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
// Import the data from your new config file
import { toastConfig, ToastType } from "@/constants/toastData"; 

interface ToastProps {
  type: ToastType;
  title: string;
  description: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function SideToast({ type, title, description, isVisible, onClose }: ToastProps) {
  const Config = toastConfig[type];
  const Icon = Config.icon;

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <div className="fixed top-24 right-4 z-[100] flex flex-col items-end pointer-events-none gap-2">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            layout
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="pointer-events-auto"
          >
            <div className="relative w-[380px] overflow-hidden rounded-xl shadow-2xl bg-white dark:bg-[#18181b] border border-gray-100 dark:border-zinc-800 p-4">
              <div className="flex items-start gap-4">
                
                {/* ICON CIRCLE */}
                <div className={`
                  flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full
                  ${Config.iconBg} ${Config.iconColor} shadow-sm
                `}>
                  <Icon className="w-5 h-5" strokeWidth={3} />
                </div>

                {/* TEXT CONTENT */}
                <div className="flex-1 pt-0.5">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white leading-none mb-1">
                    {title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* CLOSE BUTTON */}
                <button 
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}