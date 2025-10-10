"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import { useRouter } from "next/navigation";
import { brands, getTiresByBrand } from "@/lib/data";
import { 
  Star, 
  Award, 
  Globe, 
  Truck, 
  Car,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const BrandsPage = () => {
  const router = useRouter();
  const brandStats = [
    { icon: Globe, label: "Global Brands", value: "50+" },
    { icon: Star, label: "Average Rating", value: "4.7/5" },
    { icon: Users, label: "Satisfied Customers", value: "100K+" },
    { icon: TrendingUp, label: "Years Combined Experience", value: "500+" }
  ];

  const categories = [
    {
      name: "Passenger Cars",
      icon: Car,
      description: "Tires for everyday driving comfort and efficiency",
      brands: ["Michelin", "Continental", "Bridgestone"]
    },
    {
      name: "High Performance",
      icon: TrendingUp,
      description: "Sport and performance tires for enhanced driving dynamics",
      brands: ["Pirelli", "Continental", "Michelin"]
    },
    {
      name: "SUV & Truck",
      icon: Truck,
      description: "Heavy-duty tires for larger vehicles and commercial use",
      brands: ["Goodyear", "Bridgestone", "Continental"]
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
              Premium Tire{" "}
              <span className="text-tire-orange">Brands</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              We partner with the world's most trusted tire manufacturers to bring you 
              the best in safety, performance, and value.
            </p>
            <Button size="lg" className="bg-tire-orange hover:bg-tire-orange/90">
              <Globe className="w-5 h-5 mr-2" />
              Explore All Brands
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {brandStats.map((stat, index) => (
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
                  {stat.value}
                </div>
                <div className="text-tire-gray">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Categories */}
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
              Find Brands by{" "}
              <span className="bg-gradient-to-r from-tire-orange to-primary bg-clip-text text-transparent">
                Category
              </span>
            </h2>
            <p className="text-xl text-tire-gray max-w-3xl mx-auto">
              Different driving needs require different tire solutions. 
              Explore our brands by vehicle category.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full p-8 hover:shadow-xl transition-all border-0 shadow-lg">
                  <CardContent className="p-0 text-center h-full flex flex-col">
                    <div className="bg-tire-gradient w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <category.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-tire-dark mb-4">
                      {category.name}
                    </h3>
                    <p className="text-tire-gray mb-6">
                      {category.description}
                    </p>
                    <div className="space-y-2 mb-6">
                      <p className="text-sm font-semibold text-tire-dark">Featured Brands:</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {category.brands.map(brand => (
                          <Badge key={brand} variant="secondary" className="text-xs">
                            {brand}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full">
                      View {category.name} Tires
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Showcase */}
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
              Our{" "}
              <span className="bg-gradient-to-r from-tire-orange to-primary bg-clip-text text-transparent">
                Premium Partners
              </span>
            </h2>
            <p className="text-xl text-tire-gray max-w-3xl mx-auto">
              We proudly carry the world's most respected tire brands, 
              each with their unique heritage and innovations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brands.map((brand, index) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Card className="h-full hover:shadow-2xl py-0 transition-all duration-300 border-0 shadow-lg overflow-hidden">
                  <CardContent className="p-0 h-full flex flex-col">
                    {/* Brand Header */}
                    <div className={`${brand.color} text-white p-6 rounded-t-xl`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-white rounded-lg p-3">
                          <img 
                            src={brand.logo} 
                            alt={`${brand.name} logo`}
                            className="h-8 w-auto"
                          />
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-300 fill-current mr-1" />
                          <span className="font-semibold">{brand.rating}</span>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{brand.name}</h3>
                      <p className="text-sm opacity-90">
                        Est. {brand.founded} • {brand.country}
                      </p>
                    </div>

                    {/* Brand Details */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex-1 space-y-6">
                        <p className="text-tire-gray leading-relaxed">
                          {brand.description}
                        </p>

                        {/* Specialties */}
                        <div>
                          <h4 className="font-semibold text-tire-dark mb-3">Specialties</h4>
                          <div className="flex flex-wrap gap-2">
                            {brand.specialties.map(specialty => (
                              <Badge key={specialty} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Key Features */}
                        <div>
                          <h4 className="font-semibold text-tire-dark mb-3">Key Features</h4>
                          <div className="space-y-2">
                            {brand.features.map(feature => (
                              <div key={feature} className="flex items-center text-sm text-tire-gray">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Popular Models */}
                        <div>
                          <h4 className="font-semibold text-tire-dark mb-3">Popular Models</h4>
                          <div className="flex flex-wrap gap-2">
                            {brand.popularModels.map(model => (
                              <Badge key={model} variant="outline" className="text-xs">
                                {model}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="mt-6">
                        <Button 
                          className="w-full group-hover:bg-tire-orange transition-colors"
                          onClick={() => router.push(`/brands/${brand.name.toLowerCase().replace(/\s+/g, '-')}`)}
                        >
                          View {brand.name} Tires
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
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
              Find Your Perfect Brand
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Not sure which brand is right for you? Our tire experts are here to help 
              you find the perfect match for your vehicle and driving style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-tire-orange hover:bg-tire-orange/90 px-8">
                <Award className="w-5 h-5 mr-2" />
                Get Expert Advice
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-tire-dark px-8">
                <Car className="w-5 h-5 mr-2" />
                Browse All Tires
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BrandsPage;
