"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Car, 
  Menu, 
  X, 
  Phone, 
  MapPin, 
  Clock, 
  User,
  ShoppingCart,
  Settings,
  Heart,
  Search,
  LogOut,
  UserCircle,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth/client";
import { isAdmin } from "@/lib/auth/utils";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { state } = useCart();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Tires", href: "/tires" },
    { name: "Services", href: "/services" },
    { name: "Brands", href: "/brands" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      setIsOpen(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const isAdminUser = isAdmin(session);

 

  return (
    <>
      {/* Top bar */}
      <div className="bg-tire-dark text-white py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs sm:text-sm">
          <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6 overflow-hidden">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hidden sm:inline">+32 467 87 1205</span>
              <span className="sm:hidden">Call</span>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>Ghent-Belgium</span>
            </div>
            <div className="hidden lg:flex items-center space-x-2">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>Mon-Fri: 9:00-18:00, Sat: 9:00-17:00</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Authentication Links */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                    <UserCircle className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs">
                      {session.user.name || session.user.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {isAdminUser && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/favorites" className="flex items-center">
                      <Heart className="w-4 h-4 mr-2" />
                      Favorites
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login" className="hover:text-tire-orange transition-colors text-sm">
                  Sign In
                </Link>
                <Link href="/register" className="hover:text-tire-orange transition-colors text-sm">
                  Register
                </Link>
              </>
            )}
            
            {/* Admin Link - only show if not authenticated or not admin */}
            {!session && (
              <Link href="/admin" className="hover:text-tire-orange transition-colors">
                <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            )}
            
            {/* Favorites link for non-authenticated users */}
            {!session && (
              <Link href="/favorites" className="hover:text-tire-orange transition-colors">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <motion.header 
        className="bg-white shadow-lg sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
              <motion.div 
                className="bg-tire-gradient p-2 sm:p-3 rounded-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Car className="w-6 h-6 sm:w-8 sm:h-8 text-white tire-spin" />
              </motion.div>
              <div className="hidden md:block">
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-tire-dark to-primary bg-clip-text text-transparent">
                  BandenCentrale
                </h1>
                <p className="text-xs sm:text-sm text-tire-gray">Premium Tire Solutions</p>
              </div>
              
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="text-tire-dark hover:text-primary transition-colors font-medium relative group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-tire-gradient group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden xl:flex items-center relative max-w-xs">
              <Input
                placeholder="Search tires..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
              <Button type="submit" size="sm" className="absolute right-1 p-1 h-8">
                <Search className="w-4 h-4" />
              </Button>
            </form>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search button for smaller screens */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="xl:hidden p-2"
                onClick={() => router.push('/search')}
              >
                <Search className="w-5 h-5" />
              </Button>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:block"
              >
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="relative"
                  onClick={() => router.push('/cart')}
                >
                  <ShoppingCart className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Cart</span>
                  {state.itemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-tire-orange text-white text-xs">
                      {state.itemCount}
                    </Badge>
                  )}
                </Button>
              </motion.div>

              <Button className="hidden md:block bg-tire-gradient hover:opacity-90 text-sm px-4 py-2" onClick={() => router.push('/quote')}>
                Get Quote
              </Button>

              {/* Mobile cart icon */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="md:hidden relative p-2"
                onClick={() => router.push('/cart')}
              >
                <ShoppingCart className="w-5 h-5" />
                {state.itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-tire-orange text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {state.itemCount}
                  </Badge>
                )}
              </Button>

              {/* Mobile menu trigger */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden p-2">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] p-6">
                  <nav className="flex flex-col">
                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="mb-6">
                      <div className="relative">
                        <Input
                          placeholder="Search tires..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pr-12"
                        />
                        <Button type="submit" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 h-8">
                          <Search className="w-4 h-4" />
                        </Button>
                      </div>
                    </form>

                    {navigationItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="text-lg font-medium text-tire-dark hover:text-primary transition-colors py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                    
                    {/* Mobile Auth Links */}
                    <div className="pt-4 border-t space-y-3">
                      {session ? (
                        <>
                          <div className="text-sm text-gray-600">
                            Signed in as {session.user.name || session.user.email}
                          </div>
                          <Link
                            href="/dashboard"
                            className="flex items-center text-lg font-medium text-tire-dark hover:text-primary transition-colors py-2"
                            onClick={() => setIsOpen(false)}
                          >
                            <User className="w-5 h-5 mr-3" />
                            Dashboard
                          </Link>
                          {isAdminUser && (
                            <Link
                              href="/admin"
                              className="flex items-center text-lg font-medium text-tire-dark hover:text-primary transition-colors py-2"
                              onClick={() => setIsOpen(false)}
                            >
                              <Shield className="w-5 h-5 mr-3" />
                              Admin Panel
                            </Link>
                          )}
                          <Link
                            href="/favorites"
                            className="flex items-center text-lg font-medium text-tire-dark hover:text-primary transition-colors py-2"
                            onClick={() => setIsOpen(false)}
                          >
                            <Heart className="w-5 h-5 mr-3" />
                            Favorites
                          </Link>
                          <Button
                            variant="outline"
                            className="w-full justify-start py-3 text-red-600"
                            onClick={() => {
                              handleSignOut();
                              setIsOpen(false);
                            }}
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                          </Button>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/login"
                            className="text-lg font-medium text-tire-dark hover:text-primary transition-colors py-2 block"
                            onClick={() => setIsOpen(false)}
                          >
                            Sign In
                          </Link>
                          <Link
                            href="/register"
                            className="text-lg font-medium text-tire-dark hover:text-primary transition-colors py-2 block"
                            onClick={() => setIsOpen(false)}
                          >
                            Register
                          </Link>
                          <Link
                            href="/favorites"
                            className="flex items-center text-lg font-medium text-tire-dark hover:text-primary transition-colors py-2"
                            onClick={() => setIsOpen(false)}
                          >
                            <Heart className="w-5 h-5 mr-3" />
                            Favorites
                          </Link>
                        </>
                      )}
                    </div>
                    
                    <div className="pt-6 border-t space-y-4">
                      <Button className="w-full bg-tire-gradient py-3" onClick={() => {
                        router.push('/quote');
                        setIsOpen(false);
                      }}>
                        Get Quote
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full py-3"
                        onClick={() => {
                          router.push('/cart');
                          setIsOpen(false);
                        }}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Cart ({state.itemCount})
                      </Button>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
};

export default Header;
