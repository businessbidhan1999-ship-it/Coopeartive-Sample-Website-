// src/app/api/admin/branches/route.ts
import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON, generateId } from "@/lib/json-store";
import { requireAdminSession } from "@/lib/api-auth";

interface Branch {
  id: string;
  name: string;
  type: string;
  inCharge: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  isHQ: boolean;
}

export async function GET(): Promise<NextResponse> {
  const { error } = await requireAdminSession();
  if (error) return error;
  const branches = await readJSON<Branch[]>("branches");
  return NextResponse.json(branches);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { error } = await requireAdminSession();
  if (error) return error;

  const body = await request.json() as Partial<Branch>;
  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Branch name is required" }, { status: 400 });
  }

  const branches = await readJSON<Branch[]>("branches");
  const newBranch: Branch = {
    id: generateId(),
    name: body.name.trim(),
    type: body.type ?? "Branch",
    inCharge: body.inCharge?.trim() ?? "",
    address: body.address?.trim() ?? "",
    phone: body.phone?.trim() ?? "",
    lat: body.lat ?? 27.7172,
    lng: body.lng ?? 85.3240,
    isHQ: body.isHQ ?? false,
  };
  branches.push(newBranch);
  await writeJSON("branches", branches);
  return NextResponse.json(newBranch, { status: 201 });
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const { error } = await requireAdminSession();
  if (error) return error;

  const body = await request.json() as Branch;
  if (!body.id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const branches = await readJSON<Branch[]>("branches");
  const idx = branches.findIndex((b) => b.id === body.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  branches[idx] = { ...branches[idx], ...body };
  await writeJSON("branches", branches);
  return NextResponse.json(branches[idx]);
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const { error } = await requireAdminSession();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const branches = await readJSON<Branch[]>("branches");
  const filtered = branches.filter((b) => b.id !== id);
  if (filtered.length === branches.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await writeJSON("branches", filtered);
  return NextResponse.json({ ok: true });
}
