"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, ArrowUpRight, Search, FileText, TrendingUp, Users, BarChart3,
  CheckCircle2, ChevronRight, MoreHorizontal, Filter, Loader2
} from "lucide-react";

interface DashboardStats {
  total_analyses: number;
  analyses_this_month: number;
  total_resumes_analyzed: number;
  avg_ats_score: number;
  top_candidates_count: number;
  recent_bulk_analyses: number;
}

interface RecentAnalysis {
  id: string;
  job_title?: string;
  total_resumes: number;
  successful_analyses: number;
  avg_score: number;
  top_candidate: string;
  analyzed_at: string;
}

interface TopCandidate {
  file_name: string;
  overall_score: number;
  ats_score: number;
  analyzed_at: string;
  job_title?: string;
}

interface RecruiterDashboardData {
  stats: DashboardStats;
  recent_analyses: RecentAnalysis[];
  top_candidates: TopCandidate[];
}

export default function RecruiterDashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<RecruiterDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/recruiter?days=30');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch dashboard data');
      }
      
      setDashboardData(data.data);
      setError(null);
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-gray-500 dark:text-gray-400">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <BarChart3 className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard Error</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const stats = dashboardData?.stats;
  const recruiterStats = [
    { 
      label: "Total Analyses", 
      value: stats?.total_analyses?.toString() || "0", 
      trend: `+${stats?.analyses_this_month || 0} this month`, 
      color: "text-indigo-600", 
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
      icon: FileText
    },
    { 
      label: "Resumes Reviewed", 
      value: stats?.total_resumes_analyzed?.toString() || "0", 
      trend: `${stats?.avg_ats_score || 0}% avg ATS score`, 
      color: "text-blue-600", 
      bg: "bg-blue-50 dark:bg-blue-900/20",
      icon: Users
    },
    { 
      label: "Top Candidates", 
      value: stats?.top_candidates_count?.toString() || "0", 
      trend: "High-scoring profiles", 
      color: "text-green-600", 
      bg: "bg-green-50 dark:bg-green-900/20",
      icon: TrendingUp
    },
  ];
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Recruiter Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track your resume analysis performance and top candidates.</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={() => router.push('/zume/resume/analyze')}
             className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
           >
              <Search className="w-4 h-4" /> Analyze Resumes
           </button>
           <button 
             onClick={fetchDashboardData}
             className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center gap-2"
           >
              <ArrowUpRight className="w-4 h-4" /> Refresh Data
           </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recruiterStats.map((stat, i) => {
          const IconComponent = stat.icon;
          return (
            <div key={i} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
               <div className="flex justify-between items-start mb-4">
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                     <IconComponent className={`w-4 h-4 ${stat.color}`} />
                  </div>
               </div>
               <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">{stat.value}</h3>
               <p className={`text-xs font-medium ${stat.color}`}>{stat.trend}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         
         {/* Recent Bulk Analyses */}
         <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-1">
               <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Bulk Analyses</h2>
               <button 
                 onClick={() => router.push('/zume/resume/analyze')}
                 className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
               >
                 New Analysis <Plus className="w-3 h-3" />
               </button>
            </div>
            
            <div className="space-y-4">
               {dashboardData?.recent_analyses?.length === 0 ? (
                 <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 text-center">
                   <FileText className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                   <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No Analyses Yet</h3>
                   <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Start analyzing resumes to see your activity here.</p>
                   <button 
                     onClick={() => router.push('/zume/resume/analyze')}
                     className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
                   >
                     <Plus className="w-4 h-4" /> Start Analyzing
                   </button>
                 </div>
               ) : (
                 dashboardData?.recent_analyses?.map(analysis => (
                    <div key={analysis.id} className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 hover:border-indigo-500/30 hover:shadow-md transition-all cursor-pointer flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-lg shrink-0">
                             <FileText className="w-6 h-6" />
                          </div>
                          <div>
                             <h4 className="font-bold text-gray-900 dark:text-white">
                               {analysis.job_title || 'Bulk Analysis'}
                             </h4>
                             <p className="text-xs text-gray-500 dark:text-gray-400">
                               {formatDate(analysis.analyzed_at)} • Top: {analysis.top_candidate}
                             </p>
                          </div>
                       </div>

                       <div className="flex items-center gap-8">
                          <div className="text-center">
                             <p className="text-lg font-bold text-gray-900 dark:text-white">{analysis.total_resumes}</p>
                             <p className="text-[10px] text-gray-400 uppercase font-bold">Resumes</p>
                          </div>
                          <div className="text-center hidden sm:block">
                             <div className="flex items-center justify-center gap-1 text-emerald-600">
                                <span className="text-lg font-bold">{analysis.avg_score}%</span>
                                <CheckCircle2 className="w-3 h-3" />
                             </div>
                             <p className="text-[10px] text-gray-400 uppercase font-bold">Avg Score</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-600 transition-colors" />
                       </div>
                    </div>
                 ))
               )}
            </div>
         </div>

         {/* Top Candidates */}
         <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
               <h2 className="text-lg font-bold text-gray-900 dark:text-white">Top Candidates</h2>
               <button className="text-xs font-bold text-gray-500 hover:text-gray-700">
                 <Filter className="w-4 h-4" />
               </button>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-2">
               {dashboardData?.top_candidates?.length === 0 ? (
                 <div className="p-8 text-center">
                   <Users className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                   <p className="text-gray-500 dark:text-gray-400 text-sm">No candidates yet. Start analyzing resumes to find top talent.</p>
                 </div>
               ) : (
                 dashboardData?.top_candidates?.map((candidate, index) => (
                    <div key={`${candidate.file_name}-${index}`} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-colors cursor-pointer border-b border-gray-50 dark:border-gray-800 last:border-none">
                       <div className="flex justify-between items-start mb-2">
                          <div className="flex gap-3">
                             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                {candidate.file_name.charAt(0).toUpperCase()}
                             </div>
                             <div>
                                <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                                  {candidate.file_name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}
                                </h4>
                                <p className="text-xs text-gray-500 truncate max-w-[120px]">
                                  {candidate.job_title || 'General Analysis'}
                                </p>
                             </div>
                          </div>
                          <span className="text-[10px] text-gray-400">{formatDate(candidate.analyzed_at)}</span>
                       </div>
                       <div className="flex items-center justify-between mt-3 pl-[52px]">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">
                               <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                               <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                 {candidate.overall_score}% Overall
                               </span>
                            </div>
                            <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">
                               <span className="text-xs font-bold text-blue-700 dark:text-blue-400">
                                 {candidate.ats_score}% ATS
                               </span>
                            </div>
                          </div>
                          <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-400">
                             <MoreHorizontal className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                 ))
               )}
               {dashboardData?.top_candidates && dashboardData.top_candidates.length > 0 && (
                 <button 
                   onClick={() => router.push('/zume/resume/analyze')}
                   className="w-full py-3 text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors border-t border-gray-50 dark:border-gray-800 mt-2"
                 >
                   Analyze more resumes
                 </button>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}