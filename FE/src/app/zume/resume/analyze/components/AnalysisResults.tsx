"use client";

import React from "react";
import { TrendingUp, TrendingDown, Award, Target, Eye, Hash } from "lucide-react";

interface AnalysisResultsProps {
  data: {
    score: number;
    atsScore: number;
    readabilityScore: number;
    keywordMatch: number;
    strengths: string[];
    weaknesses: string[];
  };
}

export function AnalysisResults({ data }: AnalysisResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100 dark:bg-green-900/20";
    if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900/20";
    return "bg-red-100 dark:bg-red-900/20";
  };

  const getScoreBorderColor = (score: number) => {
    if (score >= 80) return "border-green-200 dark:border-green-800";
    if (score >= 60) return "border-yellow-200 dark:border-yellow-800";
    return "border-red-200 dark:border-red-800";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Overall Score Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-2">Overall Resume Score</p>
              <h2 className="text-6xl font-bold">{data.score}%</h2>
            </div>
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Award className="w-8 h-8" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
              {getScoreLabel(data.score)}
            </div>
            <p className="text-purple-100 text-sm">
              Your resume is performing {data.score >= 80 ? "very well" : data.score >= 60 ? "well" : "below average"}
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative mt-6 h-3 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${data.score}%` }}
          ></div>
        </div>
      </div>

      {/* Detailed Scores Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <ScoreCard
          icon={<Target className="w-6 h-6" />}
          label="ATS Compatibility"
          score={data.atsScore}
          description="How well your resume passes applicant tracking systems"
        />
        <ScoreCard
          icon={<Eye className="w-6 h-6" />}
          label="Readability"
          score={data.readabilityScore}
          description="How easy your resume is to read and scan"
        />
        <ScoreCard
          icon={<Hash className="w-6 h-6" />}
          label="Keyword Match"
          score={data.keywordMatch}
          description="Presence of relevant industry keywords"
        />
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Strengths */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Strengths</h3>
          </div>
          
          <div className="space-y-3">
            {data.strengths.map((strength, index) => (
              <div 
                key={index} 
                className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/20 animate-in slide-in-from-left-2 duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-6 h-6 flex items-center justify-center bg-green-500 text-white rounded-full text-xs font-bold flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">{strength}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Areas to Improve</h3>
          </div>
          
          <div className="space-y-3">
            {data.weaknesses.map((weakness, index) => (
              <div 
                key={index} 
                className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20 animate-in slide-in-from-right-2 duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full text-xs font-bold flex-shrink-0 mt-0.5">
                  ⚠
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">{weakness}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ 
  icon, 
  label, 
  score, 
  description 
}: { 
  icon: React.ReactNode; 
  label: string; 
  score: number; 
  description: string;
}) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100 dark:bg-green-900/20";
    if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900/20";
    return "bg-red-100 dark:bg-red-900/20";
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between">
        <div className={`p-3 ${getScoreBgColor(score)} rounded-xl`}>
          <div className={getScoreColor(score)}>
            {icon}
          </div>
        </div>
        <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
          {score}%
        </div>
      </div>
      
      <div>
        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{label}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      
      {/* Progress Bar */}
      <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getBarColor(score)} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
}
