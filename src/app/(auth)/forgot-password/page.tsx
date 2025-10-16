'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, ArrowLeft, Car, Mail, Shield } from 'lucide-react';
import { forgetPassword } from '@/lib/auth/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await forgetPassword({
        email,
        redirectTo: '/reset-password',
      });

      if (result.error) {
        setError(result.error.message || 'Failed to send reset email');
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tire-dark via-primary to-tire-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-tire-orange blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-tire-orange blur-3xl"></div>
        </div>

        {/* Back to Home Button */}
        <Link 
          href="/" 
          className="absolute top-6 left-6 flex items-center text-white hover:text-tire-orange transition-colors z-10"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        <div className="w-full max-w-md relative z-10">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-tire-orange rounded-full mb-4 shadow-2xl">
              <Car className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">BandenCentrale</h1>
            <p className="text-tire-light">Premium Tire Solutions</p>
          </div>

          <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-white">Check Your Email</CardTitle>
              <CardDescription className="text-tire-light">
                We've sent a password reset link to <span className="text-tire-orange font-medium">{email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex justify-center">
                  <Mail className="h-12 w-12 text-tire-orange" />
                </div>
                <div className="text-sm text-tire-light space-y-2">
                  <p>Click the link in the email to reset your password.</p>
                  <p>If you don't see the email, check your spam folder.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                onClick={() => setSuccess(false)}
                variant="outline"
                className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
              >
                Try Different Email
              </Button>
              <div className="text-sm text-center">
                <Link href="/login" className="text-tire-orange hover:text-tire-orange/80 font-medium flex items-center justify-center">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Sign In
                </Link>
              </div>
            </CardFooter>
          </Card>

          {/* Trust Indicators */}
          <div className="mt-8 text-center">
            <div className="flex justify-center space-x-6 text-white/60">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                <span className="text-xs">Secure</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span className="text-xs">Email Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tire-dark via-primary to-tire-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-tire-orange blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-tire-orange blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-24 h-24 rounded-full bg-white blur-2xl"></div>
      </div>

      {/* Back to Home Button */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center text-white hover:text-tire-orange transition-colors z-10"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Home
      </Link>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-tire-orange rounded-full mb-4 shadow-2xl">
            <Car className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">BandenCentrale</h1>
          <p className="text-tire-light">Premium Tire Solutions</p>
        </div>

        <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-white">Reset Password</CardTitle>
            <CardDescription className="text-tire-light">
              Enter your email address and we'll send you a secure reset link
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-red-500/20 border-red-400/50 text-red-100">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-tire-orange focus:ring-tire-orange"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-tire-orange hover:bg-tire-orange/90 text-white font-semibold py-3 shadow-lg" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending reset link...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-5 w-5" />
                    Send Reset Link
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center pt-6">
            <div className="text-sm">
              <Link href="/login" className="text-tire-orange hover:text-tire-orange/80 font-medium flex items-center justify-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Sign In
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <p className="text-tire-light text-sm mb-4">Your security is our priority</p>
          <div className="flex justify-center space-x-6 text-white/60">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              <span className="text-xs">Secure Reset</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              <span className="text-xs">Email Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
