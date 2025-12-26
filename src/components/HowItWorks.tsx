"use client";

import React, { useState, useEffect, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { builderStepsData, analyzerStepsData } from "@/constants/howItWorksData";
import type { Mode, Step, StepData } from "@/types/HowItWorks";

// --- HELPER FUNCTIONS ---

const convertStepDataToStep = (stepData: StepData): Step => {
  const IconComponent = stepData.iconType;
  return {
    ...stepData,
    icon: <IconComponent className="w-5 h-5" />,
  };
};

// --- SUB-COMPONENTS ---

interface ModeToggleProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

const ModeToggle = memo(({ mode, onModeChange }: ModeToggleProps) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.3 }}
    className="flex justify-center"
  >
    <div className="bg-[var(--slate-100)] dark:bg-[var(--slate-800)] p-1.5 rounded-full inline-flex relative shadow-inner">
      <motion.div
        className="absolute inset-y-1.5 bg-white dark:bg-[var(--slate-700)] shadow-sm rounded-full pointer-events-none w-[calc(50%-6px)]"
        layoutId="toggle-background"
        initial={false}
        animate={{ x: mode === "builder" ? "100%" : "0%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
      
      <button
        onClick={() => onModeChange("analyzer")}
        className={cn(
          "relative z-10 px-6 py-2 rounded-full text-sm font-bold transition-colors duration-200 w-36",
          mode === "analyzer" ? "text-[var(--emerald-600)] dark:text-[var(--emerald-400)]" : "text-[var(--slate-500)] dark:text-[var(--slate-400)] hover:text-[var(--slate-700)] dark:hover:text-[var(--slate-300)]"
        )}
        aria-label="Switch to Analyzer Setup"
      >
        Analyzer Setup
      </button>
      <button
        onClick={() => onModeChange("builder")}
        className={cn(
          "relative z-10 px-6 py-2 rounded-full text-sm font-bold transition-colors duration-200 w-36",
          mode === "builder" ? "text-[var(--emerald-600)] dark:text-[var(--emerald-400)]" : "text-[var(--slate-500)] dark:text-[var(--slate-400)] hover:text-[var(--slate-700)] dark:hover:text-[var(--slate-300)]"
        )}
        aria-label="Switch to Builder Setup"
      >
        Builder Setup
      </button>
    </div>
  </motion.div>
));

ModeToggle.displayName = "ModeToggle";

interface PhoneIllustrationProps {
  mode: Mode;
  icon: React.ReactNode;
}

