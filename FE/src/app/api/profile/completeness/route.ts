import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("__ZUME__")?.value;

    if (!token) {
      return NextResponse.json(
        { status: "error", message: "No access token found" },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_URL}/api/v1/profile/completeness`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          status: "error",
          message: data.detail || "Failed to fetch completeness",
          data: null,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Completeness fetched successfully",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile Completeness API Error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch completeness",
        data: null,
      },
      { status: 500 }
    );
  }
}
