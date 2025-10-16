'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Car, Menu, X, Home, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface AuthHeaderProps {
  className?: string;
}

const AuthHeader = ({ className = '' }: AuthHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Services', href: '/services', icon: Car },
    { name: 'Contact', href: '/contact', icon: Phone },
  ];

  return (
    <header className={`absolute top-0 left-0 right-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-tire-orange rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Car className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold text-white group-hover:text-tire-orange transition-colors">
                  BandenCentrale
                </h1>
                <p className="text-xs md:text-sm text-tire-light">Premium Tire Solutions</p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav
            className="hidden md:flex items-center space-x-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-white hover:text-tire-orange transition-colors px-3 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm"
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
            
            {/* Contact Info */}
            <div className="hidden lg:flex items-center space-x-4 ml-6 pl-6 border-l border-white/20">
              <a
                href="tel:+32467871205"
                className="flex items-center space-x-2 text-tire-light hover:text-tire-orange transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">+32 467 87 1205</span>
              </a>
              <a
                href="mailto:info@bandencentrale.be"
                className="flex items-center space-x-2 text-tire-light hover:text-tire-orange transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">info@bandencentrale.be</span>
              </a>
            </div>
          </motion.nav>

          {/* Mobile Menu Button */}
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-tire-orange hover:bg-white/10 p-2"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-80 bg-gradient-to-b from-tire-dark to-primary border-l border-white/20 backdrop-blur-lg"
              >
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between py-6 border-b border-white/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-tire-orange rounded-full flex items-center justify-center">
                        <Car className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">BandenCentrale</h2>
                        <p className="text-xs text-tire-light">Premium Tire Solutions</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:text-tire-orange hover:bg-white/10 p-2"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 py-6">
                    <div className="space-y-2">
                      {navigationItems.map((item, index) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center space-x-3 text-white hover:text-tire-orange hover:bg-white/10 px-4 py-3 rounded-lg transition-all duration-200"
                          >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </nav>

                  {/* Mobile Contact Info */}
                  <div className="border-t border-white/20 pt-6 space-y-4">
                    <div className="text-center">
                      <p className="text-tire-light text-sm mb-4">Get in touch</p>
                      <div className="space-y-3">
                        <a
                          href="tel:+32467871205"
                          className="flex items-center justify-center space-x-2 text-white hover:text-tire-orange transition-colors p-2"
                        >
                          <Phone className="w-4 h-4" />
                          <span className="font-medium">+32 467 87 1205</span>
                        </a>
                        <a
                          href="mailto:info@bandencentrale.be"
                          className="flex items-center justify-center space-x-2 text-white hover:text-tire-orange transition-colors p-2"
                        >
                          <Mail className="w-4 h-4" />
                          <span className="font-medium">info@bandencentrale.be</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;
