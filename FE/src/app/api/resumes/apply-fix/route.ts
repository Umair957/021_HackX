import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const apiUrl = process.env.NODE_ENV === 'production' 
  ? process.env.PROD_SERVER_URL 
  : process.env.DEV_SERVER_URL;

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("__ZUME__")?.value;

    if (!token) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const cvContent = formData.get("cv_content") as string;
    const fixInstruction = formData.get("fix_instruction") as string;
    const category = formData.get("category") as string;
    const originalFilename = formData.get("original_filename") as string;
    const file = formData.get("file") as File | null;

    if (!cvContent || !fixInstruction) {
      return NextResponse.json(
        { status: "error", message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Forward the request to the backend
    const backendFormData = new FormData();
    backendFormData.append("cv_content", cvContent);
    backendFormData.append("fix_instruction", fixInstruction);
    backendFormData.append("category", category);
    if (originalFilename) {
      backendFormData.append("original_filename", originalFilename);
    }
    // Forward the original file if provided to preserve structure
    if (file) {
      backendFormData.append("file", file);
    }

    const response = await fetch(
      `${apiUrl}/api/v1/resume/apply-fix`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: backendFormData,
      }
    );

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error in apply-fix route:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
