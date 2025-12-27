"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { 
  FileText, ScanLine, CheckCircle2, 
  BarChart3, UploadCloud, Sparkles 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  featureAnimations, 
  svgPaths, 
  featureNodes,
  type FeatureNode 
} from "@/constants/featuresVisualizationData";

// --- SUB-COMPONENTS ---

const SectionHeader = memo(() => (
  <div className="text-center mb-12 sm:mb-16 md:mb-20">
    <motion.div
      {...featureAnimations.badge}
      className="inline-block mb-3 sm:mb-4"
    >
      <span className="bg-[var(--emerald-50)] dark:bg-[var(--emerald-950)]/30 text-[var(--emerald-700)] dark:text-[var(--emerald-300)] px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold border border-[var(--emerald-100)] dark:border-[var(--emerald-900)] uppercase tracking-wide flex items-center gap-1.5 sm:gap-2 mx-auto w-fit">
        <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Core Technology
      </span>
    </motion.div>
    <motion.h2 
      {...featureAnimations.heading}
      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--foreground)] tracking-tight leading-tight px-4"
    >
      How our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--emerald-600)] to-[var(--teal-600)] dark:from-[var(--emerald-400)] dark:to-[var(--teal-400)]">AI Engine</span> Works
    </motion.h2>
  </div>
));

SectionHeader.displayName = "SectionHeader";

const SVGConnectors = memo(() => (
  <svg 
    className="absolute inset-0 w-full h-full pointer-events-none z-0" 
    viewBox="0 0 800 400" 
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="var(--slate-200)" />
        <stop offset="50%" stopColor="var(--slate-400)" />
        <stop offset="100%" stopColor="var(--slate-200)" />
      </linearGradient>
    </defs>

    {svgPaths.map((path) => (
      <motion.path 
        key={path.id}
        d={path.d}
        fill="none"
        stroke="url(#lineGradient)" 
        strokeWidth="2" 
        strokeDasharray="6 6"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: path.delay }}
      />
    ))}
  </svg>
));

SVGConnectors.displayName = "SVGConnectors";

const ResumePaper = memo(() => (
  <div className="relative z-20">
    {/* Glowing Backdrop */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-40 sm:w-40 sm:h-52 md:w-48 md:h-64 bg-[var(--emerald-500)]/20 blur-3xl rounded-full" />

    <motion.div 
      {...featureAnimations.centerPaper}
      className="relative w-32 h-40 sm:w-36 sm:h-48 md:w-40 md:h-56 lg:w-44 lg:h-60 bg-[var(--card)] rounded-lg sm:rounded-xl border border-[var(--slate-200)] dark:border-[var(--slate-700)] shadow-2xl shadow-[var(--emerald-900)]/5 dark:shadow-[var(--emerald-500)]/10 flex flex-col items-center pt-4 sm:pt-5 md:pt-6 px-3 sm:px-4 overflow-hidden"
    >
      {/* Resume Header Icon */}
      <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-[var(--slate-50)] dark:bg-[var(--slate-700)] border border-[var(--slate-100)] dark:border-[var(--slate-600)] mb-3 sm:mb-4 flex items-center justify-center text-[var(--slate-300)] dark:text-[var(--slate-500)]">
        <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>

      {/* Skeleton Lines */}
      <div className="w-full space-y-1.5 sm:space-y-2">
        <div className="h-1.5 sm:h-2 w-3/4 bg-[var(--slate-100)] dark:bg-[var(--slate-700)] rounded-full mx-auto" />
        <div className="h-1.5 sm:h-2 w-1/2 bg-[var(--slate-100)] dark:bg-[var(--slate-700)] rounded-full mx-auto mb-3 sm:mb-4" />
        
        <div className="h-1 sm:h-1.5 w-full bg-[var(--slate-50)] dark:bg-[var(--slate-700)]/50 rounded-full" />
        <div className="h-1 sm:h-1.5 w-full bg-[var(--slate-50)] dark:bg-[var(--slate-700)]/50 rounded-full" />
        <div className="h-1 sm:h-1.5 w-5/6 bg-[var(--slate-50)] dark:bg-[var(--slate-700)]/50 rounded-full" />
        
        <div className="h-1 sm:h-1.5 w-full bg-[var(--slate-50)] dark:bg-[var(--slate-700)]/50 rounded-full mt-2 sm:mt-3" />
        <div className="h-1 sm:h-1.5 w-4/6 bg-[var(--slate-50)] dark:bg-[var(--slate-700)]/50 rounded-full" />
      </div>

      {/* Scanning Laser Beam */}
      <motion.div
        animate={featureAnimations.scanningBeam.animate as unknown as any}
        transition={featureAnimations.scanningBeam.transition}
        className="absolute left-0 w-full h-8 sm:h-10 md:h-12 bg-gradient-to-b from-[var(--emerald-500)]/0 via-[var(--emerald-500)]/10 to-[var(--emerald-500)]/0 border-b border-[var(--emerald-500)]/30 z-30"
      />
      
      {/* Pulse Ring */}
      <div className="absolute inset-0 border-2 border-[var(--emerald-500)]/20 rounded-lg sm:rounded-xl animate-pulse" />
    </motion.div>
  </div>
));

ResumePaper.displayName = "ResumePaper";

const UploadSourceNode = memo(() => (
  <motion.div 
    className="absolute left-[2%] sm:left-[5%] md:left-[10%] top-1/2 -translate-y-1/2 z-20 block md:block"
    initial={{ x: -20, opacity: 0 }}
    whileInView={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.2 }}
  >
    <div className="bg-white dark:bg-[var(--background)] border border-[var(--slate-200)] dark:border-[var(--slate-700)] px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-lg dark:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.3)] flex items-center gap-2 sm:gap-3 w-32 sm:w-36 md:w-44">
      <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-[var(--blue-50)] flex items-center justify-center text-[var(--blue-500)]">
        <UploadCloud className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] sm:text-xs font-bold text-[var(--slate-700)]">Source File</span>
        <span className="text-[8px] sm:text-[10px] text-[var(--slate-400)]">PDF, DOCX, TXT</span>
      </div>
    </div>
  </motion.div>
));

