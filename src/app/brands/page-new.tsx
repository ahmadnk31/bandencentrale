"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import { useRouter } from "next/navigation";
import { useBrands } from "@/hooks/use-store-data";
import { 
  Star, 
  Award, 
  Globe, 
  Truck, 
  Car,
  Users,
  TrendingUp,
  ArrowRight,
  Loader2,
  ExternalLink
} from "lucide-react";

const BrandsPage = () => {
  const router = useRouter();
  const { data: brandsResponse, isLoading: brandsLoading, error: brandsError } = useBrands();
  const brands = brandsResponse?.data || [];

  const brandStats = [
    { icon: Globe, label: "Global Brands", value: "15+" },
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
      description: "Racing-inspired tires for maximum performance",
      brands: ["Pirelli", "Michelin", "Continental"]
    },
    {
      name: "Commercial & Truck",
      icon: Truck,
      description: "Heavy-duty tires built for commercial use",
      brands: ["Bridgestone", "Continental", "Michelin"]
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
              Trusted Tire{" "}
              <span className="text-tire-orange">Brands</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Discover premium tire brands from around the world. Each brand represents 
              decades of innovation, quality, and performance excellence.
            </p>
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

      {/* Categories Section */}
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
              Browse by{" "}
              <span className="bg-gradient-to-r from-tire-orange to-primary bg-clip-text text-transparent">
                Category
              </span>
            </h2>
            <p className="text-xl text-tire-gray max-w-3xl mx-auto">
              Find the perfect brand for your specific vehicle and driving needs.
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
              >
                <Card className="h-full p-6 hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardContent className="p-0 text-center">
                    <div className="bg-tire-gradient p-4 rounded-full w-fit mx-auto mb-4">
                      <category.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-tire-dark mb-3">
                      {category.name}
                    </h3>
                    <p className="text-tire-gray mb-4">
                      {category.description}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {category.brands.map(brand => (
                        <span key={brand} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-tire-gray">
                          {brand}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Grid Section */}
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
              Featured{" "}
              <span className="bg-gradient-to-r from-tire-orange to-primary bg-clip-text text-transparent">
                Brands
              </span>
            </h2>
            <p className="text-xl text-tire-gray max-w-3xl mx-auto">
              Explore our complete collection of premium tire brands, each with their unique 
              heritage and specializations.
            </p>
          </motion.div>

          {/* Loading State */}
          {brandsLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-tire-orange mr-2" />
              <span className="text-lg">Loading brands...</span>
            </div>
          )}

          {/* Error State */}
          {brandsError && (
            <div className="text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-600">Failed to load brands. Please try again.</p>
              </div>
            </div>
          )}

          {/* Brands Grid */}
          {!brandsLoading && !brandsError && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {brands.map((brand: any, index: number) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                    <CardContent className="p-6 h-full flex flex-col">
                      {/* Brand Header */}
                      <div className="flex items-center mb-4">
                        {brand.logo && (
                          <div className="bg-gray-50 rounded-lg p-3 mr-4">
                            <img 
                              src={brand.logo} 
                              alt={`${brand.name} logo`}
                              className="w-12 h-12 object-contain"
                            />
                          </div>
                        )}
                        <div>
                          <h3 className="text-xl font-bold text-tire-dark mb-1">{brand.name}</h3>
                          {brand.countryOfOrigin && (
                            <p className="text-sm text-tire-gray flex items-center">
                              <Globe className="w-4 h-4 mr-1" />
                              {brand.countryOfOrigin}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Brand Description */}
                      {brand.description && (
                        <p className="text-tire-gray text-sm mb-6 flex-grow">
                          {brand.description}
                        </p>
                      )}

                      {/* Brand Actions */}
                      <div className="flex gap-2 mt-auto">
                        <Button 
                          className="flex-1 bg-tire-gradient hover:bg-tire-gradient/90"
                          onClick={() => router.push(`/tires?brand=${encodeURIComponent(brand.name)}`)}
                        >
                          View Tires
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                        {brand.website && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(brand.website, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!brandsLoading && !brandsError && brands.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-tire-dark mb-4">
                No brands available
              </h3>
              <p className="text-tire-gray">
                Check back later for our brand collection.
              </p>
            </div>
          )}
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
              Can't Find Your Brand?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              We work with many tire manufacturers and can special order tires from 
              brands not listed here. Contact us for availability.
            </p>
            <Button 
              size="lg" 
              className="bg-tire-orange hover:bg-tire-orange/90 px-8"
              onClick={() => router.push('/contact')}
            >
              Contact Us
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BrandsPage;
