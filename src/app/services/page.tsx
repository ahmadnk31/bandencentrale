"use client";

import Header from "@/components/header";
import ServicesSection from "@/components/services-section";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { getAllServiceCategories } from "@/lib/services-data";
import { 
  Phone, 
  MapPin, 
  Calendar,
  Clock,
  Star,
  CheckCircle,
  Users,
  Award,
  Wrench,
  Car
} from "lucide-react";

const ServicesPage = () => {
  const router = useRouter();
  const stats = [
    { number: "50,000+", label: "Tires Installed", icon: Car },
    { number: "98%", label: "Customer Satisfaction", icon: Star },
    { number: "15+", label: "Years Experience", icon: Award },
    { number: "25+", label: "Certified Technicians", icon: Users }
  ];

  const whyChooseUs = [
    {
      title: "Certified Technicians",
      description: "Our team consists of certified automotive technicians with years of experience in tire installation and automotive services.",
      icon: Award
    },
    {
      title: "State-of-the-Art Equipment",
      description: "We use the latest technology and equipment to ensure precise installation and optimal performance for your tires.",
      icon: Wrench
    },
    {
      title: "Quality Guarantee",
      description: "All our services come with a satisfaction guarantee. We stand behind our work and your safety on the road.",
      icon: CheckCircle
    },
    {
      title: "Fast & Convenient",
      description: "Most services completed while you wait. We value your time and strive to get you back on the road quickly.",
      icon: Clock
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment: "Excellent service! The team was professional and completed my tire installation quickly. Highly recommended!",
      service: "Tire Installation"
    },
    {
      name: "Mike Rodriguez",
      rating: 5,
      comment: "Great experience with wheel alignment. My car drives much better now and the price was very fair.",
      service: "Wheel Alignment"
    },
    {
      name: "Emily Chen",
      rating: 5,
      comment: "The road hazard protection saved me hundreds when I got a nail in my tire. Worth every penny!",
      service: "Road Hazard Protection"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-tire-dark to-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Professional Tire{" "}
              <span className="text-tire-orange">Services</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              From installation to maintenance, our certified technicians provide 
              comprehensive automotive services to keep you safe on the road.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-tire-orange hover:bg-tire-orange/90">
                <Calendar className="w-5 h-5 mr-2" />
                Book Appointment
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-tire-dark">
                <Phone className="w-5 h-5 mr-2" />
                Call +32 467 87 1205
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-tire-dark">Browse by Category</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {getAllServiceCategories().map(category => (
              <Badge 
                key={category}
                variant="outline" 
                className="cursor-pointer hover:bg-tire-orange hover:text-white hover:border-tire-orange px-4 py-2 text-sm"
                onClick={() => {
                  // For now, we'll scroll to services section. In future, could create category pages
                  const servicesSection = document.getElementById('services-section');
                  if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-tire-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-tire-dark mb-2">
                  {stat.number}
                </div>
                <div className="text-tire-gray">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Services Section */}
      <div id="services-section">
        <ServicesSection />
      </div>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              We're not just another tire shop. We're your trusted automotive partner 
              committed to your safety and satisfaction.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full p-8 hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div className="bg-tire-gradient p-3 rounded-lg flex-shrink-0">
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-tire-dark mb-3">
                          {item.title}
                        </h3>
                        <p className="text-tire-gray leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-tire-dark mb-4">
              What Our{" "}
              <span className="bg-gradient-to-r from-tire-orange to-primary bg-clip-text text-transparent">
                Customers Say
              </span>
            </h2>
            <p className="text-xl text-tire-gray max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our satisfied customers have to say.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full p-6 hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardContent className="p-0">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-tire-gray mb-6 leading-relaxed">
                      "{testimonial.comment}"
                    </p>
                    <div className="border-t pt-4">
                      <div className="font-semibold text-tire-dark">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-tire-gray">
                        {testimonial.service}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-tire-dark to-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Experience the Difference?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Book your service appointment today and discover why thousands of customers 
              trust BandenCentrale for their automotive needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-tire-orange hover:bg-tire-orange/90 px-8">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Service
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-tire-dark px-8">
                <MapPin className="w-5 h-5 mr-2" />
                Visit Our Shop
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
