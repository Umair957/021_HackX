"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { 
  FileText, Sparkles, Send, 
  FileCheck, ScanSearch 
} from "lucide-react";
import { heroAnimations, floatingAnimations, resumeLetters } from "@/constants/heroData";

// --- SUB-COMPONENTS ---

const HeroBadge = memo(() => (
  <motion.div
    {...heroAnimations.badge}
    className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[var(--background)] border border-[var(--emerald-100)] dark:border-[var(--emerald-900)] mb-6 sm:mb-8"
  >
    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--emerald-600)] dark:text-[var(--emerald-400)]" />
    <span className="text-[10px] sm:text-xs font-bold text-[var(--emerald-700)] dark:text-[var(--emerald-300)] uppercase tracking-wide">
      AI-Powered Builder & Analyzer
    </span>
  </motion.div>
));

HeroBadge.displayName = "HeroBadge";

const HeroHeading = memo(() => (
  <motion.h1
    {...heroAnimations.heading}
    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-[var(--foreground)] leading-[1.1] mb-4 sm:mb-6 tracking-tight px-4"
  >
    Land Your Dream Job with{' '}
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--emerald-600)] to-[var(--teal-600)] dark:from-[var(--emerald-400)] dark:to-[var(--teal-400)]">
      AI-Optimized Resumes
    </span>
  </motion.h1>
));

HeroHeading.displayName = "HeroHeading";

const HeroSubheading = memo(() => (
  <motion.p
    {...heroAnimations.subheading}
    className="text-sm sm:text-base md:text-lg lg:text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4"
  >
    Beat the ATS, impress recruiters, and get 3x more interviews with resumes optimized by AI.
    <span className="text-[var(--foreground)] font-semibold"> Join 10,000+ job seekers </span> 
    who landed their dream jobs.
  </motion.p>
));

HeroSubheading.displayName = "HeroSubheading";

const CTAButtons = memo(() => (
  <motion.div
    {...heroAnimations.cta}
    className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 md:mb-20 px-4"
  >
    <button 
      className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[var(--emerald-600)] text-white rounded-full font-bold text-sm sm:text-base hover:bg-[var(--emerald-700)] hover:shadow-lg hover:shadow-[var(--emerald-200)] dark:hover:shadow-[var(--emerald-900)]/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
      aria-label="Analyze your resume with AI"
    >
      <ScanSearch className="w-4 h-4" /> Analyze My Resume
    </button>
    
    <button 
      className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[var(--card)] text-[var(--foreground)] border border-[var(--slate-200)] dark:border-[var(--slate-700)] rounded-full font-bold text-sm sm:text-base hover:bg-[var(--slate-50)] dark:hover:bg-[var(--slate-700)] hover:border-[var(--emerald-200)] dark:hover:border-[var(--emerald-600)] hover:text-[var(--emerald-600)] dark:hover:text-[var(--emerald-400)] transition-all duration-300 flex items-center justify-center gap-2"
      aria-label="Build a new resume from scratch"
    >
      Build from Scratch
    </button>
  </motion.div>
));

CTAButtons.displayName = "CTAButtons";

const FloatingDocument = memo(() => (
  <motion.div 
    animate={floatingAnimations.document.animate}
    transition={floatingAnimations.document.transition}
    className="absolute left-[5%] top-[20%] sm:left-[8%] md:left-[12%] lg:left-[15%] md:top-[25%] bg-[var(--card)] p-2 sm:p-3 rounded-lg shadow-xl shadow-[var(--emerald-900)]/5 dark:shadow-[var(--emerald-500)]/10 border border-[var(--emerald-100)] dark:border-[var(--slate-700)] w-20 sm:w-24 md:w-28 lg:w-32 rotate-[-12deg] z-20"
  >
    <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[var(--emerald-100)] dark:bg-[var(--emerald-900)]/30 flex items-center justify-center">
        <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[var(--emerald-600)] dark:text-[var(--emerald-400)]" />
      </div>
      <div className="h-1.5 sm:h-2 w-8 sm:w-12 bg-[var(--slate-100)] dark:bg-[var(--slate-700)] rounded-full" />
    </div>
    <div className="space-y-1 sm:space-y-1.5">
      <div className="h-1 sm:h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full" />
      <div className="h-1 sm:h-1.5 w-3/4 bg-[var(--slate-100)] dark:bg-[var(--slate-700)] rounded-full" />
      <div className="h-1 sm:h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full" />
    </div>
    <div className="absolute -bottom-2 sm:-bottom-3 -right-2 sm:-right-3 bg-[var(--green-500)] text-white px-1.5 sm:px-2 py-0.5 rounded-full shadow-lg text-[8px] sm:text-[10px] font-bold border-2 border-white dark:border-[var(--slate-900)]">
      98%
    </div>
  </motion.div>
));

FloatingDocument.displayName = "FloatingDocument";

