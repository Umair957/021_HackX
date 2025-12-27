import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.delete("__ZUME__"); 

  return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
}