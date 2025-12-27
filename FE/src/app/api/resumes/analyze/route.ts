import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';

const apiUrl = process.env.NODE_ENV === 'production' 
  ? process.env.PROD_SERVER_URL 
  : process.env.DEV_SERVER_URL;

export async function POST(request: NextRequest) {
  try {
    // 1. Get the Authentication Token from Cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('__ZUME__')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized: Please log in." }, { status: 401 });
    }

    // 2. Decode JWT to get user_id
    let userId: string;
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      userId = payload.sub || payload.user_id || payload.id;
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 3. Get the file and job details from the request
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const jobTitle = formData.get('job_title') as string | null;
    const jobDescription = formData.get('job_description') as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 4. Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Invalid file type. Please upload PDF or Word documents only." 
      }, { status: 400 });
    }

    // 5. Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `File size exceeds 5MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB` 
      }, { status: 400 });
    }

    // 6. Create FormData for backend
    const backendFormData = new FormData();
    backendFormData.append('file', file);
    
    // Add job details if provided
    if (jobTitle) {
      backendFormData.append('job_title', jobTitle);
    }
    if (jobDescription) {
      backendFormData.append('job_description', jobDescription);
    }

    // 7. Send file to Backend API (FastAPI)
    const res = await fetch(`${apiUrl}/api/v1/resume/analyze`, {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${accessToken}`
      },
      body: backendFormData,
    });

    const data = await res.json();

    // 8. Handle Backend Errors
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    // 9. Success - Return Analysis Results
    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    console.error("Resume Analysis Route Error:", error);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error.message 
    }, { status: 500 });
  }
}
