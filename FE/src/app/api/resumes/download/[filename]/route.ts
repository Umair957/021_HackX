import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NODE_ENV === 'production' 
  ? process.env.PROD_SERVER_URL 
  : process.env.DEV_SERVER_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("__ZUME__")?.value;

    if (!token) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { filename } = await params;

    if (!filename) {
      return NextResponse.json(
        { status: "error", message: "Filename is required" },
        { status: 400 }
      );
    }

    // Forward the download request to the backend
    const response = await fetch(
      `${apiUrl}/api/v1/resume/download/${filename}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    // Get the file blob and headers
    const blob = await response.blob();
    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const contentDisposition = response.headers.get("content-disposition");

    // Create a NextResponse with the file
    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition || `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error in download route:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
