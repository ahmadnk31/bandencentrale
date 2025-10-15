

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  Phone, 
  Timer,
  Star,
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  MessageCircle,
  Wrench,
  MapPin,
  Percent
} from "lucide-react";
import { useRouter } from "next/navigation";

interface HeroBanner {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  discount?: string;
  cta: string;
  ctaLink: string;
  image?: string;
  gradient: string;
  bgGradient: string;
  sortOrder: number;
}

const HeroSection = () => {
  const router = useRouter();
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { value: "50K+", label: "Customers", icon: "👥" },
    { value: "15+", label: "Years", icon: "⭐" },
    { value: "100+", label: "Brands", icon: "🏷️" },
    { value: "24/7", label: "Support", icon: "📞" }
  ]);

  // Fetch banners and stats from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch banners
        const bannersResponse = await fetch("/api/hero-banners");
        if (bannersResponse.ok) {
          const bannersData = await bannersResponse.json();
          setBanners(bannersData);
        } else {
          // Fallback to default banners if API fails
          setBanners(defaultBanners);
        }

        // Fetch stats
        const statsResponse = await fetch("/api/stats");
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          if (statsData.success && statsData.data) {
            setStats(statsData.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Fallback to default banners
        setBanners(defaultBanners);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Default banners as fallback
  const defaultBanners: HeroBanner[] = [
    {
      id: "1",
      title: "Premium Winter Tires",
      subtitle: "Get Ready for Winter",
      description: "Superior grip and safety for harsh winter conditions. Professional installation included with every purchase.",
      badge: "Limited Time",
      discount: "Up to 40% OFF",
      cta: "Shop Winter Tires",
      ctaLink: "/tires?season=winter",
      image: "/images/winter-tires.jpg",
      gradient: "from-blue-500 to-purple-600",
      bgGradient: "from-blue-900/60 to-purple-900/40",
      sortOrder: 0,
    },
    {
      id: "2", 
      title: "Expert Tire Services",
      subtitle: "Professional Installation",
      description: "Complete tire services including mounting, balancing, and alignment. Book your appointment today.",
      badge: "Free Installation",
      discount: "25% OFF Services",
      cta: "Book Service",
      ctaLink: "/services",
      image: "/images/tire-service.jpg",
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-900/60 to-emerald-900/40",
      sortOrder: 1,
    },
    {
      id: "3",
      title: "Summer Tire Collection",
      subtitle: "Performance & Comfort",
      description: "High-performance summer tires for optimal driving experience. Premium brands at competitive prices.",
      badge: "New Arrivals",
      discount: "Buy 3 Get 1 Free",
      cta: "Explore Collection",
      ctaLink: "/tires?season=summer",
      image: "/images/summer-tires.jpg",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-900/60 to-red-900/40",
      sortOrder: 2,
    },
    {
      id: "4",
      title: "Premium Brand Partners",
      subtitle: "Michelin, Continental & More",
      description: "Authorized dealer of world's leading tire brands. Quality guaranteed with manufacturer warranty.",
      badge: "Authorized Dealer",
      discount: "Up to 30% OFF",
      cta: "View Brands",
      ctaLink: "/brands",
      image: "/images/tire-brands.jpg",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-900/60 to-pink-900/40",
      sortOrder: 3,
    },
  ];

  // Auto-rotation
  useEffect(() => {
    if (banners.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const currentBanner = banners[currentSlide] || defaultBanners[0];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };  const quickActions = [
    {
      icon: Search,
      title: "Find Tires",
      description: "Browse our tire collection",
      link: "/tires",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Calendar,
      title: "Book Service",
      description: "Schedule installation",
      link: "/services",
      color: "from-green-500 to-green-600"
    },
    {
      icon: MessageCircle,
      title: "Get Quote",
      description: "Request custom pricing",
      link: "/quote",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Wrench,
      title: "Our Services",
      description: "View all services",
      link: "/services",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <section className="relative min-h-[100vh] lg:min-h-[110vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Dynamic Banner Carousel */}
      <div className="relative min-h-[100vh] lg:min-h-[110vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${currentBanner.image})` }}
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${currentBanner.bgGradient}`} />
            
            {/* Content */}
            <div className="relative min-h-[100vh] lg:min-h-[110vh] flex items-center py-12 sm:py-16 lg:py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh] lg:min-h-[85vh]">
                  {/* Left Content */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-white space-y-6 sm:space-y-8 order-1"
                  >
                    {/* Badge */}
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Badge className={`bg-gradient-to-r ${currentBanner.gradient} text-white border-0 px-4 py-2 text-sm font-bold shadow-lg`}>
                        <Timer className="w-4 h-4 mr-2" />
                        {currentBanner.badge}
                      </Badge>
                    </motion.div>

                    {/* Main Content */}
                    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
                      <motion.h1
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        {currentBanner.title}
                      </motion.h1>
                      
                      {currentBanner.subtitle && (
                        <motion.h2
                          className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold bg-gradient-to-r ${currentBanner.gradient} bg-clip-text text-transparent`}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          {currentBanner.subtitle}
                        </motion.h2>
                      )}
                      
                      {currentBanner.description && (
                        <motion.p
                          className="text-lg sm:text-xl lg:text-2xl text-slate-200 max-w-2xl leading-relaxed"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          {currentBanner.description}
                        </motion.p>
                      )}
                    </div>

                    {/* Discount Badge */}
                    {currentBanner.discount && (
                      <motion.div
                        className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        <div className={`bg-gradient-to-r ${currentBanner.gradient} text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl lg:text-2xl shadow-xl`}>
                          {currentBanner.discount}
                        </div>
                        <div className="text-slate-300">
                          <div className="text-xs sm:text-sm opacity-75">Starting from</div>
                          <div className="text-sm sm:text-base font-semibold">Premium brands</div>
                        </div>
                      </motion.div>
                    )}

                    {/* CTA Buttons */}
                    <motion.div
                      className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                    >
                      <Button 
                        size="lg" 
                        className={`bg-gradient-to-r ${currentBanner.gradient} hover:opacity-90 text-white font-semibold px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group`}
                        onClick={() => router.push(currentBanner.ctaLink)}
                      >
                        <span className="flex items-center">
                          {currentBanner.cta}
                          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="border-white/30 text-black hover:bg-white/10 hover:text-white rounded-xl sm:rounded-2xl px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg backdrop-blur-sm group"
                        onClick={() => router.push('/contact')}
                      >
                        <Phone className="w-5 h-5 sm:w-6 sm:h-6 mr-3 group-hover:scale-110 transition-transform" />
                        <span>Contact Us</span>
                      </Button>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                      className="flex flex-wrap items-center gap-3 sm:gap-6 pt-4 sm:pt-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-white font-medium text-sm sm:text-base">4.9/5 Rating</span>
                      </div>
                      <div className="text-white/50 hidden sm:block">•</div>
                      <div className="text-white font-medium text-sm sm:text-base">2,847+ Reviews</div>
                      <div className="text-white/50 hidden sm:block">•</div>
                      <div className="text-white font-medium text-sm sm:text-base">Free Installation</div>
                    </motion.div>
                  </motion.div>

                  {/* Right Content - Quick Actions */}
                  <motion.div
                    className="space-y-4 sm:space-y-6 order-2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <div className="bg-white/15 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-9 border border-white/30 shadow-2xl ring-1 ring-white/20">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-5 sm:mb-7 flex items-center">
                        <span className="bg-gradient-to-r from-orange-400 to-orange-500 w-1 h-6 rounded-full mr-3"></span>
                        Quick Actions
                      </h3>
                      <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-5">
                        {quickActions.map((action, index) => (
                          <motion.div
                            key={action.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                          >
                            <Card 
                              className="bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer group backdrop-blur-sm shadow-lg hover:shadow-xl"
                              onClick={() => router.push(action.link)}
                            >
                              <CardContent className="p-4 sm:p-5 flex flex-col lg:flex-row items-center lg:space-x-4 space-y-3 lg:space-y-0">
                                <div className={`bg-gradient-to-r ${action.color} p-3 sm:p-4 rounded-xl lg:rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                  <action.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                                </div>
                                <div className="flex-1 text-center lg:text-left">
                                  <h4 className="font-bold text-white text-sm sm:text-base lg:text-lg">{action.title}</h4>
                                  <p className="text-white/80 text-xs sm:text-sm lg:text-base hidden sm:block">{action.description}</p>
                                </div>
                                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all hidden lg:block" />
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Prev/Next Buttons */}
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            {/* Slide Indicators */}
            <div className="flex space-x-1 sm:space-x-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? `bg-gradient-to-r ${currentBanner.gradient} scale-125` 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <motion.div
        className="relative bg-slate-900/95 backdrop-blur-sm border-t border-slate-700"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-slate-700 group-hover:border-orange-500/50 transition-all duration-300">
                  <div className="text-xl sm:text-2xl lg:text-3xl mb-1 sm:mb-2">{stat.icon}</div>
                  <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-orange-400 mb-1">{stat.value}</div>
                  <div className="text-slate-300 font-medium text-xs sm:text-sm lg:text-base">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
