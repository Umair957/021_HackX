"use client";

import React from "react";
import { useResumeStore } from "@/store/resume/resumeBuilderStore";
import { User, MapPin, Mail, Phone, Globe, Linkedin, Github, LayoutTemplate, Sparkles, AlertCircle } from "lucide-react";

export function PersonalDetails() {
  const { resumeData, setPersonalInfo, errors, clearError } = useResumeStore();
  const { personalInfo } = resumeData;

  // Debug: Log errors whenever they change
  console.log("Current errors in PersonalDetails:", errors);

  // --- Helper: Dynamic Styles ---
  // Returns red border if error exists, otherwise standard gray/blue
  const getInputClass = (fieldKey: string) => {
    const hasError = !!errors[fieldKey];
    return `
      w-full pl-11 p-3.5 rounded-xl border outline-none transition-all duration-200
      ${hasError 
        ? "bg-red-50 dark:bg-red-900/10 border-red-500 text-red-900 dark:text-red-100 placeholder:text-red-300 focus:ring-2 focus:ring-red-500/20" 
        : "bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 dark:hover:border-slate-700"
      }
    `;
  };

  const getIconClass = (fieldKey: string) => {
    const hasError = !!errors[fieldKey];
    return `absolute left-3.5 top-3.5 w-5 h-5 transition-colors duration-200 ${
      hasError ? "text-red-500" : "text-slate-400 group-focus-within:text-blue-500"
    }`;
  };

  const labelClass = "text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1";

  // --- Handlers ---
  
  // 1. General Handler for strings
  const handleChange = (field: string, value: string) => {
    setPersonalInfo({ [field]: value });
    // If there was an error, clear it as soon as user types
    if (errors[field]) clearError(field);
  };

  // 2. Nested Handler for URLs
  const handleUrlChange = (field: string, value: string) => {
    setPersonalInfo({ 
      urls: { ...personalInfo.urls, [field]: value } 
    });
    // Note: Zod path for urls is usually "urls.linkedin", but simple mapping might pass "linkedin"
    // Adjust based on how your page.tsx maps the error.
    if (errors[field] || errors[`urls.${field}`]) clearError(field);
  };

  // 3. Nested Handler for Location
  const handleLocationChange = (field: string, value: string) => {
    setPersonalInfo({ 
      location: { ...personalInfo.location, [field]: value } 
    });
    if (errors[field] || errors[`location.${field}`]) clearError(field);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Personal Details
                <Sparkles className="w-5 h-5 text-blue-500" />
            </h2>
            <p className="text-slate-500 mt-1">Start with the basics. How can employers contact you?</p>
        </div>
      </div>

      {/* 1. Identity Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Identity</h3>
        <div className="grid md:grid-cols-2 gap-5">
            
            {/* Full Name (Required) */}
            <div className="space-y-2 group">
                <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                <div className="relative">
                    <User className={getIconClass("fullName")} />
                    <input 
                        className={getInputClass("fullName")}
                        placeholder="e.g. John Doe"
                        value={personalInfo.fullName}
                        onChange={(e) => handleChange("fullName", e.target.value)}
                    />
                    {errors.fullName && (
                        <div className="absolute right-3 top-3.5 text-red-500 animate-in zoom-in">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                    )}
                </div>
                {errors.fullName && <p className="text-xs text-red-500 font-medium ml-1">{errors.fullName}</p>}
            </div>

            {/* Headline */}
            <div className="space-y-2 group">
                <label className={labelClass}>Headline</label>
                <div className="relative">
                    <LayoutTemplate className={getIconClass("headline")} />
                    <input 
                        className={getInputClass("headline")}
                        placeholder="e.g. Senior Full Stack Engineer"
                        value={personalInfo.headline || ""}
                        onChange={(e) => handleChange("headline", e.target.value)}
                    />
                </div>
            </div>
        </div>
      </div>

      {/* 2. Contact Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Contact & Location</h3>
        <div className="grid md:grid-cols-2 gap-5">
            
            {/* Email (Required) */}
            <div className="space-y-2 group">
                <label className={labelClass}>Email Address <span className="text-red-500">*</span></label>
                <div className="relative">
                    <Mail className={getIconClass("email")} />
                    <input 
                        type="email"
                        className={getInputClass("email")}
                        placeholder="john@example.com"
                        value={personalInfo.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                    />
                    {errors.email && (
                        <div className="absolute right-3 top-3.5 text-red-500 animate-in zoom-in">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                    )}
                </div>
                {errors.email && <p className="text-xs text-red-500 font-medium ml-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2 group">
                <label className={labelClass}>Phone Number</label>
                <div className="relative">
                    <Phone className={getIconClass("phone")} />
                    <input 
                        type="tel"
                        className={getInputClass("phone")}
                        placeholder="+1 234 567 890"
                        value={personalInfo.phone || ""}
                        onChange={(e) => handleChange("phone", e.target.value)}
                    />
                </div>
            </div>

            {/* Location: City */}
            <div className="space-y-2 group">
                <label className={labelClass}>City</label>
                <div className="relative">
                    <MapPin className={getIconClass("city")} />
                    <input 
                        className={getInputClass("city")}
                        placeholder="New York"
                        value={personalInfo.location?.city || ""}
                        onChange={(e) => handleLocationChange("city", e.target.value)}
                    />
                </div>
            </div>

            {/* Location: Country */}
            <div className="space-y-2 group">
                <label className={labelClass}>Country</label>
                <div className="relative">
                    <MapPin className={getIconClass("country")} />
                    <input 
                        className={getInputClass("country")}
                        placeholder="USA"
                        value={personalInfo.location?.country || ""}
                        onChange={(e) => handleLocationChange("country", e.target.value)}
                    />
                </div>
            </div>
        </div>
      </div>

      {/* 3. Social Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Social Presence</h3>
        <div className="grid md:grid-cols-2 gap-5">
            
            {/* LinkedIn */}
            <div className="space-y-2 group">
                <label className={labelClass}>LinkedIn</label>
                <div className="relative">
                    <Linkedin className={getIconClass("linkedin")} />
                    <input 
                        className={getInputClass("linkedin")}
                        placeholder="linkedin.com/in/username"
                        value={personalInfo.urls?.linkedin || ""}
                        onChange={(e) => handleUrlChange("linkedin", e.target.value)}
                    />
                </div>
            </div>

            {/* GitHub */}
            <div className="space-y-2 group">
                <label className={labelClass}>GitHub</label>
                <div className="relative">
                    <Github className={getIconClass("github")} />
                    <input 
                        className={getInputClass("github")}
                        placeholder="github.com/username"
                        value={personalInfo.urls?.github || ""}
                        onChange={(e) => handleUrlChange("github", e.target.value)}
                    />
                </div>
            </div>

            {/* Portfolio */}
             <div className="space-y-2 group md:col-span-2">
                <label className={labelClass}>Portfolio Website</label>
                <div className="relative">
                    <Globe className={getIconClass("portfolio")} />
                    <input 
                        className={getInputClass("portfolio")}
                        placeholder="https://myportfolio.com"
                        value={personalInfo.urls?.portfolio || ""}
                        onChange={(e) => handleUrlChange("portfolio", e.target.value)}
                    />
                </div>
            </div>
        </div>
      </div>
      
      {/* 4. Summary Section */}
       <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">About You</h3>
            <div className="space-y-2 group">
                <textarea 
                    className={`${getInputClass("summary")} pl-4 min-h-[140px] resize-none leading-relaxed`}
                    placeholder="Briefly describe your professional background, key achievements, and career goals..."
                    value={personalInfo.summary || ""}
                    onChange={(e) => handleChange("summary", e.target.value)}
                />
            </div>
        </div>

    </div>
  );
}