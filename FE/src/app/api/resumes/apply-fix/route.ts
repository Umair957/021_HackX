import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"}/api/v1/resumes/apply-fix`,
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
