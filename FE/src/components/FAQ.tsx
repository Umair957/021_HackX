"use client";

import React, { memo, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, BookOpen, Calendar, ChevronDown } from "lucide-react";
import type { FAQItem } from "@/constants/faqData";
import { faqs as faqData } from "@/constants/faqData";

const FAQCard = memo<FAQItem & { index: number }>(({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-[var(--slate-200)] dark:border-[var(--slate-700)] last:border-b-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left group"
        aria-expanded={isOpen}
      >
        <h3 className="text-base md:text-lg font-medium text-[var(--foreground)] pr-4">{question}</h3>
        <ChevronDown
          className={`w-5 h-5 text-[var(--slate-400)] flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="pb-5 pr-8">
          <p className="text-sm md:text-base text-[var(--muted-foreground)] leading-relaxed">{answer}</p>
        </div>
      </motion.div>
    </motion.div>
  );
});
FAQCard.displayName = "FAQCard";

export default function FAQ() {
  return (
    <section id="faq" className="bg-white dark:bg-[var(--background)] py-16 md:py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left Column - Title and Action Cards */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-2">
                Frequently asked
              </h2>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--foreground)]">
                questions
              </h2>
            </motion.div>

            <div className="space-y-4">
              <motion.a
                href="#contact"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-4 p-5 bg-[var(--card)] rounded-xl border border-[var(--slate-200)] dark:border-[var(--slate-700)] hover:border-[var(--emerald-300)] dark:hover:border-[var(--emerald-600)] transition-colors group"
              >
                <div className="p-3 bg-white dark:bg-[var(--emerald-900)]/20 rounded-lg group-hover:bg-[var(--slate-50)] dark:group-hover:bg-[var(--emerald-900)]/30 transition-colors border border-[var(--slate-200)] dark:border-transparent">
                  <MessageCircle className="w-6 h-6 text-[var(--emerald-600)] dark:text-[var(--emerald-400)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">Contact support</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">24/7 available. No chatbots.</p>
                </div>
              </motion.a>

              <motion.a
                href="#help"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="flex items-center gap-4 p-5 bg-[var(--card)] rounded-xl border border-[var(--slate-200)] dark:border-[var(--slate-700)] hover:border-[var(--emerald-300)] dark:hover:border-[var(--emerald-600)] transition-colors group"
              >
                <div className="p-3 bg-white dark:bg-[var(--emerald-900)]/20 rounded-lg group-hover:bg-[var(--slate-50)] dark:group-hover:bg-[var(--emerald-900)]/30 transition-colors border border-[var(--slate-200)] dark:border-transparent">
                  <BookOpen className="w-6 h-6 text-[var(--emerald-600)] dark:text-[var(--emerald-400)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">Visit help center</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">Check out tutorials.</p>
                </div>
              </motion.a>

              <motion.a
                href="#demo"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 p-5 bg-[var(--card)] rounded-xl border border-[var(--slate-200)] dark:border-[var(--slate-700)] hover:border-[var(--emerald-300)] dark:hover:border-[var(--emerald-600)] transition-colors group"
              >
                <div className="p-3 bg-white dark:bg-[var(--emerald-900)]/20 rounded-lg group-hover:bg-[var(--slate-50)] dark:group-hover:bg-[var(--emerald-900)]/30 transition-colors border border-[var(--slate-200)] dark:border-transparent">
                  <Calendar className="w-6 h-6 text-[var(--emerald-600)] dark:text-[var(--emerald-400)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">Book a demo</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">1:1 talk to a tax specialist.</p>
                </div>
              </motion.a>
            </div>
          </div>

          {/* Right Column - FAQ Items */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[var(--card)] rounded-2xl border border-[var(--slate-200)] dark:border-[var(--slate-700)] p-6 md:p-8"
          >
            <div className="space-y-0">
              {faqData.map((faq: FAQItem, index: number) => (
                <FAQCard key={faq.id} {...faq} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
