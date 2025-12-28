import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("__ZUME__")?.value;

    if (!token) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/templates/categories/list`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { status: "error", message },
      { status: 500 }
    );
  }
}
