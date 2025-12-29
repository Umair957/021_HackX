import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const apiUrl = process.env.NODE_ENV === 'production' 
  ? process.env.PROD_SERVER_URL 
  : process.env.DEV_SERVER_URL;

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('__ZUME__');

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const days = searchParams.get('days') || '30';
    
    // Fetch recruiter analytics from backend
    const res = await fetch(`${apiUrl}/api/v1/dashboard/recruiter?days=${days}`, {
      method: "GET",
      headers: { 
        "Authorization": `Bearer ${token.value}`,
        "Content-Type": "application/json"
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    console.error("Recruiter dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data", detail: error.message },
      { status: 500 }
    );
  }
}
