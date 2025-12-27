"use client";

import React, { useState, memo, useCallback } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  plans, 
  pricingAnimations, 
  billingCycles,
  type BillingCycle,
  type PricingPlan 
} from "@/constants/pricingData";

// --- SUB-COMPONENTS ---

const SectionHeader = memo(() => (
  <div className="text-center mb-20">
    <motion.div
      {...pricingAnimations.badge}
      className="inline-block mb-4"
    >
      <span className="border border-[var(--emerald-200)] dark:border-[var(--emerald-800)] text-[var(--emerald-600)] dark:text-[var(--emerald-400)] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
        Flexible Pricing
      </span>
    </motion.div>

    <motion.h2
      {...pricingAnimations.heading}
      className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4 tracking-tight leading-tight"
    >
      Choose the Plan That{" "}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--emerald-600)] to-[var(--teal-600)]">
        Fits You
      </span>
    </motion.h2>

    <motion.p
      {...pricingAnimations.description}
      className="text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto mb-10"
    >
      Simple, transparent pricing. No hidden fees. Switch or cancel anytime.
    </motion.p>
  </div>
));

SectionHeader.displayName = "SectionHeader";

interface BillingToggleProps {
  billingCycle: BillingCycle;
  onCycleChange: (cycle: BillingCycle) => void;
}

