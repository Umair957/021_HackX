"use client";

import React, { useState } from "react";
import { useResumeStore } from "@/store/resume/resumeBuilderStore";
import { Plus, Trash2, Briefcase, Calendar, MapPin, Building2, Pencil, Sparkles, X } from "lucide-react";
import { WorkExperience as WorkExperienceType } from "@/types/typeResume";

export function WorkExperience() {
  const { resumeData, addExperience, removeExperience, updateExperience } = useResumeStore();
  const { workExperience } = resumeData;

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<WorkExperienceType>>({
    title: "",
    company: "",
    location: "",
    dates: { startDate: "", endDate: "", isCurrent: false },
    description: ""
  });

  // --- Styles (Consistent Zume Theme) ---
  const inputBaseClass = "w-full pl-11 p-3.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-700";
  const iconClass = "absolute left-3.5 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200";
  const labelClass = "text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1";

  // --- Handlers ---
  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      location: "",
      dates: { startDate: "", endDate: "", isCurrent: false },
      description: ""
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (job: WorkExperienceType) => {
    setFormData(job);
    setEditingId(job.id);
    setIsAdding(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.company) return;

    const jobData: WorkExperienceType = {
      id: editingId || crypto.randomUUID(),
      title: formData.title || "",
      company: formData.company || "",
      location: formData.location,
      dates: {
        startDate: formData.dates?.startDate || "",
        endDate: formData.dates?.isCurrent ? null : (formData.dates?.endDate || ""),
        isCurrent: formData.dates?.isCurrent || false
      },
      description: formData.description
    };

    if (editingId) {
      updateExperience(editingId, jobData);
    } else {
      addExperience(jobData);
    }
    resetForm();
  };

  const updateDate = (field: "startDate" | "endDate" | "isCurrent", value: WorkExperienceType["dates"][typeof field]) => {
    setFormData(prev => ({
        ...prev,
        dates: { ...prev.dates!, [field]: value }
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Work Experience
                <Sparkles className="w-5 h-5 text-blue-500" />
            </h2>
            <p className="text-slate-500 mt-1">Add your relevant work history. Start with the most recent.</p>
        </div>
      </div>

      {/* 1. LIST VIEW: Existing Jobs */}
      {!isAdding && workExperience.length > 0 && (
        <div className="space-y-4">
          {workExperience.map((job) => (
            <div key={job.id} className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/50 hover:border-blue-500/50 hover:shadow-md transition-all group relative">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                    <div className="mt-1 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl h-fit text-blue-600 dark:text-blue-400">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">{job.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">{job.company}</p>
                        
                        <div className="text-sm text-slate-500 mt-2 flex flex-wrap items-center gap-4">
                            <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                <Calendar className="w-3.5 h-3.5"/> 
                                {job.dates.startDate} — {job.dates.isCurrent ? "Present" : job.dates.endDate}
                            </span>
                            {job.location && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5"/> {job.location}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button onClick={() => handleEdit(job)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeExperience(job.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. ADD BUTTON */}
      {!isAdding && (
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all group"
        >
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-medium">Add Position</span>
        </button>
      )}

      {/* 3. FORM VIEW */}
      {isAdding && (
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 relative">
          
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {editingId ? "Edit Position" : "New Position"}
             </h3>
             <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
             </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-5 mb-5">
            <div className="space-y-2 group">
              <label className={labelClass}>Job Title</label>
              <div className="relative">
                <Briefcase className={iconClass} />
                <input 
                  className={inputBaseClass}
                  placeholder="e.g. Product Manager"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className={labelClass}>Company</label>
              <div className="relative">
                <Building2 className={iconClass} />
                <input 
                  className={inputBaseClass}
                  placeholder="e.g. Google"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className={labelClass}>Location</label>
              <div className="relative">
                <MapPin className={iconClass} />
                <input 
                  className={inputBaseClass}
                  placeholder="City, Country"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>

            {/* Empty div to align grid or can be removed if specific layout isn't needed */}
            <div className="hidden md:block"></div>

            <div className="space-y-2 group">
              <label className={labelClass}>Start Date</label>
              <input 
                type="month"
                className={inputBaseClass.replace("pl-11", "pl-4")} // Remove left padding for date
                value={formData.dates?.startDate || ""}
                onChange={(e) => updateDate("startDate", e.target.value)}
              />
            </div>

            <div className="space-y-2 group">
              <label className={labelClass}>End Date</label>
              <input 
                type="month"
                disabled={formData.dates?.isCurrent}
                className={`${inputBaseClass.replace("pl-11", "pl-4")} disabled:opacity-50`}
                value={formData.dates?.endDate || ""}
                onChange={(e) => updateDate("endDate", e.target.value)}
              />
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mt-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={formData.dates?.isCurrent || false}
                  onChange={(e) => updateDate("isCurrent", e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                I currently work here
              </label>
            </div>
          </div>
          
          <div className="space-y-2 mb-8 group">
            <label className={labelClass}>Description</label>
            <textarea 
              className={`${inputBaseClass.replace("pl-11", "pl-4")} min-h-[150px] resize-none leading-relaxed`}
              placeholder="• Developed new features...&#10;• Improved performance by 20%...&#10;• Mentored junior developers..."
              value={formData.description || ""}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button 
              onClick={resetForm}
              className="px-5 py-2.5 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={!formData.title || !formData.company}
              className="px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              {editingId ? "Update Position" : "Save Position"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}