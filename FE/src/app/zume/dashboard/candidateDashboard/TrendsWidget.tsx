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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Industry Trends</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Last updated: {new Date(trends.last_updated).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Tabs */}
            <button
              onClick={() => setActiveTab("languages")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === "languages"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <Code className="w-4 h-4" />
              Languages
            </button>
            <button
              onClick={() => setActiveTab("jobs")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === "jobs"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Jobs
            </button>
            <button
              onClick={fetchTrends}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Refresh data"
            >
              <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Content */}
      <div className="relative">
        {activeTab === "languages" ? (
          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex gap-4 px-6 py-4 min-w-max">
              {trends.languages.slice(0, 10).map((lang, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-64 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800 hover:shadow-md transition-shadow"
                >
                  {/* Rank Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                      #{lang.rank}
                    </div>
                    {getTrendIcon(lang.change)}
                  </div>

                  {/* Icon & Name */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-4xl">{lang.icon}</div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">{lang.name}</h4>
                  </div>

                  {/* Score */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Popularity</span>
                      <span className="font-bold text-gray-900 dark:text-white">{lang.popularity_score.toFixed(1)}</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all"
                        style={{ width: `${lang.popularity_score}%` }}
                      />
                    </div>
                  </div>

                  {/* Change */}
                  <div className={`text-sm font-semibold ${getTrendColor(lang.change)}`}>
                    {lang.percentage_change > 0 ? "+" : ""}{lang.percentage_change.toFixed(1)}% change
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex gap-4 px-6 py-4 min-w-max">
              {trends.job_roles.slice(0, 10).map((role, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-80 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800 hover:shadow-md transition-shadow"
                >
                  {/* Rank Badge & Trend */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                      #{role.rank}
                    </div>
                    {getTrendIcon(role.change)}
                  </div>

                  {/* Job Title */}
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-3 line-clamp-2">
                    {role.title}
                  </h4>

                  {/* Salary & Stats */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        Salary
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">{role.average_salary}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Demand</span>
                      <span className="font-bold text-gray-900 dark:text-white">{role.demand_score.toFixed(1)}</span>
                    </div>
                    <div className={`text-sm font-semibold ${getTrendColor(role.change)}`}>
                      {role.percentage_change > 0 ? "+" : ""}{role.percentage_change.toFixed(1)}% change
                    </div>
                  </div>

                  {/* Required Skills */}
                  <div className="flex flex-wrap gap-1.5">
                    {role.required_skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {role.required_skills.length > 3 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                        +{role.required_skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="px-6 pb-2">
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          ← Scroll horizontally to see more trends →
        </p>
      </div>
    </div>
  );
}
