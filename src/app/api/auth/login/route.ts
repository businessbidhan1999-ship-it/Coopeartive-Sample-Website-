// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSession, getAdminUsers, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { username, password } = body;

  if (
    !username || typeof username !== "string" ||
    !password || typeof password !== "string"
  ) {
    return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
  }

  // Sanitize: limit input length to prevent excessive bcrypt work
  if (username.length > 64 || password.length > 128) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const users = await getAdminUsers();
  const user = users.find((u) => u.username === username);

  // Always run bcrypt compare to prevent timing attacks (even if user not found)
  const dummyHash = "$2b$12$invalidhashfortimingprotectiononly000000000000000000000";
  const isValid = await bcrypt.compare(password, user?.passwordHash ?? dummyHash);

  if (!user || !isValid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createSession({ username: user.username, role: user.role });
  const expiryHours = parseInt(process.env.SESSION_EXPIRY_HOURS ?? "8");

  const response = NextResponse.json({ ok: true, username: user.username, role: user.role });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: expiryHours * 60 * 60,
    path: "/",
  });

  return response;
}
