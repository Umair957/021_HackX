"use client";

import React, { useState } from "react";
import { useResumeStore } from "@/store/resume/resumeBuilderStore";
import { Plus, X, Cpu, Sparkles, Code2, BrainCircuit, Lightbulb, Globe, Award, Calendar } from "lucide-react";
import { Language, Certification } from "@/types/typeResume";

export function Skills() {
  const { 
    resumeData, 
    addTechnicalSkill, removeTechnicalSkill, 
    addSoftSkill, removeSoftSkill,
    addLanguage, removeLanguage,
    addCertification, removeCertification
  } = useResumeStore();
  
  const { technicalSkills, softSkills, languages, certifications } = resumeData;

  // --- Local State for Inputs ---
  const [techInput, setTechInput] = useState("");
  const [softInput, setSoftInput] = useState("");
  
  const [langForm, setLangForm] = useState({ name: "", level: "Professional" });
  const [certForm, setCertForm] = useState({ name: "", issuer: "", date: "" });

  // --- Styles (Emerald/Teal Theme) ---
  const inputBaseClass = "w-full pl-11 p-3.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-700";
  const iconClass = "absolute left-3.5 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors duration-200";
  const buttonClass = "px-4 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-medium hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  // --- Handlers ---

  const handleAddTech = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (techInput.trim()) {
      addTechnicalSkill(techInput.trim());
      setTechInput("");
    }
  };

  const handleAddSoft = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (softInput.trim()) {
      addSoftSkill(softInput.trim());
      setSoftInput("");
    }
  };

  const handleAddLang = () => {
    if (langForm.name.trim()) {
      addLanguage({
        id: crypto.randomUUID(),
        name: langForm.name,
        level: langForm.level
      });
      setLangForm({ name: "", level: "Professional" });
    }
  };

  const handleAddCert = () => {
    if (certForm.name.trim() && certForm.issuer.trim()) {
      addCertification({
        id: crypto.randomUUID(),
        name: certForm.name,
        issuer: certForm.issuer,
        date: certForm.date
      });
      setCertForm({ name: "", issuer: "", date: "" });
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Skills & Qualifications
                <Sparkles className="w-5 h-5 text-emerald-500" />
            </h2>
            <p className="text-slate-500 mt-1">Highlight your technical abilities, languages, and certifications.</p>
        </div>
      </div>

      {/* ------------------------------------------------------------------------ */}
      {/* SECTION 1: SKILLS */}
      {/* ------------------------------------------------------------------------ */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* --- TECHNICAL SKILLS --- */}
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                    <Code2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Technical Skills</h3>
            </div>
            
            <form onSubmit={handleAddTech} className="flex gap-2 group relative">
                <div className="relative flex-1">
                   <Cpu className={iconClass} />
                   <input 
                       className={inputBaseClass}
                       placeholder="e.g. React, Python"
                       value={techInput}
                       onChange={(e) => setTechInput(e.target.value)}
                   />
                </div>
                <button type="submit" disabled={!techInput} className={buttonClass}>
                    <Plus className="w-5 h-5" />
                </button>
            </form>

            <div className="flex flex-wrap gap-2 min-h-[60px] content-start">
                {technicalSkills.length === 0 && <span className="text-sm text-slate-400 italic py-2">No skills added yet.</span>}
                {technicalSkills.map((skill, idx) => (
                    <div key={`${skill}-${idx}`} className="flex items-center gap-1.5 pl-3 pr-1 py-1 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/50">
                        <span>{skill}</span>
                        <button onClick={() => removeTechnicalSkill(skill)} className="p-1 hover:text-emerald-900 dark:hover:text-white"><X className="w-3.5 h-3.5" /></button>
                    </div>
                ))}
            </div>
        </div>

        {/* --- SOFT SKILLS --- */}
        <div className="space-y-4">
             <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                    <BrainCircuit className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Soft Skills</h3>
            </div>

            <form onSubmit={handleAddSoft} className="flex gap-2 group relative">
                <div className="relative flex-1">
                   <Lightbulb className={`${iconClass} group-focus-within:text-blue-500`} />
                   <input 
                       className={`${inputBaseClass} focus:ring-blue-500/20 focus:border-blue-500`}
                       placeholder="e.g. Leadership"
                       value={softInput}
                       onChange={(e) => setSoftInput(e.target.value)}
                   />
                </div>
                <button type="submit" disabled={!softInput} className={`${buttonClass} hover:bg-blue-500 dark:hover:bg-blue-600`}>
                    <Plus className="w-5 h-5" />
                </button>
            </form>

            <div className="flex flex-wrap gap-2 min-h-[60px] content-start">
                {softSkills.length === 0 && <span className="text-sm text-slate-400 italic py-2">No soft skills added yet.</span>}
                {softSkills.map((skill, idx) => (
                    <div key={`${skill}-${idx}`} className="flex items-center gap-1.5 pl-3 pr-1 py-1 rounded-lg text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/50">
                        <span>{skill}</span>
                        <button onClick={() => removeSoftSkill(skill)} className="p-1 hover:text-blue-900 dark:hover:text-white"><X className="w-3.5 h-3.5" /></button>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800" />

      {/* ------------------------------------------------------------------------ */}
      {/* SECTION 2: LANGUAGES & CERTIFICATIONS */}
      {/* ------------------------------------------------------------------------ */}
      <div className="grid md:grid-cols-2 gap-8">

        {/* --- LANGUAGES --- */}
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                    <Globe className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Languages</h3>
            </div>
            
            <div className="flex gap-2">
                <div className="relative flex-[2]">
                    <input 
                        className="w-full p-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-purple-500"
                        placeholder="Language (e.g. English)"
                        value={langForm.name}
                        onChange={(e) => setLangForm({...langForm, name: e.target.value})}
                    />
                </div>
                <div className="relative flex-1">
                    <select 
                        className="w-full p-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-purple-500 appearance-none"
                        value={langForm.level}
                        onChange={(e) => setLangForm({...langForm, level: e.target.value})}
                    >
                        <option>Native</option>
                        <option>Fluent</option>
                        <option>Professional</option>
                        <option>Intermediate</option>
                        <option>Beginner</option>
                    </select>
                </div>
                <button onClick={handleAddLang} disabled={!langForm.name} className="p-3 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-500 hover:text-white transition-colors">
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-2">
                {languages.map((lang) => (
                    <div key={lang.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl">
                        <div>
                            <p className="font-semibold text-sm text-slate-900 dark:text-white">{lang.name}</p>
                            <p className="text-xs text-slate-500">{lang.level}</p>
                        </div>
                        <button onClick={() => removeLanguage(lang.id)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                ))}
            </div>
        </div>

        {/* --- CERTIFICATIONS --- */}
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                    <Award className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Certifications</h3>
            </div>

            <div className="space-y-2 bg-slate-50 dark:bg-slate-950/30 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <input 
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm mb-2"
                    placeholder="Certificate Name (e.g. AWS Solutions Architect)"
                    value={certForm.name}
                    onChange={(e) => setCertForm({...certForm, name: e.target.value})}
                />
                <div className="flex gap-2">
                    <input 
                        className="flex-1 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                        placeholder="Issuer (e.g. Amazon)"
                        value={certForm.issuer}
                        onChange={(e) => setCertForm({...certForm, issuer: e.target.value})}
                    />
                    <input 
                        type="date"
                        className="w-32 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                        value={certForm.date}
                        onChange={(e) => setCertForm({...certForm, date: e.target.value})}
                    />
                </div>
                <button onClick={handleAddCert} disabled={!certForm.name || !certForm.issuer} className="w-full mt-2 py-2 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 rounded-lg text-sm font-semibold hover:bg-orange-500 hover:text-white transition-colors">
                    Add Certification
                </button>
            </div>

            <div className="space-y-2">
                {certifications.map((cert) => (
                    <div key={cert.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl">
                        <div className="flex items-center gap-3">
                            <Award className="w-8 h-8 text-orange-200 dark:text-orange-900/50" />
                            <div>
                                <p className="font-semibold text-sm text-slate-900 dark:text-white">{cert.name}</p>
                                <p className="text-xs text-slate-500">{cert.issuer} • {cert.date}</p>
                            </div>
                        </div>
                        <button onClick={() => removeCertification(cert.id)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}

// Simple Trash Icon helper since it wasn't imported in previous steps
function Trash2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
    </svg>
  );
}