import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import DashboardClient from "./Dashboard";

interface TokenPayload {
  role: string;
}

export default async function DashboardPage() {
  // 1. Fetch Cookie Again (Required because Layouts can't pass data to Pages)
  const cookieStore = await cookies();
  const token = cookieStore.get("__ZUME__")?.value;
  
  let userRole = "candidate";

  if (token) {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      userRole = decoded.role;
    } catch (e) {}
  }

  // 2. Render the Dashboard Component
  return (
    <div className="p-6">
      <DashboardClient role={userRole} />
    </div>
  );
}