import { LayoutDashboard, FileText, Settings } from "lucide-react";

export const sidebarItems = [
  { 
    label: "Dashboard", 
    href: "/zume/dashboard", // Must match folder path
    icon: LayoutDashboard 
  },
  { 
    label: "Resume", 
    href: "/zume/resume", 
    icon: FileText 
  },
  { 
    label: "Settings", 
    href: "/zume/settings", 
    icon: Settings 
  }
];