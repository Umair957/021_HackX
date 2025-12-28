import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      return NextResponse.json(
        { status: "error", message: "Missing code or state parameter" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `http://localhost:8000/api/v1/gmail/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Failed to process callback",
      },
      { status: 500 }
    );
  }
}
