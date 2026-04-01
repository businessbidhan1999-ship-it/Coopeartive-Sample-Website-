// src/lib/api-auth.ts
// Shared helper to protect admin API routes from unauthenticated access.
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function requireAdminSession(): Promise<
  { session: Awaited<ReturnType<typeof getSession>> & object; error: null } |
  { session: null; error: NextResponse }
> {
  const session = await getSession();
  if (!session) {
    return {
      session: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { session, error: null };
}
