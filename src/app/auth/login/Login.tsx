"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Github, Facebook, Mail, Lock, 
  CheckCircle2, Star, MapPin, Loader2, ArrowLeft,  
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  // --- STATE MANAGEMENT ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Interaction States
  const [isTyping, setIsTyping] = useState(false);
  const [isFound, setIsFound] = useState(false); // Email found (show blurred resume)
  const [isLoading, setIsLoading] = useState(false); // API Loading
  const [isUnlocked, setIsUnlocked] = useState(false); // Password correct (unblur)
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // --- HANDLERS ---

  // Handle Email Input (The "Finding" Logic)
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsTyping(true);

    // Debounce: Stop "typing" animation and "Find" the user after pause
    const timeout = setTimeout(() => {
      setIsTyping(false);
      if (value.length > 4) {
        setIsFound(true);
      } else {
        setIsFound(false);
      }
    }, 600);

    return () => clearTimeout(timeout);
  };

  // Handle Login (The "Unlock" Logic)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) return setError("Email and password are required");

    setIsLoading(true);
    try {
      const payload = { email: email.trim(), password };
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        setIsUnlocked(true);
        // redirect after a short delay to show success
        setTimeout(() => {
          router.push('/zume/dashboard');
        }, 800);
      } else {
        setError(data?.message || data?.error || 'Invalid credentials');
      }
    } catch (err : Eror) {
      setError(err?.message || 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/5 dark:bg-emerald-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-500/5 dark:bg-teal-900/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center relative z-10">
        
        {/* --- LEFT COLUMN: LOGIN FORM --- */}
        <div className="text-gray-900 dark:text-white p-4 md:p-8 lg:p-12 order-2 lg:order-1">
          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mb-8">
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
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 md:mb-12"
          >
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">ZUME</h1>
          </motion.div>

          <div className="max-w-md mx-auto lg:mx-0">
            <h2 className="text-xl md:text-2xl mb-2 font-bold text-gray-900 dark:text-white">
              {isUnlocked ? "Welcome Back!" : "Access your Profile"}
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-8 md:mb-10">
              {isFound 
                ? "We found your resume on file. Enter password to unlock." 
                : "Enter your email to find your resume."}
            </p>

            <form onSubmit={handleLogin} className="space-y-5 md:space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 ml-1">Email</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={handleEmailChange}
                    className={`w-full bg-gray-50 dark:bg-gray-900 border text-gray-900 dark:text-white rounded-xl px-4 py-4 focus:outline-none focus:ring-2 transition-all font-medium placeholder-gray-400 dark:placeholder-gray-500 ${
                        isFound ? 'border-emerald-500 dark:border-emerald-400 ring-1 ring-emerald-500 dark:ring-emerald-400' : 'border-gray-200 dark:border-gray-700 focus:ring-emerald-500 dark:focus:ring-emerald-400'
                    }`}
                    placeholder="Enter your email to search..."
                    disabled={isUnlocked} // Disable after login
                  />
                  <div className="absolute right-4 top-4">
                     {isTyping ? (
                         <Loader2 className="w-5 h-5 text-gray-500 dark:text-gray-400 animate-spin" />
                     ) : isFound ? (
                         <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                     ) : (
                         <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                     )}
                  </div>
                </div>
              </div>

              {/* Password Input (Only show if found or just always show but highlight) */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
              >
                <label className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 ml-1">Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all font-black tracking-widest placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="••••••••"
                    disabled={isUnlocked}
                  />
                  <Lock className="absolute right-4 top-4 w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
              </motion.div>

              {/* Sign In Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading || isUnlocked}
                className={`w-full font-bold py-3.5 md:py-4 rounded-xl transition-all shadow-lg text-base md:text-lg flex items-center justify-center gap-2
                    ${isUnlocked 
                        ? 'bg-emerald-600 dark:bg-emerald-500 text-white' 
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 hover:from-emerald-700 hover:to-teal-700 dark:hover:from-emerald-600 dark:hover:to-teal-600 text-white shadow-emerald-500/20 dark:shadow-emerald-900/30'
                    }`}
              >
                {isLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Verifying Credentials...</>
                ) : isUnlocked ? (
                    <><CheckCircle2 className="w-5 h-5" /> Success! Redirecting...</>
                ) : (
                    "Sign in"
                )}
              </motion.button>
              <Link href="/auth/signup" className="block text-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-xs md:text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
              >
                Need an account? <span className="font-bold ml-1">Sign Up</span>
              </motion.button>
            </Link>
              
              {/* Divider & Socials (Hide on success to clean up UI) */}
              {!isUnlocked && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="relative flex py-3 md:py-4 items-center">
                        <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                        <span className="flex-shrink mx-3 md:mx-4 text-gray-500 dark:text-gray-400 text-xs md:text-sm">Or continue with</span>
                        <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                    </div>

                    <div className="flex justify-center gap-3 md:gap-4">
                        <SocialButton icon={<GoogleIcon />} />
                        <SocialButton icon={<Github className="w-5 h-5 text-gray-700 dark:text-white" />} />
                        <SocialButton icon={<Facebook className="w-5 h-5 text-gray-700 dark:text-white" />} />
                    </div>
                  </motion.div>
              )}
            </form>
          </div>
        </div>

        {/* --- RIGHT COLUMN: INTERACTIVE RESUME STACK --- */}
        <div className="relative h-[500px] md:h-[600px] lg:h-[800px] flex items-center justify-center order-1 lg:order-2 perspective-1000">
          
          <div className="relative w-full h-full flex items-center justify-center">
            
            {/* 
                THE STACK LOGIC:
                Background cards animate/wiggle when "isTyping" is true to simulate shuffling.
            */}
            
            {/* Resume 1 (Bottom) */}
            <motion.div 
               animate={{ 
                   rotate: isTyping ? -18 : -15, 
                   x: isTyping ? -10 : 0 
               }}
               className="absolute w-[240px] sm:w-[280px] md:w-[320px] lg:w-[360px] h-[380px] sm:h-[420px] md:h-[450px] lg:h-[480px] bg-gradient-to-br from-gray-600 to-gray-700 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl border border-gray-500/50 opacity-30 scale-90 top-[40px] sm:top-[50px] md:top-[60px]"
            />

            {/* Resume 2 (Middle) */}
            <motion.div 
               animate={{ 
                   rotate: isTyping ? 15 : 10, 
                   x: isTyping ? 10 : 0 
               }}
               className="absolute w-[240px] sm:w-[280px] md:w-[320px] lg:w-[360px] h-[380px] sm:h-[420px] md:h-[450px] lg:h-[480px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl border border-gray-300 dark:border-gray-600 opacity-60 scale-95 top-[20px] sm:top-[25px] md:top-[30px]"
            />

            {/* THE MAIN CARD (TOP) - Switches between Generic and User */}
            <AnimatePresence mode="wait">
                {!isFound ? (
                    // 1. GENERIC / DUMMY CARD
                    <motion.div 
                        key="generic-card"
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0, rotate: -2 }}
                        exit={{ opacity: 0, x: 100, rotate: 20 }}
                        transition={{ duration: 0.4 }}
                        className="absolute w-[240px] sm:w-[280px] md:w-[320px] lg:w-[360px] h-[380px] sm:h-[420px] md:h-[450px] lg:h-[480px] bg-white dark:bg-gray-900 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden z-10 border border-gray-200 dark:border-gray-800"
                    >
                        <div className="h-full p-4 sm:p-5 md:p-6 flex flex-col items-center justify-center opacity-30 grayscale">
                             <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gray-200 dark:bg-white-700 rounded-full mb-3 md:mb-4"></div>
                             <div className="h-3 sm:h-3.5 md:h-4 w-28 sm:w-32 bg-gray-200 dark:bg-white-700 rounded mb-2"></div>
                             <div className="h-2 sm:h-2.5 md:h-3 w-20 sm:w-24 bg-gray-200 dark:bg-white-700 rounded mb-6 md:mb-8"></div>
                             <div className="w-full h-1.5 sm:h-2 bg-gray-100 dark:bg-white-800 rounded mb-1.5 sm:mb-2"></div>
                             <div className="w-full h-1.5 sm:h-2 bg-gray-100 dark:bg-white-800 rounded mb-1.5 sm:mb-2"></div>
                             <div className="w-2/3 h-1.5 sm:h-2 bg-gray-100 dark:bg-white-800 rounded mb-1.5 sm:mb-2"></div>
                             <p className="mt-8 md:mt-10 font-bold text-gray-400 dark:text-white text-center text-xs sm:text-sm">Enter email to <br/> find resume...</p>
                        </div>
                    </motion.div>
                ) : (
                    // 2. USER FOUND CARD (Initially Blurred)
                    <motion.div 
                        key="user-card"
                        initial={{ opacity: 0, x: -100, rotate: -10 }}
                        animate={{ 
                            opacity: 1, 
                            x: isRedirecting ? 400 : 0, // Fly away on redirect
                            rotate: isRedirecting ? 20 : -2 
                        }}
                        transition={{ type: "spring", bounce: 0.3 }}
                        className="absolute w-[240px] sm:w-[280px] md:w-[320px] lg:w-[360px] h-[380px] sm:h-[420px] md:h-[450px] lg:h-[480px] bg-white dark:bg-gray-900 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden z-20 border border-gray-200 dark:border-gray-800"
                    >
                        {/* --- RESUME HEADER (Always Visible) --- */}
                        <div className="p-4 sm:p-5 md:p-6 pb-2 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 relative z-20">
                             <div className="flex flex-col items-center">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full mb-2 md:mb-3 p-1 border-2 border-emerald-600 dark:border-emerald-400 relative">
                                    <Image
                                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent((email || "User").trim())}`}
                                      alt="User"
                                      width={80}
                                      height={80}
                                      className="w-full h-full rounded-full"
                                    />
                                    {isUnlocked && (
                                        <motion.div 
                                            initial={{ scale: 0 }} 
                                            animate={{ scale: 1 }}
                                            className="absolute bottom-0 right-0 bg-emerald-600 dark:bg-emerald-500 text-white rounded-full p-0.5 sm:p-1 border border-white dark:border-gray-900"
                                        >
                                            <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                        </motion.div>
                                    )}
                                </div>
                                
                                {/* Username / Email Display */}
                                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate w-full text-center px-2">
                                    {email.split('@')[0]}
                                </h3>
                                <p className="text-[10px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase truncate max-w-full px-2">
                                    {email}
                                </p>
                             </div>
                        </div>

                        {/* --- RESUME BODY (Blurred if Locked) --- */}
                        <div className="relative h-full p-4 sm:p-5 md:p-6 pt-3 sm:pt-4">
                            
                            {/* The Blur Overlay */}
                            <motion.div 
                                animate={{ 
                                    opacity: isUnlocked ? 0 : 1,
                                    backdropFilter: isUnlocked ? "blur(0px)" : "blur(8px)" 
                                }}
                                className={`absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/30 dark:bg-gray-900/30 transition-all duration-700 ${isUnlocked ? 'pointer-events-none' : ''}`}
                            >
                                {!isUnlocked && (
                                    <div className="bg-black/80 dark:bg-black/90 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5 sm:gap-2 shadow-xl backdrop-blur-md">
                                        <Lock className="w-3 h-3 sm:w-4 sm:h-4" /> 
                                        <span className="text-[10px] sm:text-xs font-bold">Details Locked</span>
                                    </div>
                                )}
                            </motion.div>

                            {/* Actual Content (Blurred via container overlay visually) */}
                            <div className={`space-y-4 sm:space-y-5 md:space-y-6 transition-all duration-700 ${isUnlocked ? 'blur-0' : 'blur-[6px]'}`}>
                                {/* Contact Grid */}
                                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                    <div className="flex items-center gap-1 sm:gap-2 text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-1.5 sm:p-2 rounded-lg">
                                        <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 dark:text-emerald-400" /> <span className="hidden sm:inline">Location</span><span className="sm:hidden">NY</span>
                                    </div>
                                    <div className="flex items-center gap-1 sm:gap-2 text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-1.5 sm:p-2 rounded-lg">
                                        <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 dark:text-emerald-400" /> 5.0 Rating
                                    </div>
                                </div>

                                {/* Experience */}
                                <div>
                                    <h4 className="text-[9px] sm:text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1.5 sm:mb-2">Experience</h4>
                                    <div className="relative pl-2 sm:pl-3 border-l-2 border-gray-100 dark:border-gray-800 space-y-3 sm:space-y-4">
                                        <div className="relative">
                                            <div className="absolute -left-[13px] sm:-left-[17px] top-1 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-600 dark:bg-emerald-400"></div>
                                            <div className="flex justify-between items-baseline mb-0.5 sm:mb-1">
                                                <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">Latest Job</span>
                                                <span className="text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500">Present</span>
                                            </div>
                                            <div className="h-1.5 sm:h-2 w-full bg-gray-100 dark:bg-gray-800 rounded mb-0.5 sm:mb-1"></div>
                                            <div className="h-1.5 sm:h-2 w-2/3 bg-gray-100 dark:bg-gray-800 rounded"></div>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute -left-[13px] sm:-left-[17px] top-1 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                                            <div className="flex justify-between items-baseline mb-0.5 sm:mb-1">
                                                <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">Previous Job</span>
                                                <span className="text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500">2020-2022</span>
                                            </div>
                                            <div className="h-1.5 sm:h-2 w-full bg-gray-100 dark:bg-gray-800 rounded mb-0.5 sm:mb-1"></div>
                                            <div className="h-1.5 sm:h-2 w-2/3 bg-gray-100 dark:bg-gray-800 rounded"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div>
                                     <h4 className="text-[9px] sm:text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1.5 sm:mb-2">Skills</h4>
                                     <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                        {[1,2,3,4].map(i => (
                                            <div key={i} className="h-4 sm:h-5 w-10 sm:w-12 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-md"></div>
                                        ))}
                                     </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Widgets (Only show when found) */}
            <AnimatePresence>
                {isFound && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-[8%] sm:bottom-[10%] right-[5%] sm:right-[10%] z-30 bg-white dark:bg-gray-900 border border-emerald-500 dark:border-emerald-400 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-xl flex items-center gap-2 sm:gap-3"
                    >
                        <div className="bg-emerald-600 dark:bg-emerald-500 p-1 sm:p-1.5 rounded-full text-white">
                            <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                        <div>
                            <p className="text-[10px] sm:text-xs font-bold text-gray-900 dark:text-white">Resume Found</p>
                            <p className="text-[9px] sm:text-[10px] text-gray-600 dark:text-gray-400">Ready to unlock</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
        </div>
      </div>  
    </div>
    
  );
}

// --- Helper Components ---
function SocialButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button type="button" className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-emerald-500 dark:hover:border-emerald-400 hover:scale-105 transition-all duration-300">
      {icon}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}