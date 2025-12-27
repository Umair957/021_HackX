"use client";

import { 
  Plus, ArrowUpRight, Search, 
  CheckCircle2, ChevronRight, MoreHorizontal, Filter 
} from "lucide-react";

// --- MOCK DATA ---
const recruiterStats = [
  { label: "Active Jobs", value: "12", trend: "+3 this month", color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
  { label: "Total Applicants", value: "843", trend: "+124 this week", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { label: "Interviews", value: "18", trend: "Scheduled for this week", color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
];

const activeJobs = [
  { id: 1, title: "Senior Product Designer", dept: "Design", applicants: 142, new: 12, status: "Active" },
  { id: 2, title: "Full Stack Engineer", dept: "Engineering", applicants: 89, new: 5, status: "Active" },
  { id: 3, title: "Marketing Manager", dept: "Marketing", applicants: 45, new: 0, status: "Paused" },
];

const recentApplicants = [
  { id: 1, name: "Sarah Jenkins", role: "Senior Product Designer", match: 95, time: "10m ago" },
  { id: 2, name: "Mike Ross", role: "Full Stack Engineer", match: 88, time: "1h ago" },
  { id: 3, name: "Jessica Chang", role: "Marketing Manager", match: 72, time: "3h ago" },
];

export default function RecruiterDashboard() {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hiring Command Center</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track your open roles and incoming talent pipeline.</p>
        </div>
        <div className="flex gap-3">
           <button className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
              <Search className="w-4 h-4" /> Find Talent
           </button>
           <button className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" /> Post Job
           </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recruiterStats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
             <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{stat.label}</p>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                   <ArrowUpRight className={`w-4 h-4 ${stat.color}`} />
                </div>
             </div>
             <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">{stat.value}</h3>
             <p className={`text-xs font-medium ${stat.color}`}>{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         
         {/* Active Jobs List */}
         <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-1">
               <h2 className="text-lg font-bold text-gray-900 dark:text-white">Active Listings</h2>
               <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">View All</button>
            </div>
            
            <div className="space-y-4">
               {activeJobs.map(job => (
                  <div key={job.id} className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 hover:border-indigo-500/30 hover:shadow-md transition-all cursor-pointer flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-lg shrink-0">
                           {job.title.charAt(0)}
                        </div>
                        <div>
                           <h4 className="font-bold text-gray-900 dark:text-white">{job.title}</h4>
                           <p className="text-xs text-gray-500 dark:text-gray-400">{job.dept} • {job.status}</p>
                        </div>
                     </div>

                     <div className="flex items-center gap-8">
                        <div className="text-center">
                           <p className="text-lg font-bold text-gray-900 dark:text-white">{job.applicants}</p>
                           <p className="text-[10px] text-gray-400 uppercase font-bold">Applicants</p>
                        </div>
                        <div className="text-center hidden sm:block">
                           <div className="flex items-center justify-center gap-1 text-emerald-600">
                              <span className="text-lg font-bold">+{job.new}</span>
                              {job.new > 0 && <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>}
                           </div>
                           <p className="text-[10px] text-gray-400 uppercase font-bold">New</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-600 transition-colors" />
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Recent Applicants Feed */}
         <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
               <h2 className="text-lg font-bold text-gray-900 dark:text-white">Incoming Talent</h2>
               <button className="text-xs font-bold text-gray-500 hover:text-gray-700"><Filter className="w-4 h-4" /></button>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-2">
               {recentApplicants.map((applicant) => (
                  <div key={applicant.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-colors cursor-pointer border-b border-gray-50 dark:border-gray-800 last:border-none">
                     <div className="flex justify-between items-start mb-2">
                        <div className="flex gap-3">
                           <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${applicant.name}`} alt="avatar" />
                           </div>
                           <div>
                              <h4 className="font-bold text-sm text-gray-900 dark:text-white">{applicant.name}</h4>
                              <p className="text-xs text-gray-500 truncate max-w-[120px]">Applied to {applicant.role}</p>
                           </div>
                        </div>
                        <span className="text-[10px] text-gray-400">{applicant.time}</span>
                     </div>
                     <div className="flex items-center justify-between mt-3 pl-[52px]">
                        <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">
                           <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                           <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{applicant.match}% Match</span>
                        </div>
                        <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-400">
                           <MoreHorizontal className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
               ))}
               <button className="w-full py-3 text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors border-t border-gray-50 dark:border-gray-800 mt-2">
                  View all 124 new applicants
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}