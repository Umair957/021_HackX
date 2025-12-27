"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, FileText, Sparkles } from "lucide-react";
import ConfirmModal from "@/ui/dialogModal";
import SideToast from "@/ui/Toast";
import { ToastType } from "@/constants/toastData";
import { FileUpload } from "./components/FileUpload";
import { AnalysisResults } from "./components/AnalysisResults";
import { ImprovementSuggestions } from "./components/ImprovementSuggestions";
import { OnlinePresence } from "./components/OnlinePresence";
import { analyzeResumeHandler } from "@/handler/analyzeHandler";

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

export default function AnalyzeResumePage() {
  const router = useRouter();
  
  // --- STATE ---
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");

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

  // --- HANDLERS ---
  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsAnalyzing(true);

    try {
      console.log("Uploading resume for analysis:", file.name);

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
        showToast("success", "Analysis Complete", "Your resume has been analyzed successfully!");
      } else {
        // API ERROR
        throw new Error(response.message || "Unknown error occurred");
      }
    } catch (error: any) {
      console.error("Analysis failed:", error);
      showToast("error", "Analysis Failed", error.message || "Could not analyze your resume. Please try again.");
      setUploadedFile(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setAnalysisData(null);
  };

  const handleExitClick = () => {
    if (uploadedFile || analysisData) {
      setIsModalOpen(true);
    } else {
      router.push("/zume/dashboard");
    }
  };

  const confirmExit = () => {
    setIsModalOpen(false);
    router.push("/zume/dashboard");
  };

  const handleReanalyze = () => {
    setUploadedFile(null);
    setAnalysisData(null);
    showToast("info", "Ready for New Analysis", "Upload a new resume to analyze");
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 md:p-8 relative">
      
      {/* Toast Notification Layer */}
      <SideToast 
        type={toast.type} 
        title={toast.title} 
        description={toast.description} 
        isVisible={toast.isVisible} 
        onClose={closeToast} 
      />

      {/* Exit Button */}
      <button 
        onClick={handleExitClick}
        className="absolute top-8 left-4 md:left-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors z-10 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden md:inline">Back to Dashboard</span>
      </button>

      {/* Confirmation Modal */}
      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmExit}
        title="Leave Analysis?"
        description="Your current analysis will be lost. Are you sure?"
        confirmText="Leave"
        cancelText="Stay Here"
        type="danger"
      />

      {/* Main Content Container */}
      <div className="w-full max-w-7xl mx-auto mt-12 md:mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header */}
        <div className="text-center space-y-4 pt-8 md:pt-12">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">AI-Powered Analysis</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">
            Analyze Your Resume
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Get instant AI-powered feedback, ATS compatibility scores, and actionable suggestions to improve your resume.
          </p>
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden">
          
          {!uploadedFile && !analysisData && (
            <div className="p-8 md:p-16">
              <FileUpload 
                onFileUpload={handleFileUpload}
                jobTitle={jobTitle}
                setJobTitle={setJobTitle}
                jobDescription={jobDescription}
                setJobDescription={setJobDescription}
              />
            </div>
          )}

          {isAnalyzing && (
            <div className="p-8 md:p-16 flex flex-col items-center justify-center min-h-[500px] space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-purple-200 dark:border-purple-800 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin"></div>
                <FileText className="absolute inset-0 m-auto w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Analyzing Your Resume...
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Our AI is reviewing your resume. This may take a few moments.
                </p>
              </div>
            </div>
          )}

          {!isAnalyzing && analysisData && (
            <div className="p-8 md:p-12 space-y-8">
              {/* File Info */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{uploadedFile?.name}</p>
                    <p className="text-sm text-slate-500">
                      {uploadedFile && (uploadedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleReanalyze}
                  className="px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                >
                  Analyze New Resume
                </button>
              </div>

              {/* Analysis Results */}
              <AnalysisResults data={analysisData} />

              {/* Online Presence (if available) */}
              <OnlinePresence 
                professionalLinks={analysisData.professionalLinks}
                onlineInfo={analysisData.onlineInfo}
              />

              {/* Improvement Suggestions */}
              <ImprovementSuggestions suggestions={analysisData.suggestions} />

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-4 pt-8 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => router.push("/zume/resume/create")}
                  className="flex-1 px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-purple-500/20"
                >
                  Create Optimized Resume
                </button>
                <button
                  onClick={handleReanalyze}
                  className="flex-1 px-6 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-xl transition-colors"
                >
                  Analyze Another Resume
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
