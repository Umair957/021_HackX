"use client";

import React from "react";
import {AnalysisResults} from "./AnalysisResults";
import {OnlinePresence} from "./OnlinePresence";
import {ImprovementSuggestions} from "./ImprovementSuggestions";
import { FileText, ArrowLeft } from "lucide-react";

interface IndividualViewData {
  fileName: string;
  score: number;
  atsScore: number;
  keywordMatch: number;
  strengths: string[];
  weaknesses: string[];
  readabilityScore: number;
  suggestions: {
    category: string;
    issue: string;
    fix: string;
    priority: "high" | "medium" | "low";
  }[];
  professionalLinks: string[];
  onlineInfo?: string;
}

interface IndividualViewProps {
  data: IndividualViewData;
  onBack?: () => void;
}

export default function IndividualView({ data, onBack }: IndividualViewProps) {
  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" />
          </button>
        )}
        <div className="flex items-center gap-3 flex-1">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {data.fileName}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Detailed Resume Analysis
            </p>
          </div>
        </div>
      </div>

      {/* Full Analysis Results */}
      <div className="space-y-6">
        <AnalysisResults data={data} />
        <OnlinePresence 
          professionalLinks={data.professionalLinks}
          onlineInfo={data.onlineInfo}
        />
        <ImprovementSuggestions suggestions={data.suggestions} />
      </div>
    </div>
  );
}
