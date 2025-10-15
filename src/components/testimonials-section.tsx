"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Marie Dubois",
      location: "Ghent, Belgium",
      rating: 5,
      text: "Exceptional service! The team at BandenCentrale helped me choose the perfect winter tires for my BMW. Professional installation and great prices. Highly recommended!",
      avatar: "/api/placeholder/60/60",
      service: "Winter Tire Installation"
    },
    {
      id: 2,
      name: "Jan Vermeulen",
      location: "Brussels, Belgium", 
      rating: 5,
      text: "I've been a customer for over 5 years. Their expertise in tire selection is unmatched, and the wheel alignment service is top-notch. Always fair pricing and honest advice.",
      avatar: "/api/placeholder/60/60",
      service: "Wheel Alignment & Tire Replacement"
    },
    {
      id: 3,
      name: "Sophie Laurent",
      location: "Antwerp, Belgium",
      rating: 5,
      text: "Quick and efficient service! Had my summer tires changed in under an hour. The staff is knowledgeable and the waiting area is comfortable. Will definitely return.",
      avatar: "/api/placeholder/60/60",
      service: "Summer Tire Change"
    },
    {
      id: 4,
      name: "Pieter De Smet",
      location: "Leuven, Belgium",
      rating: 5,
      text: "Outstanding customer service and competitive prices. They explained everything clearly and the tire recommendation was perfect for my driving needs. Five stars!",
      avatar: "/api/placeholder/60/60",
      service: "All-Season Tire Purchase"
    },
    {
      id: 5,
      name: "Emma Van Der Berg",
      location: "Bruges, Belgium",
      rating: 5,
      text: "Professional team with excellent technical knowledge. They diagnosed my wheel balance issue quickly and fixed it perfectly. Great value for money!",
      avatar: "/api/placeholder/60/60",
      service: "Wheel Balancing"
    },
    {
      id: 6,
      name: "Lucas Moreau",
      location: "Mechelen, Belgium",
      rating: 5,
      text: "Impressive selection of premium tires and expert installation. The road hazard protection plan gave me peace of mind. Truly professional service!",
      avatar: "/api/placeholder/60/60",
      service: "Performance Tire Installation"
    }
  ];

  return (
    <section className="py-20 bg-white">
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
            What Our{" "}
            <span className="bg-gradient-to-r from-tire-orange to-primary bg-clip-text text-transparent">
              Customers Say
            </span>
          </h2>
          <p className="text-xl text-tire-gray max-w-3xl mx-auto">
            Join thousands of satisfied customers who trust BandenCentrale for their tire needs. 
            Here's what they have to say about our service and expertise.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  {/* Quote Icon */}
                  <div className="flex justify-between items-start">
                    <Quote className="w-8 h-8 text-tire-orange/30" />
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-tire-gray leading-relaxed">
                    "{testimonial.text}"
                  </p>

                  {/* Service Badge */}
                  <div className="inline-block">
                    <span className="bg-tire-orange/10 text-tire-orange px-3 py-1 rounded-full text-sm font-medium">
                      {testimonial.service}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-center space-x-3 pt-4 border-t">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-tire-dark">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-tire-gray">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Overall Rating Summary */}
        <motion.div
          className="mt-16 text-center bg-gradient-to-r from-tire-dark to-primary rounded-2xl p-8 text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <h3 className="text-2xl font-bold mb-1">4.9/5 Rating</h3>
              <p className="text-gray-300">Based on 2,847+ reviews</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-1">50,000+</h3>
              <p className="text-gray-300">Happy Customers</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-1">99%</h3>
              <p className="text-gray-300">Would Recommend</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