const PaperPlane = memo(() => (
  <motion.div
    initial={floatingAnimations.paperPlane.initial}
    animate={floatingAnimations.paperPlane.animate}
    transition={floatingAnimations.paperPlane.transition}
    className="absolute left-[35%] sm:left-[38%] md:left-[40%] top-[50%] z-20"
  >
    <div className="bg-[var(--orange-100)] dark:bg-[var(--orange-900)]/30 p-2 sm:p-3 rounded-full shadow-lg border border-[var(--orange-200)] dark:border-[var(--orange-800)]">
      <Send className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[var(--orange-500)] dark:text-[var(--orange-400)] fill-[var(--orange-500)] dark:fill-[var(--orange-400)]" />
    </div>
  </motion.div>
));

PaperPlane.displayName = "PaperPlane";

const AnalysisCard = memo(() => (
  <motion.div 
    animate={floatingAnimations.analysisCard.animate}
    transition={floatingAnimations.analysisCard.transition}
    className="absolute right-[5%] top-[30%] sm:right-[8%] md:right-[12%] lg:right-[15%] md:top-[15%] bg-[var(--card)] p-2 sm:p-3 rounded-lg shadow-xl shadow-[var(--teal-900)]/5 dark:shadow-[var(--teal-500)]/10 border border-[var(--teal-100)] dark:border-[var(--slate-700)] w-20 sm:w-24 md:w-28 lg:w-32 rotate-[12deg] z-20"
  >
    <div className="absolute -top-1.5 sm:-top-2 -right-1.5 sm:-right-2">
      <div className="bg-[var(--emerald-600)] dark:bg-[var(--emerald-500)] text-white rounded-full p-0.5 sm:p-1 shadow-lg">
        <FileCheck className="w-3 h-3 sm:w-4 sm:h-4" />
      </div>
    </div>
    <div className="flex gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded bg-[var(--emerald-50)] dark:bg-[var(--emerald-900)]/30 flex items-center justify-center">
        <ScanSearch className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--emerald-600)] dark:text-[var(--emerald-400)]" />
      </div>
      <div className="flex-1 space-y-0.5 sm:space-y-1 pt-1">
        <div className="h-1.5 sm:h-2 w-full bg-[var(--slate-100)] dark:bg-[var(--slate-700)] rounded-full" />
        <div className="h-1.5 sm:h-2 w-1/2 bg-[var(--slate-100)] dark:bg-[var(--slate-700)] rounded-full" />
      </div>
    </div>
    <div className="mt-1.5 sm:mt-2">
      <div className="flex justify-between text-[7px] sm:text-[8px] text-gray-400 dark:text-gray-500 mb-0.5">
        <span>Job Match</span>
        <span className="text-[var(--emerald-600)] dark:text-[var(--emerald-400)] font-bold">High</span>
      </div>
      <div className="h-1 sm:h-1.5 w-full bg-[var(--emerald-100)] dark:bg-[var(--emerald-900)]/30 rounded-full">
        <div className="h-1 sm:h-1.5 w-[90%] bg-[var(--emerald-500)] dark:bg-[var(--emerald-400)] rounded-full" />
      </div>
    </div>
  </motion.div>
));

AnalysisCard.displayName = "AnalysisCard";

const ResumeText = memo(() => (
  <div className="relative z-10 flex items-baseline gap-1 md:gap-4">
    {resumeLetters.map((letter, i) => (
      <motion.span
        key={`${letter}-${i}`}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 + (i * 0.1), type: "spring", bounce: 0.5 }}
        className="text-[60px] sm:text-[80px] md:text-[120px] lg:text-[160px] xl:text-[200px] font-black text-slate-700 dark:text-slate-600 leading-none tracking-tighter drop-shadow-sm"
      >
        {letter}
      </motion.span>
    ))}
  </div>
));

ResumeText.displayName = "ResumeText";

const IllustrationArea = memo(() => (
  <motion.div
    {...heroAnimations.illustration}
    className="relative w-full max-w-7xl mx-auto h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px] bg-[var(--slate-50)] dark:bg-[var(--slate-900)] rounded-2xl sm:rounded-[2.5rem] border border-[var(--slate-100)] dark:border-[var(--slate-800)] flex items-center justify-center overflow-hidden select-none"
  >
    {/* Background Grid Pattern */}
    <div 
      className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#6366f1_1px,transparent_1px)] bg-[size:30px_30px]"
    />

    <ResumeText />
    <FloatingDocument />
    <PaperPlane />
    <AnalysisCard />
  </motion.div>
));

IllustrationArea.displayName = "IllustrationArea";

// --- MAIN COMPONENT ---

export default function HeroSection() {
  return (
    <section id="home" className="bg-[var(--background)] pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 md:px-8 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        <HeroBadge />
        <HeroHeading />
        <HeroSubheading />
        <CTAButtons />
        <IllustrationArea />
      </div>
    </section>
  );
}
