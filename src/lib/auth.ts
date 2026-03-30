import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';

function getJwtSecret() {
  const secret = process.env.DASHBOARD_SECRET;
  if (!secret) {
    throw new Error('DASHBOARD_SECRET environment variable is required');
  }
  return new TextEncoder().encode(secret);
}

const TOKEN_NAME = 'dashboard_token';

export async function signToken(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('2h')
    .sign(getJwtSecret());
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getJwtSecret());
    return true;
  } catch {
    return false;
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  return req.cookies.get(TOKEN_NAME)?.value ?? null;
}

export async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const token = getTokenFromRequest(req);
  if (!token) return false;
  return verifyToken(token);
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export function createAuthResponse(token: string) {
  const res = NextResponse.json({ success: true });
  res.cookies.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 2,
  });
  return res;
}

export function createLogoutResponse() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(TOKEN_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
