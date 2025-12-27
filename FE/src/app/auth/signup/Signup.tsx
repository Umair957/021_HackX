"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Briefcase, FileText, 
  Sparkles, X, ArrowRight, ArrowLeft,
  Search, Building2, Loader2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SideToast from "@/ui/Toast";
import { ToastType } from "@/constants/toastData";

// Define the interface locally to ensure it matches exactly what we send
// You can move this back to @/constants/signUpData later
interface SignupPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  company?: string; // Optional string
}

export default function Signup() {
  // --- STATE ---
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "Candidate", // UI Logic uses Capitalized "Candidate"
    company: "",
    password: "",
  });

  const [skills, setSkills] = useState<string[]>(["Figma", "React"]); 
  const [currentSkill, setCurrentSkill] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ visible: boolean; type: ToastType; title: string; desc: string }>({
    visible: false,
    type: "success",
    title: "",
    desc: "",
  });

  const showToast = (type: ToastType, title: string, desc: string) => {
    setToast({ visible: true, type, title, desc });
  };

  // --- HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role: string) => {
    setFormData({ ...formData, role });
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

  // --- SUBMIT HANDLER (UPDATED) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    // 1. Client-Side Validation
    if(!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
        setError("Please fill in all required fields.");
        setLoading(false);
        return;
    }

    if (formData.role === "Recruiter" && !formData.company) {
        setError("Company name is required for Recruiters.");
        setLoading(false);
        return;
    }

    try {
      // 2. Construct Payload
      // Note: We convert role to lowercase ("recruiter" | "candidate") for the backend Enum
      const payload: SignupPayload = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role.trim().toLowerCase(), 
        // Send company if it exists, otherwise undefined (so Pydantic ignores it or sees None)
        company: formData.company.trim() || undefined
      };

      console.log("Sending Payload:", payload); // Debugging

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        // 3. Better Error Handling
        // Pydantic validation errors usually come in data.detail
        if (typeof data.detail === 'string') {
            throw new Error(data.detail);
        } else if (Array.isArray(data.detail)) {
            // Handle array of validation errors (e.g. missing fields)
            throw new Error(data.detail[0].msg || "Invalid input data");
        } else {
            throw new Error(data.message || "Signup failed");
        }
      }

      // 4. Success -> show toast then redirect
      showToast("success", "Account created", "Check your email for the OTP to verify your account.");
      setTimeout(() => {
        router.push(`/auth/otp?email=${encodeURIComponent(payload.email)}`);
      }, 800);

    } catch (err) {
      console.error("Signup Error:", err);
      const message = (err as Error).message || "Network error";
      setError(message);
      showToast("error", "Signup failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Let`s create your account. Are you hiring or looking for a job?</p>
          </motion.div>

          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            
            {/* --- ROLE SELECTION CARDS --- */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 ml-1">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Candidate Selection */}
                <div
                  onClick={() => handleRoleSelect("Candidate")}
                  className={`
                    relative cursor-pointer rounded-2xl border-2 p-4 flex flex-col items-center justify-center gap-2 text-center transition-all duration-200
                    ${formData.role === "Candidate" 
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300" 
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600"}
                  `}
                >
                  <User className={`w-6 h-6 ${formData.role === "Candidate" ? "fill-current" : ""}`} />
                  <div>
                    <span className="block text-sm font-bold">Candidate</span>
                    <span className="text-[10px] opacity-80">Looking for jobs</span>
                  </div>
                  {formData.role === "Candidate" && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  )}
                </div>

                {/* Recruiter Selection */}
                <div
                  onClick={() => handleRoleSelect("Recruiter")}
                  className={`
                    relative cursor-pointer rounded-2xl border-2 p-4 flex flex-col items-center justify-center gap-2 text-center transition-all duration-200
                    ${formData.role === "Recruiter" 
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300" 
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600"}
                  `}
                >
                  <Briefcase className={`w-6 h-6 ${formData.role === "Recruiter" ? "fill-current" : ""}`} />
                  <div>
                    <span className="block text-sm font-bold">Recruiter</span>
                    <span className="text-[10px] opacity-80">Hiring talent</span>
                  </div>
                  {formData.role === "Recruiter" && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Name Inputs */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 ml-1 flex items-center gap-1.5 md:gap-2">
                <User className="w-3.5 h-3.5 md:w-4 md:h-4" /> Full Name
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("firstName")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="First name"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("lastName")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Last name"
                />
              </div>
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
                  placeholder="name@work.com"
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

            {/* Professional Info */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 ml-1 flex items-center gap-1.5 md:gap-2">
                {formData.role === "Recruiter" ? (
                  <><Building2 className="w-3.5 h-3.5" /> Company Name <span className="text-red-500">*</span></>
                ) : (
                  <><FileText className="w-3.5 h-3.5" /> Current Company / University</>
                )}
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                onFocus={() => setFocusedField("company")}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all placeholder-gray-400 dark:placeholder-gray-500"
                placeholder={formData.role === "Recruiter" ? "e.g. Google, Amazon, Startup Inc." : "e.g. Freelance, University of Tech"}
              />
            </div>

            {/* Skills Input (Only show for Candidates) */}
            <AnimatePresence>
              {formData.role === "Candidate" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 ml-1 flex items-center gap-1.5 md:gap-2">
                    <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" /> Core Skills <span className="text-[9px] md:text-[10px] text-gray-500 dark:text-gray-600">(Press Enter to add)</span>
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
                          <button type="button" onClick={() => removeSkill(skill)} className="hover:text-emerald-900 dark:hover:text-white"><X className="w-3 h-3" /></button>
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
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900 text-center"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>
            
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={loading}
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 hover:from-emerald-700 hover:to-teal-700 dark:hover:from-emerald-600 dark:hover:to-teal-600 text-white font-bold py-3.5 md:py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/30 text-base md:text-lg flex items-center justify-center gap-2 mt-2 md:mt-4 disabled:opacity-60"
            >
              {loading ? (
                <>Creating Account <Loader2 className="w-4 h-4 animate-spin" /></>
              ) : (
                <>
                  {formData.role === "Recruiter" ? "Join as Recruiter" : "Join as Candidate"} 
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </>
              )}
            </motion.button>

          </form>
        </div>

        {/* --- RIGHT COLUMN: THE LIVE PREVIEW --- */}
        <div className="relative h-full min-h-[600px] hidden lg:flex items-center justify-center order-1 lg:order-2">
          
          <div className="sticky top-8">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-widest text-center mb-6">
              {formData.role === "Recruiter" ? "Recruiter Profile Preview" : "Resume Preview"}
            </h3>
            
            <motion.div 
               className="w-[420px] h-[600px] bg-white dark:bg-gray-800/80 rounded-[1rem] shadow-2xl overflow-hidden relative"
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.5 }}
            >
               {/* Resume Top Accent */}
               <div className={`h-3 w-full bg-gradient-to-r ${formData.role === "Recruiter" ? "from-indigo-600 to-purple-600" : "from-emerald-600 to-teal-600"}`}></div>

               <div className="p-8 h-full flex flex-col">
                  
                  {/* --- HEADER SECTION --- */}
                  <motion.div 
                    className={`flex items-start justify-between border-b border-gray-100 pb-6 mb-6 transition-all duration-300 ${focusedField === 'firstName' || focusedField === 'lastName' ? 'scale-[1.02] bg-gray-50/50 -mx-4 px-4 rounded-xl' : ''}`}
                  >
                    <div className="flex-1 pr-4">
                      {/* Dynamic Name */}
                      <h2 className={`text-2xl font-bold uppercase tracking-tight break-words ${formData.firstName || formData.lastName ? 'text-gray-900' : 'text-gray-300'}`}>
                        {(formData.firstName || formData.lastName) ? `${(formData.firstName || "").trim()} ${(formData.lastName || "").trim()}`.trim() : "Your Name"}
                      </h2>
                      {/* Dynamic Role */}
                      <p className={`text-sm font-bold tracking-widest uppercase mt-1 ${formData.role === "Recruiter" ? "text-indigo-600" : "text-emerald-600"}`}>
                        {formData.role === "Recruiter" ? "Hiring Manager" : "Job Seeker"}
                      </p>
                    </div>

                    {/* Dynamic Avatar */}
                    <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden border-2 border-gray-100 flex-shrink-0">
                      <Image
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(((formData.firstName || "") + " " + (formData.lastName || "")).trim() || "User")}`}
                        alt="avatar"
                        className="w-full h-full object-cover"
                        width={64}
                        height={64}
                      />
                    </div>
                  </motion.div>

                  {/* --- CONTACT SECTION --- */}
                  <motion.div 
                    className={`grid grid-cols-2 gap-4 mb-8 transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.02] bg-gray-50/50 -mx-4 px-4 py-2 rounded-xl' : ''}`}
                  >
                     <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block mb-0.5">Email</span>
                        <span className={`text-xs font-medium ${formData.email ? 'text-gray-700' : 'text-gray-300'}`}>
                          {formData.email || "email@example.com"}
                        </span>
                     </div>
                  </motion.div>

                  {/* --- COMPANY SECTION --- */}
                  <motion.div 
                    className={`mb-8 transition-all duration-300 ${focusedField === 'company' ? 'scale-[1.02] bg-gray-50/50 -mx-4 px-4 py-2 rounded-xl' : ''}`}
                  >
                    <h4 className="text-xs font-bold text-gray-900 uppercase border-b border-gray-100 pb-2 mb-3">
                      {formData.role === "Recruiter" ? "Hiring For" : "Experience"}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <p className={`text-xs leading-relaxed ${formData.company ? 'text-gray-600 font-semibold' : 'text-gray-300 italic'}`}>
                        {formData.company || "Company Name"}
                      </p>
                    </div>
                  </motion.div>

                  {/* --- SKILLS SECTION (Only for Candidate) --- */}
                  {formData.role === "Candidate" && (
                    <motion.div 
                      className={`transition-all duration-300 ${focusedField === 'skills' ? 'scale-[1.02] bg-gray-50/50 -mx-4 px-4 py-2 rounded-xl' : ''}`}
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
                             <span className="text-[10px] text-gray-300 italic">Add skills...</span>
                          )}
                       </div>
                    </motion.div>
                  )}

                  {/* --- RECRUITER PLACEHOLDER --- */}
                  {formData.role === "Recruiter" && (
                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg text-center mt-4">
                      <Search className="w-8 h-8 text-indigo-300 mx-auto mb-2" />
                      <p className="text-xs text-indigo-800 font-medium">Ready to find top talent?</p>
                    </div>
                  )}

                  {/* --- DECORATIVE WATERMARK --- */}
                  <div className="absolute bottom-4 right-6 opacity-10">
                    <Sparkles className={`w-12 h-12 ${formData.role === "Recruiter" ? "text-indigo-600" : "text-emerald-600"}`} />
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
          </div>
        </div>

      </div>
    </div>
      {/* Side Toast */}
      <SideToast
        isVisible={toast.visible}
        type={toast.type}
        title={toast.title}
        description={toast.desc}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </>
  );
}