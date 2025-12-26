"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { FileText, Sparkles, BarChart3, MessageSquare, Palette, Download } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

const BenefitCard = memo<Benefit & { index: number }>(
  ({ icon: Icon, title, description, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--slate-100)] dark:border-[var(--slate-700)] hover:border-[var(--emerald-300)] dark:hover:border-[var(--emerald-700)] shadow-lg hover:shadow-xl transition-all duration-300 group"
    >
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--emerald-500)] to-[var(--teal-600)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">{title}</h3>
      <p className="text-[var(--muted-foreground)] leading-relaxed">{description}</p>
    </motion.div>
  )
);
BenefitCard.displayName = "BenefitCard";

export default function Benefits() {
  const benefits: Benefit[] = [
    {
      icon: FileText,
      title: "ATS-Optimized Templates",
      description:
        "Choose from 20+ professionally designed templates that pass ATS screening with 95% success rate.",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Content",
      description:
        "Generate compelling bullet points and descriptions tailored to your experience and target role.",
    },
    {
      icon: BarChart3,
      title: "Real-Time Scoring",
      description:
        "Get instant feedback on your resume's ATS compatibility, keyword optimization, and overall quality.",
    },
    {
      icon: MessageSquare,
      title: "Cover Letter Generator",
      description:
        "Create personalized cover letters that complement your resume and match job requirements.",
    },
    {
      icon: Palette,
      title: "Easy Customization",
      description:
        "Intuitive drag-and-drop builder with real-time preview. Customize fonts, colors, and sections effortlessly.",
    },
    {
      icon: Download,
      title: "Multiple Export Formats",
      description:
        "Download your resume in PDF, DOCX, or TXT formats. All formats are ATS-friendly.",
    },
  ];

  return (
    <section className="bg-white dark:bg-gradient-to-b dark:bg-[var(--background)] py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4 leading-tight">
            Everything You Need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--emerald-600)] to-[var(--teal-600)]">
              Stand Out
            </span>
          </h2>
          <p className="text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto">
            Powerful features designed to get your resume past ATS systems and into the hands of
            hiring managers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
