import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

import { COOKIE_NAME, sessionHours, sessionSecret } from './session-config';
export { COOKIE_NAME } from './session-config';

export interface SessionPayload {
  username: string;
  role: 'admin' | 'editor';
}

export async function createSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${sessionHours()}h`)
    .sign(sessionSecret());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, sessionSecret());
    return {
      username: payload.username as string,
      role: payload.role as 'admin' | 'editor',
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
  role: 'admin' | 'editor';
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const { getAdminUsersFromFile } = await import('./admin-users');
  return getAdminUsersFromFile();
}
