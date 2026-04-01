// src/app/api/admin/news/route.ts
import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON, generateId } from "@/lib/json-store";
import { requireAdminSession } from "@/lib/api-auth";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  emoji: string;
  featured: boolean;
}

export async function GET(): Promise<NextResponse> {
  const { error } = await requireAdminSession();
  if (error) return error;
  const items = await readJSON<NewsItem[]>("news");
  return NextResponse.json(items);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { error } = await requireAdminSession();
  if (error) return error;

  const body = await request.json() as Partial<NewsItem>;
  if (!body.title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const items = await readJSON<NewsItem[]>("news");
  const newItem: NewsItem = {
    id: generateId(),
    title: body.title.trim(),
    excerpt: body.excerpt?.trim() ?? "",
    content: body.content?.trim() ?? "",
    date: body.date ?? new Date().toISOString().split("T")[0],
    category: body.category ?? "Announcement",
    emoji: body.emoji ?? "📢",
    featured: body.featured ?? false,
  };
  items.unshift(newItem);
  await writeJSON("news", items);
  return NextResponse.json(newItem, { status: 201 });
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const { error } = await requireAdminSession();
  if (error) return error;

  const body = await request.json() as NewsItem;
  if (!body.id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const items = await readJSON<NewsItem[]>("news");
  const idx = items.findIndex((n) => n.id === body.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  items[idx] = { ...items[idx], ...body };
  await writeJSON("news", items);
  return NextResponse.json(items[idx]);
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const { error } = await requireAdminSession();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const items = await readJSON<NewsItem[]>("news");
  const filtered = items.filter((n) => n.id !== id);
  if (filtered.length === items.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await writeJSON("news", filtered);
  return NextResponse.json({ ok: true });
}
