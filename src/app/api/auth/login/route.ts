import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken, createAuthResponse } from '@/lib/auth';
import { getStoredPasswordHash } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    // Check stored hashed password first
    const storedHash = getStoredPasswordHash();
    if (storedHash) {
      const valid = await bcrypt.compare(password, storedHash);
      if (!valid) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
      }
    } else {
      // Fall back to env var
      const envPassword = process.env.DASHBOARD_PASSWORD;
      if (!envPassword) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
      }
      if (password !== envPassword) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
      }
    }

    const token = await signToken();
    return createAuthResponse(token);
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
