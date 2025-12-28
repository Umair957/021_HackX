"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, FileText, Sparkles, LayoutGrid, User, BarChart3 } from "lucide-react";
import ConfirmModal from "@/ui/dialogModal";
import SideToast from "@/ui/Toast";
import { ToastType } from "@/constants/toastData";
import { FileUpload } from "./components/FileUpload";
import { BulkFileUpload } from "./components/BulkFileUpload";
import { AnalysisResults } from "./components/AnalysisResults";
import { ImprovementSuggestions } from "./components/ImprovementSuggestions";
import { OnlinePresence } from "./components/OnlinePresence";
import ComparisonView from "./components/ComparisonView";
import CVSidebar from "./components/CVSidebar";
import IndividualView from "./components/IndividualView";
import ConsolidatedSummary from "./components/ConsolidatedSummary";
import { analyzeResumeHandler, analyzeBulkResumesHandler } from "@/handler/analyzeHandler";

interface AnalysisData {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: {
    category: string;
    issue: string;
    fix: string;
    priority: "high" | "medium" | "low";
  }[];
  atsScore: number;
  readabilityScore: number;
  keywordMatch: number;
  professionalLinks?: string[];
  onlineInfo?: string;
}

interface BulkAnalysisResult {
  fileName: string;
  status: "success" | "error";
  data?: AnalysisData;
  error?: string;
}

interface ConsolidatedSummary {
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
}

interface AnalyzeClientProps {
  userRole: string;
  userEmail: string;
}

