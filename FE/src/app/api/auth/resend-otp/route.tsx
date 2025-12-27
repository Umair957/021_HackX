import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NODE_ENV === 'production' 
  ? process.env.PROD_SERVER_URL 
  : process.env.DEV_SERVER_URL;
  
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data?.email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const url = `${apiUrl}/api/v1/auth/resend-otp`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const respBody = await response.json().catch(() => null);
    
    if (!response.ok) {
        return NextResponse.json(respBody || { error: "Failed to resend" }, { status: response.status });
    }

    return NextResponse.json(respBody, { status: response.status });
    
  } catch (error: any) {
    console.error("Error in resend-otp API route:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}