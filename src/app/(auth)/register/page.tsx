'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, CheckCircle, Car, UserPlus, ArrowLeft, Shield } from 'lucide-react';
import { signUp } from '@/lib/auth/client';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    };
  };

  const passwordValidation = validatePassword(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (!passwordValidation.isValid) {
      setError('Password does not meet the requirements');
      setIsLoading(false);
      return;
    }

    try {
      // Use our custom registration endpoint
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message || 'Registration failed');
      } else {
        setSuccess('Account created successfully! Please check your email to verify your account.');
        // Optionally redirect after a delay
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tire-dark via-primary to-tire-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-tire-orange blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-tire-orange blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-white blur-2xl"></div>
      </div>

      {/* Back to Home Button */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center text-white hover:text-tire-orange transition-colors z-10"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Home
      </Link>

      <div className="w-full max-w-lg relative z-10">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-tire-orange rounded-full mb-4 shadow-2xl">
            <Car className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join BandenCentrale</h1>
          <p className="text-tire-light">Start your premium tire experience today</p>
        </div>

        <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
            <CardDescription className="text-tire-light">
              Join thousands of satisfied customers for premium tire services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-red-500/20 border-red-400/50 text-red-100">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="bg-green-500/20 border-green-400/50 text-green-100">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-tire-orange focus:ring-tire-orange"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-tire-orange focus:ring-tire-orange"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-tire-orange focus:ring-tire-orange"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+32 467 87 1205"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-tire-orange focus:ring-tire-orange"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-tire-orange focus:ring-tire-orange pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-300 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                {formData.password && (
                  <div className="space-y-2 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-white text-sm font-medium">Password requirements:</div>
                    <div className="grid grid-cols-1 gap-1 text-xs">
                      <div className={`flex items-center ${passwordValidation.minLength ? 'text-green-400' : 'text-gray-400'}`}>
                        <CheckCircle className={`h-3 w-3 mr-2 ${passwordValidation.minLength ? 'text-green-400' : 'text-gray-400'}`} />
                        At least 8 characters
                      </div>
                      <div className={`flex items-center ${passwordValidation.hasUpperCase ? 'text-green-400' : 'text-gray-400'}`}>
                        <CheckCircle className={`h-3 w-3 mr-2 ${passwordValidation.hasUpperCase ? 'text-green-400' : 'text-gray-400'}`} />
                        One uppercase letter
                      </div>
                      <div className={`flex items-center ${passwordValidation.hasNumbers ? 'text-green-400' : 'text-gray-400'}`}>
                        <CheckCircle className={`h-3 w-3 mr-2 ${passwordValidation.hasNumbers ? 'text-green-400' : 'text-gray-400'}`} />
                        One number & special character
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-tire-orange focus:ring-tire-orange pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-300 hover:text-white"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-sm text-red-400 flex items-center">
                    <CheckCircle className="h-3 w-3 mr-2" />
                    Passwords do not match
                  </p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-tire-orange hover:bg-tire-orange/90 text-white font-semibold py-3 shadow-lg" 
                disabled={isLoading || !passwordValidation.isValid || formData.password !== formData.confirmPassword}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Create Account
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center pt-6">
            <div className="text-sm text-tire-light">
              Already have an account?{' '}
              <Link href="/login" className="text-tire-orange hover:text-tire-orange/80 font-medium">
                Sign In
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <p className="text-tire-light text-sm mb-4">Join our community of satisfied customers</p>
          <div className="flex justify-center space-x-6 text-white/60">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              <span className="text-xs">Secure & Private</span>
            </div>
            <div className="flex items-center">
              <Car className="w-4 h-4 mr-2" />
              <span className="text-xs">Expert Service</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
