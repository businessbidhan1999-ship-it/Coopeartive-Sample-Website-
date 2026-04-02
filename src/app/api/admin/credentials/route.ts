// src/app/api/admin/credentials/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireAdminSession } from "@/lib/api-auth";
import { getAdminUsersFromFile, updateUserPassword } from "@/lib/admin-users";

const DUMMY_HASH = "$2b$12$invalidhashfortimingprotectiononly000000000000000000000";

// GET — list users (admin only, no hashes exposed)
export async function GET(): Promise<NextResponse> {
  const { session, error } = await requireAdminSession();
  if (error) return error;

  if (session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await getAdminUsersFromFile();
  const safe = users.map(({ username, role }) => ({ username, role }));
  return NextResponse.json(safe);
}

// PUT — change own password or reset another user's password
export async function PUT(request: NextRequest): Promise<NextResponse> {
  const { session, error } = await requireAdminSession();
  if (error) return error;

  let body: { targetUsername?: string; currentPassword?: string; newPassword?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { targetUsername, currentPassword, newPassword } = body;

  if (
    !targetUsername || typeof targetUsername !== "string" ||
    !currentPassword || typeof currentPassword !== "string" ||
    !newPassword || typeof newPassword !== "string"
  ) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  if (currentPassword.length > 128 || newPassword.length > 128) {
    return NextResponse.json({ error: "Password too long" }, { status: 400 });
  }

  if (newPassword.length < 8) {
    return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
  }

  const isOwnPassword = targetUsername === session.username;

  // Only admins can reset other users' passwords
  if (!isOwnPassword && session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await getAdminUsersFromFile();

  // Verify the caller's current password
  const caller = users.find((u) => u.username === session.username);
  const callerValid = await bcrypt.compare(currentPassword, caller?.passwordHash ?? DUMMY_HASH);
  if (!caller || !callerValid) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 403 });
  }

  // Check target user exists
  const target = users.find((u) => u.username === targetUsername);
  if (!target) {
    // Timing protection — still ran bcrypt above
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const newHash = await bcrypt.hash(newPassword, 12);
  const updated = await updateUserPassword(targetUsername, newHash);

  if (!updated) {
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
