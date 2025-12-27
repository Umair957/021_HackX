import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';

const apiUrl = process.env.NODE_ENV === 'production' 
  ? process.env.PROD_SERVER_URL 
  : process.env.DEV_SERVER_URL;

export async function POST(request: NextRequest) {
  try {
    // 1. Get the Authentication Token from Cookies
    // You set this as '__ZUME__' in your login route
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('__ZUME__')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized: Please log in." }, { status: 401 });
    }

    // 2. Decode JWT to get user_id
    // Simple JWT decode (payload is base64 encoded between the dots)
    let userId: string;
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      userId = payload.sub || payload.user_id || payload.id;
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 3. Get the Resume Data from the Request Body
    const body = await request.json();

    // 4. Add user_id to the body
    body.user_id = userId;

    // 5. Send Data to Backend API (FastAPI)
    const res = await fetch(`${apiUrl}/api/v1/resume/resume-create/`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    // 6. Handle Backend Errors
    if (!res.ok) {
      // Pass the backend's error message to the frontend
      return NextResponse.json(data, { status: res.status });
    }

    // 7. Success
    return NextResponse.json({ 
      message: "Resume created successfully", 
      data: data // The created resume object returned by backend
    }, { status: 201 });

  } catch (error: any) {
    console.error("Resume Creation Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}