"use client";

import React, { useState } from "react";
import { useResumeStore } from "@/store/resume/resumeBuilderStore";
import { Plus, Trash2, FolderGit2, Calendar, Link as LinkIcon, Layers, Sparkles, Pencil, X, Code } from "lucide-react";
import { Project as ProjectType } from "@/types/typeResume";

export function Projects() {
  const { resumeData, addProject, removeProject } = useResumeStore();
  // Note: Ensure you have updateProject in your store, or simulate it like below
  const { projects } = resumeData;

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Local state for the "Add Technology" input field
  const [techInput, setTechInput] = useState("");

  // Form State
  const [formData, setFormData] = useState<Partial<ProjectType>>({
    name: "",
    description: "",
    technologies: [],
    url: "",
    dates: { startDate: "", endDate: "", isCurrent: false }
  });

  // --- Styles (Zume Theme - Amber Accent) ---
  const inputBaseClass = "w-full pl-11 p-3.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-700";
  const iconClass = "absolute left-3.5 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors duration-200";
  const labelClass = "text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1";

  // --- Handlers ---
  const resetForm = () => {
    setFormData({ 
        name: "", 
        description: "", 
        technologies: [], 
        url: "", 
        dates: { startDate: "", endDate: "", isCurrent: false } 
    });
    setTechInput("");
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (item: ProjectType) => {
    setFormData(item);
    setEditingId(item.id);
    setIsAdding(true);
  };

  const handleSave = () => {
    if (!formData.name) return;

    const newProject: ProjectType = {
      id: editingId || crypto.randomUUID(),
      name: formData.name || "",
      description: formData.description || "",
      technologies: formData.technologies || [],
      url: formData.url || "",
      dates: {
        startDate: formData.dates?.startDate || "",
        endDate: formData.dates?.isCurrent ? null : (formData.dates?.endDate || ""),
        isCurrent: formData.dates?.isCurrent || false
      }
    };

    if (editingId) {
      removeProject(editingId); // Simulate update if updateProject action doesn't exist
      addProject(newProject);
    } else {
      addProject(newProject);
    }
    
    resetForm();
  };

  // Technology Tag Handlers
  const handleAddTech = (e: React.FormEvent) => {
    e.preventDefault();
    if (techInput.trim()) {
      setFormData(prev => ({
        ...prev,
        technologies: [...(prev.technologies || []), techInput.trim()]
      }));
      setTechInput("");
    }
  };

  const removeTech = (techToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: (prev.technologies || []).filter(t => t !== techToRemove)
    }));
  };

  const updateDate = (field: "startDate" | "endDate" | "isCurrent", value: string | boolean) => {
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
                Projects
                <Sparkles className="w-5 h-5 text-amber-500" />
            </h2>
            <p className="text-slate-500 mt-1">Showcase your side projects, case studies, or coding assignments.</p>
        </div>
      </div>

      {/* 1. LIST VIEW */}
      {!isAdding && projects.length > 0 && (
        <div className="space-y-4">
          {projects.map((proj) => (
            <div key={proj.id} className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/50 hover:border-amber-500/50 hover:shadow-md transition-all group relative">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                    <div className="mt-1 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl h-fit text-amber-600 dark:text-amber-400">
                        <FolderGit2 className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">{proj.name}</h3>
                            {proj.url && (
                                <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors">
                                    <LinkIcon className="w-3.5 h-3.5" />
                                </a>
                            )}
                        </div>
                        
                        {/* Tech Stack Chips */}
                        {proj.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {proj.technologies.map(tech => (
                                    <span key={tech} className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="text-sm text-slate-500 mt-3 flex items-center gap-4">
                            {proj.dates?.startDate && (
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5"/> 
                                    {proj.dates.startDate} {proj.dates.endDate ? `— ${proj.dates.endDate}` : ""}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-1">
                    <button onClick={() => handleEdit(proj)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeProject(proj.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
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
          className="w-full py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-500 hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-all group"
        >
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30 transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-medium">Add Project</span>
        </button>
      )}

      {/* 3. FORM VIEW */}
      {isAdding && (
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 relative">
           
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {editingId ? "Edit Project" : "New Project"}
             </h3>
             <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
             </button>
           </div>

           <div className="grid md:grid-cols-2 gap-5 mb-5">
              
              {/* Project Name */}
              <div className="space-y-2 group">
                <label className={labelClass}>Project Name</label>
                <div className="relative">
                  <Layers className={iconClass} />
                  <input 
                    className={inputBaseClass}
                    placeholder="e.g. E-Commerce Dashboard"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              {/* Project URL */}
              <div className="space-y-2 group">
                <label className={labelClass}>Project Link (Optional)</label>
                <div className="relative">
                  <LinkIcon className={iconClass} />
                  <input 
                    className={inputBaseClass}
                    placeholder="https://github.com/..."
                    value={formData.url || ""}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                  />
                </div>
              </div>

              {/* Technologies (Tag Input) */}
              <div className="md:col-span-2 space-y-2 group">
                <label className={labelClass}>Technologies Used</label>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <Code className={iconClass} />
                    <input 
                        className={inputBaseClass}
                        placeholder="Type a skill and press Enter (e.g. React, Node.js)"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTech(e);
                            }
                        }}
                    />
                  </div>
                  <button 
                    onClick={handleAddTech}
                    disabled={!techInput} 
                    className="px-4 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-amber-500 hover:text-white transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Tech Chips */}
                <div className="flex flex-wrap gap-2 mt-2">
                    {formData.technologies?.map((tech, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 pl-3 pr-1 py-1 rounded-lg text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-sm">
                            <span>{tech}</span>
                            <button onClick={() => removeTech(tech)} className="p-1 hover:text-red-500 text-slate-400 transition-colors">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-2 group">
                <label className={labelClass}>Start Date</label>
                <input 
                    type="month"
                    className={inputBaseClass.replace("pl-11", "pl-4")}
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
                    className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    I'm currently working on this
                </label>
              </div>
           </div>
           
           {/* Description */}
           <div className="space-y-2 mb-8 group">
             <label className={labelClass}>Description</label>
             <textarea 
               className={`${inputBaseClass.replace("pl-11", "pl-4")} min-h-[120px] resize-none leading-relaxed`}
               placeholder="Describe what you built and the impact it had..."
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
                disabled={!formData.name}
                className="px-8 py-2.5 bg-amber-500 text-white rounded-xl hover:bg-amber-600 font-semibold shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                {editingId ? "Update Project" : "Save Project"}
              </button>
           </div>
        </div>
      )}
    </div>
  );
}