import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Sidebar } from "@/app/sidebar/Sidebar"; // Check your path

interface TokenPayload {
  role: string;
  user_name: string;
}

export default async function ZumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Get Token & Security Check
  const cookieStore = await cookies();
  const token = cookieStore.get("__ZUME__")?.value;

  if (!token) {
    redirect("/auth/login");
  }

  // 2. Decode Role (to pass to Sidebar)
  let userRole = "candidate";
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    userRole = decoded.role;
  } catch (error) {
    console.error("Token decode failed", error);
  }

  // 3. Render: Sidebar (Left) + Page Content (Right)
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      
      {/* The Sidebar is called HERE in the layout */}
      <aside className="hidden md:block w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <Sidebar role={userRole} />
      </aside>

      {/* The Page (Dashboard/Resume) is loaded HERE */}
      <main className="flex-1 h-full overflow-y-auto">
        {children}
      </main>

    </div>
  );
}