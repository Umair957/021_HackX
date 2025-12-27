"use client";

import { 
  Users, 
  FileText, 
  Briefcase, 
  TrendingUp, 
  Clock 
} from "lucide-react";

interface DashboardProps {
  role: string;
}

export default function DashboardClient({ role }: DashboardProps) {
  const isCandidate = role === "candidate";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Welcome back, {isCandidate ? "Candidate" : "Recruiter"}!
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Here is what is happening with your {isCandidate ? "job applications" : "hiring pipeline"} today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={isCandidate ? "Active Applications" : "Open Jobs"} 
          value={isCandidate ? "12" : "5"} 
          icon={Briefcase} 
          color="blue"
        />
        <StatCard 
          title={isCandidate ? "Profile Views" : "Total Candidates"} 
          value={isCandidate ? "48" : "128"} 
          icon={Users} 
          color="purple"
        />
        <StatCard 
          title="Interviews" 
          value="3" 
          icon={Clock} 
          color="orange"
        />
        <StatCard 
          title={isCandidate ? "Response Rate" : "Hire Rate"} 
          value="24%" 
          icon={TrendingUp} 
          color="green"
        />
      </div>

      {/* Main Content Area Placeholder */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 min-h-[400px] flex items-center justify-center border-dashed">
        <div className="text-center space-y-4 max-w-md">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                {isCandidate ? "Recent Activity" : "Candidate Pipeline"}
            </h3>
            <p className="text-slate-500">
                This area will display your charts, recent activity feed, or detailed tables depending on your backend data.
            </p>
        </div>
      </div>
    </div>
  );
}

// Helper Sub-Component for clean code
function StatCard({ title, value, icon: Icon, color }: any) {
  const colorStyles: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <h4 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{value}</h4>
        </div>
        <div className={`p-3 rounded-xl ${colorStyles[color] || colorStyles.blue}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}