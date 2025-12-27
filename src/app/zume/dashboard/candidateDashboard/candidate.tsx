"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  FileText, Plus, ArrowRight, TrendingUp, 
  Calendar, CheckCircle2, ChevronRight 
} from "lucide-react";

// --- MOCK DATA ---
const candidateHistory = [
  { id: 1, name: "Senior_Product_Designer.pdf", role: "Product Designer", date: "2 hours ago", score: 92 },
  { id: 2, name: "Frontend_Dev_React_v2.pdf", role: "Frontend Developer", date: "1 day ago", score: 78 },
];

const latestAnalysis = {
  score: 92,
  summary: "Excellent work! Your resume is well-tailored for ATS.",
  breakdown: [
    { label: "Impact", score: 95, color: "bg-emerald-500" },
    { label: "Brevity", score: 88, color: "bg-emerald-400" },
    { label: "Keywords", score: 92, color: "bg-emerald-500" },
  ]
};

export default function CandidateDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Resumes</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your documents and view analysis reports.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
          <Plus className="w-4 h-4" /> Create New
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left: Resume List */}
        <div className="xl:col-span-2 space-y-6">
           <div className="flex flex-col gap-4">
              {candidateHistory.map(resume => (
                <motion.div 
                  key={resume.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-emerald-500/30 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${resume.score >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                  
                  <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:text-emerald-600 transition-colors shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900 dark:text-white truncate text-base">{resume.name}</h4>
                      {resume.score >= 90 && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {resume.date}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                      <span>{resume.role}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end mt-4 sm:mt-0">
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Score</span>
                      <div className={`text-2xl font-black ${resume.score >= 90 ? 'text-emerald-600' : 'text-amber-500'}`}>{resume.score}</div>
                    </div>
                    
                    <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-bold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                      Report <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
           </div>
           
           <button className="w-full py-4 text-sm font-bold text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1 transition-colors">
              Load older resumes <ChevronRight className="w-4 h-4" />
           </button>
        </div>

        {/* Right: Analysis Snapshot */}
        <div className="space-y-6">
           <div>
             <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 px-1">Latest Analysis</h2>
             <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-xl shadow-emerald-500/5 relative overflow-hidden group">
                
                <div className="flex justify-between items-start mb-6">
                   <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 mb-2">
                      <TrendingUp className="w-6 h-6" />
                   </div>
                   <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full">+5% vs last</span>
                </div>

                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">{latestAnalysis.score}/100</h3>
                
                <div className="space-y-3 mb-6">
                   {latestAnalysis.breakdown.map((item, i) => (
                      <div key={i}>
                         <div className="flex justify-between text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                            <span>{item.label}</span><span>{item.score}%</span>
                         </div>
                         <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                            <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.score}%` }} />
                         </div>
                      </div>
                   ))}
                </div>

                <button className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:opacity-90 transition-opacity">
                  View Full Report
                </button>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}