// src/app/api/admin/rates/route.ts
import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/json-store";
import { requireAdminSession } from "@/lib/api-auth";

interface RateRow { product: string; minRate: number; maxRate: number; unit: string; }
interface RatesData { loans: RateRow[]; deposits: RateRow[]; }

export async function GET(): Promise<NextResponse> {
  const { error } = await requireAdminSession();
  if (error) return error;
  const rates = await readJSON<RatesData>("rates");
  return NextResponse.json(rates);
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const { error } = await requireAdminSession();
  if (error) return error;

  const body = await request.json() as RatesData;
  if (!body.loans || !body.deposits) {
    return NextResponse.json({ error: "Invalid rates data" }, { status: 400 });
  }
  await writeJSON("rates", body);
  return NextResponse.json({ ok: true });
}
