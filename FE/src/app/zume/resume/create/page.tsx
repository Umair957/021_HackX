"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useResumeStore } from "@/store/resume/resumeBuilderStore";
import Stepper, { Step } from "@/ui/Stepper"; 
import { ArrowLeft } from "lucide-react";
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

export default function ResumeBuilderPage() {
  const router = useRouter();
  
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