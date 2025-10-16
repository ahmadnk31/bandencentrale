import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { db } from '@/lib/db/config';
import { user } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, password } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'First name, last name, email, and password are required',
        },
        { status: 400 }
      );
    }

    // Create user with Better Auth using the internal API
    const authRequest = new Request(`${request.nextUrl.origin}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name: `${firstName} ${lastName}`.trim(),
      }),
    });

    const authResponse = await auth.handler(authRequest);
    
    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      let errorMessage = 'Registration failed';
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If parsing fails, use default message
      }

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
        },
        { status: authResponse.status }
      );
    }

    const authData = await authResponse.json();

    // Update user with additional fields if user was created successfully
    if (authData && authData.user && authData.user.id) {
      try {
        await db
          .update(user)
          .set({
            firstName,
            lastName,
            phone: phone || null,
            updatedAt: new Date(),
          })
          .where(eq(user.id, authData.user.id));

        console.log(`Updated user ${authData.user.id} with additional fields`);
      } catch (updateError) {
        console.error('Failed to update user with additional fields:', updateError);
        // Don't fail the registration if additional fields update fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: authData.user,
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred during registration',
      },
      { status: 500 }
    );
  }
}
