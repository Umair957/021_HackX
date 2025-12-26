import { type LucideIcon } from "lucide-react";

export type Mode = "builder" | "analyzer";

export interface Feature {
  title: string;
  desc: string;
}

export interface Step {
  id: number;
  title: string;
  description: string;
  contentTitle: string;
  contentDesc: string;
  features: Feature[];
  icon: React.ReactNode;
}

export interface StepData {
  id: number;
  title: string;
  description: string;
  contentTitle: string;
  contentDesc: string;
  features: Feature[];
  iconType: LucideIcon;
}