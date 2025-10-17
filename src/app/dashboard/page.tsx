'use client';

import { useSession } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, Package, Calendar, FileText, Settings, LogOut } from 'lucide-react';

export default function DashboardPage() {
  // Server-side middleware now protects this route.
  // If you want to show user info, fetch it server-side or via API and pass as props.

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Bandencentrale</span>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, User</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Handle logout
                  window.location.href = '/login';
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage your account, orders, and appointments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile
              </CardTitle>
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm"><strong>Name:</strong> Not set</p>
                <p className="text-sm"><strong>Email:</strong> Not set</p>
                <p className="text-sm"><strong>Role:</strong> Customer</p>
              </div>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Orders
              </CardTitle>
              <CardDescription>
                View and track your orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Recent orders will appear here</p>
              </div>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                View All Orders
              </Button>
            </CardContent>
          </Card>

          {/* Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Appointments
              </CardTitle>
              <CardDescription>
                Schedule and manage appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">No upcoming appointments</p>
              </div>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                Book Appointment
              </Button>
            </CardContent>
          </Card>

          {/* Quotes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Quotes
              </CardTitle>
              <CardDescription>
                Request and manage quotes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">No active quotes</p>
              </div>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                Request Quote
              </Button>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Settings
              </CardTitle>
              <CardDescription>
                Manage account settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Account preferences and security</p>
              </div>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                Settings
              </Button>
            </CardContent>
          </Card>

          {/* Admin Panel (only for admins) */}
          {/* If you want to show admin panel, use server-side logic to determine admin status */}
        </div>
      </div>
    </div>
  );
}
