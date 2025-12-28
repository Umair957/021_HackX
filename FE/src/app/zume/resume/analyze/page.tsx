import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import AnalyzeClient from "./Analyze";

interface TokenPayload {
  sub: string; // email
  user_id: string;
  role: string;
}

export default async function AnalyzeResumePage() {
  // Read the httpOnly cookie on the server
  const cookieStore = await cookies();
  const token = cookieStore.get("__ZUME__")?.value;

  if (!token) {
    redirect("/auth/login");
  }

  // Decode the JWT to get user info
  let userRole = "candidate";
  let userEmail = "Unknown";
  
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    userRole = decoded.role?.toLowerCase() || "candidate";
    userEmail = decoded.sub || "Unknown";
    
  } catch (error) {
    console.error("❌ Token decode failed:", error);
  }

  // Pass the user info to the client component
  return <AnalyzeClient userRole={userRole} userEmail={userEmail} />;
}
