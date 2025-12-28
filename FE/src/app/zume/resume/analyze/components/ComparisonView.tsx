"use client";

import React from "react";
import { 
  Award, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Target,
  FileText 
} from "lucide-react";

interface ComparisonData {
  fileName: string;
  score: number;
  atsScore: number;
  keywordMatch: number;
  strengths: string[];
  weaknesses: string[];
  topSkills: string[];
}

interface ComparisonViewProps {
  data: ComparisonData[];
}

export default function ComparisonView({ data }: ComparisonViewProps) {
  if (data.length === 0) {
    return (
      <div className="p-12 text-center">
        <FileText className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          Select at least one resume to compare
        </p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
    return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
  };

  const getBorderColor = (score: number) => {
    if (score >= 80) return "border-green-200 dark:border-green-800";
    if (score >= 60) return "border-yellow-200 dark:border-yellow-800";
    return "border-red-200 dark:border-red-800";
  };

  return (
    <div className="space-y-6">
      {/* Comparison Header */}
      <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
        <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Resume Comparison
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Comparing {data.length} {data.length === 1 ? "resume" : "resumes"} side by side
          </p>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="overflow-x-auto">
        <div className="inline-flex gap-4 min-w-full pb-4">
          {data.map((resume, index) => (
            <div
              key={index}
              className={`flex-shrink-0 w-80 bg-white dark:bg-slate-900 rounded-xl border-2 ${getBorderColor(resume.score)} overflow-hidden`}
            >
              {/* Resume Header */}
              <div className={`p-4 ${getScoreColor(resume.score)} border-b border-slate-200 dark:border-slate-800`}>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5" />
                  <h4 className="font-semibold text-sm truncate" title={resume.fileName}>
                    {resume.fileName}
                  </h4>
                </div>
                <div className="flex items-baseline gap-2">
                  <Award className="w-5 h-5" />
                  <span className="text-3xl font-bold">{resume.score}%</span>
                  <span className="text-xs opacity-75">Overall</span>
                </div>
              </div>

              {/* Metrics Section */}
              <div className="p-4 space-y-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">ATS Score</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {resume.atsScore}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Keywords</span>
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {resume.keywordMatch}%
                  </span>
                </div>
              </div>

              {/* Strengths Section */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <h5 className="font-semibold text-sm text-slate-900 dark:text-white">
                    Strengths
                  </h5>
                </div>
                <ul className="space-y-2">
                  {resume.strengths.slice(0, 3).map((strength, i) => (
                    <li
                      key={i}
                      className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                    >
                      <span className="text-green-500 mt-0.5">•</span>
                      <span className="flex-1 line-clamp-2">{strength}</span>
                    </li>
                  ))}
                  {resume.strengths.length > 3 && (
                    <li className="text-xs text-slate-500 dark:text-slate-500 italic">
                      +{resume.strengths.length - 3} more
                    </li>
                  )}
                </ul>
              </div>

              {/* Weaknesses Section */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <h5 className="font-semibold text-sm text-slate-900 dark:text-white">
                    Areas to Improve
                  </h5>
                </div>
                <ul className="space-y-2">
                  {resume.weaknesses.slice(0, 3).map((weakness, i) => (
                    <li
                      key={i}
                      className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                    >
                      <span className="text-red-500 mt-0.5">•</span>
                      <span className="flex-1 line-clamp-2">{weakness}</span>
                    </li>
                  ))}
                  {resume.weaknesses.length > 3 && (
                    <li className="text-xs text-slate-500 dark:text-slate-500 italic">
                      +{resume.weaknesses.length - 3} more
                    </li>
                  )}
                </ul>
              </div>

              {/* Top Skills */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h5 className="font-semibold text-sm text-slate-900 dark:text-white">
                    Top Skills
                  </h5>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resume.topSkills.slice(0, 5).map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {resume.topSkills.length > 5 && (
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-xs">
                      +{resume.topSkills.length - 5}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Tips */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-900 dark:text-blue-300">
          <strong>💡 Tip:</strong> Scroll horizontally to view all compared resumes. Click on any resume in the sidebar to view full details individually.
        </p>
      </div>
    </div>
  );
}
