// src/lib/auth.ts
// JWT-based authentication utilities using jose (edge-compatible)
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const COOKIE_NAME = "rmcl_admin_session";
const EXPIRY_HOURS = parseInt(process.env.SESSION_EXPIRY_HOURS ?? "8");

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET environment variable is not set");
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  username: string;
  role: "admin" | "editor";
}

export async function createSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${EXPIRY_HOURS}h`)
    .sign(getSecret());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      username: payload.username as string,
      role: payload.role as "admin" | "editor",
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export interface AdminUser {
  username: string;
  passwordHash: string;
  role: "admin" | "editor";
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const { getAdminUsersFromFile } = await import("./admin-users");
  return getAdminUsersFromFile();
}
