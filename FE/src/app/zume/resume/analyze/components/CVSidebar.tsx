"use client";

import React from "react";
import { 
  FileText, 
  CheckSquare, 
  Square, 
  ChevronRight,
  Award,
  AlertCircle 
} from "lucide-react";

interface BulkAnalysisResult {
  fileName: string;
  status: "success" | "error";
  data?: {
    score: number;
    atsScore: number;
    keywordMatch: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: {
      category: string;
      issue: string;
      fix: string;
      priority: "high" | "medium" | "low";
    }[];
    professionalLinks: string[];
    onlineInfo?: string;
  };
  error?: string;
}

interface CVSidebarProps {
  results: BulkAnalysisResult[];
  selectedForComparison: Set<number>;
  currentIndividualView: number | null;
  viewMode: "summary" | "compare" | "individual";
  onToggleComparison: (index: number) => void;
  onSelectIndividual: (index: number) => void;
}

export default function CVSidebar({
  results,
  selectedForComparison,
  currentIndividualView,
  viewMode,
  onToggleComparison,
  onSelectIndividual,
}: CVSidebarProps) {
  const successfulResults = results.filter((r) => r.status === "success");

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
    if (score >= 60) return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
    return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
  };

  return (
    <div className="w-80 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          Analyzed Resumes
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {successfulResults.length} of {results.length} successful
        </p>
        {viewMode === "compare" && (
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
            ✓ Select resumes to compare
          </p>
        )}
      </div>

      {/* CV List */}
      <div className="p-2 space-y-2">
        {results.map((result, index) => {
          const isSelected = viewMode === "compare" 
            ? selectedForComparison.has(index)
            : currentIndividualView === index;
          const isSuccess = result.status === "success";

          return (
            <div
              key={index}
              className={`group relative rounded-lg border transition-all ${
                isSuccess
                  ? isSelected
                    ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-slate-800/50"
                  : "border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-900/10"
              }`}
            >
              {/* Error State */}
              {!isSuccess && (
                <div className="p-3 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {result.fileName}
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1 line-clamp-2">
                      {result.error || "Analysis failed"}
                    </p>
                  </div>
                </div>
              )}

              {/* Success State */}
              {isSuccess && result.data && (
                <>
                  {/* Comparison Mode: Checkbox */}
                  {viewMode === "compare" && (
                    <button
                      onClick={() => onToggleComparison(index)}
                      className="absolute top-3 left-3 z-10 p-1 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors"
                    >
                      {selectedForComparison.has(index) ? (
                        <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400 dark:text-slate-600" />
                      )}
                    </button>
                  )}

                  {/* CV Info */}
                  <button
                    onClick={() => viewMode === "individual" && onSelectIndividual(index)}
                    className={`w-full p-3 text-left ${
                      viewMode === "compare" ? "pl-11" : ""
                    } ${viewMode === "individual" ? "hover:bg-slate-50 dark:hover:bg-slate-800" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <FileText className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        isSelected 
                          ? "text-blue-600 dark:text-blue-400" 
                          : "text-slate-400 dark:text-slate-600"
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium text-slate-900 dark:text-white truncate mb-2"
                          title={result.fileName}
                        >
                          {result.fileName}
                        </p>

                        {/* Score Badge */}
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getScoreBg(result.data.score)}`}>
                          <Award className={`w-4 h-4 ${getScoreColor(result.data.score)}`} />
                          <span className={`text-sm font-bold ${getScoreColor(result.data.score)}`}>
                            {result.data.score}%
                          </span>
                        </div>

                        {/* Quick Metrics */}
                        <div className="flex gap-2 mt-2">
                          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded text-xs font-medium">
                            ATS {result.data.atsScore}
                          </span>
                          <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded text-xs font-medium">
                            KW {result.data.keywordMatch}
                          </span>
                        </div>
                      </div>

                      {/* Individual View Indicator */}
                      {viewMode === "individual" && (
                        <ChevronRight className={`w-5 h-5 flex-shrink-0 transition-transform ${
                          isSelected 
                            ? "text-blue-600 dark:text-blue-400 translate-x-1" 
                            : "text-slate-400 dark:text-slate-600 opacity-0 group-hover:opacity-100"
                        }`} />
                      )}
                    </div>
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 sticky bottom-0 bg-white dark:bg-slate-900">
        {viewMode === "compare" && (
          <div className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {selectedForComparison.size}
              </span>{" "}
              selected for comparison
            </p>
          </div>
        )}
        {viewMode === "individual" && currentIndividualView !== null && (
          <div className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Viewing resume{" "}
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {currentIndividualView + 1}
              </span>{" "}
              of {results.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
