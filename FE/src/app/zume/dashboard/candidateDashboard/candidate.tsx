"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Plus, ArrowRight, TrendingUp, 
  Calendar, CheckCircle2, ChevronRight, Loader2,
  FileSearch, BarChart3, Clock, AlertCircle, Target,
  Award, Zap, Eye, Star, Download, X, AlertTriangle,
  Globe, ExternalLink, Sparkles
} from "lucide-react";
import { getAnalysisHistoryHandler, getAnalysisDetailHandler, type AnalysisHistoryItem } from "@/handler/analyzeHandler";
import { useRouter } from "next/navigation";

export default function CandidateDashboard() {
  const router = useRouter();
  const [analyses, setAnalyses] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  
  // Modal state
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [analysisDetail, setAnalysisDetail] = useState<any>(null);

  useEffect(() => {
    fetchAnalysisHistory();
  }, []);

  const fetchAnalysisHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAnalysisHistoryHandler(5, 0);
      setAnalyses(response.analyses);
      setTotalCount(response.total);
    } catch (err: any) {
      console.error("Failed to fetch analysis history:", err);
      setError("Failed to load your resume history");
    } finally {
      setLoading(false);
    }
  };

  const handleViewAnalysis = async (analysisId: string) => {
    setSelectedAnalysisId(analysisId);
    setModalLoading(true);
    try {
      const response = await getAnalysisDetailHandler(analysisId);
      setAnalysisDetail(response.analysis);
    } catch (err) {
      console.error("Failed to fetch analysis detail:", err);
      setAnalysisDetail(null);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedAnalysisId(null);
    setAnalysisDetail(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 75) return "text-blue-600 dark:text-blue-400";
    if (score >= 60) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400";
    if (score >= 75) return "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400";
    if (score >= 60) return "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400";
    return "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const stats = {
    totalAnalyses: totalCount,
    avgScore: analyses.length > 0 
      ? Math.round(analyses.reduce((sum, a) => sum + a.scores.overall, 0) / analyses.length)
      : 0,
    avgATS: analyses.length > 0
      ? Math.round(analyses.reduce((sum, a) => sum + a.scores.ats, 0) / analyses.length)
      : 0,
    highScores: analyses.filter(a => a.scores.overall >= 85).length,
    needsWork: analyses.filter(a => a.scores.overall < 70).length,
    jobTargeted: analyses.filter(a => a.has_job_description).length
  };

  const improvementTrend = analyses.length >= 2 
    ? analyses[0].scores.overall - analyses[1].scores.overall 
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans">
      
      {/* Header with Welcome */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
          Welcome back, Candidate! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here is what is happening with your job applications today.
        </p>
      </div>

      {/* Primary Stats - Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardNew 
          title="Active Applications" 
          value="12" 
          icon={Target} 
          trend="+3"
          trendUp={true}
          color="blue"
        />
        <StatCardNew 
          title="Profile Views" 
          value="48" 
          icon={Eye} 
          trend="+12"
          trendUp={true}
          color="purple"
        />
        <StatCardNew 
          title="Interviews" 
          value="3" 
          icon={Calendar} 
          trend="+1"
          trendUp={true}
          color="emerald"
        />
        <StatCardNew 
          title="Response Rate" 
          value="24%" 
          icon={TrendingUp} 
          trend="+5%"
          trendUp={true}
          color="amber"
        />
      </div>

      {/* Resume Performance Section */}
      {!loading && !error && analyses.length > 0 && (
        <div className="bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-emerald-900/10 dark:via-blue-900/10 dark:to-purple-900/10 rounded-3xl p-6 md:p-8 border border-emerald-100 dark:border-emerald-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Resume Performance</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your latest resume metrics</p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${improvementTrend > 0 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
              <TrendingUp className={`w-4 h-4 ${improvementTrend > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500'}`} />
              <span className={`text-sm font-bold ${improvementTrend > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400'}`}>
                {improvementTrend > 0 ? '+' : ''}{improvementTrend} pts
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard 
              label="Average Score" 
              value={stats.avgScore} 
              max={100}
              icon={Award}
              color="emerald"
            />
            <MetricCard 
              label="ATS Compatibility" 
              value={stats.avgATS} 
              max={100}
              icon={CheckCircle2}
              color="blue"
            />
            <MetricCard 
              label="Total Analyzed" 
              value={stats.totalAnalyses} 
              max={null}
              icon={FileText}
              color="purple"
              suffix=" resumes"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left: Resume List */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <FileSearch className="w-5 h-5" />
              Recent Resume Analyses
            </h2>
            {totalCount > 5 && (
              <button 
                onClick={() => router.push('/zume/resume/analyze/history')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
              >
                View all ({totalCount}) <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading your resumes...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-900 rounded-2xl border border-red-100 dark:border-red-900">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Failed to Load</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-sm">{error}</p>
              <button 
                onClick={fetchAnalysisHistory}
                className="px-5 py-2.5 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : analyses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
              <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <FileSearch className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Start Your Journey</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                Analyze your resume to get AI-powered insights and improve your chances of landing interviews.
              </p>
              <button 
                onClick={() => router.push('/zume/resume/analyze')}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                <Zap className="w-5 h-5" /> Analyze Your First Resume
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {analyses.map((analysis, index) => (
                <motion.div 
                  key={analysis.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
                  className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all cursor-pointer overflow-hidden"
                  onClick={() => handleViewAnalysis(analysis.id)}
                >
                  {/* Score Badge - Left indicator */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    analysis.scores.overall >= 90 ? 'bg-gradient-to-b from-emerald-500 to-emerald-600' : 
                    analysis.scores.overall >= 75 ? 'bg-gradient-to-b from-blue-500 to-blue-600' : 
                    analysis.scores.overall >= 60 ? 'bg-gradient-to-b from-amber-500 to-amber-600' :
                    'bg-gradient-to-b from-red-500 to-red-600'
                  }`}></div>
                  
                  <div className="p-4 pl-6">
                    <div className="flex items-start justify-between gap-4">
                      {/* File Info */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h4 className="font-bold text-gray-900 dark:text-white truncate text-sm">
                              {analysis.file_name}
                            </h4>
                            {analysis.scores.overall >= 85 && (
                              <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-full shrink-0">
                                <Star className="w-3 h-3 text-emerald-600 dark:text-emerald-400 fill-current" />
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Top</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {formatDate(analysis.analyzed_at)}
                            </span>
                            {analysis.job_title && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                                <span className="truncate max-w-[180px] font-medium text-gray-700 dark:text-gray-300">
                                  {analysis.job_title}
                                </span>
                              </>
                            )}
                            {analysis.has_job_description && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                                  <Target className="w-3 h-3" /> Targeted
                                </span>
                              </>
                            )}
                          </div>

                          {/* Mini Score Breakdown */}
                          <div className="flex items-center gap-3 mt-2">
                            <ScorePill label="ATS" score={analysis.scores.ats} />
                            <ScorePill label="Format" score={analysis.scores.formatting} />
                            <ScorePill label="Keywords" score={analysis.scores.keywords} />
                          </div>
                        </div>
                      </div>
                      
                      {/* Overall Score */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="text-[9px] font-bold uppercase text-gray-400 tracking-wider block mb-0.5">Overall</span>
                          <div className={`text-3xl font-black leading-none ${getScoreColor(analysis.scores.overall)}`}>
                            {analysis.scores.overall}
                          </div>
                        </div>
                        
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
           
          {!loading && !error && analyses.length > 0 && totalCount > 5 && (
            <button 
              onClick={() => router.push('/zume/resume/analyze/history')}
              className="w-full py-3 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center justify-center gap-1 transition-colors bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30"
            >
              Load more analyses ({totalCount - 5} remaining) <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-4">
          {/* Latest Analysis Card */}
          {analyses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-1">Latest Analysis</h2>
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6" />
                    </div>
                    {improvementTrend > 0 && (
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +{improvementTrend}
                      </span>
                    )}
                  </div>

                  <div className="mb-6">
                    <p className="text-sm text-white/80 mb-2">Overall Score</p>
                    <h3 className="text-5xl font-black mb-1">{analyses[0].scores.overall}</h3>
                    <p className="text-sm text-white/70">{analyses[0].file_name.substring(0, 25)}...</p>
                  </div>
                  
                  <div className="space-y-2.5 mb-6">
                    <ScoreBarWhite label="ATS" score={analyses[0].scores.ats} />
                    <ScoreBarWhite label="Formatting" score={analyses[0].scores.formatting} />
                    <ScoreBarWhite label="Keywords" score={analyses[0].scores.keywords} />
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewAnalysis(analyses[0].id);
                    }}
                    className="w-full py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-white/90 transition-all shadow-lg"
                  >
                    View Full Report
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm"
          >
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={() => router.push('/zume/resume/analyze')}
                className="w-full flex items-center gap-3 p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl hover:shadow-md transition-all text-left group border border-blue-100 dark:border-blue-800"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <FileSearch className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Analyze Resume</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Get AI insights</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </button>
              
              <button 
                onClick={() => router.push('/zume/resume/create')}
                className="w-full flex items-center gap-3 p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl hover:shadow-md transition-all text-left group border border-emerald-100 dark:border-emerald-800"
              >
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Create Resume</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Build from scratch</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </motion.div>

          {/* Resume Stats */}
          {analyses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm"
            >
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Your Stats</h3>
              <div className="space-y-3">
                <StatItem icon={FileText} label="Total Resumes" value={stats.totalAnalyses.toString()} />
                <StatItem icon={Star} label="High Scores" value={stats.highScores.toString()} />
                <StatItem icon={Target} label="Job Targeted" value={stats.jobTargeted.toString()} />
                <StatItem icon={AlertCircle} label="Needs Work" value={stats.needsWork.toString()} color="amber" />
              </div>
            </motion.div>
          )}
        </div>

      </div>

      {/* Analysis Detail Modal */}
      <AnimatePresence>
        {selectedAnalysisId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={closeModal}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">Resume Analysis Report</h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {modalLoading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading analysis...</p>
                  </div>
                ) : analysisDetail ? (
                  <div className="space-y-6">
                    {/* File Info */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white">{analysisDetail.file_info.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {(analysisDetail.file_info.size / 1024).toFixed(2)} KB • {analysisDetail.file_info.type}
                        </p>
                      </div>
                      {analysisDetail.job_context?.job_title && (
                        <div className="text-right">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Job Targeted</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{analysisDetail.job_context.job_title}</p>
                        </div>
                      )}
                    </div>

                    {/* Scores Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <ScoreCard label="Overall" score={analysisDetail.scores.overall_score} />
                      <ScoreCard label="ATS" score={analysisDetail.scores.ats_score} />
                      <ScoreCard label="Formatting" score={analysisDetail.scores.formatting_score} />
                      <ScoreCard label="Content" score={analysisDetail.scores.content_quality_score} />
                      <ScoreCard label="Keywords" score={analysisDetail.scores.keyword_optimization_score} />
                    </div>

                    {/* Strengths */}
                    {analysisDetail.strengths && analysisDetail.strengths.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Strengths
                        </h3>
                        <div className="space-y-2">
                          {analysisDetail.strengths.map((strength: string, i: number) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                              <div className="w-2 h-2 rounded-full bg-emerald-600 mt-2"></div>
                              <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">{strength}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Weaknesses */}
                    {analysisDetail.weaknesses && analysisDetail.weaknesses.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-amber-600" /> Areas for Improvement
                        </h3>
                        <div className="space-y-2">
                          {analysisDetail.weaknesses.map((weakness: string, i: number) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                              <div className="w-2 h-2 rounded-full bg-amber-600 mt-2"></div>
                              <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">{weakness}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Online Presence (if available) */}
                    {(analysisDetail.professional_links?.length > 0 || analysisDetail.online_info) && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-cyan-600" /> Online Presence Analysis
                        </h3>
                        
                        {/* Professional Links */}
                        {analysisDetail.professional_links?.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <Globe className="w-4 h-4" /> Professional Links Found:
                            </p>
                            <div className="space-y-2">
                              {analysisDetail.professional_links.map((link: string, i: number) => (
                                <a
                                  key={i}
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors group"
                                >
                                  <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                  <span className="text-sm text-blue-700 dark:text-blue-300 truncate flex-1">{link}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Online Information */}
                        {analysisDetail.online_info && (
                          <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 rounded-xl border border-cyan-200 dark:border-cyan-800">
                            <p className="text-sm font-semibold text-cyan-900 dark:text-cyan-300 mb-2 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4" /> Findings from Your Profiles:
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                              {analysisDetail.online_info}
                            </p>
                            <div className="mt-3 pt-3 border-t border-cyan-200 dark:border-cyan-800">
                              <p className="text-xs text-cyan-700 dark:text-cyan-400 font-medium">
                                💡 Our AI used Google Search to discover this information and compared it with your resume
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Improvement Suggestions */}
                    {analysisDetail.improvement_suggestions && analysisDetail.improvement_suggestions.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <Zap className="w-5 h-5 text-blue-600" /> Actionable Suggestions
                        </h3>
                        <div className="space-y-3">
                          {analysisDetail.improvement_suggestions.map((suggestion: any, i: number) => (
                            <div key={i} className={`p-4 rounded-xl border-l-4 ${
                              suggestion.priority === 'high' ? 'bg-red-50 dark:bg-red-900/10 border-red-500' :
                              suggestion.priority === 'medium' ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-500' :
                              'bg-gray-50 dark:bg-gray-800 border-gray-400'
                            }`}>
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-gray-900 dark:text-white">{suggestion.category}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                  suggestion.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                                  suggestion.priority === 'medium' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                                  'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}>
                                  {suggestion.priority} priority
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300">{suggestion.suggestion}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Failed to load analysis details</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// New Modern Stat Card with Trends
function StatCardNew({ title, value, icon: Icon, trend, trendUp, color }: {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  color: string;
}) {
  const colorStyles: Record<string, { bg: string; icon: string; border: string }> = {
    blue: { bg: "bg-blue-50 dark:bg-blue-900/20", icon: "text-blue-600 dark:text-blue-400", border: "border-blue-100 dark:border-blue-800" },
    purple: { bg: "bg-purple-50 dark:bg-purple-900/20", icon: "text-purple-600 dark:text-purple-400", border: "border-purple-100 dark:border-purple-800" },
    amber: { bg: "bg-amber-50 dark:bg-amber-900/20", icon: "text-amber-600 dark:text-amber-400", border: "border-amber-100 dark:border-amber-800" },
    emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-100 dark:border-emerald-800" },
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div className={`bg-white dark:bg-gray-900 p-5 rounded-2xl border ${style.border} hover:shadow-lg transition-all group`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${style.bg} group-hover:scale-110 transition-transform`}>
          <Icon className={`w-5 h-5 ${style.icon}`} />
        </div>
        {trend && (
          <span className={`text-xs font-bold ${trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'} flex items-center gap-0.5`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{title}</p>
      <h4 className="text-3xl font-black text-gray-900 dark:text-white">{value}</h4>
    </div>
  );
}

// Metric Card for Performance Section
function MetricCard({ label, value, max, icon: Icon, color, suffix }: {
  label: string;
  value: number;
  max: number | null;
  icon: React.ElementType;
  color: string;
  suffix?: string;
}) {
  const colorStyles: Record<string, string> = {
    emerald: "from-emerald-500 to-teal-500",
    blue: "from-blue-500 to-indigo-500",
    purple: "from-purple-500 to-pink-500",
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${colorStyles[color] || colorStyles.emerald}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-black text-gray-900 dark:text-white">{value}</span>
        {max && <span className="text-lg font-bold text-gray-400">/{max}</span>}
        {suffix && <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{suffix}</span>}
      </div>
      {max && (
        <div className="mt-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full bg-gradient-to-r ${colorStyles[color]}`}
            style={{ width: `${(value / max) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}

// Score Pill Component
function ScorePill({ label, score }: { label: string; score: number }) {
  const getColor = (score: number) => {
    if (score >= 90) return "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400";
    if (score >= 75) return "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400";
    if (score >= 60) return "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400";
    return "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400";
  };

  return (
    <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${getColor(score)}`}>
      {label}: {score}
    </span>
  );
}

function StatCard({ title, value, icon: Icon, color }: {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}) {
  const colorStyles: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h4>
        </div>
        <div className={`p-3 rounded-xl ${colorStyles[color] || colorStyles.blue}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const getBarColor = (score: number) => {
    if (score >= 90) return "bg-emerald-500";
    if (score >= 75) return "bg-blue-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div>
      <div className="flex justify-between text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
        <span>{label}</span>
        <span>{score}%</span>
      </div>
      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${getBarColor(score)} transition-all duration-500`} 
          style={{ width: `${score}%` }} 
        />
      </div>
    </div>
  );
}

// White version for colored backgrounds
function ScoreBarWhite({ label, score }: { label: string; score: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-bold text-white/90 mb-1.5">
        <span>{label}</span>
        <span>{score}%</span>
      </div>
      <div className="w-full bg-white/20 backdrop-blur-sm rounded-full h-2">
        <div 
          className="h-2 rounded-full bg-white transition-all duration-500" 
          style={{ width: `${score}%` }} 
        />
      </div>
    </div>
  );
}

// Stat Item for sidebar
function StatItem({ icon: Icon, label, value, color = "gray" }: {
  icon: React.ElementType;
  label: string;
  value: string;
  color?: string;
}) {
  const iconColors: Record<string, string> = {
    gray: "text-gray-600 dark:text-gray-400",
    amber: "text-amber-600 dark:text-amber-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
  };

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2.5">
        <Icon className={`w-4 h-4 ${iconColors[color] || iconColors.gray}`} />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      </div>
      <span className="text-sm font-bold text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}

// Score Card for Modal
function ScoreCard({ label, score }: { label: string; score: number }) {
  const getColor = (score: number) => {
    if (score >= 90) return "from-emerald-500 to-emerald-600 text-emerald-50";
    if (score >= 75) return "from-blue-500 to-blue-600 text-blue-50";
    if (score >= 60) return "from-amber-500 to-amber-600 text-amber-50";
    return "from-red-500 to-red-600 text-red-50";
  };

  return (
    <div className={`p-4 rounded-xl bg-gradient-to-br ${getColor(score)} text-center`}>
      <p className="text-xs font-semibold opacity-90 mb-1">{label}</p>
      <p className="text-3xl font-black">{score}</p>
    </div>
  );
}
