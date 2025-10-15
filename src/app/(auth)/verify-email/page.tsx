'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, Mail } from 'lucide-react';
import { verifyEmail, sendVerificationEmail } from '@/lib/auth/client';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [error, setError] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      handleVerification();
    }
  }, [token]);

  const handleVerification = async () => {
    if (!token) return;
    
    setIsVerifying(true);
    setError('');

    try {
      const result = await verifyEmail({
        query: { token }
      });

      if (result.error) {
        setError(result.error.message || 'Email verification failed');
        setVerificationStatus('error');
      } else {
        setVerificationStatus('success');
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      }
    } catch (err) {
      setError('An unexpected error occurred during verification');
      setVerificationStatus('error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError('Email address not provided');
      return;
    }

    setIsResending(true);
    setError('');
    setResendSuccess(false);

    try {
      const result = await sendVerificationEmail({
        email,
        callbackURL: '/verify-email',
      });

      if (result.error) {
        setError(result.error.message || 'Failed to send verification email');
      } else {
        setResendSuccess(true);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsResending(false);
    }
  };

  // Success state
  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Email verified!</CardTitle>
            <CardDescription>
              Your email address has been successfully verified. You will be redirected to your dashboard.
            </CardDescription>
          </CardHeader>
          <CardFooter className="text-center">
            <Button onClick={() => router.push('/dashboard')} className="w-full">
              Continue to dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Error state
  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Verification failed</CardTitle>
            <CardDescription>
              We couldn't verify your email address. The link may be expired or invalid.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {resendSuccess && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  New verification email sent! Please check your inbox.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            {email && (
              <Button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Resend verification email
                  </>
                )}
              </Button>
            )}
            <div className="text-sm text-center">
              <Link href="/login" className="text-blue-600 hover:underline">
                Back to sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Verification in progress or no token provided
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            {isVerifying ? (
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            ) : (
              <Mail className="h-12 w-12 text-blue-600" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">
            {isVerifying ? 'Verifying your email...' : 'Check your email'}
          </CardTitle>
          <CardDescription>
            {isVerifying 
              ? 'Please wait while we verify your email address.'
              : 'Click the verification link we sent to your email address to verify your account.'
            }
          </CardDescription>
        </CardHeader>
        
        {!token && (
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600 text-center">
              <p>Didn't receive the email?</p>
              <p className="mt-2">Check your spam folder or request a new verification email.</p>
            </div>
            
            {resendSuccess && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  New verification email sent! Please check your inbox.
                </AlertDescription>
              </Alert>
            )}
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        )}
        
        {!token && (
          <CardFooter className="flex flex-col space-y-2">
            {email && (
              <Button
                onClick={handleResendVerification}
                disabled={isResending}
                variant="outline"
                className="w-full"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Resend verification email
                  </>
                )}
              </Button>
            )}
            <div className="text-sm text-center">
              <Link href="/login" className="text-blue-600 hover:underline">
                Back to sign in
              </Link>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

// Loading component for Suspense fallback
function VerifyEmailLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          </div>
          <CardTitle className="text-2xl font-bold">Loading...</CardTitle>
          <CardDescription>
            Please wait while we load the verification page.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailLoading />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
