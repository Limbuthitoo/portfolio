import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getExperiences, saveExperience, deleteExperience, validateExperience } from '@/lib/db';
import { isAuthenticated, unauthorizedResponse } from '@/lib/auth';

export async function GET() {
  return NextResponse.json(await getExperiences());
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated(req))) return unauthorizedResponse();
  const exp = await req.json();
  if (!validateExperience(exp)) {
    return NextResponse.json({ error: 'Invalid experience data' }, { status: 400 });
  }
  await saveExperience(exp);
  revalidatePath('/');
  revalidatePath('/about');
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated(req))) return unauthorizedResponse();
  const body = await req.json();
  if (!body?.id || typeof body.id !== 'string') {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  await deleteExperience(body.id);
  revalidatePath('/');
  revalidatePath('/about');
  return NextResponse.json({ success: true });
}
