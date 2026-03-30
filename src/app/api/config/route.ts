import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSiteConfig, saveSiteConfig, validateSiteConfig } from '@/lib/db';
import { isAuthenticated, unauthorizedResponse } from '@/lib/auth';

export async function GET() {
  return NextResponse.json(await getSiteConfig());
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated(req))) return unauthorizedResponse();
  const config = await req.json();
  if (!validateSiteConfig(config)) {
    return NextResponse.json({ error: 'Invalid config data' }, { status: 400 });
  }
  await saveSiteConfig(config);
  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/contact');
  return NextResponse.json({ success: true });
}
