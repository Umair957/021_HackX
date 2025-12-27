import { Check, AlertTriangle, X, Info } from "lucide-react";

export type ToastType = "success" | "warning" | "error" | "info";

export const toastConfig = {
  success: {
    icon: Check,
    iconBg: "bg-emerald-500", 
    iconColor: "text-white",
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-amber-400",
    iconColor: "text-amber-950",
  },
  error: {
    icon: X,
    iconBg: "bg-rose-500",
    iconColor: "text-white",
  },
  info: {
    icon: Info,
    iconBg: "bg-blue-500",
    iconColor: "text-white",
  }
};