import { cookies } from "next/headers";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const jobId = id;
  const cookieStore = await cookies();
  const token = cookieStore.get("__ZUME__")?.value;

  try {
    console.log("Jobs API Route - PUT request for job:", jobId);
    console.log("Token found:", !!token);

    if (!token) {
      console.error("No __ZUME__ token found in cookies");
      return Response.json(
        { status: "error", message: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("Request body:", body);

    const response = await fetch(`${apiUrl}/api/v1/jobs/${jobId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Backend error:", response.status, errorData);
      return Response.json(
        { status: "error", message: `Backend error: ${errorData}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Job updated successfully:", data);
    return Response.json(data);
  } catch (error: unknown) {
    console.error("Job update error:", error);
    return Response.json(
      { status: "error", message: error instanceof Error ? error.message : "Failed to update job" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const jobId = id;
  const cookieStore = await cookies();
  const token = cookieStore.get("__ZUME__")?.value;

  try {
    console.log("Jobs API Route - DELETE request for job:", jobId);
    console.log("Token found:", !!token);

    if (!token) {
      console.error("No __ZUME__ token found in cookies");
      return Response.json(
        { status: "error", message: "Not authenticated" },
        { status: 401 }
      );
    }

    const response = await fetch(`${apiUrl}/api/v1/jobs/${jobId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Backend error:", response.status, errorData);
      return Response.json(
        { status: "error", message: `Backend error: ${errorData}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Job deleted successfully:", data);
    return Response.json(data);
  } catch (error: unknown) {
    console.error("Job deletion error:", error);
    return Response.json(
      { status: "error", message: error instanceof Error ? error.message : "Failed to delete job" },
      { status: 500 }
    );
  }
}
