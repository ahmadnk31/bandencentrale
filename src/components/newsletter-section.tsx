"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  CheckCircle, 
  Gift, 
  Bell, 
  Zap,
  ArrowRight,
  Star
} from "lucide-react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail("");
    }, 1500);
  };

  const benefits = [
    {
      icon: Gift,
      title: "Exclusive Discounts",
      description: "Get 10% off your first purchase and special member-only pricing"
    },
    {
      icon: Bell,
      title: "Tire Maintenance Alerts",
      description: "Personalized reminders for tire rotation, pressure checks, and seasonal changes"
    },
    {
      icon: Zap,
      title: "New Product Updates",
      description: "Be first to know about latest tire technology and product launches"
    }
  ];

  if (isSubscribed) {
    return (
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-0 shadow-xl">
              <CardContent className="p-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-tire-dark mb-4">
                  Welcome to the BandenCentrale Family! 🎉
                </h2>
                <p className="text-lg text-tire-gray mb-6">
                  Thank you for subscribing! Check your email for your exclusive 10% discount code 
                  and get ready for expert tire tips and special offers.
                </p>
                <Badge className="bg-green-100 text-green-800 px-4 py-2">
                  <Gift className="w-4 h-4 mr-2" />
                  10% Discount Code Sent!
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-tire-dark to-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="text-white space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="space-y-4">
              <Badge className="bg-tire-orange/20 text-tire-orange border-tire-orange/30">
                <Star className="w-4 h-4 mr-2" />
                Exclusive Member Benefits
              </Badge>
              
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                Stay Connected &{" "}
                <span className="text-tire-orange">Save More</span>
              </h2>
              
              <p className="text-xl text-gray-300">
                Join over 25,000 smart drivers who receive exclusive discounts, 
                maintenance reminders, and expert tire care tips straight to their inbox.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  className="flex items-start space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-tire-orange/20 p-2 rounded-lg flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-tire-orange" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{benefit.title}</h3>
                    <p className="text-gray-300">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-8 h-8 bg-tire-orange rounded-full border-2 border-white"></div>
                  ))}
                </div>
                <span className="text-sm text-gray-300">25,000+ subscribers</span>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-gray-300 ml-2">4.9/5 rating</span>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Signup Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="border-0 shadow-2xl overflow-hidden py-0">
              <CardContent className="p-0">
                {/* Header */}
                <div className="bg-gradient-to-r from-tire-orange to-primary text-white p-8 text-center">
                  <Mail className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">
                    Get Your 10% Discount
                  </h3>
                  <p className="text-orange-100">
                    Subscribe now and save on your next tire purchase!
                  </p>
                </div>

                {/* Form */}
                <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-tire-dark mb-2">
                          Email Address
                        </label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="h-12 text-lg"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-tire-gradient hover:opacity-90 h-12 text-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Gift className="w-5 h-5 mr-2" />
                      )}
                      {isLoading ? "Subscribing..." : "Get My 10% Discount"}
                      {!isLoading && <ArrowRight className="w-5 h-5 ml-2" />}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      By subscribing, you agree to receive marketing emails. 
                      Unsubscribe at any time. Privacy policy applies.
                    </p>
                  </form>

                  {/* Trust Indicators */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="grid grid-cols-3 gap-4 text-center text-sm text-tire-gray">
                      <div>
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-1" />
                        <span>No Spam</span>
                      </div>
                      <div>
                        <Mail className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                        <span>Weekly Tips</span>
                      </div>
                      <div>
                        <Gift className="w-5 h-5 text-tire-orange mx-auto mb-1" />
                        <span>Exclusive Deals</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
