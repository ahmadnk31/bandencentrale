"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Star, 
  Shield, 
  Truck, 
  Clock, 
  Zap,
  Award,
  CheckCircle,
  Play,
  Gauge
} from "lucide-react";

const HeroSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Lifetime Warranty",
      description: "Premium protection for all installations",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Truck,
      title: "Free Installation",
      description: "Professional mounting included",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Clock,
      title: "Quick Service",
      description: "Most jobs completed in 30 minutes",
      color: "from-purple-500 to-purple-600"
    }
  ];

  const stats = [
    { value: "50K+", label: "Customers", icon: "👥" },
    { value: "15+", label: "Years", icon: "⭐" },
    { value: "100+", label: "Brands", icon: "🏷️" },
    { value: "24/7", label: "Support", icon: "📞" }
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,53,0.1),transparent_50%)]"></div>
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-12 gap-12 items-center min-h-[80vh]">
          {/* Left content - 7 columns */}
          <div className="lg:col-span-7 text-white space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 border-orange-500/30 backdrop-blur-sm px-4 py-2 text-sm font-medium">
                  <Award className="w-4 h-4 mr-2" />
                  #1 Tire Shop in Belgium
                </Badge>
              </motion.div>
              
              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight">
                  Ariana{" "}
                  <span className="relative">
                    <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                      Bandencentrale
                    </span>
                    <motion.div
                      className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1, duration: 0.8 }}
                    />
                  </span>
                  <br />
                  for Every{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Journey
                  </span>
                </h1>
                
                <motion.p
                  className="text-xl text-slate-300 max-w-2xl leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Discover premium tires from world-renowned brands. Expert installation, 
                  competitive prices, and lifetime support — all backed by our commitment to your safety.
                </motion.p>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <span className="flex items-center">
                  Shop Tires Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white rounded-2xl px-8 py-4 backdrop-blur-sm bg-slate-800/50 group"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="flex flex-wrap items-center gap-6 pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-slate-300 font-medium">4.9/5 Rating</span>
              </div>
              <div className="text-slate-400">•</div>
              <div className="text-slate-300 font-medium">2,847+ Reviews</div>
              <div className="text-slate-400">•</div>
              <div className="text-slate-300 font-medium">50,000+ Happy Customers</div>
            </motion.div>
          </div>

          {/* Right content - 5 columns */}
          <div className="lg:col-span-5 space-y-6">
            {/* Hero Visual */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Main tire visual */}
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700">
                <div className="flex items-center justify-center h-64">
                  <motion.div
                    className="relative w-48 h-48 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full shadow-inner flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <motion.div
                      className="w-32 h-32 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center shadow-lg"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    >
                      <Gauge className="w-16 h-16 text-orange-400" />
                    </motion.div>
                    {/* Tire pattern lines */}
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-12 bg-slate-600 rounded-full"
                        style={{
                          transformOrigin: 'center bottom',
                          transform: `rotate(${i * 45}deg) translateY(-96px)`
                        }}
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                      />
                    ))}
                  </motion.div>
                </div>
                
                {/* Floating elements */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  ✓ In Stock
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  Free Install
                </motion.div>
              </div>
            </motion.div>

            {/* Feature cards */}
            <div className="grid gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700 py-0 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 group">
                    <CardContent className="p-4 flex items-center space-x-4">
                      <div className={`bg-gradient-to-r ${feature.color} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-sm">{feature.title}</h3>
                        <p className="text-slate-400 text-xs">{feature.description}</p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats section - moved to bottom */}
        <motion.div
          className="mt-16 lg:mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 xl:gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="group cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                style={{ transform: 'none' }} // Reset any inherited transforms
              >
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-slate-700 group-hover:border-orange-500/50 transition-all duration-300 h-full transform-none">
                  <div className="flex flex-col items-center justify-center text-center space-y-2 lg:space-y-3 transform-none">
                    <div className="text-2xl lg:text-3xl transform-none">{stat.icon}</div>
                    <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-orange-400 transform-none">
                      {stat.value}
                    </div>
                    <div className="text-slate-300 font-medium text-sm lg:text-base transform-none">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
