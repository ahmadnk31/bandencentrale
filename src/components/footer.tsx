"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Car, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Youtube
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const quickLinks = [
    { name: "Summer Tires", href: "/tires/summer" },
    { name: "Winter Tires", href: "/tires/winter" },
    { name: "All-Season Tires", href: "/tires/all-season" },
    { name: "Performance Tires", href: "/tires/performance" },
    { name: "Tire Installation", href: "/services/tire-installation" },
    { name: "Wheel Alignment", href: "/services/wheel-alignment" }
  ];

  const brands = [
    "Michelin", "Continental", "Bridgestone", "Pirelli", 
    "Goodyear", "Dunlop", "Yokohama", "Hankook"
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", name: "Facebook" },
    { icon: Twitter, href: "#", name: "Twitter" },
    { icon: Instagram, href: "#", name: "Instagram" },
    { icon: Linkedin, href: "#", name: "LinkedIn" },
    { icon: Youtube, href: "#", name: "YouTube" }
  ];

  return (
    <footer className="bg-tire-dark text-white">
      {/* Newsletter section */}
      <div className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold">
              Stay Updated with{" "}
              <span className="bg-gradient-to-r from-tire-orange to-yellow-400 bg-clip-text text-transparent">
                Special Offers
              </span>
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Get exclusive deals, tire maintenance tips, and be the first to know about our latest products.
            </p>
            <div className="flex max-w-md mx-auto space-x-3">
              <Input 
                placeholder="Enter your email address" 
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              />
              <Button className="bg-tire-orange hover:bg-tire-orange/90 px-6">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-gray-400">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
          {/* Company info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-tire-gradient p-3 rounded-xl">
                <Car className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">BandenCentrale</h2>
                <p className="text-sm text-gray-400">Premium Tire Solutions</p>
              </div>
            </Link>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              Netherlands' trusted tire specialist since 2008. We provide premium tires 
              and professional services with a commitment to safety, quality, and customer satisfaction.
            </p>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-300">
                <MapPin className="w-4 h-4 mr-3 text-tire-orange" />
                <span>Hoofdstraat 123, 1012 AB Amsterdam</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <Phone className="w-4 h-4 mr-3 text-tire-orange" />
                <span>+31 20 123 4567</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <Mail className="w-4 h-4 mr-3 text-tire-orange" />
                <span>info@bandencentrale.nl</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <Clock className="w-4 h-4 mr-3 text-tire-orange" />
                <span>Mon-Fri: 8:00-18:00, Sat: 9:00-17:00</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-tire-orange transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Brands */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold">Popular Brands</h3>
            <ul className="space-y-3">
              {brands.map((brand) => (
                <li key={brand}>
                  <Link 
                    href={`/brands/${brand.toLowerCase()}`}
                    className="text-gray-300 hover:text-tire-orange transition-colors text-sm"
                  >
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services & Social */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold">Our Services</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>• Tire Installation & Balancing</li>
              <li>• Wheel Alignment Service</li>
              <li>• Road Hazard Protection</li>
              <li>• 24/7 Roadside Assistance</li>
              <li>• Tire Pressure Monitoring</li>
              <li>• Vehicle Inspections</li>
            </ul>

            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-tire-orange transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2024 BandenCentrale. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-tire-orange transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-tire-orange transition-colors">
                Terms of Service
              </Link>
              <Link href="/warranty" className="hover:text-tire-orange transition-colors">
                Warranty Info
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
