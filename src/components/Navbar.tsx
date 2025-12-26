"use client";

import React, { useState, memo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Menu, X, LogIn, UserPlus, LayoutDashboard, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { navItems, navItemType, springTransition } from "@/constants/navbarData";
import ThemeToggle from "./ThemeToggle";

// -----------------------------------------------------
// CONFIGURATION & UTILS
// -----------------------------------------------------

const SCROLL_OFFSET = 80;

const scrollToTarget = (href: string) => {
  if (!href.startsWith("#")) return;
  const element = document.querySelector(href);
  if (element) {
    const offsetTop = (element as HTMLElement).offsetTop;
    window.scrollTo({ top: offsetTop - SCROLL_OFFSET, behavior: "smooth" });
  }
};

// -----------------------------------------------------
// DESKTOP COMPONENTS
// -----------------------------------------------------

const DesktopItem = memo(({ item, isActive, onClick, springTransition }: navItemType) => {
  return (
    <motion.button
      layout
      onClick={() => {
        onClick(item.name);
        scrollToTarget(item.href);
      }}
      className={cn(
        "relative flex items-center justify-center rounded-full transition-colors duration-300",
        isActive ? "px-6 h-11" : "px-4 h-10 hover:bg-white/10"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="active-pill"
          className="absolute inset-0 bg-[var(--card)] backdrop-blur-md border border-[var(--slate-200)] dark:border-[var(--slate-700)] shadow-lg rounded-full"
          transition={springTransition}
        />
      )}
      <span
        className={cn(
          "relative z-10 text-sm font-medium transition-colors duration-200",
          isActive 
            ? "text-[var(--foreground)] font-bold" 
            : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        )}
      >
        {item.name}
      </span>
    </motion.button>
  );
});

DesktopItem.displayName = "DesktopItem";

// -----------------------------------------------------
// MOBILE COMPONENTS
// -----------------------------------------------------

const MobileMenuItem = memo(({ item, isActive, onClick }: navItemType) => (
  <motion.button
    layout
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    onClick={() => {
      onClick(item.name);
      scrollToTarget(item.href);
    }}
    className={cn(
      "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden",
      isActive
        ? "text-white shadow-md"
        : "text-[var(--muted-foreground)] hover:bg-black/5 dark:hover:bg-white/5"
    )}
  >
    {isActive && (
      <motion.div
        layoutId="mobile-active"
        className="absolute inset-0 bg-gradient-to-r from-[var(--emerald-600)] to-[var(--teal-600)] z-0"
      />
    )}
    <span className="relative z-10">{item.name}</span>
  </motion.button>
));
MobileMenuItem.displayName = "MobileMenuItem";

// -----------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------

interface NavbarProps {
  isLoggedIn: boolean; // Prop passed from Server
}

export default function Navbar({ isLoggedIn }: NavbarProps) {
  const [active, setActive] = useState("Home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Toggle scroll lock
  React.useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [mobileMenuOpen]);

  return (
    <div className="fixed top-6 left-0 right-0 z-50 px-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        
        {/* LOGO */}
        <Link href="#home" className="group relative z-50">
           <div className="relative flex items-center justify-center w-12 h-12 bg-[var(--card)]/50 backdrop-blur-xl border border-[var(--slate-200)] dark:border-[var(--slate-700)] rounded-full shadow-sm transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/logo/zume.png"
              alt="ZUME"
              width={32}
              height={32}
              className="object-contain"
            />
           </div>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center">
            <motion.nav
              layout
              className="flex items-center gap-1 px-2 h-14 bg-[var(--card)]/50 backdrop-blur-xl border border-[var(--slate-200)] dark:border-[var(--slate-700)] rounded-full shadow-lg"
            >
              <LayoutGroup>
                {navItems.map((item) => (
                  <DesktopItem 
                    key={item.name} 
                    item={item} 
                    isActive={active === item.name} 
                    onClick={setActive}
                    springTransition={springTransition}
                  />
                ))}
              </LayoutGroup>
            </motion.nav>
        </div>

        {/* RIGHT ACTIONS (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <div className="pointer-events-auto">
             <ThemeToggle />
          </div>

          {/* CHECK PROP DIRECTLY - NO FLICKER */}
          {isLoggedIn ? (
            <Link
              href="/zume/dashboard"
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300 group"
            >
              Go to Dashboard <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-5 py-2.5 text-sm font-medium rounded-full text-[var(--foreground)] bg-[var(--card)]/50 backdrop-blur-md border border-[var(--slate-200)] dark:border-[var(--slate-700)] hover:bg-[var(--card)] transition-all"
              >
                Sign In
              </Link>

              <Link
                href="/auth/signup"
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full text-white bg-gradient-to-r from-[var(--emerald-600)] to-[var(--teal-600)] shadow-lg hover:shadow-emerald-500/25 hover:scale-105 transition-all duration-300"
              >
                <UserPlus size={16} /> Sign Up
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden relative z-50 p-3 rounded-full bg-[var(--card)] backdrop-blur-lg border border-[var(--slate-200)] dark:border-[var(--slate-700)] shadow-lg"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

      </div>

      {/* MOBILE MENU PANEL */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden pointer-events-auto"
            />
            
            <motion.div
              initial={{ y: -20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-20 left-4 right-4 z-50 md:hidden pointer-events-auto"
            >
              <div className="bg-[var(--card)]/90 backdrop-blur-2xl border border-white/20 dark:border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden p-2">
                <div className="p-2 space-y-1">
                  {navItems.map((item) => (
                    <MobileMenuItem
                      key={item.name}
                      item={item}
                      isActive={active === item.name}
                      onClick={() => {
                        setActive(item.name);
                        setMobileMenuOpen(false);
                      }}
                      springTransition={springTransition}
                    />
                  ))}
                </div>

                <div className="mt-2 p-2 border-t border-slate-200 dark:border-slate-800">
                  {isLoggedIn ? (
                    <Link
                      href="/zume/dashboard"
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium w-full shadow-lg"
                    >
                      <LayoutDashboard size={16} /> Go to Dashboard
                    </Link>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                        <Link
                          href="/auth/login"
                          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--secondary)] text-[var(--foreground)] text-sm font-medium"
                        >
                          <LogIn size={16} /> Sign In
                        </Link>
                        <Link
                          href="/auth/signup"
                          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[var(--emerald-600)] to-[var(--teal-600)] text-white text-sm font-medium"
                        >
                          <UserPlus size={16} /> Sign Up
                        </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}