export default function AnalyzeClient({ userRole, userEmail }: AnalyzeClientProps) {
  const router = useRouter();
  const resultsRef = React.useRef<HTMLDivElement>(null);
  
  // --- STATE ---
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [bulkResults, setBulkResults] = useState<BulkAnalysisResult[]>([]);
  const [consolidatedSummary, setConsolidatedSummary] = useState<ConsolidatedSummary | null>(null);
  // const [expandedResults, setExpandedResults] = useState<Set<number>>(new Set());
  
  // Bulk analysis view modes
  const [viewMode, setViewMode] = useState<"summary" | "compare" | "individual">("summary");
  const [selectedForComparison, setSelectedForComparison] = useState<Set<number>>(new Set());
  const [currentIndividualView, setCurrentIndividualView] = useState<number | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [analyzingProgress, setAnalyzingProgress] = useState<string>("");
  const [filesBeingAnalyzed, setFilesBeingAnalyzed] = useState<number>(0);
  
  // Job selection state
  const [jobs, setJobs] = useState<Array<{ id: string; title: string; status: string; description?: string }>>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  // --- TOAST STATE ---
  const [toast, setToast] = useState<{
    isVisible: boolean;
    type: ToastType;
    title: string;
    description: string;
  }>({
    isVisible: false,
    type: "info",
    title: "",
    description: "",
  });

  const showToast = (type: ToastType, title: string, description: string) => {
    setToast({ isVisible: true, type, title, description });
  };

  const closeToast = () => setToast((prev) => ({ ...prev, isVisible: false }));

  // --- FETCH JOBS ---
  React.useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/jobs");
        const data = await response.json();
        if (data.data) {
          setJobs(data.data);
          
          // Check if job_id is in URL params (from job posting page)
          const searchParams = new URLSearchParams(window.location.search);
          const jobIdParam = searchParams.get("job_id");
          if (jobIdParam) {
            setSelectedJobId(jobIdParam);
            // Auto-populate job title from selected job
            const selectedJob = data.data.find((j: { id: string }) => j.id === jobIdParam);
            if (selectedJob) {
              setJobTitle(selectedJob.title);
              setJobDescription(selectedJob.description || "");
            }
          }
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };
    
    if (userRole === "recruiter") {
      fetchJobs();
    }
  }, [userRole]);

  // --- HANDLERS ---
  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsAnalyzing(true);
    setAnalyzingProgress("Uploading resume...");
    setFilesBeingAnalyzed(1);

    try {

      setAnalyzingProgress("AI is analyzing your resume...");
      // Call the API handler with job data
      const response = await analyzeResumeHandler(file, jobTitle, jobDescription);

      // Check the status returned by our handler
      if (response.status === 200 && response.data) {
        const apiAnalysis = response.data.analysis;
        
        // Transform API response to match our component interface
        const transformedAnalysis: AnalysisData = {
          score: apiAnalysis?.score || 0,
          atsScore: apiAnalysis?.ats_score || 0,
          readabilityScore: apiAnalysis?.readability_score || 0,
          keywordMatch: apiAnalysis?.keyword_match || 0,
          strengths: apiAnalysis?.strengths || [],
          weaknesses: apiAnalysis?.weaknesses || [],
          suggestions: apiAnalysis?.suggestions || [],
          professionalLinks: apiAnalysis?.professional_links || [],
          onlineInfo: apiAnalysis?.online_info || undefined,
        };

        setAnalysisData(transformedAnalysis);
        setAnalyzingProgress("Analysis complete!");

        setTimeout(() => {
          setIsAnalyzing(false);
          showToast("success", "Analysis Complete", "Your resume has been analyzed successfully!");
          // Scroll to results after a short delay
          setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }, 500);
      } else {
        // API ERROR
        throw new Error(response.message || "Analysis failed");
      }
    } catch (error: unknown) {
      console.error("Error analyzing resume:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setIsAnalyzing(false);
      showToast("error", "Analysis Failed", errorMessage);
    }
  };

  const handleBulkFilesUpload = async (files: File[]) => {
    setIsAnalyzing(true);
    setBulkResults([]);
    setConsolidatedSummary(null);
    setFilesBeingAnalyzed(files.length);
    setAnalyzingProgress(`Uploading ${files.length} resumes...`);

    try {

      setAnalyzingProgress(`AI is analyzing ${files.length} resumes...`);
      const response = await analyzeBulkResumesHandler(files, jobTitle, jobDescription);

      if (response.status === 200 && response.data) {
        // Check if individual_results array exists
        if (!response.data.individual_results || !Array.isArray(response.data.individual_results)) {
          console.error("❌ Invalid response structure:", response.data);
          throw new Error("Invalid response format from server");
        }

        // Transform the results
        const transformedResults: BulkAnalysisResult[] = response.data.individual_results.map((result: {
          file_name: string;
          status: "success" | "error";
          error?: string;
          analysis?: {
            score: number;
            ats_score: number;
            readability_score: number;
            keyword_match: number;
            strengths: string[];
            weaknesses: string[];
            suggestions: {
              category: string;
              issue: string;
              fix: string;
              priority: "high" | "medium" | "low";
            }[];
            professional_links?: string[];
            online_info?: string;
          };
        }) => ({
          fileName: result.file_name,
          status: result.status,
          data: result.analysis ? {
            score: result.analysis.score || 0,
            atsScore: result.analysis.ats_score || 0,
            readabilityScore: result.analysis.readability_score || 0,
            keywordMatch: result.analysis.keyword_match || 0,
            strengths: result.analysis.strengths || [],
            weaknesses: result.analysis.weaknesses || [],
            suggestions: result.analysis.suggestions || [],
            professionalLinks: result.analysis.professional_links || [],
            onlineInfo: result.analysis.online_info || undefined,
          } : undefined,
          error: result.error,
        }));

        setBulkResults(transformedResults);
        setConsolidatedSummary(response.data.consolidated_summary);
        setAnalyzingProgress("Analysis complete!");
       
        setTimeout(() => {
          setIsAnalyzing(false);
          showToast("success", "Bulk Analysis Complete", `Analyzed ${files.length} resumes successfully!`);
          // Scroll to results after a short delay
          setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }, 500);
      } else {
        throw new Error(response.message || "Bulk analysis failed");
      }
    } catch (error: unknown) {
      console.error("Error in bulk analysis:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setIsAnalyzing(false);
      showToast("error", "Bulk Analysis Failed", errorMessage);
    }
  };

  // const toggleResultExpanded = (index: number) => {
  //   setExpandedResults(prev => {
  //     const newSet = new Set(prev);
  //     if (newSet.has(index)) {
  //       newSet.delete(index);
  //     } else {
  //       newSet.add(index);
  //     }
  //     return newSet;
  //   });
  // };

  const toggleComparisonSelection = (index: number) => {
    setSelectedForComparison(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        if (newSet.size < 5) {
          newSet.add(index);
        } else {
          showToast("info", "Maximum Reached", "You can compare up to 5 resumes at once");
        }
      }
      return newSet;
    });
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setAnalysisData(null);
    setJobTitle("");
    setJobDescription("");
  };

  const handleStartNewAnalysis = () => {
    setBulkResults([]);
    setConsolidatedSummary(null);
    setViewMode("summary");
    setSelectedForComparison(new Set());
    setCurrentIndividualView(null);
    setJobTitle("");
    setJobDescription("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="px-4 sm:px-8 py-6 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push("/zume/dashboard")}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </button>
          
          {bulkResults.length > 0 && (
            <button
              onClick={handleStartNewAnalysis}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              New Analysis
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-8 py-12 max-w-7xl mx-auto">
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              AI Resume Analyzer
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Get instant AI-powered feedback, ATS compatibility scores, and actionable suggestions to improve your resume.
          </p>
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden">
          
          {!uploadedFile && !analysisData && bulkResults.length === 0 && (
            <div className="p-8 md:p-16">
              {/* Debug Info */}
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  🐛 Debug Information
                </p>
                <div className="space-y-1 text-xs">
                  <p className="text-blue-900 dark:text-blue-100">
                    <strong>📧 Email:</strong> {userEmail || "Unknown"}
                  </p>
                  <p className="text-blue-900 dark:text-blue-100">
                    <strong>🎭 Role (from layout):</strong> <span className="font-mono bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">{userRole}</span>
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-2 pt-2 border-t border-blue-200 dark:border-blue-700">
                    {userRole === "recruiter" ? "✅ Showing Bulk Upload (Multiple Files)" : "ℹ️ Showing Single Upload (One File)"}
                  </p>
                </div>
              </div>

              {userRole === "recruiter" ? (
                <div className="space-y-6">
                  {/* Job Selection for Recruiters */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Select a Job Opening (Optional)
                    </label>
                    <select
                      value={selectedJobId}
                      onChange={(e) => {
                        const jobId = e.target.value;
                        setSelectedJobId(jobId);
                        
                        // Auto-populate job details when job is selected
                        if (jobId) {
                          const job = jobs.find((j) => j.id === jobId);
                          if (job) {
                            setJobTitle(job.title);
                            setJobDescription(job.description || "");
                          }
                        } else {
                          setJobTitle("");
                          setJobDescription("");
                        }
                      }}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    >
                      <option value="">-- Upload for General Analysis --</option>
                      {jobs.map((job) => (
                        <option key={job.id} value={job.id}>
                          {job.title} ({job.status.toUpperCase()})
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Selecting a job will automatically use its title and description for analysis
                    </p>
                  </div>

                  {/* Bulk File Upload */}
                  <BulkFileUpload
                    onFilesUpload={handleBulkFilesUpload}
                    jobTitle={jobTitle}
                    setJobTitle={setJobTitle}
                    jobDescription={jobDescription}
                    setJobDescription={setJobDescription}
                    maxFiles={10}
                  />
                </div>
              ) : (
                <FileUpload
                  onFileUpload={handleFileUpload}
                  jobTitle={jobTitle}
                  setJobTitle={setJobTitle}
                  jobDescription={jobDescription}
                  setJobDescription={setJobDescription}
                />
              )}
            </div>
          )}

          {/* Rest of the component stays the same... */}
          {/* Single file analysis results */}
          {uploadedFile && analysisData && (
            <div ref={resultsRef} className="p-8 md:p-16 space-y-8">
              {/* Results sections */}
              <AnalysisResults data={analysisData} />
              <ImprovementSuggestions suggestions={analysisData.suggestions} />
              {analysisData.professionalLinks && analysisData.professionalLinks.length > 0 && (
                <OnlinePresence 
                  professionalLinks={analysisData.professionalLinks} 
                  onlineInfo={analysisData.onlineInfo}
                />
              )}
            </div>
          )}

          {/* Bulk analysis results */}
          {bulkResults.length > 0 && (
            <div ref={resultsRef} className="p-8">
              {/* View Mode Tabs */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("summary")}
                    className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      viewMode === "summary"
                        ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    Summary
                  </button>
                  <button
                    onClick={() => setViewMode("compare")}
                    className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      viewMode === "compare"
                        ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    Compare
                  </button>
                  <button
                    onClick={() => setViewMode("individual")}
                    className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      viewMode === "individual"
                        ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Individual
                  </button>
                </div>
              </div>

              {/* Content Area */}
              {viewMode === "summary" && consolidatedSummary && (
                <ConsolidatedSummary data={consolidatedSummary} />
              )}

              {(viewMode === "compare" || viewMode === "individual") && (
                <div className="flex gap-6">
                  <CVSidebar
                    results={bulkResults}
                    selectedForComparison={selectedForComparison}
                    currentIndividualView={currentIndividualView}
                    viewMode={viewMode}
                    onToggleComparison={toggleComparisonSelection}
                    onSelectIndividual={(index: number) => {
                      setCurrentIndividualView(index);
                      setViewMode("individual");
                    }}
                  />

                  <div className="flex-1">
                    {viewMode === "compare" && selectedForComparison.size > 0 && (
                      <ComparisonView
                        data={Array.from(selectedForComparison).map((idx) => {
                          const r = bulkResults[idx];
                          return {
                            fileName: r?.fileName || "Unknown",
                            score: r?.data?.score ?? 0,
                            atsScore: r?.data?.atsScore ?? 0,
                            readabilityScore: r?.data?.readabilityScore ?? 0,
                            keywordMatch: r?.data?.keywordMatch ?? 0,
                            strengths: r?.data?.strengths || [],
                            weaknesses: r?.data?.weaknesses || [],
                            topSkills: (r?.data?.strengths || []).slice(0, 5),
                          };
                        })}
                      />
                    )}

                    {viewMode === "compare" && selectedForComparison.size === 0 && (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <BarChart3 className="w-16 h-16 text-slate-400 dark:text-slate-600 mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Select Resumes to Compare
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md">
                          Choose resumes from the sidebar to see a detailed comparison of their scores, strengths, and weaknesses.
                        </p>
                      </div>
                    )}
                    
                    {viewMode === "individual" && currentIndividualView !== null && (
                      <IndividualView
                        data={(() => {
                          const r = bulkResults[currentIndividualView];
                          return {
                            fileName: r?.fileName || "Unknown",
                            score: r?.data?.score ?? 0,
                            atsScore: r?.data?.atsScore ?? 0,
                            keywordMatch: r?.data?.keywordMatch ?? 0,
                            strengths: r?.data?.strengths || [],
                            weaknesses: r?.data?.weaknesses || [],
                            suggestions: r?.data?.suggestions || [],
                            professionalLinks: r?.data?.professionalLinks || [],
                            onlineInfo: r?.data?.onlineInfo,
                            readabilityScore: r?.data?.readabilityScore ?? 0,
                          };
                        })()}
                        onBack={() => setCurrentIndividualView(null)}
                      />
                    )}

                    {viewMode === "individual" && currentIndividualView === null && (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <User className="w-16 h-16 text-slate-400 dark:text-slate-600 mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Select a Resume to View
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md">
                          Click on any resume from the sidebar to see its detailed analysis and recommendations.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Analyzing Modal */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Animated Icon */}
              <div className="relative">
                <div className="absolute inset-0 animate-ping">
                  <div className="w-20 h-20 bg-indigo-500/30 rounded-full"></div>
                </div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Title */}
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Analyzing {filesBeingAnalyzed > 1 ? 'Resumes' : 'Resume'}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {analyzingProgress}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full">
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-[progress_2s_ease-in-out_infinite]"></div>
                </div>
              </div>

              {/* File Count */}
              {filesBeingAnalyzed > 1 && (
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <FileText className="w-4 h-4" />
                  <span>Processing {filesBeingAnalyzed} files</span>
                </div>
              )}

              {/* Info */}
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Please wait while our AI analyzes the {filesBeingAnalyzed > 1 ? 'resumes' : 'resume'}...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.isVisible && (
        <SideToast
          isVisible={toast.isVisible}
          type={toast.type}
          title={toast.title}
          description={toast.description}
          onClose={closeToast}
        />
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          handleRemoveFile();
          setIsModalOpen(false);
        }}
        title="Start New Analysis?"
        description="This will clear your current analysis. Are you sure?"
      />

      {/* Add animation keyframes */}
      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 75%;
            margin-left: 0%;
          }
          100% {
            width: 0%;
            margin-left: 100%;
          }
        }
      `}</style>
    </div>
  );
}
