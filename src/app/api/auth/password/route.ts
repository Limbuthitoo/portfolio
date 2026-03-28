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
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
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
      const envPassword = process.env.DASHBOARD_PASSWORD;
      if (!envPassword || currentPassword !== envPassword) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
      }
    }

    // Hash and save new password
    const hash = await bcrypt.hash(newPassword, 12);
    savePasswordHash(hash);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
