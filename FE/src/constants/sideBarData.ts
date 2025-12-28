import { LayoutDashboard, FileText, Settings, Briefcase, FileSearch, Mail } from "lucide-react";

// Candidate sidebar items
export const candidateSidebarItems = [
  { 
    label: "Dashboard", 
    href: "/zume/dashboard", 
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

// Recruiter sidebar items
export const recruiterSidebarItems = [
  { 
    label: "Dashboard", 
    href: "/zume/dashboard", 
    icon: LayoutDashboard 
  },
  { 
    label: "Jobs", 
    href: "/zume/jobs", 
    icon: Briefcase 
  },
  { 
    label: "Analyze Resume", 
    href: "/zume/resume/analyze", 
    icon: FileSearch 
  },
  { 
    label: "Gmail Scanner", 
    href: "/zume/settings/gmail", 
    icon: Mail 
  },
  { 
    label: "Settings", 
    href: "/zume/settings", 
    icon: Settings 
  }
];

// Legacy export for backward compatibility
export const sidebarItems = candidateSidebarItems;