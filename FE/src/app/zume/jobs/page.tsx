"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, Search, 
  Briefcase, Clock, MapPin,
  Edit, Trash2, Loader2, Upload
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  description?: string;
  location?: string;
  type: string;
  status: "open" | "draft" | "closed";
  created_at: string;
}

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "draft" | "closed">("all");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    type: "Full-time",
    status: "draft",
  });
  const [isEditingJobId, setIsEditingJobId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    isVisible: boolean;
    type: "success" | "error" | "info";
    message: string;
  }>({
    isVisible: false,
    type: "info",
    message: "",
  });

  const showToast = (type: "success" | "error" | "info", message: string) => {
    setToast({ isVisible: true, type, message });
    setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 3000);
  };

  // Fetch jobs
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/jobs", {
        credentials: 'include', // Send cookies with request
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          setError("Please log in to view jobs");
        } else {
          setError("Failed to load jobs");
        }
        return;
      }
      
      const data = await response.json();
      if (data.data) {
        setJobs(data.data);
      } else {
        setJobs([]);
      }
    } catch (err: unknown) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Job data:", formData);
      const url = isEditingJobId ? `/api/jobs/${isEditingJobId}` : "/api/jobs";
      const method = isEditingJobId ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method: method,
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);
      
      if (response.ok && data.data) {
        if (isEditingJobId) {
          // Update existing job
          setJobs(jobs.map(job => job.id === isEditingJobId ? data.data : job));
          showToast("success", `✅ Job "${data.data.title}" updated successfully!`);
        } else {
          // Add new job
          setJobs([data.data, ...jobs]);
          showToast("success", `✅ Job "${data.data.title}" created successfully!`);
        }
        setShowCreateModal(false);
        setIsEditingJobId(null);
        setFormData({ title: "", description: "", location: "", type: "Full-time", status: "draft" });
      } else {
        const errorMsg = data.message || "Failed to save job";
        console.error("Job save failed:", data);
        showToast("error", `❌ ${errorMsg}`);
      }
    } catch (err) {
      console.error("Error saving job:", err);
      showToast("error", `❌ ${err instanceof Error ? err.message : "Failed to save job"}`);
    }
  };

  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${jobTitle}"?`)) return;
    
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE",
        credentials: 'include',
      });
      const data = await response.json();
      
      if (response.ok) {
        setJobs(jobs.filter(job => job.id !== jobId));
        showToast("success", `✅ Job "${jobTitle}" deleted successfully!`);
      } else {
        const errorMsg = data.message || "Failed to delete job";
        showToast("error", `❌ ${errorMsg}`);
      }
    } catch (err) {
      console.error("Error deleting job:", err);
      showToast("error", `❌ ${err instanceof Error ? err.message : "Failed to delete job"}`);
    }
  };

  const handleEditJob = (job: Job) => {
    setFormData({
      title: job.title,
      description: job.description || "",
      location: job.location || "",
      type: job.type,
      status: job.status,
    });
    setIsEditingJobId(job.id);
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setIsEditingJobId(null);
    setFormData({ title: "", description: "", location: "", type: "Full-time", status: "draft" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400";
      case "draft":
        return "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400";
      case "closed":
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400";
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || job.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: jobs.length,
    open: jobs.filter(j => j.status === "open").length,
    draft: jobs.filter(j => j.status === "draft").length,
    closed: jobs.filter(j => j.status === "closed").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-slate-600 dark:text-slate-400">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Job Postings</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Manage your job listings and upload CVs for analysis
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-5 h-5" />
            Post New Job
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Total Jobs
            </p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Open
            </p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.open}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Draft
            </p>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.draft}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Closed
            </p>
            <p className="text-3xl font-bold text-slate-600 dark:text-slate-400">{stats.closed}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "open", "draft", "closed"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
                  filterStatus === status
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400">
              {error}
            </div>
          )}
          {filteredJobs.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
              <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No jobs found</h3>
              <p className="text-slate-500 dark:text-slate-400">
                {searchQuery || filterStatus !== "all" 
                  ? "Try adjusting your search or filters"
                  : "Get started by posting your first job"}
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {job.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(job.status)}`}>
                            {job.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                          {job.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {job.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/zume/resume/analyze?job_id=${job.id}`}
                      className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Upload CVs for this job"
                    >
                      <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </Link>
                    <button
                      onClick={() => handleEditJob(job)}
                      className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Edit job"
                    >
                      <Edit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id, job.title)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete job"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {isEditingJobId ? "Edit Job" : "Post New Job"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateJob} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  placeholder="e.g., Senior Full Stack Developer"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Job Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  placeholder="Enter job description..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    placeholder="e.g., Remote"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Job Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Job Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                >
                  <option value="draft">Draft</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {isEditingJobId ? "Update Job" : "Create Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.isVisible && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-300">
          <div
            className={`px-6 py-4 rounded-xl shadow-lg border flex items-center gap-3 ${
              toast.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
                : toast.type === "error"
                ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
                : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400"
            }`}
          >
            {toast.type === "success" && <span className="text-xl">✅</span>}
            {toast.type === "error" && <span className="text-xl">❌</span>}
            {toast.type === "info" && <span className="text-xl">ℹ️</span>}
            <span className="font-semibold">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
