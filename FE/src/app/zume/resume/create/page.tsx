"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useResumeStore } from "@/store/resume/resumeBuilderStore";
import Stepper, { Step } from "@/ui/Stepper"; 
import { ArrowLeft, FileText, Upload, Sparkles, CheckCircle2 } from "lucide-react";
import ConfirmModal from "@/ui/dialogModal"; 
import SideToast from "@/ui/Toast"; 
import { personalInfoSchema, workExperienceSchema, educationSchema } from "@/lib/validation"; 
import { ToastType } from "@/constants/toastData"; 

// ✅ IMPORT THE HANDLER
import { createResumeHandler } from "@/handler/createHandler";

import { PersonalDetails } from "./components/PersonalDetails";
import { WorkExperience } from "./components/WorkExperience";
import { Education } from "./components/Educations";
import { Skills } from "./components/Skills";
import { Projects } from "./components/Projects";

type CreationMode = "selection" | "scratch" | "upload";

export default function ResumeBuilderPage() {
  const router = useRouter();
  const [creationMode, setCreationMode] = useState<CreationMode>("selection");
  
  const { resumeData, resetStore, setErrors } = useResumeStore();

  // --- 1. TOAST STATE ---
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

  // --- 2. MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- VALIDATION LOGIC ---
  const validateStep = (currentStep: number): boolean => {
    setErrors({});
    
    // 1. Personal Info Validation (Step 1)
    if (currentStep === 1) {
      const result = personalInfoSchema.safeParse(resumeData.personalInfo);
      
      if (!result.success) {
        const newErrors: Record<string, string> = {};
        
        result.error.issues.forEach((issue) => {
          const fieldName = issue.path[0]?.toString();
          if (fieldName) {
            newErrors[fieldName] = issue.message;
          }
        });

        setErrors(newErrors);
        
        const firstError = result.error.issues[0];
        const firstErrorMessage = firstError?.message || "Invalid details";
        
        showToast("error", "Validation Failed", firstErrorMessage);
        return false;
      }
    }

    // 2. Work Experience Validation (Step 2)
    if (currentStep === 2) {
      if (resumeData.workExperience.length === 0) {
        showToast("error", "No Work Experience", "Please add at least one work experience entry.");
        return false;
      }
      for (let i = 0; i < resumeData.workExperience.length; i++) {
        const result = workExperienceSchema.safeParse(resumeData.workExperience[i]);
        if (!result.success) {
          const firstError = result.error?.issues?.[0];
          showToast("error", "Invalid Work Experience", `Entry ${i + 1}: ${firstError?.message}`);
          return false;
        }
      }
    }

    // 3. Education Validation (Step 3)
    if (currentStep === 3) {
      if (resumeData.education.length === 0) {
        showToast("error", "No Education", "Please add at least one education entry.");
        return false;
      }
      for (let i = 0; i < resumeData.education.length; i++) {
        const result = educationSchema.safeParse(resumeData.education[i]);
        if (!result.success) {
          const firstError = result.error?.issues?.[0];
          showToast("error", "Invalid Education", `Entry ${i + 1}: ${firstError?.message}`);
          return false;
        }
      }
    }

    // 4. Skills Validation (Step 4)
    if (currentStep === 4) {
      if (resumeData.technicalSkills.length === 0 && resumeData.softSkills.length === 0) {
        showToast("error", "No Skills Added", "Please add at least one technical or soft skill.");
        return false;
      }
    }

    return true; 
  };

  // --- HANDLERS ---

  const handleFinish = async () => {
    setIsCompleteModalOpen(true);
  };

  const confirmComplete = async () => {
    setIsSubmitting(true);
    
    try {

      // ✅ CALL THE API HANDLER
      const response = await createResumeHandler(resumeData);

      // Check the status returned by our handler
      if (response.status === 200 || response.status === 201) {
        // ✅ SUCCESS
        
        // 1. Clear Local Storage
        localStorage.removeItem("zume-resume-storage");
        
        // 2. Reset Store State
        resetStore();
        
        // 3. Show Success Message
        showToast("success", "Success", "Resume saved successfully!");

        // 4. Close Modal & Redirect
        setIsCompleteModalOpen(false);
        setTimeout(() => {
          router.push("/zume/dashboard");
        }, 1000);
      } else {
        // ❌ API ERROR (e.g. 401, 422, 500)
        throw new Error(response.message || "Unknown error occurred");
      }
      
    } catch (error: unknown) {
      console.error("Failed to save resume:", error);
      
      showToast(
        "error",
        "Save Failed",
        error instanceof Error ? error.message : "Could not save your resume. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExitClick = () => {
    const hasData = resumeData.personalInfo.fullName.length > 0;
    if (hasData) {
      setIsModalOpen(true);
    } else {
      router.push("/zume/dashboard");
    }
  };

  const confirmExit = () => {
    localStorage.removeItem("zume-resume-storage"); 
    resetStore();
    setIsModalOpen(false);
    router.push("/zume/dashboard");
  };

  // Selection Screen Component
  if (creationMode === "selection") {
    return (
      <div className="w-full h-screen overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-8">
        
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
          onClick={() => router.push("/zume/dashboard")}
          className="absolute top-8 left-4 md:left-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors z-10 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden md:inline">Back to Dashboard</span>
        </button>

        <div className="max-w-5xl mx-auto mt-20 md:mt-32">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              Create Your Resume
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose how you'd like to start building your professional resume
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            
            {/* Option 1: From Scratch */}
            <button
              onClick={() => setCreationMode("scratch")}
              className="group relative bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-2xl hover:scale-105 text-left"
            >
              <div className="absolute top-4 right-4 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  Build From Scratch
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Start with a blank canvas and create your resume step-by-step with our guided builder
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Step-by-step guidance</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>AI-powered suggestions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Professional templates</span>
                  </div>
                </div>

                <div className="mt-6 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm font-semibold text-blue-600 dark:text-blue-400 inline-block">
                  Recommended for beginners
                </div>
              </div>
            </button>

            {/* Option 2: Upload Existing */}
            <button
              onClick={() => setCreationMode("upload")}
              className="group relative bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300 hover:shadow-2xl hover:scale-105 text-left"
            >
              <div className="absolute top-4 right-4 w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  Upload Existing Resume
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Import your current resume and enhance it with AI-powered optimization and formatting
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Automatic data extraction</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>ATS score analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Smart improvements</span>
                  </div>
                </div>

                <div className="mt-6 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-sm font-semibold text-emerald-600 dark:text-emerald-400 inline-block">
                  Quick & efficient
                </div>
              </div>
            </button>

          </div>

          {/* Help Text */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Not sure which option to choose? Start from scratch for complete control, or upload to save time.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Upload Mode UI
  if (creationMode === "upload") {
    return (
      <div className="w-full h-screen overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
        
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
          onClick={() => setCreationMode("selection")}
          className="absolute top-8 left-4 md:left-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors z-10 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden md:inline">Back to Options</span>
        </button>

        <div className="max-w-4xl mx-auto mt-20">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 border border-gray-200 dark:border-gray-800 shadow-lg text-center">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Upload Your Resume
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Drop your resume file here or click to browse. We support PDF, DOC, and DOCX formats.
            </p>

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-12 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors cursor-pointer">
              <input 
                type="file" 
                accept=".pdf,.doc,.docx"
                className="hidden"
                id="resume-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    showToast("info", "Processing", `Uploading ${file.name}...`);
                    // TODO: Implement upload handler
                  }
                }}
              />
              <label 
                htmlFor="resume-upload"
                className="cursor-pointer"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      PDF, DOC, or DOCX (Max 5MB)
                    </p>
                  </div>
                </div>
              </label>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-500 mt-6">
              Your data is secure and will only be used to create your optimized resume
            </p>
          </div>
        </div>
      </div>
    );
  }

  // From Scratch Mode (existing stepper UI)

  // From Scratch Mode (existing stepper UI)
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
        title="Discard Changes?"
        description="This will clear your current progress. Are you sure?"
        confirmText="Discard & Leave"
        cancelText="Stay Here"
        type="danger"
      />

      {/* Complete Modal */}
      <ConfirmModal 
        isOpen={isCompleteModalOpen}
        onClose={() => !isSubmitting && setIsCompleteModalOpen(false)}
        onConfirm={confirmComplete}
        title={isSubmitting ? "Saving Resume..." : "Complete Resume?"}
        description={isSubmitting ? "Please wait while we save your resume to the cloud." : "Your resume will be saved and you'll be redirected to the dashboard."}
        confirmText="Save & Continue"
        cancelText="Review Again"
        type="success"
        isLoading={isSubmitting}
      />
      
      <Stepper
        initialStep={1}
        onBeforeNext={validateStep}
        onFinalStepCompleted={handleFinish}
        backButtonText="Back"
        nextButtonText="Next Step"
        className="w-full max-w-6xl mx-auto mt-12 md:mt-0"
        
        stepCircleContainerClassName="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl"
        stepContainerClassName="p-6 border-b border-slate-100 dark:border-slate-800"
        contentClassName="!p-8 md:!p-16 min-h-[500px]"
        footerClassName="p-8 border-t border-slate-100 dark:border-slate-800"
      >
        <Step><PersonalDetails /></Step>
        <Step><WorkExperience /></Step>
        <Step><Education /></Step>
        <Step><Skills /></Step>
        <Step><Projects /></Step>
      </Stepper>
    </div>
  );
}