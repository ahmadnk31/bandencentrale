"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useProducts, Product } from "@/hooks/use-store-data";
import { useSwipe } from "@/hooks/use-swipe";
import ProductCard from "@/components/product-card";
import { 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Loader2,
  Sparkles
} from "lucide-react";

const NewArrivalsCarousel = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(4);
  
  // Responsive items per slide
  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth < 480) {
        setItemsPerSlide(1); // Small mobile: 1 item
      } else if (window.innerWidth < 768) {
        setItemsPerSlide(1); // Mobile: 1 item
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(2); // Tablet: 2 items
      } else if (window.innerWidth < 1280) {
        setItemsPerSlide(3); // Small desktop: 3 items
      } else {
        setItemsPerSlide(4); // Large desktop: 4 items
      }
    };

    updateItemsPerSlide();
    window.addEventListener('resize', updateItemsPerSlide);
    return () => window.removeEventListener('resize', updateItemsPerSlide);
  }, []);
  
  // Fetch newest products from API (products from last 30 days or newest available)
  const { data: productsResponse, isLoading: productsLoading, error: productsError } = useProducts({ 
    limit: 12, 
    inStock: true,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  // Filter for truly new products (created in last 30 days) or show newest available
  const allProducts = productsResponse?.data || [];
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentProducts = allProducts.filter((product: Product) => 
    new Date(product.createdAt) > thirtyDaysAgo
  );
  
  // Use recent products if available, otherwise show newest 8 products
  const products = recentProducts.length > 0 ? recentProducts : allProducts.slice(0, 8);

  const totalSlides = Math.ceil(products.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (slide: number) => {
    setCurrentSlide(slide);
  };

  // Touch/swipe handlers
  const swipeHandlers = useSwipe({
    onSwipeLeft: nextSlide,
    onSwipeRight: prevSlide,
  }, {
    threshold: 50,
    preventDefaultTouchmoveEvent: false
  });

  const handleAddToCart = (id: string | number) => {
    console.log(`Added product ${id} to cart`);
  };

  const handleViewDetails = (id: string | number, slug?: string) => {
    router.push(`/product/${slug || id}`);
  };

  const handleToggleFavorite = (id: string | number) => {
    console.log(`Toggled favorite for product ${id}`);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-tire-dark mb-1 sm:mb-2">
                New{" "}
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  Arrivals
                </span>
              </h2>
              <p className="text-sm sm:text-lg text-tire-gray flex items-center">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Latest tire technology and innovations
              </p>
            </div>
          </div>
          
          {/* Navigation Arrows - Hidden on mobile, shown on larger screens */}
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
        {productsLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-tire-orange mr-2" />
            <span className="text-lg">Loading new arrivals...</span>
          </div>
        )}

        {/* Products Carousel */}
        {!productsLoading && !productsError && products.length > 0 && (
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
                    itemsPerSlide === 1 ? 'grid-cols-1' :
                    itemsPerSlide === 2 ? 'grid-cols-2' :
                    itemsPerSlide === 3 ? 'grid-cols-3' :
                    'grid-cols-4'
                  } auto-rows-fr`}>
                    {products
                      .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                      .map((product: Product, index: number) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className="relative flex"
                        >
                          {/* New Badge */}
                          <div className="absolute top-2 left-2 z-10">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold shadow-lg">
                              NEW
                            </div>
                          </div>
                          
                          <ProductCard
                            id={product.id}
                            slug={product.slug}
                            name={product.name}
                            brand={product.brand || "Unknown"}
                            price={parseFloat(product.price)}
                            originalPrice={product.compareAtPrice ? parseFloat(product.compareAtPrice) : undefined}
                            images={product.images && product.images.length > 0 ? product.images : [
                              { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop", alt: `${product.name} - Tire Image` }
                            ]}
                            rating={4.5}
                            reviews={Math.floor(Math.random() * 100) + 20}
                            size={product.size}
                            season={
                              product.season === 'all-season' ? 'All-Season' :
                              product.season === 'summer' ? 'Summer' :
                              product.season === 'winter' ? 'Winter' :
                              'All-Season'
                            }
                            speedRating={product.speedRating || undefined}
                            features={product.features || []}
                            inStock={product.inStock}
                            onAddToCart={handleAddToCart}
                            onViewDetails={handleViewDetails}
                            onToggleFavorite={handleToggleFavorite}
                            className="w-full h-full"
                          />
                        </motion.div>
                      ))}
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
                        ? 'bg-green-500 scale-125'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* No Products State */}
        {!productsLoading && !productsError && products.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-tire-dark mb-4">
              Coming Soon
            </h3>
            <p className="text-tire-gray mb-8">
              New products are being added regularly. Check back soon!
            </p>
          </div>
        )}

        {/* View All New Arrivals CTA */}
        {products.length > 0 && (
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
              className="px-8 py-4 rounded-full hover:bg-green-50 border-green-300 text-green-700 hover:text-green-800"
              onClick={() => router.push('/tires?sort=createdAt&order=desc')}
            >
              View All New Arrivals
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default NewArrivalsCarousel;
