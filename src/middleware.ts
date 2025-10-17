import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';

export async function middleware(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session || !session.user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
