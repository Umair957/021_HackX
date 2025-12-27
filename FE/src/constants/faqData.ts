import { HelpCircle } from "lucide-react";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export const faqs: FAQItem[] = [
  {
    id: "faq-ats",
    question: "What is an ATS and why does it matter?",
    answer:
      "ATS (Applicant Tracking System) is software used by most companies to screen resumes. If your resume isn't ATS-optimized, it may be rejected before a human sees it. ZUME analyzes and optimizes your resume to pass ATS filters.",
    category: "ATS",
  },
  {
    id: "faq-ai",
    question: "How does the AI analyze my resume?",
    answer:
      "ZUME's AI compares your resume against job descriptions, checks keyword matches, formatting, and content quality, and returns actionable recommendations and a compatibility score.",
    category: "AI",
  },
  {
    id: "faq-templates",
    question: "Can I use my own resume template?",
    answer:
      "Yes — upload your existing resume and ZUME will analyze it. You can also choose from 20+ ATS-friendly templates and customize them in the builder.",
    category: "Templates",
  },
  {
    id: "faq-free",
    question: "What's included in the free plan?",
    answer:
      "The free plan includes 3 resume analyses per month, access to basic templates, and limited AI suggestions so you can try ZUME risk-free.",
    category: "Billing",
  },
  {
    id: "faq-diff",
    question: "How is ZUME different from other resume builders?",
    answer:
      "ZUME focuses on ATS optimization and AI personalization — analyzing resumes against actual job requirements and providing real-time scoring for higher interview rates.",
    category: "Product",
  },
  {
    id: "faq-cancel",
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes. Cancel anytime from your account settings — you keep access to paid features until the end of the billing period and can export your resumes anytime.",
    category: "Billing",
  },
];
