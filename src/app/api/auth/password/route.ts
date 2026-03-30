import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { isAuthenticated, unauthorizedResponse } from '@/lib/auth';
import { getStoredPasswordHash, savePasswordHash } from '@/lib/db';

const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > MAX_ATTEMPTS;
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated(req))) return unauthorizedResponse();

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
  }

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || typeof currentPassword !== 'string') {
      return NextResponse.json({ error: 'Current password required' }, { status: 400 });
    }
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
    }

    // Verify current password
    const storedHash = getStoredPasswordHash();
    if (storedHash) {
      const valid = await bcrypt.compare(currentPassword, storedHash);
      if (!valid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
      }
    } else {
      // Fall back to env var for first-time password change
      const { timingSafeEqual } = await import('crypto');
      const envPassword = process.env.DASHBOARD_PASSWORD;
      if (!envPassword) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
      }
      const bufA = Buffer.from(currentPassword);
      const bufB = Buffer.from(envPassword);
      const match = bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
      if (!match) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
      }
    }

    // Hash and save new password
    const hash = await bcrypt.hash(newPassword, 12);
    savePasswordHash(hash);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('/api/auth/password error:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
