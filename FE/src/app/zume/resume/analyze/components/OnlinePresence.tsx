"use client";

import React from "react";
import { Globe, Github, Linkedin, ExternalLink, Sparkles, TrendingUp } from "lucide-react";

interface OnlinePresenceProps {
  professionalLinks?: string[];
  onlineInfo?: string;
}

export function OnlinePresence({ professionalLinks, onlineInfo }: OnlinePresenceProps) {
  // Don't render if no data
  if ((!professionalLinks || professionalLinks.length === 0) && !onlineInfo) {
    return null;
  }

  const getLinkIcon = (url: string) => {
    if (url.includes('github.com')) return <Github className="w-4 h-4" />;
    if (url.includes('linkedin.com')) return <Linkedin className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  const getLinkColor = (url: string) => {
    if (url.includes('github.com')) return 'border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500';
    if (url.includes('linkedin.com')) return 'border-blue-200 dark:border-blue-900/50 hover:border-blue-400 dark:hover:border-blue-700';
    return 'border-purple-200 dark:border-purple-900/50 hover:border-purple-400 dark:hover:border-purple-700';
  };

  const getLinkBgColor = (url: string) => {
    if (url.includes('github.com')) return 'bg-slate-50 dark:bg-slate-900/50';
    if (url.includes('linkedin.com')) return 'bg-blue-50 dark:bg-blue-950/30';
    return 'bg-purple-50 dark:bg-purple-950/30';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Online Presence Analysis</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Information discovered from your professional profiles
          </p>
        </div>
      </div>

      {/* Professional Links Found */}
      {professionalLinks && professionalLinks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Professional Links Found ({professionalLinks.length})
            </h4>
          </div>
          
          <div className="grid gap-2">
            {professionalLinks.map((link, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-3 p-3 ${getLinkBgColor(link)} border ${getLinkColor(link)} rounded-xl transition-all duration-200 hover:shadow-md`}
              >
                <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                  {getLinkIcon(link)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                    {link.replace('https://', '').replace('http://', '')}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Online Information Summary */}
      {onlineInfo && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Findings from Your Online Profiles
            </h4>
          </div>
          
          <div className="relative overflow-hidden bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 rounded-xl p-6 border border-cyan-200 dark:border-cyan-900/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="relative space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-cyan-500 rounded-lg flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {onlineInfo}
                  </p>
                </div>
              </div>
              
              <div className="pt-3 border-t border-cyan-200 dark:border-cyan-900/50">
                <p className="text-xs text-cyan-700 dark:text-cyan-400 font-medium">
                  💡 Tip: Our AI compared your resume with this online information to provide better recommendations
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-xl">
        <div className="p-1.5 bg-blue-500 rounded-lg flex-shrink-0 mt-0.5">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex-1 text-sm text-blue-900 dark:text-blue-300">
          <p className="font-medium mb-1">Google Search Integration Active</p>
          <p className="text-blue-700 dark:text-blue-400">
            We analyzed your professional links to provide more comprehensive feedback. Check the improvement suggestions for items you can add from your online profiles.
          </p>
        </div>
      </div>
    </div>
  );
}
