import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { isAdmin } from '@/lib/auth/utils';

/**
 * Middleware to check if the user is authenticated and has admin privileges
 * @param request - The NextRequest object
 * @returns Promise<NextResponse | null> - Returns error response if unauthorized, null if authorized
 */
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  try {
    // Get the session from the request
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication required. Please sign in to access this resource.',
          error: 'UNAUTHORIZED',
        },
        { status: 401 }
      );
    }

    // Check if user has admin privileges
    if (!isAdmin(session)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Admin privileges required. You do not have permission to access this resource.',
          error: 'FORBIDDEN',
        },
        { status: 403 }
      );
    }

    // User is authenticated and has admin privileges
    return null;
  } catch (error) {
    console.error('Admin authentication error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Authentication error. Please try again.',
        error: 'AUTH_ERROR',
      },
      { status: 500 }
    );
  }
}

/**
 * Wrapper function to automatically apply admin authentication to API routes
 * @param handler - The API route handler function
 * @returns Protected API route handler
 */
export function withAdmin(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    // Check admin authentication
    const authError = await requireAdmin(request);
    if (authError) {
      return authError;
    }

    // If authentication passes, call the original handler
    return handler(request, context);
  };
}

export default requireAdmin;
