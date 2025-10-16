import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('Server-side login attempt for:', email);
    
    // Use Better Auth server-side API
    const result = await auth.api.signInEmail({
      body: { email, password },
      headers: request.headers,
    });

    console.log('Server-side login result:', result);

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message || 'Login failed' },
        { status: 400 }
      );
    }

    // If successful, return success and let the client handle redirect
    const response = NextResponse.json({ 
      success: true, 
      user: result.user,
      session: result.session
    });

    // Copy cookies from auth result if available
    if (result.headers) {
      const setCookieHeader = result.headers.get('set-cookie');
      if (setCookieHeader) {
        response.headers.set('set-cookie', setCookieHeader);
      }
    }

    return response;
    
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error during login' },
      { status: 500 }
    );
  }
}