UploadSourceNode.displayName = "UploadSourceNode";

interface FeatureCardProps {
  color: "emerald" | "blue" | "purple";
  title: string;
  value: string;
}

const FeatureCard = memo(({ color, title, value }: FeatureCardProps) => {
  const colors = {
    emerald: "bg-[var(--emerald-50)] border-[var(--emerald-100)]",
    blue: "bg-[var(--blue-50)] border-[var(--blue-100)]",
    purple: "bg-[var(--emerald-50)] border-[var(--emerald-100)]"
  } as const;

  const icons = {
    emerald: <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--emerald-600)]" />,
    blue: <ScanLine className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--blue-600)]" />,
    purple: <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--emerald-600)]" />
  } as const;

  return (
    <div className="bg-[var(--card)] border border-[var(--slate-100)] dark:border-[var(--slate-700)] px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.3)] flex items-center gap-2 sm:gap-3 w-36 sm:w-40 md:w-48 hover:scale-105 transition-transform duration-300">
      <div className={cn("w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center border", colors[color])}>
        {icons[color]}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] sm:text-xs font-bold text-[var(--slate-800)] dark:text-[var(--slate-200)]">{title}</span>
        <span className="text-[8px] sm:text-[10px] font-semibold text-[var(--slate-400)] dark:text-[var(--slate-500)] uppercase tracking-wider">{value}</span>
      </div>
    </div>
  );
});

FeatureCard.displayName = "FeatureCard";

interface FeatureNodeComponentProps {
  node: FeatureNode;
}

const FeatureNodeComponent = memo(({ node }: FeatureNodeComponentProps) => (
  <motion.div 
    className={cn("absolute z-20", node.position)}
    {...node.animation}
  >
    <FeatureCard {...node.data} />
  </motion.div>
));

FeatureNodeComponent.displayName = "FeatureNodeComponent";

// --- MAIN COMPONENT ---

export default function Features() {
  return (
    <section id="features" className="bg-[var(--background)] py-16 sm:py-20 md:py-24 px-3 sm:px-4 md:px-8 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionHeader />

        <div className="relative w-full max-w-5xl mx-auto aspect-[4/3] sm:aspect-[16/9] md:aspect-[2/1] bg-[var(--slate-50)]/50 dark:bg-[var(--slate-900)]/50 rounded-2xl sm:rounded-[2.5rem] md:rounded-[3rem] border border-[var(--slate-100)] dark:border-[var(--slate-800)] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 select-none overflow-hidden">
          {/* Background Grid */}
          <div 
            className="absolute inset-0 opacity-30 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-[size:30px_30px]"
          />

          <SVGConnectors />
          <ResumePaper />
          <UploadSourceNode />
          
          {featureNodes.map((node, index) => (
            <FeatureNodeComponent key={`feature-node-${index}`} node={node} />
          ))}
        </div>
      </div>
    </section>
  );
}
