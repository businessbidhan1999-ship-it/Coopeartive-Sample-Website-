import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, generateId } from '@/lib/server/store';
import { requireAdminSession } from '@/lib/server/api-auth';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
}

interface ChairmanData {
  name: string;
  title: string;
  message: string;
  imageUrl: string;
}

interface TeamData {
  chairman: ChairmanData;
  boardOfDirectors: TeamMember[];
  topManagement: TeamMember[];
}

export async function GET(): Promise<NextResponse> {
  const { error } = await requireAdminSession();
  if (error) return error;
  const team = await readJSON<TeamData>('team');
  return NextResponse.json(team);
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const { error } = await requireAdminSession();
  if (error) return error;

  const body = (await request.json()) as {
    action: string;
    section: string;
    member?: TeamMember;
    id?: string;
    chairman?: ChairmanData;
  };

  const team = await readJSON<TeamData>('team');

  if (body.action === 'update-chairman' && body.chairman) {
    team.chairman = { ...team.chairman, ...body.chairman };
    await writeJSON('team', team);
    return NextResponse.json(team.chairman);
  }

  if (body.action === 'add' && body.section && body.member) {
    const newMember: TeamMember = {
      id: generateId(),
      name: body.member.name.trim(),
      role: body.member.role.trim(),
      imageUrl: body.member.imageUrl ?? '',
    };
    if (body.section === 'board') {
      team.boardOfDirectors.push(newMember);
    } else if (body.section === 'management') {
      team.topManagement.push(newMember);
    }
    await writeJSON('team', team);
    return NextResponse.json(newMember, { status: 201 });
  }

  if (body.action === 'update' && body.section && body.member) {
    const arr = body.section === 'board' ? team.boardOfDirectors : team.topManagement;
    const idx = arr.findIndex((m) => m.id === body.member!.id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    arr[idx] = { ...arr[idx], ...body.member };
    await writeJSON('team', team);
    return NextResponse.json(arr[idx]);
  }

  if (body.action === 'delete' && body.section && body.id) {
    if (body.section === 'board') {
      team.boardOfDirectors = team.boardOfDirectors.filter((m) => m.id !== body.id);
    } else if (body.section === 'management') {
      team.topManagement = team.topManagement.filter((m) => m.id !== body.id);
    }
    await writeJSON('team', team);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
