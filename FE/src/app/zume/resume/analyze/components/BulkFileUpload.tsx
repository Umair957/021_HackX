"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, X, AlertCircle, Users, Check, Loader2 } from "lucide-react";

interface BulkFileUploadProps {
  onFilesUpload: (files: File[]) => void;
  jobTitle: string;
  setJobTitle: (title: string) => void;
  jobDescription: string;
  setJobDescription: (description: string) => void;
  maxFiles?: number;
}

interface FileWithStatus {
  file: File;
  status: "pending" | "valid" | "error";
  error?: string;
}

export function BulkFileUpload({ 
  onFilesUpload, 
  jobTitle, 
  setJobTitle, 
  jobDescription, 
  setJobDescription,
  maxFiles = 10
}: BulkFileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileWithStatus[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const maxSize = 5 * 1024 * 1024; // 5MB per file

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: "Invalid file type. PDF or Word only." };
    }

    if (file.size > maxSize) {
      return { valid: false, error: "File exceeds 5MB limit." };
    }

    return { valid: true };
  };

  const handleFilesSelect = (files: FileList) => {
    const newFiles: FileWithStatus[] = [];
    const existingNames = selectedFiles.map(f => f.file.name);

    Array.from(files).forEach((file) => {
      // Check if file already added
      if (existingNames.includes(file.name)) {
        return;
      }

      // Check max files limit
      if (selectedFiles.length + newFiles.length >= maxFiles) {
        return;
      }

      const validation = validateFile(file);
      newFiles.push({
        file,
        status: validation.valid ? "valid" : "error",
        error: validation.error,
      });
    });

    setSelectedFiles([...selectedFiles, ...newFiles]);
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

    if (e.dataTransfer.files) {
      handleFilesSelect(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFilesSelect(e.target.files);
      // Reset input to allow selecting the same files again if needed
      e.target.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleAnalyze = () => {
    const validFiles = selectedFiles
      .filter(f => f.status === "valid")
      .map(f => f.file);

    if (validFiles.length > 0) {
      onFilesUpload(validFiles);
    }
  };

  const validFilesCount = selectedFiles.filter(f => f.status === "valid").length;
  const errorFilesCount = selectedFiles.filter(f => f.status === "error").length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Bulk Resume Analysis</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Upload up to {maxFiles} resumes to analyze at once
          </p>
        </div>
      </div>

      {/* Job Context (Optional) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <AlertCircle className="w-4 h-4" />
          <span>Job Context (Optional - applies to all resumes)</span>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Job Title
            </label>
            <input
              type="text"
              placeholder="e.g., Senior Software Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Job Description
          </label>
          <textarea
            placeholder="Paste the job description here to analyze resumes against specific requirements..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>

      {/* File Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all
          ${isDragging 
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10" 
            : "border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 bg-slate-50 dark:bg-slate-900/50"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {selectedFiles.length === 0 
                ? "Click here to select multiple resumes" 
                : "Click to add more resumes"}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Supports PDF, DOC, DOCX • Max 5MB per file • Up to {maxFiles} files
            </p>
            {selectedFiles.length === 0 && (
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-2">
                💡 Tip: Hold Ctrl/Cmd to select multiple files at once
              </p>
            )}
          </div>

          {selectedFiles.length > 0 && (
            <div className="flex items-center justify-center gap-4 text-sm font-medium">
              <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                <Check className="w-4 h-4" /> {validFilesCount} Valid
              </span>
              {errorFilesCount > 0 && (
                <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                  <X className="w-4 h-4" /> {errorFilesCount} Errors
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Selected Resumes ({selectedFiles.length}/{maxFiles})
            </h4>
            {selectedFiles.length < maxFiles && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/30 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Add More Files
              </button>
            )}
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {selectedFiles.map((fileItem, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  fileItem.status === "valid"
                    ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
                }`}
              >
                <div className={`p-2 rounded-lg flex-shrink-0 ${
                  fileItem.status === "valid"
                    ? "bg-green-100 dark:bg-green-900/20"
                    : "bg-red-100 dark:bg-red-900/20"
                }`}>
                  {fileItem.status === "valid" ? (
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {fileItem.file.name}
                  </p>
                  {fileItem.error ? (
                    <p className="text-xs text-red-600 dark:text-red-400">{fileItem.error}</p>
                  ) : (
                    <p className="text-xs text-slate-500">
                      {(fileItem.file.size / 1024).toFixed(2)} KB
                    </p>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(index);
                  }}
                  className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analyze Button */}
      {selectedFiles.length > 0 && (
        <button
          onClick={handleAnalyze}
          disabled={validFilesCount === 0}
          className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/20 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <FileText className="w-5 h-5" />
          Analyze {validFilesCount} Resume{validFilesCount !== 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}
