import { NextRequest, NextResponse } from 'next/server';
import { getExperienceById, saveExperience, validateExperience } from '@/lib/db';
import { isAuthenticated, unauthorizedResponse } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exp = getExperienceById(id);
  if (!exp) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(exp);
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated(req))) return unauthorizedResponse();
  const exp = await req.json();
  if (!validateExperience(exp)) {
    return NextResponse.json({ error: 'Invalid experience data' }, { status: 400 });
  }
  saveExperience(exp);
  return NextResponse.json({ success: true });
}
