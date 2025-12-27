export type BillingCycle = "monthly" | "yearly";

export interface PricingPlan {
  id: string;
  name: string;
  desc: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  notIncluded: string[];
  popular: boolean;
  cta: string;
}

export const plans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    desc: "Perfect for individuals and side projects.",
    price: { monthly: 0, yearly: 0 },
    features: [
      "1 User Account",
      "5 Resume Parses / mo",
      "Basic Job Matching",
      "Community Support",
    ],
    notIncluded: ["Advanced Analytics", "Custom API Access"],
    popular: false,
    cta: "Get Started Free",
  },
  {
    id: "pro",
    name: "Professional",
    desc: "For serious recruiters and growing teams.",
    price: { monthly: 49, yearly: 39 },
    features: [
      "Up to 5 Team Members",
      "500 Resume Parses / mo",
      "AI-Powered Matching",
      "Priority Email Support",
      "Export to PDF/Excel",
    ],
    notIncluded: ["Custom API Access"],
    popular: true,
    cta: "Start Free Trial",
  },
  {
    id: "enterprise",
    name: "Organization",
    desc: "Custom solutions for large scale operations.",
    price: { monthly: 99, yearly: 89 },
    features: [
      "Unlimited Team Members",
      "Unlimited Parsing",
      "Custom Metrics Config",
      "Dedicated Success Manager",
      "API & Webhooks Access",
      "SSO Authentication",
    ],
    notIncluded: [],
    popular: false,
    cta: "Contact Sales",
  },
] as const;

export const pricingAnimations = {
  badge: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true }
  },
  heading: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { delay: 0.1 }
  },
  description: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { delay: 0.2 }
  },
  toggle: {
    initial: { opacity: 0, scale: 0.9 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true },
    transition: { delay: 0.3 }
  },
  saveBadge: {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 }
  }
} as const;

export const billingCycles: BillingCycle[] = ["monthly", "yearly"] as const;
