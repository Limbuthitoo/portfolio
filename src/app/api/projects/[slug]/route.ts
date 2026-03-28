import { NextRequest, NextResponse } from 'next/server';
import { getProjectBySlug, saveProject, validateProject } from '@/lib/db';
import { isAuthenticated, unauthorizedResponse } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated(req))) return unauthorizedResponse();
  const project = await req.json();
  if (!validateProject(project)) {
    return NextResponse.json({ error: 'Invalid project data' }, { status: 400 });
  }
  saveProject(project);
  return NextResponse.json({ success: true });
}
