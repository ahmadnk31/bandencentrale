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
  TrendingUp,
  Loader2,
  Trophy,
  Flame
} from "lucide-react";

const BestSellersCarousel = () => {
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
  
  // Fetch best selling products (using isFeatured and stockQuantity as proxy for bestsellers)
  const { data: productsResponse, isLoading: productsLoading, error: productsError } = useProducts({ 
    limit: 12, 
    inStock: true,
    sortBy: 'stockQuantity',
    sortOrder: 'desc' // Products with higher stock movement (lower remaining stock) indicate popularity
  });
  
  // Get all products and simulate bestseller logic
  const allProducts = productsResponse?.data || [];
  const products = allProducts.map((product: Product, index: number) => ({
    ...product,
    salesRank: index + 1, // Simulate sales ranking
    salesCount: Math.floor(Math.random() * 500) + 100, // Mock sales count
    isHot: index < 3 // Top 3 are "hot" items
  }));

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

  const handleAddToCart = (id: string | number) => {
    console.log(`Added product ${id} to cart`);
  };

  const handleViewDetails = (id: string | number, slug?: string) => {
    router.push(`/product/${slug || id}`);
  };

  const handleToggleFavorite = (id: string | number) => {
    console.log(`Toggled favorite for product ${id}`);
  };

  // Best seller rankings
  const getBestSellerRank = (index: number) => {
    const rank = index + 1;
    if (rank === 1) return { icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-100" };
    if (rank === 2) return { icon: Trophy, color: "text-gray-400", bg: "bg-gray-100" };
    if (rank === 3) return { icon: Trophy, color: "text-orange-500", bg: "bg-orange-100" };
    return { icon: Flame, color: "text-red-500", bg: "bg-red-100" };
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
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-tire-dark mb-1 sm:mb-2">
                Best{" "}
                <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                  Sellers
                </span>
              </h2>
              <p className="text-sm sm:text-lg text-tire-gray flex items-center">
                <Flame className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Most popular choices by our customers
              </p>
            </div>
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
        {productsLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-tire-orange mr-2" />
            <span className="text-lg">Loading best sellers...</span>
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
                      .map((product: any, index: number) => {
                        const globalIndex = slideIndex * itemsPerSlide + index;
                        const { icon: RankIcon, color, bg } = getBestSellerRank(globalIndex);
                        return (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative flex"
                          >
                            {/* Best Seller Rank Badge */}
                            <div className="absolute top-2 left-2 z-10">
                              <div className={`${bg} text-gray-800 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1`}>
                                <RankIcon className={`w-3 h-3 ${color}`} />
                                <span>#{globalIndex + 1}</span>
                              </div>
                            </div>

                            {/* Hot Badge for top sellers */}
                            {globalIndex < 3 && (
                              <div className="absolute top-2 right-2 z-10">
                                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                                  HOT
                                </div>
                              </div>
                            )}
                            
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
                              rating={4.5 + (globalIndex < 3 ? 0.3 : 0)} // Top 3 get higher ratings
                              reviews={Math.floor(Math.random() * 300) + 100} // Bestsellers have more reviews
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
                        ? 'bg-red-500 scale-125'
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
              <TrendingUp className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-tire-dark mb-4">
              No Best Sellers Yet
            </h3>
            <p className="text-tire-gray mb-8">
              We're tracking sales data to show you the most popular products.
            </p>
          </div>
        )}

        {/* View All Best Sellers CTA */}
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
              className="px-8 py-4 rounded-full hover:bg-red-50 border-red-300 text-red-700 hover:text-red-800"
              onClick={() => router.push('/tires?sort=featured&order=desc')}
            >
              View All Best Sellers
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BestSellersCarousel;
