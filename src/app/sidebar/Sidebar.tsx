"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, ChevronRight, PanelLeft } from "lucide-react";
// Imports from your project
import { sidebarItems } from "@/constants/sideBarData";
import { logoutHandler } from "@/handler/authHandler";

interface SidebarProps {
  role?: string; 
  onClose?: () => void; 
}

export function Sidebar({ role, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false); // 1. State for collapse

  const handleLogout = async () => {
    await logoutHandler();
    window.location.href = "/auth/login";
  };

  return (
    <div 
      // 2. Dynamic Width Transition
      className={`h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      
      {/* 1. Header Section (Logo + Toggle) */}
      <div className={`p-6 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
        
        {/* Logo Text - Only show when expanded */}
        {!isCollapsed && (
          <div className="overflow-hidden whitespace-nowrap">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ZUME
            </h1>
            {role && (
                <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">
                    {role} Portal
                </p>
            )}
          </div>
        )}

        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
           {isCollapsed ? <ChevronRight size={20} /> : <PanelLeft size={20} />}
        </button>
      </div>

      {/* 2. Navigation Links */}
      <nav className="flex-1 px-3 space-y-2 overflow-y-auto overflow-x-hidden">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              title={isCollapsed ? item.label : ""} // Tooltip when collapsed
              className={`
                flex items-center rounded-xl font-medium transition-all duration-200
                ${isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"} 
                ${isActive
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" 
                  : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                }
              `}
            >
              <item.icon 
                className={`w-5 h-5 flex-shrink-0 ${isActive ? "stroke-blue-600 dark:stroke-blue-400" : "stroke-slate-500"}`} 
              />
              
              {/* Hide Label when collapsed */}
              {!isCollapsed && (
                <span className="whitespace-nowrap overflow-hidden transition-all duration-300">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* 3. Logout Button */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800">
        <button 
          onClick={handleLogout} 
          title={isCollapsed ? "Sign Out" : ""}
          className={`
            flex items-center w-full rounded-xl transition-colors text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10
            ${isCollapsed ? "justify-center p-3" : "gap-3 p-3"}
          `}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium whitespace-nowrap">Sign Out</span>}
        </button>
      </div>
    </div>
  );
}