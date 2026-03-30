import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getProjects, saveProject, deleteProject, validateProject } from '@/lib/db';
import { isAuthenticated, unauthorizedResponse } from '@/lib/auth';

export async function GET() {
  return NextResponse.json(await getProjects());
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated(req))) return unauthorizedResponse();
  const project = await req.json();
  if (!validateProject(project)) {
    return NextResponse.json({ error: 'Invalid project data' }, { status: 400 });
  }
  await saveProject(project);
  revalidatePath('/');
  revalidatePath('/work');
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated(req))) return unauthorizedResponse();
  const body = await req.json();
  if (!body?.slug || typeof body.slug !== 'string') {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
  }
  await deleteProject(body.slug);
  revalidatePath('/');
  revalidatePath('/work');
  return NextResponse.json({ success: true });
}
