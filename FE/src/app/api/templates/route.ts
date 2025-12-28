import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("__ZUME__")?.value;

    if (!token) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const is_premium = searchParams.get("is_premium");

    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/templates`;
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (is_premium) params.append("is_premium", is_premium);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();

    return NextResponse.json({
      status: "success",
      data: data,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { status: "error", message },
      { status: 500 }
    );
  }
}
