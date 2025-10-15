"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCategories, useCategoryProductCounts } from "@/hooks/use-store-data";
import { useSwipe } from "@/hooks/use-swipe";
import { 
  ChevronLeft, 
  ChevronRight,
  Car,
  Truck,
  Bike,
  Zap,
  Shield,
  Mountain,
  Loader2
} from "lucide-react";

const CategoriesCarousel = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(4);
  
  // Responsive items per slide
  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth < 480) {
        setItemsPerSlide(2); // Small mobile: 2 items
      } else if (window.innerWidth < 768) {
        setItemsPerSlide(2); // Mobile: 2 items
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(3); // Tablet: 3 items
      } else if (window.innerWidth < 1280) {
        setItemsPerSlide(4); // Small desktop: 4 items
      } else {
        setItemsPerSlide(4); // Large desktop: 4 items
      }
    };

    updateItemsPerSlide();
    window.addEventListener('resize', updateItemsPerSlide);
    return () => window.removeEventListener('resize', updateItemsPerSlide);
  }, []);
  
  // Fetch categories from API
  const { data: categoriesResponse, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const { data: productCounts, isLoading: countsLoading } = useCategoryProductCounts();
  const categories = categoriesResponse?.data || [];

  const mockCategories = [
    {
      id: 1,
      name: "Summer Tires",
      slug: "summer-tires",
      description: "High-performance tires for warm weather",
      icon: Car,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      productCount: 45,
      color: "from-orange-500 to-red-500"
    },
    {
      id: 2,
      name: "Winter Tires",
      slug: "winter-tires", 
      description: "Superior grip for snow and ice",
      icon: Mountain,
      image: "https://images.unsplash.com/photo-1551524164-687a55dd1126?w=400&h=300&fit=crop",
      productCount: 38,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 3,
      name: "All-Season Tires",
      slug: "all-season-tires",
      description: "Versatile performance year-round",
      icon: Shield,
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
      productCount: 52,
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 4,
      name: "Performance Tires",
      slug: "performance-tires",
      description: "Maximum grip and handling",
      icon: Zap,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      productCount: 29,
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 5,
      name: "Truck Tires",
      slug: "truck-tires",
      description: "Heavy-duty tires for trucks",
      icon: Truck,
      image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop",
      productCount: 23,
      color: "from-gray-600 to-gray-800"
    },
    {
      id: 6,
      name: "Motorcycle Tires",
      slug: "motorcycle-tires",
      description: "Precision tires for motorcycles",
      icon: Bike,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      productCount: 18,
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const displayCategories = categories.length > 0 ? categories.map((cat: any, index: number) => ({
    ...cat,
    icon: [Car, Mountain, Shield, Zap, Truck, Bike][index % 6],
    image: `https://images.unsplash.com/photo-${['1558618666-fcd25c85cd64', '1551524164-687a55dd1126', '1449824913935-59a10b8d2000', '1571019613454-1cb2f99b2d8b', '1544636331-e26879cd4d9b', '1558618666-fcd25c85cd64'][index % 6]}?w=400&h=300&fit=crop`,
    productCount: productCounts?.[cat.name] || 0, // Use real product count
    color: ['from-orange-500 to-red-500', 'from-blue-500 to-cyan-500', 'from-green-500 to-emerald-500', 'from-purple-500 to-pink-500', 'from-gray-600 to-gray-800', 'from-yellow-500 to-orange-500'][index % 6]
  })) : mockCategories;

  const totalSlides = Math.ceil(displayCategories.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (slide: number) => {
    setCurrentSlide(slide);
  };

  const handleCategoryClick = (category: any) => {
    router.push(`/tires?category=${category.slug}`);
  };

  // Touch/swipe handlers
  const swipeHandlers = useSwipe({
    onSwipeLeft: nextSlide,
    onSwipeRight: prevSlide,
  }, {
    threshold: 50,
    preventDefaultTouchmoveEvent: false
  });

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-tire-dark mb-1 sm:mb-2">
              Shop by{" "}
              <span className="bg-gradient-to-r from-tire-orange to-primary bg-clip-text text-transparent">
                Category
              </span>
            </h2>
            <p className="text-sm sm:text-lg text-tire-gray">
              Find the perfect tires for your specific needs
            </p>
          </div>
          
          {/* Navigation Arrows - Hidden on mobile */}
          <div className="hidden sm:flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              className="p-2 rounded-full"
              disabled={totalSlides <= 1}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              className="p-2 rounded-full"
              disabled={totalSlides <= 1}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Loading State */}
        {(categoriesLoading || countsLoading) && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-tire-orange mr-2" />
            <span className="text-lg">Loading categories...</span>
          </div>
        )}

        {/* Categories Carousel */}
        {!categoriesLoading && !countsLoading && !categoriesError && (
          <div className="relative overflow-hidden">
            <motion.div
              {...swipeHandlers}
              className="flex transition-transform duration-500 ease-in-out touch-pan-y select-none"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className={`grid gap-4 sm:gap-6 ${
                    itemsPerSlide === 2 ? 'grid-cols-2' :
                    itemsPerSlide === 3 ? 'grid-cols-3' :
                    'grid-cols-4'
                  } auto-rows-fr`}>
                    {displayCategories
                      .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                      .map((category: any, index: number) => {
                        const IconComponent = category.icon;
                        return (
                          <motion.div
                            key={category.id || category.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                            className="group cursor-pointer flex"
                            onClick={() => handleCategoryClick(category)}
                          >
                            <Card className="h-full w-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                              {/* Background Image */}
                              <div className="relative h-24 sm:h-32 md:h-40 lg:h-48 overflow-hidden">
                                <img
                                  src={category.image}
                                  alt={category.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80`} />
                                
                                {/* Icon Overlay */}
                                <div className="absolute top-1 sm:top-2 md:top-3 lg:top-4 right-1 sm:right-2 md:right-3 lg:right-4">
                                  <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
                                  </div>
                                </div>

                                {/* Product Count */}
                                <div className="absolute bottom-1 sm:bottom-2 md:bottom-3 lg:bottom-4 left-1 sm:left-2 md:left-3 lg:left-4">
                                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-2.5 md:py-1 lg:px-3 lg:py-1">
                                    <span className="text-white text-xs sm:text-xs md:text-sm lg:text-sm font-medium">
                                      {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Content */}
                              <CardContent className="p-2 sm:p-3 md:p-4 lg:p-6 flex-1 flex flex-col">
                                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-tire-dark mb-1 sm:mb-1 md:mb-2 lg:mb-2 group-hover:text-tire-orange transition-colors">
                                  {category.name}
                                </h3>
                                <p className="text-tire-gray text-xs sm:text-xs md:text-sm lg:text-sm mb-2 sm:mb-3 md:mb-3 lg:mb-4 flex-1 line-clamp-2">
                                  {category.description}
                                </p>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="w-full text-xs sm:text-xs md:text-sm lg:text-sm py-1 sm:py-1.5 md:py-2 lg:py-2 group-hover:bg-tire-orange group-hover:text-white group-hover:border-tire-orange transition-all mt-auto"
                                >
                                  Shop Now
                                </Button>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Mobile Navigation Arrows */}
            <div className="flex sm:hidden justify-center space-x-4 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                className="p-2 rounded-full"
                disabled={totalSlides <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                className="p-2 rounded-full"
                disabled={totalSlides <= 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Slide Indicators */}
            {totalSlides > 1 && (
              <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                      index === currentSlide
                        ? 'bg-tire-orange scale-125'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* View All Categories CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-4 rounded-full hover:bg-gray-50 border-gray-300"
            onClick={() => router.push('/tires')}
          >
            View All Tires
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesCarousel;
