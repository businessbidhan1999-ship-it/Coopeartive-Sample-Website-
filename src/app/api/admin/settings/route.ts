// src/app/api/admin/settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/json-store";
import { requireAdminSession } from "@/lib/api-auth";

export async function GET(): Promise<NextResponse> {
  const { error } = await requireAdminSession();
  if (error) return error;
  const settings = await readJSON<object>("settings");
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const { error } = await requireAdminSession();
  if (error) return error;
  const body = await request.json() as object;
  await writeJSON("settings", body);
  return NextResponse.json({ ok: true });
}
