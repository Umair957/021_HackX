// src/handlers/resumeHandler.ts

import axios from "axios";
import { ResumeData } from "@/types/typeResume"; 

export const createResumeHandler = async (resumeData: ResumeData) => {
  try {
    const payload = transformToBackend(resumeData);

    const response = await axios.post("/api/resumes/create", payload);

    return { 
      data: response.data, 
      message: "Resume saved successfully!", 
      status: response.status 
    };

  } catch (error: unknown) {
    const axiosError = error as { response?: { status: number; data?: { detail?: unknown } } };
    const status = axiosError.response?.status ?? 500;
    
    // ✅ IMPROVEMENT: Extract the specific validation details
    let errorMessage = "Failed to save resume.";
    
    if (status === 422) {
      const detail = axiosError.response?.data?.detail;
      console.error("VALIDATION ERROR DETAIL:", JSON.stringify(detail, null, 2));
      
      // Try to format the error nicely for the UI
      if (Array.isArray(detail)) {
        // detail looks like: [{ loc: ['body', 'education', 0, 'graduation_year'], msg: 'value is not a valid integer' }]
        const firstIssue = detail[0];
        const field = firstIssue.loc[firstIssue.loc.length - 1]; // e.g., 'graduation_year'
        errorMessage = `Validation Error: ${field} - ${firstIssue.msg}`;
      } else {
        errorMessage = "Validation Error: Check your inputs.";
      }
    } else if (status === 401) {
      errorMessage = "Session expired. Please log in again.";
    }

    return { message: errorMessage, status: status };
  }
};

// src/handlers/resumeHandler.ts

const transformToBackend = (data: ResumeData) => {
  const { personalInfo } = data;

  // Helper to safely parse dates - returns undefined if invalid (so field is excluded from payload)
  const safeDate = (dateStr: string | undefined | null) => {
    if (!dateStr || dateStr.trim() === "") return undefined;
    return dateStr; 
  };

  // Helper to safely parse integers
  const safeInt = (val: string | number | undefined | null) => {
    if (!val) return null;
    const parsed = parseInt(String(val));
    return isNaN(parsed) ? null : parsed;
  };

  return {
    full_name: personalInfo.fullName,
    headline: personalInfo.headline || null,
    phone: personalInfo.phone || null,
    summary: personalInfo.summary || null,
    
    location: personalInfo.location 
      ? { city: personalInfo.location.city || null, country: personalInfo.location.country || null } 
      : null,
    
    urls: personalInfo.urls || {},

    work_experience: data.workExperience.map((job) => {
      const startDate = safeDate(job.dates.startDate);
      const endDate = safeDate(job.dates.endDate);
      
      return {
        title: job.title,
        company: job.company,
        location: job.location || null,
        description: job.description || null,
        dates: {
          // Backend requires valid datetime - use today's date if empty
          start_date: startDate || new Date().toISOString().split('T')[0],
          end_date: endDate || null,
          is_current: job.dates.isCurrent || false
        }
      };
    }),

    education: data.education.map((edu) => ({
      institution: edu.institution,
      degree: edu.degree,
      field_of_study: edu.fieldOfStudy,
      // ✅ Fix: Ensure graduation_year is a number (use current year if missing/invalid)
      graduation_year: safeInt(edu.graduationYear) || new Date().getFullYear(),
      gpa: edu.gpa ?? null
    })),

    technical_skills: data.technicalSkills,
    soft_skills: data.softSkills,

    languages: data.languages.map((lang) => ({
      name: lang.name,
      level: lang.level
    })),

    certifications: data.certifications.map((cert) => {
      const certData: { name: string; issuer: string; date?: string } = {
        name: cert.name,
        issuer: cert.issuer
      };
      
      const date = safeDate(cert.date);
      if (date !== undefined) certData.date = date;
      
      return certData;
    }),

    projects: data.projects.map((proj) => {
      const dates: { start_date?: string; end_date?: string } = {};
      
      if (proj.dates) {
        const startDate = safeDate(proj.dates.startDate);
        const endDate = safeDate(proj.dates.endDate);
        
        if (startDate !== undefined) dates.start_date = startDate;
        if (endDate !== undefined) dates.end_date = endDate;
      }
      
      return {
        name: proj.name,
        description: proj.description || null,
        technologies: proj.technologies || [],
        url: proj.url || null,
        dates: Object.keys(dates).length > 0 ? dates : null
      };
    }),

    preferences: {
      desired_titles: data.preferences.desiredTitles || [],
      target_industries: data.preferences.targetIndustries || [],
      work_mode: data.preferences.workMode || null,
      min_salary: safeInt(data.preferences.minSalary),
      max_salary: safeInt(data.preferences.maxSalary),
      currency: data.preferences.currency || "USD",
      relocation: data.preferences.relocation || false
    }
  };
};