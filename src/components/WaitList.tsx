'use client';

import React, { useState, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { waitlistAnimations } from '@/constants/waitlistData';

// --- SUB-COMPONENTS ---

const TopBadge = memo(() => (
  <motion.div variants={waitlistAnimations.item} className="flex justify-center mb-4 sm:mb-6">
    <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 bg-white dark:bg-[var(--slate-800)] border border-[var(--slate-100)] dark:border-[var(--slate-700)] rounded-full shadow-sm">
      <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--yellow-500)] fill-[var(--yellow-500)]" />
      <span className="text-[10px] sm:text-xs font-semibold text-[var(--slate-600)] dark:text-[var(--slate-300)] uppercase tracking-wide">
        Beyond Artificial
      </span>
    </div>
  </motion.div>
));

TopBadge.displayName = 'TopBadge';

const SectionHeading = memo(() => (
  <>
    <motion.h2 
      variants={waitlistAnimations.item}
      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[var(--foreground)] tracking-tight mb-4 sm:mb-6 leading-[1.1]"
    >
      Early Access to <br className="hidden md:block" />
      Game-Changing AI
    </motion.h2>

    <motion.p 
      variants={waitlistAnimations.item}
      className="text-sm sm:text-base md:text-lg lg:text-xl text-[var(--muted-foreground)] max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4"
    >
      Unlock exclusive early access to our groundbreaking Resume Analyzer. 
      Subscribe now and stay ahead of the job market!
    </motion.p>
  </>
));

SectionHeading.displayName = 'SectionHeading';

interface EmailFormProps {
  email: string;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const EmailForm = memo(({ email, onEmailChange, onSubmit }: EmailFormProps) => (
  <form onSubmit={onSubmit} className="relative group">
    <input 
      type="email" 
      placeholder="Your Email" 
      value={email}
      onChange={(e) => onEmailChange(e.target.value)}
      required
      className="w-full h-12 sm:h-14 pl-4 sm:pl-6 pr-32 sm:pr-36 bg-[var(--slate-100)]/50 dark:bg-[var(--slate-800)]/50 hover:bg-[var(--card)] border border-transparent hover:border-[var(--slate-200)] dark:hover:border-[var(--slate-700)] rounded-full outline-none focus:bg-[var(--card)] focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-[var(--slate-300)] dark:focus:border-[var(--slate-600)] transition-all duration-300 placeholder:text-[var(--slate-400)] dark:placeholder:text-[var(--slate-500)] text-[var(--slate-800)] dark:text-white text-sm sm:text-base"
      aria-label="Enter your email address"
    />
    <button 
      type="submit"
      className="absolute right-1 sm:right-1.5 top-1 sm:top-1.5 bottom-1 sm:bottom-1.5 bg-[var(--emerald-600)] hover:bg-[var(--emerald-700)] text-white px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-1 sm:gap-2 shadow-lg"
      aria-label="Subscribe to waitlist"
    >
      <Send size={12} className="sm:w-[14px] sm:h-[14px]" />
      Subscribe
    </button>
  </form>
));

EmailForm.displayName = 'EmailForm';

const SuccessMessage = memo(() => (
  <motion.div 
    {...waitlistAnimations.successMessage}
    className="w-full h-12 sm:h-14 flex items-center justify-center bg-[var(--green-50)] border border-[var(--green-100)] rounded-full text-[var(--green-700)] gap-1 sm:gap-2 text-sm sm:text-base"
  >
    <CheckCircle2 size={16} className="sm:w-[18px] sm:h-[18px]" />
    <span className="font-semibold">You&apos;re on the list!</span>
  </motion.div>
));

SuccessMessage.displayName = 'SuccessMessage';

// --- MAIN COMPONENT ---

export default function WaitlistSection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // TODO: Add your API call here
      // Example: await fetch('/api/waitlist', { method: 'POST', body: JSON.stringify({ email }) });
    }
  }, [email]);

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
  }, []);

  return (
    <section className="w-full py-16 sm:py-20 md:py-24 bg-white dark:bg-[var(--background)] dark:to-[var(--slate-900)] flex flex-col items-center justify-center overflow-hidden font-sans">
      <motion.div 
        className="max-w-4xl w-full px-4 sm:px-6 text-center"
        variants={waitlistAnimations.container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <TopBadge />
        <SectionHeading />

        <motion.div 
          variants={waitlistAnimations.item} 
          className="max-w-md mx-auto mb-8 sm:mb-10 relative z-10"
        >
          {!isSubmitted ? (
            <EmailForm 
              email={email} 
              onEmailChange={handleEmailChange} 
              onSubmit={handleSubmit} 
            />
          ) : (
            <SuccessMessage />
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