const BillingToggle = memo(({ billingCycle, onCycleChange }: BillingToggleProps) => (
  <motion.div
    {...pricingAnimations.toggle}
    className="flex justify-center items-center gap-4"
  >
    <div className="relative inline-flex bg-[var(--slate-100)] dark:bg-[var(--slate-800)] p-1.5 rounded-full shadow-inner">
      {billingCycles.map((cycle) => {
        const isActive = billingCycle === cycle;
        return (
          <button
            key={cycle}
            onClick={() => onCycleChange(cycle)}
            className={cn(
              "relative px-8 py-2.5 rounded-full text-sm font-bold transition-colors duration-500 z-10 w-32 outline-none",
              isActive ? "text-white" : "text-[var(--slate-500)] dark:text-[var(--slate-400)] hover:text-[var(--slate-900)] dark:hover:text-[var(--slate-200)]"
            )}
            aria-label={`Switch to ${cycle} billing`}
            aria-pressed={isActive}
          >
            {isActive && (
              <motion.div
                layoutId="pricing-pill"
                className="absolute inset-0 bg-gradient-to-r from-[var(--emerald-600)] to-[var(--teal-600)] rounded-full shadow-[0_4px_14px_0_rgba(124,58,237,0.4)]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-20 capitalize">{cycle}</span>
          </button>
        );
      })}
    </div>
    <motion.span 
      {...pricingAnimations.saveBadge}
      className="text-xs font-bold text-[var(--green-600)] bg-[var(--green-100)] px-2 py-1 rounded-full border border-[var(--green-200)]"
    >
      Save 20%
    </motion.span>
  </motion.div>
));

BillingToggle.displayName = "BillingToggle";

interface FeatureListProps {
  features: string[];
  notIncluded: string[];
}

const FeatureList = memo(({ features, notIncluded }: FeatureListProps) => (
  <div className="space-y-4">
    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
      What&apos;s included
    </p>
    <ul className="space-y-3">
      {features.map((feature, i) => (
        <li key={`feature-${i}`} className="flex items-start gap-3 text-sm text-[var(--slate-600)] dark:text-[var(--slate-300)]">
          <div className="mt-0.5 p-0.5 rounded-full bg-[var(--green-100)] dark:bg-[var(--green-900)]/30 text-[var(--green-600)] dark:text-[var(--green-400)] flex-shrink-0">
            <Check className="w-3 h-3" strokeWidth={3} />
          </div>
          <span className="font-medium">{feature}</span>
        </li>
      ))}
      {notIncluded.map((feature, i) => (
        <li key={`not-included-${i}`} className="flex items-start gap-3 text-sm text-[var(--slate-400)] dark:text-[var(--slate-600)] opacity-60">
          <div className="mt-0.5 p-0.5 rounded-full bg-[var(--slate-100)] dark:bg-[var(--slate-800)] text-[var(--slate-400)] dark:text-[var(--slate-600)] flex-shrink-0">
            <X className="w-3 h-3" strokeWidth={3} />
          </div>
          <span className="line-through">{feature}</span>
        </li>
      ))}
    </ul>
  </div>
));

FeatureList.displayName = "FeatureList";

interface PricingCardProps {
  plan: PricingPlan;
  billingCycle: BillingCycle;
  index: number;
}

const PricingCard = memo(({ plan, billingCycle, index }: PricingCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className={cn(
      "relative bg-[var(--card)] rounded-[2rem] p-8 md:p-10 border transition-all duration-300",
      plan.popular
        ? "border-[var(--emerald-200)] dark:border-[var(--emerald-800)] shadow-[0_20px_40px_-15px_rgba(16,185,129,0.2)] dark:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.4)] z-10 lg:-mt-6 lg:mb-6 ring-1 ring-[var(--emerald-100)] dark:ring-[var(--emerald-900)]" 
        : "border-[var(--slate-100)] dark:border-[var(--slate-800)] shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-[var(--emerald-100)] dark:hover:border-[var(--emerald-800)] hover:shadow-lg"
    )}
  >
    {plan.popular && (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="bg-[var(--emerald-600)] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-[var(--emerald-200)] flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Most Popular
        </span>
      </div>
    )}

    {/* Card Header */}
    <div className="mb-8">
      <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">{plan.name}</h3>
      <p className="text-[var(--muted-foreground)] text-sm h-10">{plan.desc}</p>
    </div>

    {/* Price */}
    <div className="mb-8 flex items-end gap-1">
      <span className="text-5xl font-extrabold text-[var(--foreground)] tracking-tight">
        ${billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
      </span>
      <span className="text-gray-400 dark:text-gray-500 font-medium mb-1">/mo</span>
    </div>

    {/* CTA Button */}
    <button
      className={cn(
        "w-full py-4 rounded-xl font-bold text-sm transition-all duration-200 mb-10",
        plan.popular
          ? "bg-[var(--slate-900)] dark:bg-[var(--emerald-600)] text-white hover:bg-[var(--slate-800)] dark:hover:bg-[var(--emerald-700)] shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          : "bg-[var(--emerald-50)] dark:bg-[var(--emerald-900)]/20 text-[var(--emerald-700)] dark:text-[var(--emerald-400)] hover:bg-[var(--emerald-100)] dark:hover:bg-[var(--emerald-900)]/30 border border-[var(--emerald-100)] dark:border-[var(--emerald-800)]"
      )}
      aria-label={`${plan.cta} for ${plan.name} plan`}
    >
      {plan.cta}
    </button>

    <FeatureList features={plan.features} notIncluded={plan.notIncluded} />
  </motion.div>
));

PricingCard.displayName = "PricingCard";

const FooterCTA = memo(() => (
  <div className="mt-20 text-center">
    <p className="text-[var(--muted-foreground)]">
      Need a custom plan for a large enterprise?{' '}
      <a href="#contact" className="text-[var(--emerald-600)] dark:text-[var(--emerald-400)] font-bold hover:underline">
        Chat with us
      </a>
    </p>
  </div>
));

FooterCTA.displayName = "FooterCTA";

// --- MAIN COMPONENT ---

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  const handleCycleChange = useCallback((cycle: BillingCycle) => {
    setBillingCycle(cycle);
  }, []);

  return (
    <section id="pricing" className="bg-[var(--background)] py-24 px-4 md:px-8 font-sans selection:bg-[var(--emerald-100)] dark:selection:bg-[var(--emerald-900)]/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeader />
        <BillingToggle billingCycle={billingCycle} onCycleChange={handleCycleChange} />

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-16">
          {plans.map((plan, idx) => (
            <PricingCard 
              key={plan.id} 
              plan={plan} 
              billingCycle={billingCycle} 
              index={idx} 
            />
          ))}
        </div>

        <FooterCTA />
      </div>
    </section>
  );
}