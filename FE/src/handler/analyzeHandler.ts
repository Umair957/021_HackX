// src/handlers/analyzeHandler.ts

import axios from "axios";

export interface AnalysisResponse {
  status: string;
  message: string;
  file_info?: {
    filename: string;
    size_kb: number;
    temp_path: string;
    user_id: string;
  };
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
}

export interface AnalysisHistoryItem {
  id: string;
  file_name: string;
  file_size: number;
  job_title: string | null;
  has_job_description: boolean;
  scores: {
    overall: number;
    ats: number;
    formatting: number;
    keywords: number;
  };
  analyzed_at: string;
}

export interface AnalysisHistoryResponse {
  status: string;
  total: number;
  limit: number;
  skip: number;
  analyses: AnalysisHistoryItem[];
}

export interface DetailedAnalysisResponse {
  status: string;
  analysis: {
    id: string;
    file_info: {
      name: string;
      size: number;
      type: string;
    };
    job_context: {
      job_title: string | null;
      job_description: string | null;
    };
    scores: {
      overall_score: number;
      ats_score: number;
      formatting_score: number;
      content_quality_score: number;
      keyword_optimization_score: number;
    };
    strengths: string[];
    weaknesses: string[];
    improvement_suggestions: {
      category: string;
      suggestion: string;
      priority: string;
    }[];
    professional_links?: string[];
    online_info?: string;
    analyzed_at: string;
  };
}

export const analyzeResumeHandler = async (file: File, jobTitle?: string, jobDescription?: string) => {
  try {
    // Create FormData to send file
    const formData = new FormData();
    formData.append('file', file);
    
    // Add job details if provided
    if (jobTitle) {
      formData.append('job_title', jobTitle);
    }
    if (jobDescription) {
      formData.append('job_description', jobDescription);
    }

    // Send to Next.js API route (which forwards to FastAPI)
    const response = await axios.post<AnalysisResponse>("/api/resumes/analyze", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return { 
      data: response.data, 
      message: "Resume analyzed successfully!", 
      status: response.status 
    };

  } catch (error: any) {
    const status = error.response ? error.response.status : 500;
    
    let errorMessage = "Failed to analyze resume.";
    
    if (status === 400) {
      // Bad request - probably file validation error
      errorMessage = error.response?.data?.error || error.response?.data?.detail || "Invalid file. Please check file type and size.";
    } else if (status === 401) {
      errorMessage = "Session expired. Please log in again.";
    } else if (status === 413) {
      errorMessage = "File too large. Maximum size is 5MB.";
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    }

    console.error("Resume Analysis Error:", error);

    return { 
      message: errorMessage, 
      status: status,
      data: null
    };
  }
};

export const getAnalysisHistoryHandler = async (limit: number = 10, skip: number = 0): Promise<AnalysisHistoryResponse> => {
  try {
    const response = await axios.get<AnalysisHistoryResponse>("/api/resumes/history", {
      params: { limit, skip },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching analysis history:", error);
    throw error;
  }
};

export const getAnalysisDetailHandler = async (analysisId: string): Promise<DetailedAnalysisResponse> => {
  try {
    const response = await axios.get<DetailedAnalysisResponse>(`/api/resumes/history/${analysisId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching analysis detail:", error);
    throw error;
  }
};
