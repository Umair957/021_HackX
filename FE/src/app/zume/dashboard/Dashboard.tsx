"use client";

import CandidateDashboard from "./candidateDashboard/candidate";
import RecruiterDashboard from "./recruiterDashboard/recruiter";

interface DashboardProps {
  role: string;
}

export default function DashboardClient({ role }: DashboardProps) {
  const isCandidate = role === "candidate";

  // Route to the appropriate dashboard based on role
  if (isCandidate) {
    return <CandidateDashboard />;
  }

  return <RecruiterDashboard />;
}