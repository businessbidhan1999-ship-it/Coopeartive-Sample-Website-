import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/server/store';
import { requireAdminSession } from '@/lib/server/api-auth';

interface BaseSubmission {
  id: string;
  submittedAt: string;
  status: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { error } = await requireAdminSession();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') ?? 'applications';

  if (type !== 'applications' && type !== 'contacts') {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  const items = await readJSON<BaseSubmission[]>(`submissions/${type}`);
  // Return newest first
  return NextResponse.json([...items].reverse());
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const { error } = await requireAdminSession();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') ?? 'applications';

  if (type !== 'applications' && type !== 'contacts') {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  const body = (await request.json()) as { id: string; status: string };
  if (!body.id || !body.status) {
    return NextResponse.json({ error: 'ID and status required' }, { status: 400 });
  }

  const items = await readJSON<BaseSubmission[]>(`submissions/${type}`);
  const idx = items.findIndex((i) => i.id === body.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  items[idx].status = body.status;
  await writeJSON(`submissions/${type}`, items);
  return NextResponse.json({ ok: true });
}
