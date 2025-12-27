"use client";

import { useRouter } from "next/navigation"; // <--- 1. Import Router
import TiltedCard from "@/ui/TiltedCard"; // Verify this path
import { FilePlus, ScanSearch, ArrowRight } from "lucide-react";

export default function ResumeSelection() {
  const router = useRouter(); // <--- 2. Initialize Router

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-10 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header Section */}
      <div className="text-center mb-10 md:mb-16">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
          What would you like to do?
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
          Select an option below to start building your career profile.
        </p>
      </div>

      {/* Cards Container */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 w-full">
        
        {/* --- CARD 1: CREATE RESUME --- */}
        {/* We removed <Link> and added onClick to the div below */}
        <div 
          onClick={() => router.push("/zume/resume/create")} 
          className="cursor-pointer group relative z-10" // Added z-10 to ensure it's clickable
        >
          <TiltedCard
            imageSrc="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop"
            altText="Blue Gradient Background"
            captionText="Start Building"
            containerHeight="350px"
            containerWidth="300px"
            imageHeight="350px"
            imageWidth="300px"
            rotateAmplitude={12}
            scaleOnHover={1.05}
            showMobileWarning={false}
            showTooltip={true}
            displayOverlayContent={true}
            overlayContent={
              <CardOverlay
                icon={<FilePlus className="w-10 h-10 text-white" />}
                title="Create Resume"
                description="Build a professional, ATS-friendly resume from scratch."
                color="bg-blue-600"
              />
            }
          />
        </div>

        {/* --- CARD 2: ANALYZE RESUME --- */}
        <div 
          onClick={() => router.push("/zume/resume/analyze")} 
          className="cursor-pointer group relative z-10"
        >
          <TiltedCard
            imageSrc="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop"
            altText="Purple Tech Background"
            captionText="Get AI Feedback"
            containerHeight="350px"
            containerWidth="300px"
            imageHeight="350px"
            imageWidth="300px"
            rotateAmplitude={12}
            scaleOnHover={1.05}
            showMobileWarning={false}
            showTooltip={true}
            displayOverlayContent={true}
            overlayContent={
              <CardOverlay
                icon={<ScanSearch className="w-10 h-10 text-white" />}
                title="Analyze Resume"
                description="Upload your existing resume to get an AI score & fix errors."
                color="bg-purple-600"
              />
            }
          />
        </div>

      </div>
    </div>
  );
}

// --- Helper Component ---
function CardOverlay({ icon, title, description, color }: any) {
  return (
    // Added pointer-events-none to text so clicks pass through to the parent div
    <div className="flex flex-col justify-between h-full w-full p-6 bg-black/30 hover:bg-black/20 transition-colors duration-500 rounded-[15px] pointer-events-none">
      <div className="flex justify-between items-start">
        <div className={`${color} p-3 rounded-xl shadow-lg backdrop-blur-md bg-opacity-90`}>
          {icon}
        </div>
        <div className="bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowRight className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="space-y-2 mt-auto">
        <h2 className="text-2xl font-bold text-white drop-shadow-md tracking-tight">
          {title}
        </h2>
        <p className="text-sm text-white/90 leading-relaxed drop-shadow-sm font-medium">
          {description}
        </p>
      </div>
    </div>
  );
}