const PhoneIllustration = memo(({ mode, icon }: PhoneIllustrationProps) => (
  <div className="bg-[var(--card)] rounded-3xl shadow-xl p-6 pb-0 border border-[var(--slate-100)] dark:border-[var(--slate-700)] relative top-6 mx-auto w-[300px]">
    {/* Phone Header */}
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[var(--emerald-100)] dark:bg-[var(--emerald-900)]/30 flex items-center justify-center text-[var(--emerald-600)] dark:text-[var(--emerald-400)]">
          {icon}
        </div>
        <span className="text-xs font-bold text-[var(--slate-800)] dark:text-[var(--slate-200)]">
          {mode === 'builder' ? 'Personal Data' : 'Analysis Config'}
        </span>
      </div>
      <div className="bg-[var(--emerald-600)] dark:bg-[var(--emerald-500)] text-white text-[10px] px-3 py-1.5 rounded-lg font-medium shadow-sm shadow-[var(--emerald-200)] dark:shadow-[var(--emerald-900)]/50">
        {mode === 'builder' ? 'Upload Photo' : 'Export Data'}
      </div>
    </div>

    {/* Form Fields Illustration */}
    <div className="space-y-6">
      {mode === 'builder' ? (
        <>
          <div>
            <div className="h-2 w-16 bg-[var(--emerald-600)] dark:bg-[var(--emerald-500)] rounded-full mb-2" />
            <div className="h-10 w-full bg-[var(--slate-50)] dark:bg-[var(--slate-700)] rounded-lg border border-[var(--slate-100)] dark:border-[var(--slate-600)]" />
          </div>
          <div>
            <div className="h-2 w-24 bg-[var(--emerald-600)] dark:bg-[var(--emerald-500)] rounded-full mb-2" />
            <div className="h-10 w-full bg-[var(--slate-50)] dark:bg-[var(--slate-700)] rounded-lg border border-[var(--slate-100)] dark:border-[var(--slate-600)]" />
          </div>
          <div>
            <div className="h-2 w-10 bg-[var(--emerald-600)] dark:bg-[var(--emerald-500)] rounded-full mb-2" />
            <div className="h-10 w-full bg-[var(--slate-50)] dark:bg-[var(--slate-700)] rounded-lg border border-[var(--slate-100)] dark:border-[var(--slate-600)]" />
          </div>
        </>
      ) : (
        <>
          <div className="flex items-end gap-2 h-24 mb-4 px-2">
            <div className="w-1/4 bg-[var(--emerald-200)] dark:bg-[var(--emerald-900)]/30 rounded-t-lg h-[40%]" />
            <div className="w-1/4 bg-[var(--emerald-400)] dark:bg-[var(--emerald-700)]/50 rounded-t-lg h-[70%]" />
            <div className="w-1/4 bg-[var(--emerald-600)] dark:bg-[var(--emerald-500)] rounded-t-lg h-full shadow-lg shadow-[var(--emerald-200)] dark:shadow-[var(--emerald-900)]/50" />
            <div className="w-1/4 bg-[var(--emerald-300)] dark:bg-[var(--emerald-800)]/50 rounded-t-lg h-[50%]" />
          </div>
          <div>
            <div className="h-2 w-full bg-[var(--slate-100)] dark:bg-[var(--slate-700)] rounded-full mb-2 overflow-hidden">
              <div className="h-full w-2/3 bg-[var(--emerald-600)] dark:bg-[var(--emerald-500)]" />
            </div>
            <div className="flex justify-between text-[10px] text-[var(--slate-400)] dark:text-[var(--slate-500)]">
              <span>Processing...</span>
              <span>67%</span>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
));

PhoneIllustration.displayName = "PhoneIllustration";

interface ContentDetailProps {
  currentData: Step;
}

const ContentDetail = memo(({ currentData }: ContentDetailProps) => (
  <motion.div
    key={currentData.id}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    <span className="text-[var(--emerald-600)] dark:text-[var(--emerald-400)] font-bold text-xl mb-2 block">
      0{currentData.id}
    </span>
    
    <h3 className="text-3xl font-bold text-[var(--foreground)] mb-4 leading-tight">
      {currentData.contentTitle}
    </h3>
    
    <p className="text-[var(--muted-foreground)] mb-10 leading-relaxed">
      {currentData.contentDesc}
    </p>

    <div className="space-y-6">
      {currentData.features.map((feature, idx) => (
        <div key={idx} className="flex items-start gap-4 group">
          <div className="mt-1 flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-[var(--emerald-600)] fill-[var(--emerald-50)]" />
          </div>
          <div>
            <h4 className="text-[var(--foreground)] font-bold text-base mb-1 group-hover:text-[var(--emerald-700)] dark:group-hover:text-[var(--emerald-400)] transition-colors">
              {feature.title}.
              <span className="font-normal text-[var(--muted-foreground)] ml-1">
                {feature.desc}
              </span>
            </h4>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
));

ContentDetail.displayName = "ContentDetail";

interface StepNavigationProps {
  steps: Step[];
  activeStepId: number;
  onStepClick: (id: number) => void;
}

const StepNavigation = memo(({ steps, activeStepId, onStepClick }: StepNavigationProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    {steps.map((step) => {
      const isActive = activeStepId === step.id;
      return (
        <button
          key={step.id}
          onClick={() => onStepClick(step.id)}
          className="cursor-pointer group relative text-left"
          aria-label={`Go to step ${step.id}: ${step.title}`}
        >
          <div className={cn(
            "absolute -top-6 left-0 w-full h-[3px] transition-colors duration-300",
            isActive ? "bg-[var(--emerald-600)] dark:bg-[var(--emerald-500)]" : "bg-[var(--slate-200)] dark:bg-[var(--slate-700)] group-hover:bg-[var(--emerald-200)] dark:group-hover:bg-[var(--emerald-800)]"
          )} />

          <div className="pt-2">
            <span className={cn(
              "block text-sm font-bold mb-2 transition-colors",
              isActive ? "text-[var(--emerald-600)] dark:text-[var(--emerald-400)]" : "text-[var(--muted-foreground)]"
            )}>
              0{step.id}
            </span>
            <h4 className={cn(
              "text-lg font-bold mb-2 transition-colors",
              isActive ? "text-[var(--emerald-600)] dark:text-[var(--emerald-400)]" : "text-[var(--foreground)]"
            )}>
              {step.title}
            </h4>
            <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        </button>
      );
    })}
  </div>
));

StepNavigation.displayName = "StepNavigation";

// --- MAIN COMPONENT ---

export default function HowItWorks() {
  const [mode, setMode] = useState<Mode>("builder");
  const [activeStepId, setActiveStepId] = useState(1);

  // Memoize steps based on mode and convert to Step with rendered icons
  const steps = useMemo(
    () => (mode === "builder" ? builderStepsData : analyzerStepsData).map(convertStepDataToStep),
    [mode]
  );

  // Reset to step 1 when mode toggles
  useEffect(() => {
    setActiveStepId(1);
  }, [mode]);

  // Memoize current data
  const currentData = useMemo(
    () => steps.find((s) => s.id === activeStepId) || steps[0],
    [steps, activeStepId]
  );

  return (
    <section id="how-it-works" className="bg-[var(--background)] py-24 px-4 md:px-8 font-sans selection:bg-[var(--emerald-100)] dark:selection:bg-[var(--emerald-900)]/30">
      <div className="max-w-6xl mx-auto">
        
        {/* --- Header Section --- */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-4"
          >
            <span className="border border-[var(--emerald-200)] dark:border-[var(--emerald-800)] text-[var(--emerald-600)] dark:text-[var(--emerald-400)] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase flex items-center gap-2 mx-auto w-fit">
              <CheckCircle2 className="w-3 h-3" /> SIMPLE PROCESS
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4 tracking-tight leading-tight"
          >
            Getting Started is{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--emerald-600)] to-[var(--teal-600)]">
              Easy
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto"
          >
            Create a profile and we&apos;ll match you with the best your dream companies and jobs in the world.
          </motion.p>

          <ModeToggle mode={mode} onModeChange={setMode} />
        </div>

        {/* --- Main Content Card --- */}
        <div className="bg-[var(--card)] rounded-[2.5rem] border border-[var(--slate-100)] dark:border-[var(--slate-800)] shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden min-h-[500px] mb-20 relative">
          <div className="flex flex-col lg:flex-row h-full">
            
            {/* Left Side: Illustration (Dynamic Phone UI) */}
            <div className="lg:w-1/2 bg-white dark:bg-gradient-to-b dark:from-[var(--slate-800)] dark:to-[var(--slate-900)] p-10 flex items-center justify-center relative min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${mode}-${activeStepId}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                  className="w-full max-w-sm"
                >
                  <PhoneIllustration mode={mode} icon={currentData.icon} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Side: Content */}
            <div className="lg:w-1/2 p-8 md:p-16 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <ContentDetail currentData={currentData} />
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* --- Bottom Stepper Navigation --- */}
        <StepNavigation 
          steps={steps} 
          activeStepId={activeStepId} 
          onStepClick={setActiveStepId} 
        />
      </div>
    </section>
  );
}