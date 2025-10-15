"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useBrands } from "@/hooks/use-store-data";
import { Loader2 } from "lucide-react";

const BrandsSection = () => {
  // Fetch brands from API
  const { data: brandsResponse, isLoading: brandsLoading, error: brandsError } = useBrands();
  const brands = brandsResponse?.data || [];

  const mockBrands = [
    {
      name: "Michelin",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYnMzapI5DmmijYolQm45NMaD9eMrE4oAOhA&s",
      description: "Premium French tire manufacturer"
    },
    {
      name: "Continental",
      logo: "/api/placeholder/120/60", 
      description: "German engineering excellence"
    },
    {
      name: "Bridgestone",
      logo: "/api/placeholder/120/60",
      description: "Japanese innovation leader"
    },
    {
      name: "Pirelli",
      logo: "/api/placeholder/120/60",
      description: "Italian motorsport heritage"
    },
    {
      name: "Goodyear",
      logo: "/api/placeholder/120/60",
      description: "American tire pioneer"
    },
    {
      name: "Dunlop",
      logo: "/api/placeholder/120/60",
      description: "British racing legacy"
    },
    {
      name: "Yokohama",
      logo: "/api/placeholder/120/60",
      description: "Japanese performance focus"
    },
    {
      name: "Hankook",
      logo: "/api/placeholder/120/60",
      description: "Korean quality innovation"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-tire-dark mb-4">
            Premium{" "}
            <span className="bg-gradient-to-r from-tire-orange to-primary bg-clip-text text-transparent">
              Brand Partners
            </span>
          </h2>
          <p className="text-xl text-tire-gray max-w-3xl mx-auto">
            We partner with the world's leading tire manufacturers to bring you 
            the highest quality products and latest innovations in tire technology.
          </p>
        </motion.div>

        {/* Loading State */}
        {brandsLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-tire-orange mr-2" />
            <span className="text-lg">Loading brands...</span>
          </div>
        )}

        {/* Brands Grid */}
        {!brandsLoading && !brandsError && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {(brands.length > 0 ? brands : mockBrands).slice(0, 8).map((brand: any, index: number) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                <CardContent className=" text-center space-y-4">
                  <div className="">
                    <img
                      src={brand.logo}
                      alt={`${brand.name} logo`}
                      className="w-auto h-auto aspect-square object-contain mx-auto"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-tire-dark text-lg mb-1">
                      {brand.name}
                    </h3>
                    <p className="text-tire-gray text-sm">
                      {brand.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          </div>
        )}

        {/* Trust Indicators */}
        <motion.div
          className="mt-16 grid md:grid-cols-3 gap-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-tire-orange">100+</h3>
            <p className="text-tire-gray">Tire Models Available</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-tire-orange">15+</h3>
            <p className="text-tire-gray">Years of Partnership</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-tire-orange">24/7</h3>
            <p className="text-tire-gray">Support & Warranty</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BrandsSection;
