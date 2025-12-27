import { LucideIcon } from "lucide-react";

export interface DashboardStat {
  label: string;
  value: string;
  suffix: string;
  trend: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export interface ResumeItem {
  id: number;
  name: string;
  date: string;
  score: number;
  status: "Optimized" | "Needs Review" | "Draft";
}

export interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}

export interface StatCardProps {
  data: DashboardStat;
  index: number;
}