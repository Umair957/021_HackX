"use client";

import React, { useState } from "react";
import { AlertCircle, CheckCircle, Info, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

interface Suggestion {
  category: string;
  issue: string;
  fix: string;
  priority: "high" | "medium" | "low";
}

interface ImprovementSuggestionsProps {
  suggestions: Suggestion[];
}

export function ImprovementSuggestions({ suggestions }: ImprovementSuggestionsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "high":
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          bgColor: "bg-red-50 dark:bg-red-900/10",
          borderColor: "border-red-200 dark:border-red-800",
          textColor: "text-red-600 dark:text-red-400",
          badgeBg: "bg-red-100 dark:bg-red-900/30",
          label: "High Priority",
        };
      case "medium":
        return {
          icon: <Info className="w-5 h-5" />,
          bgColor: "bg-yellow-50 dark:bg-yellow-900/10",
          borderColor: "border-yellow-200 dark:border-yellow-800",
          textColor: "text-yellow-600 dark:text-yellow-400",
          badgeBg: "bg-yellow-100 dark:bg-yellow-900/30",
          label: "Medium Priority",
        };
      case "low":
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          bgColor: "bg-blue-50 dark:bg-blue-900/10",
          borderColor: "border-blue-200 dark:border-blue-800",
          textColor: "text-blue-600 dark:text-blue-400",
          badgeBg: "bg-blue-100 dark:bg-blue-900/30",
          label: "Low Priority",
        };
      default:
        return {
          icon: <Info className="w-5 h-5" />,
          bgColor: "bg-slate-50 dark:bg-slate-900/10",
          borderColor: "border-slate-200 dark:border-slate-800",
          textColor: "text-slate-600 dark:text-slate-400",
          badgeBg: "bg-slate-100 dark:bg-slate-900/30",
          label: "Normal",
        };
    }
  };

  const filteredSuggestions = filter === "all" 
    ? suggestions 
    : suggestions.filter(s => s.priority === filter);

  const priorityCount = {
    high: suggestions.filter(s => s.priority === "high").length,
    medium: suggestions.filter(s => s.priority === "medium").length,
    low: suggestions.filter(s => s.priority === "low").length,
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              AI-Powered Suggestions
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {filteredSuggestions.length} {filter !== "all" && `${filter} priority`} improvement{filteredSuggestions.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3">
        <FilterButton
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label="All Suggestions"
          count={suggestions.length}
        />
        <FilterButton
          active={filter === "high"}
          onClick={() => setFilter("high")}
          label="High Priority"
          count={priorityCount.high}
          color="red"
        />
        <FilterButton
          active={filter === "medium"}
          onClick={() => setFilter("medium")}
          label="Medium Priority"
          count={priorityCount.medium}
          color="yellow"
        />
        <FilterButton
          active={filter === "low"}
          onClick={() => setFilter("low")}
          label="Low Priority"
          count={priorityCount.low}
          color="blue"
        />
      </div>

      {/* Suggestions List */}
      <div className="space-y-4">
        {filteredSuggestions.map((suggestion, index) => {
          const config = getPriorityConfig(suggestion.priority);
          const isExpanded = expandedIndex === index;

          return (
            <div
              key={index}
              className={`
                border rounded-xl overflow-hidden transition-all duration-300
                ${config.borderColor} ${isExpanded ? config.bgColor : "bg-white dark:bg-slate-900"}
                hover:shadow-md animate-in slide-in-from-left-2 duration-300
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Header */}
              <button
                onClick={() => toggleExpand(index)}
                className="w-full p-5 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1 text-left">
                  <div className={`p-2 ${config.badgeBg} rounded-lg flex-shrink-0 ${config.textColor}`}>
                    {config.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2.5 py-1 ${config.badgeBg} ${config.textColor} text-xs font-semibold rounded-full`}>
                        {config.label}
                      </span>
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-full">
                        {suggestion.category}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-white mb-1">
                      {suggestion.issue}
                    </p>
                    {!isExpanded && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                        {suggestion.fix}
                      </p>
                    )}
                  </div>
                </div>

                <div className={`ml-4 flex-shrink-0 ${config.textColor}`}>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className={`px-5 pb-5 pt-2 border-t ${config.borderColor} animate-in slide-in-from-top-2 duration-300`}>
                  <div className="pl-14">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      💡 Recommended Fix:
                    </h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {suggestion.fix}
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <button className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                        Learn more about this suggestion →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredSuggestions.length === 0 && (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-slate-400" />
          </div>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
            No {filter !== "all" && `${filter} priority`} suggestions
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {filter === "all" 
              ? "Your resume looks great!" 
              : `Try viewing suggestions with different priority levels.`}
          </p>
        </div>
      )}
    </div>
  );
}

function FilterButton({ 
  active, 
  onClick, 
  label, 
  count, 
  color 
}: { 
  active: boolean; 
  onClick: () => void; 
  label: string; 
  count: number; 
  color?: "red" | "yellow" | "blue";
}) {
  const getColors = () => {
    if (!color) {
      return active
        ? "bg-purple-600 text-white border-purple-600"
        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700";
    }

    const colorMap = {
      red: active
        ? "bg-red-600 text-white border-red-600"
        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-red-300 dark:hover:border-red-700",
      yellow: active
        ? "bg-yellow-600 text-white border-yellow-600"
        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-yellow-300 dark:hover:border-yellow-700",
      blue: active
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700",
    };

    return colorMap[color];
  };

  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200
        ${getColors()}
        ${active ? "shadow-md" : "hover:shadow-sm"}
      `}
    >
      {label}
      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
        active 
          ? "bg-white/20" 
          : "bg-slate-100 dark:bg-slate-800"
      }`}>
        {count}
      </span>
    </button>
  );
}
