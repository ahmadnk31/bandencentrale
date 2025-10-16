import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';

export async function GET(request: NextRequest) {
  // Only allow in development or with special header
  if (process.env.NODE_ENV === 'production' && !request.headers.get('x-debug-auth')) {
    return NextResponse.json({ error: 'Debug endpoint not available' }, { status: 404 });
  }

  const cookies = request.cookies.getAll();
  const headers = Object.fromEntries(request.headers.entries());
  
  let session = null;
  let sessionError = null;
  
  try {
    session = await auth.api.getSession({
      headers: request.headers,
    });
  } catch (error) {
    sessionError = error instanceof Error ? error.message : 'Unknown error';
  }
  
  return NextResponse.json({
    session,
    sessionError,
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_URL: process.env.VERCEL_URL,
      hasDatabase: !!process.env.DATABASE_URL,
      hasBetterAuthSecret: !!process.env.BETTER_AUTH_SECRET,
      hasBetterAuthUrl: !!process.env.BETTER_AUTH_URL,
      betterAuthUrl: process.env.BETTER_AUTH_URL || 'not-set',
      nextAuthUrl: process.env.NEXTAUTH_URL || 'not-set',
    },
    request: {
      url: request.url,
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer'),
      userAgent: request.headers.get('user-agent'),
    },
    cookies: cookies.map(cookie => ({
      name: cookie.name,
      value: cookie.value.substring(0, 20) + '...', // Truncate for security
      hasValue: !!cookie.value,
    })),
    authHeaders: {
      authorization: headers.authorization ? 'Present' : 'Missing',
      'x-forwarded-proto': headers['x-forwarded-proto'],
      'x-forwarded-host': headers['x-forwarded-host'],
    },
  });
}
