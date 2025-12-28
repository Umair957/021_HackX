import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("__ZUME__")?.value;

    if (!token) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    console.log("Fetching trends from:", `${apiUrl}/api/v1/trends`);

    const response = await fetch(
      `${apiUrl}/api/v1/trends`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    console.log("Trends API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Trends API error:", errorText);
      return NextResponse.json(
        { status: "error", message: `Backend error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Trends data received:", data);
    
    return NextResponse.json({
      status: "success",
      data: data,
    });
  } catch (error: unknown) {
    console.error("Trends API route error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch trends";
    return NextResponse.json(
      { status: "error", message },
      { status: 500 }
    );
  }
}
