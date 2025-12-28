"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus, Briefcase, Code, DollarSign, RefreshCw } from "lucide-react";

interface LanguageTrend {
  name: string;
  popularity_score: number;
  rank: number;
  change: "up" | "down" | "stable";
  percentage_change: number;
  icon: string;
}

interface JobRoleTrend {
  title: string;
  demand_score: number;
  rank: number;
  average_salary: string;
  change: "up" | "down" | "stable";
  percentage_change: number;
  required_skills: string[];
}

interface TrendsData {
  languages: LanguageTrend[];
  job_roles: JobRoleTrend[];
  last_updated: string;
  data_source: string;
}

export default function TrendsWidget() {
  const [trends, setTrends] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"languages" | "jobs">("languages");

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/trends");
      const data = await response.json();
      
      if (data.status === "success") {
        setTrends(data.data);
      }
    } catch (error) {
      console.error("Error fetching trends:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (change: string) => {
    if (change === "up") return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change === "down") return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getTrendColor = (change: string) => {
    if (change === "up") return "text-green-600 dark:text-green-400";
    if (change === "down") return "text-red-600 dark:text-red-400";
    return "text-gray-600 dark:text-gray-400";
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!trends) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <p className="text-gray-600 dark:text-gray-400">Unable to load trends data</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Industry Trends</h3>
          <button
            onClick={fetchTrends}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("languages")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === "languages"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            <Code className="w-4 h-4" />
            Programming Languages
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === "jobs"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Job Roles
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "languages" ? (
          <div className="space-y-3">
            {trends.languages.slice(0, 10).map((lang, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                {/* Rank */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-400">
                  {lang.rank}
                </div>

                {/* Icon */}
                <div className="text-2xl">{lang.icon}</div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{lang.name}</h4>
                    {getTrendIcon(lang.change)}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Score: {lang.popularity_score.toFixed(1)}
                    </span>
                    <span className={getTrendColor(lang.change)}>
                      {lang.percentage_change > 0 ? "+" : ""}{lang.percentage_change.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="hidden md:block w-24">
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{ width: `${lang.popularity_score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {trends.job_roles.slice(0, 10).map((role, index) => (
              <div
                key={index}
                className="p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-sm font-bold text-purple-600 dark:text-purple-400">
                    {role.rank}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{role.title}</h4>
                      {getTrendIcon(role.change)}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm mb-2">
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <DollarSign className="w-4 h-4" />
                        {role.average_salary}
                      </div>
                      <span className={getTrendColor(role.change)}>
                        {role.percentage_change > 0 ? "+" : ""}{role.percentage_change.toFixed(1)}%
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        Demand: {role.demand_score.toFixed(1)}
                      </span>
                    </div>

                    {/* Required Skills */}
                    <div className="flex flex-wrap gap-2">
                      {role.required_skills.slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {role.required_skills.length > 4 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{role.required_skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Last updated: {new Date(trends.last_updated).toLocaleString()} • {trends.data_source}
        </p>
      </div>
    </div>
  );
}
