import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';

const apiUrl = process.env.NODE_ENV === 'production' 
  ? process.env.PROD_SERVER_URL 
  : process.env.DEV_SERVER_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('__ZUME__');

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Forward to backend with token in Authorization header
    const res = await fetch(`${apiUrl}/api/v1/resume/history/${id}`, {
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
    if (process.env.NODE_ENV === 'development') {
      console.error("Analysis Detail Route Error:", error.message);
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
