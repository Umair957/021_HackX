import { Transition } from "framer-motion/dom";

export interface NavItem {
  name: string;
  href: string;
}

export const navItems: NavItem[] = [
  { name: "Home", href: "#home" },
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Pricing", href: "#pricing" },
];

export interface navItemType {
  item: typeof navItems[number];
  isActive: boolean;
  onClick: (name: string) => void;
  springTransition: Transition;
}

export const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 50,
};
