"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { 
  Shield, 
  Clock, 
  Award, 
  Users, 
  Wrench, 
  Euro,
  MapPin,
  Phone,
  CheckCircle,
  Star
} from "lucide-react";

const WhyChooseUsSection = () => {
  const router = useRouter();

  const features = [
    {
      icon: Shield,
      title: "Lifetime Warranty",
      description: "Comprehensive warranty coverage on all tire installations and services. Your investment is protected with our industry-leading guarantee.",
      color: "from-blue-500 to-blue-600",
      benefits: ["Workmanship guarantee", "Road hazard protection", "Free repairs within warranty"]
    },
    {
      icon: Clock,
      title: "Quick Service",
      description: "Most tire installations completed within 30-45 minutes. Same-day service available for urgent needs with our efficient process.",
      color: "from-green-500 to-green-600", 
      benefits: ["30-min average service", "Same-day availability", "Online appointment booking"]
    },
    {
      icon: Award,
      title: "Expert Technicians",
      description: "ASE-certified professionals with years of experience. Our team stays updated with the latest tire technology and installation techniques.",
      color: "from-purple-500 to-purple-600",
      benefits: ["ASE certified staff", "Ongoing training", "15+ years experience"]
    },
    {
      icon: Euro,
      title: "Best Price Guarantee",
      description: "We'll match or beat any competitor's price on the same tire and service package. Quality service doesn't have to break the bank.",
      color: "from-tire-orange to-primary",
      benefits: ["Price matching", "No hidden fees", "Transparent pricing"]
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Personalized service tailored to your driving needs and budget. We take time to understand your requirements and recommend the best solutions.",
      color: "from-red-500 to-red-600",
      benefits: ["Personal consultation", "Custom recommendations", "24/7 support"]
    },
    {
      icon: Wrench,
      title: "Complete Service",
      description: "Full-service automotive care beyond just tires. From wheel alignment to brake service, we're your one-stop automotive solution.",
      color: "from-indigo-500 to-indigo-600",
      benefits: ["Full automotive service", "Latest equipment", "Quality parts"]
    }
  ];

  const stats = [
    { number: "50K+", label: "Satisfied Customers", icon: "👥" },
    { number: "15+", label: "Years in Business", icon: "📅" },
    { number: "100+", label: "Tire Brands", icon: "🏷️" },
    { number: "99%", label: "Customer Satisfaction", icon: "⭐" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-tire-dark mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-tire-orange to-primary bg-clip-text text-transparent">
              BandenCentrale?
            </span>
          </h2>
          <p className="text-xl text-tire-gray max-w-3xl mx-auto">
            We're not just another tire shop. We're your trusted automotive partner, 
            committed to keeping you safe on the road with premium products and expert service.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="h-full hover:shadow-xl py-0 transition-all duration-300 border-0 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  {/* Icon Header */}
                  <div className={`bg-gradient-to-r ${feature.color} p-6 text-white`}>
                    <feature.icon className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <p className="text-tire-gray leading-relaxed">
                      {feature.description}
                    </p>
                    
                    {/* Benefits List */}
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center text-sm text-tire-gray">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl lg:text-4xl font-bold text-tire-orange mb-2">
                  {stat.number}
                </div>
                <div className="text-tire-gray font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center bg-white rounded-2xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl lg:text-3xl font-bold text-tire-dark mb-4">
            Ready to Experience the Difference?
          </h3>
          <p className="text-tire-gray mb-6 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust BandenCentrale for their tire needs. 
            Schedule your appointment today and discover why we're Belgium's preferred tire service center.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-tire-gradient hover:opacity-90 px-8"
              onClick={() => router.push('/booking')}
            >
              <Clock className="w-5 h-5 mr-2" />
              Schedule Service
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-tire-orange text-tire-orange hover:bg-tire-orange hover:text-white px-8"
              onClick={() => router.push('/quote')}
            >
              <Euro className="w-5 h-5 mr-2" />
              Get Free Quote
            </Button>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-6 pt-6 border-t text-sm text-tire-gray">
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-tire-orange" />
              <span>+32 467 87 1205</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-tire-orange" />
              <span>Dendermondsesteenweg 428, Ghent, Belgium</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
