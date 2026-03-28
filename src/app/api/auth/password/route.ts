import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { isAuthenticated, unauthorizedResponse } from '@/lib/auth';
import { getStoredPasswordHash, savePasswordHash } from '@/lib/db';

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated(req))) return unauthorizedResponse();

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
