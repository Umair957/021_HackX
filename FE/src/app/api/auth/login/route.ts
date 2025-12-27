import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';

const apiUrl = process.env.NODE_ENV === 'production' 
  ? process.env.PROD_SERVER_URL 
  : process.env.DEV_SERVER_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const res = await fetch(`${apiUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    const accessToken = data.access_token;

    if (accessToken) {
      const cookieStore = await cookies();
      
      cookieStore.set({
        name: '__ZUME__',
        value: accessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      return NextResponse.json({ 
        message: "Login successful", 
        user: {
          user_name: data.user_name, role: data.role
        }
      }, { status: 200 });
    }

    return NextResponse.json({ error: "No token returned from backend" }, { status: 500 });

  } catch (error: any) {
    console.error("Login Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}