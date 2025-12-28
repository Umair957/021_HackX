import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

export async function POST(req: NextRequest) {
  try {
    // Get the JWT token from cookies
    const token = req.cookies.get("__ZUME__")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token found" },
        { status: 401 }
      );
    }

    // Get the form data from the request
    const formData = await req.formData();

    // Forward the request to the FastAPI backend
    const response = await fetch(`${BACKEND_URL}/api/v1/resume/analyze-bulk`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: data.detail || data.error || "Failed to analyze resumes",
          detail: data.detail 
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Bulk analysis API error:", error);
    return NextResponse.json(
      { error: "Internal server error", detail: error.message },
      { status: 500 }
    );
  }
}
