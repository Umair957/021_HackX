"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Briefcase, FileText, 
  Sparkles, X, ArrowRight, ArrowLeft 
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function Signup() {
  // --- STATE ---
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    company: "",
    password: "",
  });

  const [skills, setSkills] = useState<string[]>(["Figma", "React"]); // Default skills
  const [currentSkill, setCurrentSkill] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentSkill.trim()) {
      e.preventDefault();
      if (skills.length < 6) {
        setSkills([...skills, currentSkill.trim()]);
        setCurrentSkill("");
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = { ...formData, skills };
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/auth/login");
      } else {
        setError(data?.message || "Signup failed");
      }
    } catch (err: any) {
      setError(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-500/5 dark:bg-teal-900/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start relative z-10">
        
        {/* --- LEFT COLUMN: THE INPUT FORM --- */}
        <div className="text-gray-900 dark:text-white p-4 md:p-8 lg:p-12 order-2 lg:order-1">
          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-xs md:text-sm font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Home</span>
              </motion.button>
            </Link>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8"
          >
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Build your Profile</h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Let`s create your account and set up your base resume.</p>
          </motion.div>

          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 ml-1 flex items-center gap-1.5 md:gap-2">
                <User className="w-3.5 h-3.5 md:w-4 md:h-4" /> Full Name
              </label>
              <input 
                type="text" 
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onFocus={() => setFocusedField("fullName")}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="e.g. Alex Morgan"
              />
            </div>

            {/* Role Input */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 ml-1 flex items-center gap-1.5 md:gap-2">
                <Briefcase className="w-3.5 h-3.5 md:w-4 md:h-4" /> Target Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                onFocus={() => setFocusedField("role")}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all"
                aria-label="Select target role"
              >
                <option value="" disabled>Select role</option>
                <option value="Candidate">Candidate</option>
                <option value="Recruiter">Recruiter</option>
              </select>
            </div>

            {/* Email & Password Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 ml-1 flex items-center gap-1.5 md:gap-2">
                  <Mail className="w-3.5 h-3.5 md:w-4 md:h-4" /> Email
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="alex@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 ml-1">Password</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Professional Summary */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 ml-1 flex items-center gap-1.5 md:gap-2">
                <FileText className="w-3.5 h-3.5 md:w-4 md:h-4" /> Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                onFocus={() => setFocusedField("company")}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="e.g. Acme Corp"
              />
            </div>

            {/* Skills Input */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 ml-1 flex items-center gap-1.5 md:gap-2">
                <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" /> Top Skills <span className="text-[9px] md:text-[10px] text-gray-500 dark:text-gray-600">(Press Enter to add)</span>
              </label>
              <div 
                className={`w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-2 py-2 flex flex-wrap gap-2 transition-all ${focusedField === 'skills' ? 'ring-2 ring-emerald-500 dark:ring-emerald-400' : ''}`}
              >
                <AnimatePresence>
                  {skills.map(skill => (
                    <motion.span 
                      key={skill}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-2 py-1.5 rounded-lg flex items-center gap-1 border border-emerald-200 dark:border-emerald-800"
                    >
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="hover:text-emerald-900 dark:hover:text-white"><X className="w-3 h-3" /></button>
                    </motion.span>
                  ))}
                </AnimatePresence>
                <input 
                  type="text" 
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyDown={handleAddSkill}
                  onFocus={() => setFocusedField("skills")}
                  onBlur={() => setFocusedField(null)}
                  className="bg-transparent text-gray-900 dark:text-white outline-none flex-1 min-w-[100px] text-sm py-1.5 px-2 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder={skills.length === 0 ? "Type skill & hit Enter" : ""}
                />
              </div>
            </div>

            {/* Submit Button */}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={loading}
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 hover:from-emerald-700 hover:to-teal-700 dark:hover:from-emerald-600 dark:hover:to-teal-600 text-white font-bold py-3.5 md:py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/30 text-base md:text-lg flex items-center justify-center gap-2 mt-2 md:mt-4 disabled:opacity-60"
            >
              {loading ? (
                <>
                  Creating... <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </>
              ) : (
                <>
                  Create Account <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </>
              )}
            </motion.button>

          </form>
        </div>

        {/* --- RIGHT COLUMN: THE LIVE RESUME PREVIEW --- */}
        <div className="relative h-full min-h-[600px] hidden lg:flex items-center justify-center order-1 lg:order-2">
          
          {/* Sticky Container so it stays while scrolling form */}
          <div className="sticky top-8">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-widest text-center mb-6">Live Preview</h3>
            
            <motion.div 
               className="w-[420px] h-[600px] bg-white dark:bg-gray-800/80 rounded-[1rem] shadow-2xl overflow-hidden relative"
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.5 }}
            >
               {/* Resume Top Accent */}
               <div className="h-3 w-full bg-gradient-to-r from-emerald-600 to-teal-600"></div>

               <div className="p-8 h-full flex flex-col">
                  
                  {/* --- HEADER SECTION --- */}
                  <motion.div 
                    className={`flex items-start justify-between border-b border-gray-100 pb-6 mb-6 transition-all duration-300 ${focusedField === 'fullName' || focusedField === 'role' ? 'scale-[1.02] bg-green-50/50 -mx-4 px-4 rounded-xl' : ''}`}
                  >
                     <div className="flex-1 pr-4">
                        {/* Dynamic Name */}
                        <h2 className={`text-2xl font-bold uppercase tracking-tight break-words ${formData.fullName ? 'text-gray-900' : 'text-gray-300'}`}>
                           {formData.fullName || "Your Name"}
                        </h2>
                        {/* Dynamic Role */}
                        <p className={`text-sm font-bold tracking-widest uppercase mt-1 ${formData.role ? 'text-emerald-600' : 'text-gray-300'}`}>
                           {formData.role || "Target Role"}
                        </p>
                     </div>

                     {/* Dynamic Avatar based on name */}
                     <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden border-2 border-gray-100 flex-shrink-0">
                        <Image
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent((formData.fullName || "User").trim())}`}
                          alt="avatar"
                          className="w-full h-full object-cover"
                          width={64}
                          height={64}
                        />
                     </div>
                  </motion.div>

                  {/* --- CONTACT SECTION --- */}
                  <motion.div 
                    className={`grid grid-cols-2 gap-4 mb-8 transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.02] bg-green-50/50 -mx-4 px-4 py-2 rounded-xl' : ''}`}
                  >
                     <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block mb-0.5">Email</span>
                        <span className={`text-xs font-medium ${formData.email ? 'text-gray-700' : 'text-gray-300'}`}>
                          {formData.email || "email@example.com"}
                        </span>
                     </div>
                     <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block mb-0.5">Location</span>
                        <span className="text-xs font-medium text-gray-300">New York, USA</span>
                     </div>
                  </motion.div>

                  {/* --- SUMMARY SECTION --- */}
                  <motion.div 
                    className={`mb-8 transition-all duration-300 ${focusedField === 'company' ? 'scale-[1.02] bg-green-50/50 -mx-4 px-4 py-2 rounded-xl' : ''}`}
                  >
                    <h4 className="text-xs font-bold text-gray-900 uppercase border-b border-gray-100 pb-2 mb-3">Company</h4>
                    <p className={`text-xs leading-relaxed ${formData.company ? 'text-gray-600' : 'text-gray-300 italic'}`}>
                      {formData.company || "Company name will appear here as you type..."}
                    </p>
                  </motion.div>

                  {/* --- SKILLS SECTION --- */}
                  <motion.div 
                    className={`transition-all duration-300 ${focusedField === 'skills' ? 'scale-[1.02] bg-green-50/50 -mx-4 px-4 py-2 rounded-xl' : ''}`}
                  >
                     <h4 className="text-xs font-bold text-gray-900 uppercase border-b border-gray-100 pb-2 mb-3">Core Skills</h4>
                     <div className="flex flex-wrap gap-2">
                        {skills.length > 0 ? (
                           skills.map(skill => (
                              <span key={skill} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-100">
                                 {skill}
                              </span>
                           ))
                        ) : (
                           <span className="text-[10px] text-gray-300 italic">Add skills to see them here...</span>
                        )}
                     </div>
                  </motion.div>

                  {/* --- DECORATIVE WATERMARK --- */}
                  <div className="absolute bottom-4 right-6 opacity-10">
                    <Sparkles className="w-12 h-12 text-emerald-600" />
                  </div>
               </div>
            </motion.div>

            <div className="flex flex-1 items-center justify-center mt-4 md:mt-6">
              <Link href="/auth/login">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-xs md:text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
              >
                Already have an account? <span className="font-bold ml-1">Sign In</span>
              </motion.button>
            </Link>
            </div>

            {/* Helper Tooltip */}
            <AnimatePresence>
               {focusedField && (
                  <motion.div 
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0 }}
                     className="absolute -right-36 top-1/2 -translate-y-1/2 bg-emerald-600 dark:bg-emerald-500 text-white text-xs font-bold py-2 px-3 rounded-lg shadow-lg hidden xl:block"
                  >
                     Updating Live!
                     <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-emerald-600 dark:bg-emerald-500 rotate-45"></div>
                  </motion.div>
               )}
            </AnimatePresence>

          </div>
        </div>

      </div>
    </div>
  );
}