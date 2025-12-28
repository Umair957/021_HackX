import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  sub: string; // email
  user_id: string;
  role: string;
  exp: number;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("__ZUME__")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Decode the JWT token
    const decoded = jwtDecode<TokenPayload>(token);

    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      return NextResponse.json(
        { error: "Token expired" },
        { status: 401 }
      );
    }

    // Return user information
    return NextResponse.json({
      email: decoded.sub,
      user_id: decoded.user_id,
      role: decoded.role,
    });
  } catch (error) {
    console.error("Error decoding token:", error);
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
  }
}
