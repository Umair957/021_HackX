import {NextRequest, NextResponse} from "next/server";


// ------------------------
// Backend server URL
// ------------------------
const apiUrl = process.env.NODE_ENV === 'production' 
  ? process.env.PROD_SERVER_URL 
  : process.env.DEV_SERVER_URL;
  
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const response = await fetch(`${apiUrl}/api/v1/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const respBody = await response.json().catch(() => null);
    return NextResponse.json(respBody, {status: response.status});
  } catch (error: any) {
    console.error("Error in signup API route:", error);
    return NextResponse.json({ error: String(error) }, {status: error?.status || 500});
  }
}