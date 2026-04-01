// src/app/api/auth/session/route.ts
// Returns current session info (used by admin layout to display username)
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET(): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, username: session.username, role: session.role });
}
