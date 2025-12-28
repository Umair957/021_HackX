import { cookies } from "next/headers";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("__ZUME__")?.value;

    console.log("Jobs API Route - GET request");
    console.log("Available cookies:", cookieStore.getAll().map(c => c.name));
    console.log("Token found:", !!token);

    if (!token) {
      console.error("No __ZUME__ token found in cookies");
      return Response.json(
        { status: "error", message: "Not authenticated" },
        { status: 401 }
      );
    }

    const response = await fetch(`${apiUrl}/api/v1/jobs`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Backend error:", response.status, errorData);
      return Response.json(
        { status: "error", message: "Failed to fetch jobs" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error: unknown) {
    console.error("Job fetch error:", error);
    return Response.json(
      { status: "error", message: error instanceof Error ? error.message : "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("__ZUME__")?.value;

  try {
    console.log("Jobs API Route - POST request");
    console.log("Available cookies:", cookieStore.getAll().map(c => c.name));
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

    const response = await fetch(`${apiUrl}/api/v1/jobs`, {
      method: "POST",
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
    console.log("Job created successfully:", data);
    return Response.json(data);
  } catch (error: unknown) {
    console.error("Job creation error:", error);
    return Response.json(
      { status: "error", message: error instanceof Error ? error.message : "Failed to create job" },
      { status: 500 }
    );
  }
}
