// --- Shared Sub-Models ---

export interface DateRange {
  startDate: string | null; // stored as ISO string or YYYY-MM
  endDate: string | null;
  isCurrent: boolean;
}

export interface Location {
  city?: string;
  country?: string;
  remote?: boolean;
}

export interface SocialUrls {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  twitter?: string;
}

// --- Main Sections ---

export interface PersonalInfo {
  fullName: string;
  headline?: string;
  phone?: string;
  email: string; // Not in your Candidate model but needed for contact
  location?: Location;
  summary?: string;
  urls?: SocialUrls;
}

export interface WorkExperience {
  id: string; // Frontend only (for React keys/deletion)
  title: string;
  company: string;
  location?: string;
  dates: DateRange;
  description?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: number;
  gpa?: number;
}

export interface Language {
  id: string;
  name: string;
  level: string; // "Native", "B2", "Professional"
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string; // datetime string
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  technologies: string[];
  url?: string;
  dates?: DateRange;
}

export interface Preferences {
  desiredTitles: string[];
  targetIndustries: string[];
  workMode?: "remote" | "hybrid" | "onsite";
  minSalary?: number;
  maxSalary?: number;
  currency: string;
  relocation: boolean;
}

// --- The Master State Object ---
export interface ResumeData {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  technicalSkills: string[];
  softSkills: string[];
  languages: Language[];
  certifications: Certification[];
  projects: Project[];
  preferences: Preferences;
}