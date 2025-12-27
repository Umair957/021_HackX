import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NODE_ENV === 'production' 
  ? process.env.PROD_SERVER_URL 
  : process.env.DEV_SERVER_URL;
  
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data?.email || !data?.otp) {
      return NextResponse.json({ error: 'Missing email or otp' }, { status: 400 });
    }

    const url = `${apiUrl}/api/v1/auth/verify-otp`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const respBody = await response.json().catch(() => null);

    if (!response.ok) {
        return NextResponse.json(respBody || { error: "Verification failed" }, { status: response.status });
    }

    return NextResponse.json(respBody, { status: response.status });
    
  } catch (error: any) {
    console.error("Error in verify-otp API route:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}