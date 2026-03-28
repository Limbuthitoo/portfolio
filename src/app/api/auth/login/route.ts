import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import bcrypt from 'bcryptjs';
import { signToken, createAuthResponse } from '@/lib/auth';
import { getStoredPasswordHash } from '@/lib/db';

// In-memory rate limiter
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

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

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Compare against itself to maintain constant time
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
  }

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
      // Fall back to env var (constant-time comparison)
      const envPassword = process.env.DASHBOARD_PASSWORD;
      if (!envPassword) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
      }
      if (!safeCompare(password, envPassword)) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
      }
    }

    const token = await signToken();
    return createAuthResponse(token);
  } catch (error) {
    console.error('/api/auth/login error:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
