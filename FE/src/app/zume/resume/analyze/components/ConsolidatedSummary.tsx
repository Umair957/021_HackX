"use client";

import React from "react";
import { 
  TrendingUp, 
  Award, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  XCircle,
  BarChart3,
  Target
} from "lucide-react";

interface ConsolidatedSummaryProps {
  data: {
    total_resumes: number;
    successful_analyses: number;
    failed_analyses: number;
    job_context: {
      job_title: string | null;
      has_job_description: boolean;
    };
    ranking: {
      rank: number;
      file_name: string;
      overall_score: number;
      ats_score: number;
      keyword_match: number;
      top_strength: string | null;
      main_concern: string | null;
      recommendation: string;
    }[];
    statistics?: {
      average_ats_score: number;
      average_overall_score: number;
      highest_ats_score: number;
      lowest_ats_score: number;
      strong_candidates: number;
      moderate_candidates: number;
      weak_candidates: number;
    };
  };
}

export default function ConsolidatedSummary({ data }: ConsolidatedSummaryProps) {
  const getRecommendationColor = (recommendation: string) => {
    if (recommendation.includes("Highly Recommended")) {
      return "text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-700";
    } else if (recommendation.includes("Recommended")) {
      return "text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700";
    } else if (recommendation.includes("Consider")) {
      return "text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700";
    } else {
      return "text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-700";
    }
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white";
    if (rank === 2) return "bg-gradient-to-br from-slate-300 to-slate-500 text-white";
    if (rank === 3) return "bg-gradient-to-br from-orange-400 to-orange-600 text-white";
    return "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <BarChart3 className="w-8 h-8" />
          <h2 className="text-2xl font-bold">AI-Powered Consolidated Analysis</h2>
        </div>
        <p className="text-purple-100">
          Intelligent ranking based on ATS compatibility and job fit
        </p>
        {data.job_context.job_title && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Target className="w-4 h-4" />
            <span className="font-medium">Job Role:</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">{data.job_context.job_title}</span>
          </div>
        )}
      </div>

      {/* Statistics Overview */}
      {data.statistics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Strong Candidates */}
          <div className="bg-green-50 dark:bg-green-900/10 border-2 border-green-200 dark:border-green-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {data.statistics.strong_candidates}
                </p>
                <p className="text-sm text-green-600 dark:text-green-500">Strong Candidates</p>
              </div>
            </div>
            <p className="text-xs text-green-600 dark:text-green-500">ATS Score ≥ 80%</p>
          </div>

          {/* Moderate Candidates */}
          <div className="bg-yellow-50 dark:bg-yellow-900/10 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                  {data.statistics.moderate_candidates}
                </p>
                <p className="text-sm text-yellow-600 dark:text-yellow-500">Moderate Fit</p>
              </div>
            </div>
            <p className="text-xs text-yellow-600 dark:text-yellow-500">ATS Score 60-79%</p>
          </div>

          {/* Weak Candidates */}
          <div className="bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                  {data.statistics.weak_candidates}
                </p>
                <p className="text-sm text-red-600 dark:text-red-500">Weak Match</p>
              </div>
            </div>
            <p className="text-xs text-red-600 dark:text-red-500">ATS Score &lt; 60%</p>
          </div>
        </div>
      )}

      {/* Averages */}
      {data.statistics && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Average Scores</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Overall</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {data.statistics.average_overall_score}%
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">ATS Score</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {data.statistics.average_ats_score}%
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Highest</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {data.statistics.highest_ats_score}%
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Lowest</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {data.statistics.lowest_ats_score}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Ranking List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Candidate Rankings (By ATS Score)
            </h3>
          </div>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {data.ranking.map((candidate) => (
            <div
              key={candidate.rank}
              className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Rank Badge */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-lg ${getRankBadgeColor(candidate.rank)}`}>
                  #{candidate.rank}
                </div>

                {/* Candidate Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 truncate">
                    {candidate.file_name}
                  </h4>

                  {/* Scores */}
                  <div className="flex flex-wrap gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">ATS:</span>
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-full font-bold text-sm">
                        {candidate.ats_score}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Overall:</span>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full font-bold text-sm">
                        {candidate.overall_score}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Keywords:</span>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full font-bold text-sm">
                        {candidate.keyword_match}%
                      </span>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    {candidate.top_strength && (
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                          {candidate.top_strength}
                        </p>
                      </div>
                    )}
                    {candidate.main_concern && (
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                          {candidate.main_concern}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Recommendation */}
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-semibold ${getRecommendationColor(candidate.recommendation)}`}>
                    <Users className="w-4 h-4" />
                    {candidate.recommendation}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
