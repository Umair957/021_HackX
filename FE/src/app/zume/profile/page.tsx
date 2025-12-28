"use client";

import { useState, useEffect, useCallback } from "react";
import { User, Briefcase, GraduationCap, Code, FolderGit2, Settings, CheckCircle2, Loader2, Plus, Trash2, Linkedin, Github, Globe, Twitter } from "lucide-react";
import { debounce } from "lodash";
import { 
  ExperienceSection, 
  SkillsSection, 
  ProjectsSection, 
  PreferencesSection,
  type Education,
  type WorkExperience,
  type Skills,
  type Project,
  type JobPreferences
} from "./page_components";

// Types
interface PersonalInfo {
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  title?: string;
  bio?: string;
  photo_url?: string;
}

interface SocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  twitter?: string;
  website?: string;
}

interface ProfileData {
  personal_info?: PersonalInfo;
  social_links?: SocialLinks;
  education: Education[];
  work_experience: WorkExperience[];
  skills?: Skills;
  projects: Project[];
  job_preferences?: JobPreferences;
  profile_completeness: number;
}

type TabType = "personal" | "social" | "education" | "experience" | "skills" | "projects" | "preferences";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("personal");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Fetch profile
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      const result = await response.json();
      if (result.status === "success") {
        setProfile(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced auto-save
  const saveProfile = async (data: ProfileData) => {
      setSaving(true);
      try {
        const response = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (result.status === "success") {
          setProfile(result.data);
          setLastSaved(new Date());
        }
      } catch (error) {
        console.error("Failed to save profile:", error);
      } finally {
        setSaving(false);
      }
    };

  const debouncedSave = useCallback(debounce(saveProfile, 1000), []);

  const updateProfile = (updates: Partial<ProfileData>) => {
    const updated = { ...profile, ...updates } as ProfileData;
    setProfile(updated);
    debouncedSave(updated);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const tabs = [
    { id: "personal" as TabType, label: "Personal Info", icon: User },
    { id: "social" as TabType, label: "Social Links", icon: Globe },
    { id: "education" as TabType, label: "Education", icon: GraduationCap },
    { id: "experience" as TabType, label: "Work Experience", icon: Briefcase },
    { id: "skills" as TabType, label: "Skills", icon: Code },
    { id: "projects" as TabType, label: "Projects", icon: FolderGit2 },
    { id: "preferences" as TabType, label: "Job Preferences", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
              <p className="text-gray-600 dark:text-gray-400">Complete your profile to get better job matches</p>
            </div>
            <div className="flex items-center gap-4">
              {saving && (
                <div className="flex items-center gap-2 text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Saving...</span>
                </div>
              )}
              {lastSaved && !saving && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm">Saved {lastSaved.toLocaleTimeString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile Completeness</span>
              <span className="text-2xl font-bold text-blue-600">{profile?.profile_completeness || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${profile?.profile_completeness || 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {activeTab === "personal" && (
              <PersonalInfoSection
                data={profile?.personal_info}
                onChange={(data) => updateProfile({ personal_info: data })}
              />
            )}
            {activeTab === "social" && (
              <SocialLinksSection
                data={profile?.social_links}
                onChange={(data) => updateProfile({ social_links: data })}
              />
            )}
            {activeTab === "education" && (
              <EducationSection
                data={profile?.education || []}
                onChange={(data) => updateProfile({ education: data })}
              />
            )}
            {activeTab === "experience" && (
              <ExperienceSection
                data={profile?.work_experience || []}
                onChange={(data) => updateProfile({ work_experience: data })}
              />
            )}
            {activeTab === "skills" && (
              <SkillsSection
                data={profile?.skills}
                onChange={(data) => updateProfile({ skills: data })}
              />
            )}
            {activeTab === "projects" && (
              <ProjectsSection
                data={profile?.projects || []}
                onChange={(data) => updateProfile({ projects: data })}
              />
            )}
            {activeTab === "preferences" && (
              <PreferencesSection
                data={profile?.job_preferences}
                onChange={(data) => updateProfile({ job_preferences: data })}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Personal Info Section Component
function PersonalInfoSection({ data, onChange }: { data?: PersonalInfo; onChange: (data: PersonalInfo) => void }) {
  const [formData, setFormData] = useState<PersonalInfo>(data || {
    full_name: "",
    email: "",
    phone: "",
    location: "",
    title: "",
    bio: "",
    photo_url: ""
  });

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) => handleChange("full_name", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location
          </label>
          <input
            type="text"
            value={formData.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="San Francisco, CA"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Professional Title
          </label>
          <input
            type="text"
            value={formData.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Senior Software Engineer"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bio
          </label>
          <textarea
            value={formData.bio || ""}
            onChange={(e) => handleChange("bio", e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Tell us about yourself..."
            maxLength={500}
          />
          <p className="text-sm text-gray-500 mt-1">{(formData.bio || "").length}/500 characters</p>
        </div>
      </div>
    </div>
  );
}

// Social Links Section Component
function SocialLinksSection({ data, onChange }: { data?: SocialLinks; onChange: (data: SocialLinks) => void }) {
  const [formData, setFormData] = useState<SocialLinks>(data || {});

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  const handleChange = (field: keyof SocialLinks, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onChange(updated);
  };

  const links = [
    { key: "linkedin" as keyof SocialLinks, label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/in/yourprofile" },
    { key: "github" as keyof SocialLinks, label: "GitHub", icon: Github, placeholder: "https://github.com/yourusername" },
    { key: "portfolio" as keyof SocialLinks, label: "Portfolio", icon: Globe, placeholder: "https://yourportfolio.com" },
    { key: "twitter" as keyof SocialLinks, label: "Twitter/X", icon: Twitter, placeholder: "https://twitter.com/yourhandle" },
    { key: "website" as keyof SocialLinks, label: "Personal Website", icon: Globe, placeholder: "https://yourwebsite.com" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Social Links</h2>
      
      <div className="space-y-4">
        {links.map((link) => (
          <div key={link.key}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <link.icon className="w-4 h-4" />
              {link.label}
            </label>
            <input
              type="url"
              value={formData[link.key] || ""}
              onChange={(e) => handleChange(link.key, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder={link.placeholder}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Due to size limits, I'll create the remaining section components in separate parts...
// Education Section Component
function EducationSection({ data, onChange }: { data: Education[]; onChange: (data: Education[]) => void }) {
  const addEducation = () => {
    onChange([...data, {
      institution: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      currently_studying: false,
      grade: "",
      description: ""
    }]);
  };

  const updateEducation = (index: number, field: keyof Education, value: string | boolean) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeEducation = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Education</h2>
        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Education
        </button>
      </div>

      <div className="space-y-6">
        {data.map((edu, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Education {index + 1}</h3>
              <button
                onClick={() => removeEducation(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Institution *</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, "institution", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="University of Example"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Degree *</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, "degree", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Bachelor's"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Field of Study</label>
                <input
                  type="text"
                  value={edu.field_of_study || ""}
                  onChange={(e) => updateEducation(index, "field_of_study", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Computer Science"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                <input
                  type="date"
                  value={edu.start_date || ""}
                  onChange={(e) => updateEducation(index, "start_date", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                <input
                  type="date"
                  value={edu.end_date || ""}
                  onChange={(e) => updateEducation(index, "end_date", e.target.value)}
                  disabled={edu.currently_studying}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                />
              </div>

              <div className="flex items-center gap-2 md:col-span-2">
                <input
                  type="checkbox"
                  checked={edu.currently_studying}
                  onChange={(e) => updateEducation(index, "currently_studying", e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">Currently studying here</label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  value={edu.description || ""}
                  onChange={(e) => updateEducation(index, "description", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Relevant coursework, achievements, etc."
                />
              </div>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No education entries yet. Click &ldquo;Add Education&rdquo; to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

