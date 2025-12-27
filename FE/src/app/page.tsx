import { cookies } from "next/headers";
import Navbar from "@/components//Navbar"; 

// Keep your existing landing page components
import HeroSection from "@/components/Hero";
import ProblemSolution from "@/components/ProblemSolution";
import Benefits from "@/components/Benefits";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import PricingCard from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import ListWishlist from "@/components/WaitList";
import Footer from "@/components/Footer";

// 1. Make the component async
export default async function Home() {
  // 2. Check for auth cookies on the server
  const cookieStore = await cookies();
  const isLoggedIn = 
    cookieStore.has("__ZUME__") || 
    cookieStore.has("auth-token") || 
    cookieStore.has("next-auth.session-token");

  return (
    <main 
      className="min-h-screen"
      style={{ background: 'var(--background)' }}
    >
      {/* 3. Pass the result to the Navbar */}
      <Navbar isLoggedIn={isLoggedIn} />
      
      <HeroSection />
      <ProblemSolution />
      <Benefits />
      <Features />
      <HowItWorks /> 
      <PricingCard />
      <FAQ />
      <ListWishlist />
      <Footer />
    </main>
  );
}