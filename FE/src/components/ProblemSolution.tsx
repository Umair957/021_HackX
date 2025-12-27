"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { XCircle, CheckCircle } from "lucide-react";

const PainPoint = memo<{ text: string; index: number }>(({ text, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="flex items-start gap-3 p-4 bg-[var(--red-50)] dark:bg-[var(--red-900)]/20 rounded-lg border border-[var(--red-200)] dark:border-[var(--red-800)]"
  >
    <XCircle className="w-5 h-5 text-[var(--red-500)] flex-shrink-0 mt-1" />
    <p className="text-[var(--foreground)]">{text}</p>
  </motion.div>
));
PainPoint.displayName = "PainPoint";

const Solution = memo<{ text: string; index: number }>(({ text, index }) => (
  <motion.div
    initial={{ opacity: 0, x: 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="flex items-start gap-3 p-4 bg-[var(--green-50)] dark:bg-[var(--green-900)]/20 rounded-lg border border-[var(--green-200)] dark:border-[var(--green-800)]"
  >
    <CheckCircle className="w-5 h-5 text-[var(--green-500)] flex-shrink-0 mt-1" />
    <p className="text-[var(--foreground)]">{text}</p>
  </motion.div>
));
Solution.displayName = "Solution";

export default function ProblemSolution() {
  const painPoints = [
    "Your resume gets rejected by ATS systems before a human even sees it",
    "You spend hours formatting and still don't know if it's good enough",
    "Generic resumes that don't match specific job requirements",
    "No feedback on what's wrong with your current resume",
  ];

  const solutions = [
    "AI analyzes your resume against ATS algorithms and job requirements",
    "Professional templates optimized for both ATS and recruiters",
    "Personalized suggestions to match each job description",
    "Real-time scoring and actionable feedback to improve your resume",
  ];

  return (
    <section className="bg-[var(--background)] py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4 leading-tight">
            Stop Losing Opportunities to{" "}            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--red-500)] to-[var(--orange-500)]">
              ATS Systems
            </span>
          </h2>
          <p className="text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto">
            75% of resumes never reach a human recruiter. Here&apos;s how we solve that problem.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Pain Points */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-[var(--slate-900)] dark:text-white mb-6 flex items-center gap-2"
            >
              <XCircle className="w-6 h-6 text-[var(--red-500)]" />
              The Problem
            </motion.h3>
            <div className="space-y-4">
              {painPoints.map((point, index) => (
                <PainPoint key={index} text={point} index={index} />
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div className="lg:col-start-2 lg:row-start-1">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2"
            >
              <CheckCircle className="w-6 h-6 text-[var(--green-500)]" />
              The Solution
            </motion.h3>
            <div className="space-y-4">
              {solutions.map((solution, index) => (
                <Solution key={index} text={solution} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
