// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/server/auth';

export async function POST(): Promise<NextResponse> {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
  return response;
}
