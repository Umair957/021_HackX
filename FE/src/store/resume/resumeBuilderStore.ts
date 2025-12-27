import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  ResumeData, 
  PersonalInfo, 
  WorkExperience, 
  Education, 
  Language, 
  Project, 
  Certification, 
  Preferences 
} from '@/types/typeResume';

interface ResumeStore {
  // --- STATE ---
  currentStep: number;
  resumeData: ResumeData;

  // ✅ NEW: Global Error State for Validation
  errors: Record<string, string>; 

  // --- ACTIONS ---
  
  // Error Handling
  setErrors: (newErrors: Record<string, string>) => void;
  clearError: (key: string) => void;

  // Navigation
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;

  // Sections
  setPersonalInfo: (data: Partial<PersonalInfo>) => void;
  
  // Experience
  addExperience: (item: WorkExperience) => void;
  removeExperience: (id: string) => void;
  updateExperience: (id: string, data: Partial<WorkExperience>) => void;

  // Education
  addEducation: (item: Education) => void;
  removeEducation: (id: string) => void;

  // Skills
  addTechnicalSkill: (skill: string) => void;
  removeTechnicalSkill: (skill: string) => void;
  addSoftSkill: (skill: string) => void;
  removeSoftSkill: (skill: string) => void;

  // Projects
  addProject: (item: Project) => void;
  removeProject: (id: string) => void;

  // Languages & Certs
  addLanguage: (item: Language) => void;
  removeLanguage: (id: string) => void;
  addCertification: (item: Certification) => void;
  removeCertification: (id: string) => void;

  // Preferences
  setPreferences: (data: Partial<Preferences>) => void;

  // Reset
  resetStore: () => void;
}

const initialResumeState: ResumeData = {
  personalInfo: {
    fullName: "",
    email: "", 
    headline: "",
    phone: "",
    summary: "",
    urls: { linkedin: "", github: "", portfolio: "" },
    location: { city: "", country: "", remote: false }
  },
  workExperience: [],
  education: [],
  technicalSkills: [],
  softSkills: [],
  languages: [],
  certifications: [],
  projects: [],
  preferences: {
    desiredTitles: [],
    targetIndustries: [],
    currency: "PKR",
    relocation: false,
    workMode: "hybrid",
    minSalary: 0,
    maxSalary: 0
  }
};

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      currentStep: 1,
      resumeData: initialResumeState,
      
      // ✅ NEW: Error Logic Implementation
      errors: {},
      setErrors: (newErrors) => set({ errors: newErrors }),
      clearError: (key) => set((state) => {
        // Create a copy of errors and remove the specific key
        const newErrors = { ...state.errors };
        delete newErrors[key];
        return { errors: newErrors };
      }),

      // --- Navigation ---
      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
      prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),
      setStep: (step) => set({ currentStep: step }),

      // --- Personal Info ---
      setPersonalInfo: (data) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            personalInfo: { 
              ...state.resumeData.personalInfo, 
              ...data,
              // Deep merge nested objects
              urls: { ...state.resumeData.personalInfo.urls, ...data.urls },
              location: { ...state.resumeData.personalInfo.location, ...data.location }
            },
          },
        })),

      // --- Experience ---
      addExperience: (item) =>
        set((state) => ({
          resumeData: { ...state.resumeData, workExperience: [...state.resumeData.workExperience, item] },
        })),
      removeExperience: (id) =>
        set((state) => ({
          resumeData: { ...state.resumeData, workExperience: state.resumeData.workExperience.filter(i => i.id !== id) },
        })),
      updateExperience: (id, data) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            workExperience: state.resumeData.workExperience.map((item) => 
              item.id === id ? { ...item, ...data } : item
            )
          }
        })),

      // --- Education ---
      addEducation: (item) =>
        set((state) => ({
          resumeData: { ...state.resumeData, education: [...state.resumeData.education, item] },
        })),
      removeEducation: (id) =>
        set((state) => ({
          resumeData: { ...state.resumeData, education: state.resumeData.education.filter(i => i.id !== id) },
        })),

      // --- Skills ---
      addTechnicalSkill: (skill) =>
        set((state) => ({
          resumeData: { ...state.resumeData, technicalSkills: [...state.resumeData.technicalSkills, skill] },
        })),
      removeTechnicalSkill: (skill) =>
        set((state) => ({
          resumeData: { ...state.resumeData, technicalSkills: state.resumeData.technicalSkills.filter(s => s !== skill) },
        })),
      addSoftSkill: (skill) =>
        set((state) => ({
          resumeData: { ...state.resumeData, softSkills: [...state.resumeData.softSkills, skill] },
        })),
      removeSoftSkill: (skill) =>
        set((state) => ({
          resumeData: { ...state.resumeData, softSkills: state.resumeData.softSkills.filter(s => s !== skill) },
        })),

      // --- Projects ---
      addProject: (item) =>
        set((state) => ({
          resumeData: { ...state.resumeData, projects: [...state.resumeData.projects, item] },
        })),
      removeProject: (id) =>
        set((state) => ({
          resumeData: { ...state.resumeData, projects: state.resumeData.projects.filter(i => i.id !== id) },
        })),

      // --- Languages & Certs ---
      addLanguage: (item) =>
        set((state) => ({
          resumeData: { ...state.resumeData, languages: [...state.resumeData.languages, item] },
        })),
      removeLanguage: (id) =>
        set((state) => ({
          resumeData: { ...state.resumeData, languages: state.resumeData.languages.filter(i => i.id !== id) },
        })),
      addCertification: (item) =>
        set((state) => ({
          resumeData: { ...state.resumeData, certifications: [...state.resumeData.certifications, item] },
        })),
      removeCertification: (id) =>
        set((state) => ({
          resumeData: { ...state.resumeData, certifications: state.resumeData.certifications.filter(i => i.id !== id) },
        })),

      // --- Preferences ---
      setPreferences: (data) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            preferences: { ...state.resumeData.preferences, ...data }
          },
        })),

      resetStore: () => set({ currentStep: 1, resumeData: initialResumeState, errors: {} }),
    }),
    {
      name: 'zume-resume-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);