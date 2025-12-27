"use client";

import React, { useState } from "react";
import { useResumeStore } from "@/store/resume/resumeBuilderStore";
import { Plus, Trash2, GraduationCap, Calendar, School, BookOpen, Sparkles, Pencil, X, Hash } from "lucide-react";
import { Education as EducationType } from "@/types/typeResume";

export function Education() {
  const { resumeData, addEducation, removeEducation } = useResumeStore();
  // Note: If you haven't added updateEducation to your store yet, 
  // you can implement edit by removing the old one and adding the new one.
  const { education } = resumeData;

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<EducationType>>({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    graduationYear: new Date().getFullYear(),
    gpa: undefined
  });

  // --- Styles (Zume Theme - Purple Accent) ---
  const inputBaseClass = "w-full pl-11 p-3.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-700";
  const iconClass = "absolute left-3.5 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-purple-500 transition-colors duration-200";
  const labelClass = "text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1";

  // --- Handlers ---
  const resetForm = () => {
    setFormData({ 
        institution: "", 
        degree: "", 
        fieldOfStudy: "", 
        graduationYear: new Date().getFullYear(), 
        gpa: undefined 
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (item: EducationType) => {
    setFormData(item);
    setEditingId(item.id);
    setIsAdding(true);
  };

  const handleSave = () => {
    if (!formData.institution || !formData.degree) return;

    const newEdu: EducationType = {
      id: editingId || crypto.randomUUID(),
      institution: formData.institution || "",
      degree: formData.degree || "",
      fieldOfStudy: formData.fieldOfStudy || "",
      graduationYear: Number(formData.graduationYear),
      gpa: formData.gpa ? Number(formData.gpa) : undefined
    };

    if (editingId) {
      // If your store doesn't have updateEducation, we simulate it:
      removeEducation(editingId);
      addEducation(newEdu);
    } else {
      addEducation(newEdu);
    }
    
    resetForm();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Education
                <Sparkles className="w-5 h-5 text-purple-500" />
            </h2>
            <p className="text-slate-500 mt-1">Add your academic background and achievements.</p>
        </div>
      </div>

      {/* 1. LIST VIEW */}
      {!isAdding && education.length > 0 && (
        <div className="space-y-4">
          {education.map((edu) => (
            <div key={edu.id} className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/50 hover:border-purple-500/50 hover:shadow-md transition-all group relative">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                    <div className="mt-1 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl h-fit text-purple-600 dark:text-purple-400">
                        <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">{edu.institution}</h3>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">
                          {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                        </p>
                        <div className="text-sm text-slate-500 mt-2 flex items-center gap-4">
                            <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                <Calendar className="w-3.5 h-3.5"/> Class of {edu.graduationYear}
                            </span>
                            {edu.gpa && (
                                <span className="font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                                    GPA: {edu.gpa}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-1">
                    <button onClick={() => handleEdit(edu)} className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeEducation(edu.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
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
          className="w-full py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-500 hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all group"
        >
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-medium">Add Education</span>
        </button>
      )}

      {/* 3. FORM VIEW */}
      {isAdding && (
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 relative">
           
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {editingId ? "Edit Education" : "New Education"}
             </h3>
             <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
             </button>
           </div>

           <div className="grid md:grid-cols-2 gap-5 mb-5">
              <div className="space-y-2 group">
                <label className={labelClass}>School / University</label>
                <div className="relative">
                  <School className={iconClass} />
                  <input 
                    className={inputBaseClass}
                    placeholder="e.g. Harvard University"
                    value={formData.institution}
                    onChange={(e) => setFormData({...formData, institution: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className={labelClass}>Degree</label>
                <div className="relative">
                  <GraduationCap className={iconClass} />
                  <input 
                    className={inputBaseClass}
                    placeholder="e.g. Bachelor's"
                    value={formData.degree}
                    onChange={(e) => setFormData({...formData, degree: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className={labelClass}>Field of Study</label>
                <div className="relative">
                  <BookOpen className={iconClass} />
                  <input 
                    className={inputBaseClass}
                    placeholder="e.g. Computer Science"
                    value={formData.fieldOfStudy}
                    onChange={(e) => setFormData({...formData, fieldOfStudy: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 group">
                  <label className={labelClass}>Graduation Year</label>
                  <div className="relative">
                    <Calendar className={iconClass} />
                    <input 
                        type="number"
                        className={inputBaseClass}
                        placeholder="2024"
                        value={formData.graduationYear}
                        onChange={(e) => setFormData({...formData, graduationYear: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className={labelClass}>GPA (Optional)</label>
                  <div className="relative">
                    <Hash className={iconClass} />
                    <input 
                        type="number"
                        step="0.01"
                        className={inputBaseClass}
                        placeholder="4.0"
                        value={formData.gpa || ""}
                        onChange={(e) => setFormData({...formData, gpa: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
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
                disabled={!formData.institution || !formData.degree}
                className="px-8 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-semibold shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                {editingId ? "Update Education" : "Save Education"}
              </button>
           </div>
        </div>
      )}
    </div>
  );
}