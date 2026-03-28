import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/dashboard') && pathname !== '/dashboard/login') {
    const token = req.cookies.get('dashboard_token')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.redirect(new URL('/dashboard/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
