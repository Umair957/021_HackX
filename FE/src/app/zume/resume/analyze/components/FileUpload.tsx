"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, X, AlertCircle, Briefcase, FileSearch } from "lucide-react";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  jobTitle: string;
  setJobTitle: (title: string) => void;
  jobDescription: string;
  setJobDescription: (description: string) => void;
}

export function FileUpload({ onFileUpload, jobTitle, setJobTitle, jobDescription, setJobDescription }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const maxSize = 5 * 1024 * 1024; // 5MB

  const validateFile = (file: File): boolean => {
    setError("");

    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Please upload PDF or Word documents only.");
      return false;
    }

    if (file.size > maxSize) {
      setError("File size exceeds 5MB limit. Please upload a smaller file.");
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      setError("");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Job Details Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Target Job Details (Optional)
          </h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Provide job details for more accurate, role-specific analysis
        </p>

        {/* Job Title Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <FileSearch className="w-4 h-4" />
            Job Title
          </label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g., Senior Software Engineer, Data Scientist"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
          />
        </div>

        {/* Job Description Textarea */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here... Include key requirements, responsibilities, and qualifications."
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all resize-none"
          />
          <p className="text-xs text-slate-400">
            Adding a job description helps AI analyze your resume against specific role requirements
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer
          ${isDragging 
            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/10 scale-[1.02]" 
            : error
            ? "border-red-300 bg-red-50 dark:bg-red-900/10"
            : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/50 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-900/5"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {!selectedFile ? (
          <div className="text-center space-y-4">
            <div className={`
              inline-flex items-center justify-center w-16 h-16 rounded-full transition-colors duration-300
              ${error 
                ? "bg-red-100 dark:bg-red-900/20" 
                : "bg-purple-100 dark:bg-purple-900/20"
              }
            `}>
              {error ? (
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              ) : (
                <Upload className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                {isDragging ? "Drop your resume here" : "Upload Your Resume"}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Drag and drop or <span className="text-purple-600 dark:text-purple-400 font-semibold">click to browse</span>
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                PDF, DOC, DOCX
              </span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span>Max 5MB</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{selectedFile.name}</p>
                <p className="text-sm text-slate-500">
                  {(selectedFile.size / 1024).toFixed(2)} KB • {selectedFile.type.split("/")[1].toUpperCase()}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl animate-in slide-in-from-top-2 duration-300">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900 dark:text-red-100 text-sm">Upload Error</p>
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Action Button */}
      {selectedFile && !error && (
        <button
          onClick={handleUpload}
          className="w-full px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 hover:scale-[1.02] animate-in slide-in-from-bottom-2 duration-300"
        >
          Analyze Resume with AI
        </button>
      )}

      {/* Info Section */}
      <div className="grid md:grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
        <InfoCard
          icon="🎯"
          title="ATS Score"
          description="Check how well your resume passes applicant tracking systems"
        />
        <InfoCard
          icon="💡"
          title="Smart Suggestions"
          description="Get actionable tips to improve your resume content"
        />
        <InfoCard
          icon="📊"
          title="Detailed Analysis"
          description="View comprehensive breakdown of strengths and weaknesses"
        />
      </div>
    </div>
  );
}

function InfoCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800">
      <div className="text-2xl mb-2">{icon}</div>
      <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}
