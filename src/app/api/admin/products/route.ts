// src/app/api/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON, generateId } from "@/lib/json-store";
import { requireAdminSession } from "@/lib/api-auth";

interface Product {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  category: "loan" | "deposit" | "microfinance";
  rate: string;
  rateValue: number;
  description: string;
  features: string[];
  requirements: string[];
  facilities: string[];
  interestRates?: { period: string; rate: string }[];
}

export async function GET(): Promise<NextResponse> {
  const { error } = await requireAdminSession();
  if (error) return error;
  const products = await readJSON<Product[]>("products");
  return NextResponse.json(products);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { error } = await requireAdminSession();
  if (error) return error;

  const body = await request.json() as Partial<Product>;
  if (!body.name?.trim() || !body.category) {
    return NextResponse.json({ error: "Name and category are required" }, { status: 400 });
  }

  const products = await readJSON<Product[]>("products");
  const slug = body.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const newProduct: Product = {
    id: generateId(),
    slug: body.slug?.trim() || slug,
    name: body.name.trim(),
    emoji: body.emoji ?? "💳",
    category: body.category,
    rate: body.rate?.trim() ?? "",
    rateValue: body.rateValue ?? 0,
    description: body.description?.trim() ?? "",
    features: body.features ?? [],
    requirements: body.requirements ?? [],
    facilities: body.facilities ?? [],
  };
  products.push(newProduct);
  await writeJSON("products", products);
  return NextResponse.json(newProduct, { status: 201 });
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const { error } = await requireAdminSession();
  if (error) return error;

  const body = await request.json() as Product;
  if (!body.id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const products = await readJSON<Product[]>("products");
  const idx = products.findIndex((p) => p.id === body.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  products[idx] = { ...products[idx], ...body };
  await writeJSON("products", products);
  return NextResponse.json(products[idx]);
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const { error } = await requireAdminSession();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const products = await readJSON<Product[]>("products");
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await writeJSON("products", filtered);
  return NextResponse.json({ ok: true });
}
