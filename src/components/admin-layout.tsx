"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Car,
  Bell,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, current: true },
    { name: "Products", href: "/admin/products", icon: Package, current: false },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart, current: false, badge: "3" },
    { name: "Customers", href: "/admin/customers", icon: Users, current: false },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3, current: false },
    { name: "Settings", href: "/admin/settings", icon: Settings, current: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <motion.div
          className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl"
          initial={{ x: -256 }}
          animate={{ x: sidebarOpen ? 0 : -256 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="bg-tire-gradient p-2 rounded-lg">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-tire-dark">Admin</span>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  item.current
                    ? 'bg-tire-gradient text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
                {item.badge && (
                  <Badge className="ml-auto bg-red-500 text-white">{item.badge}</Badge>
                )}
              </Link>
            ))}
          </nav>
          <div className="border-t p-4">
            <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200">
          <div className="flex h-16 shrink-0 items-center px-4 border-b">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="bg-tire-gradient p-2 rounded-lg">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-tire-dark">BandenCentrale</span>
            </Link>
          </div>
          <nav className="flex flex-1 flex-col px-4">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      item.current
                        ? 'bg-tire-gradient text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                    {item.badge && (
                      <Badge className="ml-auto bg-red-500 text-white">{item.badge}</Badge>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto border-t pt-4 pb-4">
              <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </Button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <div className="relative w-96 hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search products, orders, customers..."
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                  3
                </Badge>
              </Button>
              
              <Avatar className="w-8 h-8">
                <AvatarImage src="/api/placeholder/32/32" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
