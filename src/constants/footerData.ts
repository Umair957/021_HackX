import { LucideIcon, Twitter, Linkedin, Github, Instagram } from "lucide-react";

export interface FooterLink {
  label: string;
  href: string;
  badge?: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  icon: LucideIcon;
  href: string;
  label: string;
}

export const footerColumns: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#home" },
      { label: "Careers", href: "#", badge: "Hiring" },
      { label: "Contact", href: "#faq" },
    ]
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ]
  },
];

export const socialLinks: SocialLink[] = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export const footerAnimations = {
  ctaCard: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
  },
};

export const brandInfo = {
  name: "ZUME",
  description: "Build ATS-optimized resumes with AI. Get instant feedback, match job requirements, and land more interviews.",
  copyright: "© 2024 ZUME.",
};
