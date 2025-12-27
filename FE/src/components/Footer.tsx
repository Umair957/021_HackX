"use client";

import React, { memo, useCallback, useState } from "react";
import { Send, Heart } from "lucide-react";
import Image from "next/image";
import { 
  footerColumns, 
  socialLinks, 
  brandInfo,
  type FooterColumn,
  type SocialLink
} from "@/constants/footerData";

// Brand Section with Logo and Description
const BrandSection = memo(() => (
  <div className="flex items-center gap-2 mb-6">
    <Image 
      src="/logo/zume.png" 
      alt="ZUME" 
      width={32} 
      height={32}
      className="hover:scale-110 transition-transform duration-300"
    />
    <span className="text-xl font-bold text-[var(--foreground)]">{brandInfo.name}</span>
  </div>
));
BrandSection.displayName = "BrandSection";

// Newsletter Form Component
const NewsletterForm = memo(() => {
  const [email, setEmail] = useState("");

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  }, [email]);

  return (
    <form onSubmit={handleSubmit} className="relative max-w-sm">
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email" 
        className="w-full bg-[var(--slate-50)] dark:bg-[var(--slate-800)] border border-[var(--slate-200)] dark:border-[var(--slate-700)] rounded-full py-3 px-5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--emerald-500)]/20 focus:border-[var(--emerald-500)] dark:focus:border-[var(--emerald-400)] transition-all dark:text-white dark:placeholder:text-[var(--slate-500)]"
        aria-label="Email address for newsletter"
        required
      />
      <button 
        type="submit"
        className="absolute right-2 top-1.5 bg-[var(--emerald-600)] dark:bg-[var(--emerald-500)] text-white p-1.5 rounded-full hover:bg-[var(--emerald-700)] dark:hover:bg-[var(--emerald-600)] transition-colors shadow-lg shadow-[var(--emerald-200)] dark:shadow-[var(--emerald-900)]/50"
        aria-label="Subscribe to newsletter"
      >
        <Send className="w-4 h-4 ml-0.5" />
      </button>
    </form>
  );
});
NewsletterForm.displayName = "NewsletterForm";

// Brand and Newsletter Column
const BrandColumn = memo(() => (
  <div className="col-span-2 lg:col-span-2">
    <BrandSection />
    <p className="text-[var(--muted-foreground)] text-sm mb-8 max-w-sm leading-relaxed">
      {brandInfo.description}
    </p>
    <NewsletterForm />
  </div>
));
BrandColumn.displayName = "BrandColumn";

// Footer Link Item
const FooterLinkItem = memo<{ label: string; href: string; badge?: string }>(
  ({ label, href, badge }) => (
    <li>
      <a 
        href={href} 
        className="text-[var(--slate-500)] dark:text-[var(--slate-400)] text-sm hover:text-[var(--emerald-600)] dark:hover:text-[var(--emerald-400)] transition-colors flex items-center gap-2 group"
        aria-label={label}
      >
        <span className="relative">
          {label}
          <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--emerald-600)] dark:bg-[var(--emerald-400)] transition-all duration-300 group-hover:w-full" />
        </span>
        {badge && (
          <span className="text-[10px] bg-[var(--emerald-100)] dark:bg-[var(--emerald-900)]/30 text-[var(--emerald-600)] dark:text-[var(--emerald-400)] px-1.5 py-0.5 rounded font-bold uppercase">
            {badge}
          </span>
        )}
      </a>
    </li>
  )
);
FooterLinkItem.displayName = "FooterLinkItem";

// Footer Column Component
const FooterColumnComponent = memo<{ column: FooterColumn }>(({ column }) => (
  <div className="col-span-1">
    <h4 className="font-bold text-[var(--foreground)] mb-6">{column.title}</h4>
    <ul className="space-y-4">
      {column.links.map((link, idx) => (
        <FooterLinkItem key={idx} {...link} />
      ))}
    </ul>
  </div>
));
FooterColumnComponent.displayName = "FooterColumnComponent";

// Social Media Links
const SocialLinks = memo(() => (
  <div className="flex gap-4" role="list" aria-label="Social media links">
    {socialLinks.map((social: SocialLink, idx) => {
      const IconComponent = social.icon;
      return (
        <a 
          key={idx} 
          href={social.href}
          className="w-10 h-10 rounded-full bg-[var(--slate-50)] dark:bg-[var(--slate-800)] flex items-center justify-center text-[var(--slate-500)] dark:text-[var(--slate-400)] hover:bg-[var(--emerald-50)] dark:hover:bg-[var(--emerald-900)]/30 hover:text-[var(--emerald-600)] dark:hover:text-[var(--emerald-400)] hover:scale-110 transition-all duration-300"
          aria-label={social.label}
          role="listitem"
        >
          <IconComponent className="w-5 h-5" />
        </a>
      );
    })}
  </div>
));
SocialLinks.displayName = "SocialLinks";

// Bottom Bar Component
const BottomBar = memo(() => (
  <div className="pt-8 border-t border-[var(--slate-100)] dark:border-[var(--slate-800)] flex flex-col md:flex-row justify-between items-center gap-4">
    <p className="text-[var(--slate-400)] dark:text-[var(--slate-500)] text-sm flex items-center gap-1">
      {brandInfo.copyright} Made with <Heart className="w-3 h-3 text-[var(--red-500)] fill-[var(--red-500)]" aria-label="love" /> in Next.js
    </p>
    <SocialLinks />
  </div>
));
BottomBar.displayName = "BottomBar";

export default function Footer() {
  return (
    <footer className="bg-[var(--background)] pt-20 pb-10 px-4 md:px-8 font-sans border-t border-[var(--slate-100)] dark:border-[var(--slate-800)]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          <BrandColumn />
          {footerColumns.map((column, idx) => (
            <FooterColumnComponent key={idx} column={column} />
          ))}
        </div>

        <BottomBar />
      </div>
    </footer>
  );
}