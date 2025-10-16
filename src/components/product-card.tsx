"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useFavorites } from "@/lib/favorites-context";
import { formatPrice, safeToNumber, calculateDiscountPercentage } from "@/lib/utils/price";
import { 
  Star, 
  ShoppingCart, 
  Eye,
  Heart,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Snowflake,
  Sun,
  Mountain,
  Zap,
  Plus,
  Minus
} from "lucide-react";
import Image from "next/image";

interface ProductImage {
  src: string;
  alt: string;
}

interface ProductCardProps {
  id: number | string;
  slug?: string;
  name: string;
  brand: string | { id: string; name: string; slug: string; logo?: string; website?: string; countryOfOrigin?: string; } | null;
  price: number;
  originalPrice?: number;
  images: ProductImage[];
  rating: number;
  reviews: number;
  size?: string;
  season?: "Summer" | "Winter" | "All-Season";
  speedRating?: string;
  features: string[];
  badge?: string;
  badgeColor?: string;
  category?: string;
  inStock?: boolean;
  onAddToCart?: (id: number | string) => void;
  onViewDetails?: (id: number | string, slug?: string) => void;
  onToggleFavorite?: (id: number | string) => void;
  isFavorite?: boolean;
  className?: string;
}

const ProductCard = ({
  id,
  slug,
  name,
  brand,
  price,
  originalPrice,
  images: rawImages,
  rating,
  reviews,
  size,
  season,
  speedRating,
  features,
  badge,
  badgeColor = "bg-blue-500",
  category,
  inStock = true,
  onAddToCart,
  onViewDetails,
  onToggleFavorite,
  isFavorite = false,
  className = ""
}: ProductCardProps) => {
  // Normalize images to always be an array of {src, alt}
  let images: { src: string; alt: string }[] = [];
  if (Array.isArray(rawImages)) {
    if (rawImages.length > 0 && typeof rawImages[0] === 'object' && rawImages[0].src) {
      images = rawImages.map(img => ({ src: img.src, alt: img.alt || name }));
    } else {
      images = rawImages.map(img => ({ src: img, alt: name }));
    }
  } else if (typeof rawImages === 'string') {
    images = [{ src: rawImages, alt: name }];
  } else {
    images = [{ src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center', alt: name }];
  }
  const router = useRouter();
  const { addItem } = useCart();
  const { isFavorite: isInFavorites, toggleFavorite } = useFavorites();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for previous
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewImageIndex, setQuickViewImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const hasMultipleImages = images.length > 1;
  const isListView = className.includes("flex");
  
  // Swipe detection threshold
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };
  const discountPercentage = calculateDiscountPercentage(originalPrice, price);

  const nextImage = () => {
    setDirection(1);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setDirection(-1);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setDirection(index > currentImageIndex ? 1 : -1);
    setCurrentImageIndex(index);
  };

  const openQuickView = () => {
    setQuickViewImageIndex(0);
    setQuantity(1);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
  };

  // Convert current product to TireData format for cart
  const convertToTireData = () => {
    // Generate a numeric ID from string ID for cart compatibility
    const numericId = typeof id === 'string' ? 
      parseInt(id.replace(/[^0-9]/g, '').substring(0, 8)) || Math.floor(Math.random() * 1000000) : 
      id;

    // Ensure images are always in {src, alt} format
    let formattedImages: Array<{ src: string; alt: string }> = [];
    if (Array.isArray(images)) {
      if (images.length > 0 && typeof images[0] === 'object' && images[0].src) {
        formattedImages = images.map(img => ({ src: img.src, alt: img.alt || name }));
      } else {
        // Fallback: if images is array but not objects with src, use default image
        formattedImages = [{ src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center', alt: name }];
      }
    } else if (typeof images === 'string') {
      formattedImages = [{ src: images, alt: name }];
    } else {
      formattedImages = [{ src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center', alt: name }];
    }

    return {
      id: numericId,
      name,
      brand: typeof brand === 'string' ? brand : brand?.name || 'Unknown',
      model: name,
      price,
      originalPrice,
      images: formattedImages,
      rating,
      reviews,
      size: Array.isArray(size) ? size[0] : size || "215/60R16",
      season: (season || "All-Season") as "All-Season" | "Summer" | "Winter",
      speedRating: speedRating || "H",
      loadIndex: "91",
      features,
      specifications: {
        pattern: "Asymmetric",
        construction: "Radial",
        sidewallType: "Standard",
        runFlat: false,
        studded: false,
        reinforced: false
      },
      description: `${typeof brand === 'string' ? brand : brand?.name || 'Unknown'} ${name}`,
      warranty: "6 years",
      category: category || "Passenger",
      inStock: inStock !== false,
      stockCount: 10,
      badge: badge || "",
      badgeColor: badgeColor || "bg-blue-500"
    };
  };

  const nextQuickViewImage = () => {
    if (quickViewImageIndex < images.length - 1) {
      setQuickViewImageIndex(quickViewImageIndex + 1);
    }
  };

  const prevQuickViewImage = () => {
    if (quickViewImageIndex > 0) {
      setQuickViewImageIndex(quickViewImageIndex - 1);
    }
  };

  const getSeasonIcon = (season?: string) => {
    switch (season) {
      case "Summer":
        return <Sun className="w-4 h-4" />;
      case "Winter":
        return <Snowflake className="w-4 h-4" />;
      case "All-Season":
        return <Mountain className="w-4 h-4" />;
      default:
        return <Sun className="w-4 h-4" />;
    }
  };

  const renderProductImage = () => {
  // Debug logging
  console.log('ProductCard images prop:', images);
  console.log('Images length:', images?.length);
  console.log('First image:', images?.[0]);

  // Accept any image with a non-empty src
  const hasValidImages = images && images.length > 0 && images[0]?.src && images[0].src.length > 0;
  console.log('hasValidImages:', hasValidImages);

  if (!hasValidImages) {
      // Render tire visualization for tire products when no real images are available
      return (
        <motion.div 
          className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
          drag={hasMultipleImages ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, { offset, velocity }) => {
            if (!hasMultipleImages) return;
            
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              nextImage();
            } else if (swipe > swipeConfidenceThreshold) {
              prevImage();
            }
          }}
        >
          <motion.div
            className="w-48 h-48 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center shadow-inner"
            animate={{ rotate: isHovered ? 180 : 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <div className="w-32 h-32 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center shadow-lg">
              <Gauge className="w-16 h-16 text-orange-400" />
            </div>
            {/* Tire pattern lines */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-12 bg-slate-600 rounded-full opacity-60"
                style={{
                  transformOrigin: 'center bottom',
                  transform: `rotate(${i * 45}deg) translateY(-96px)`
                }}
              />
            ))}
          </motion.div>
          
          {/* Show carousel controls even for tire visualization if multiple placeholder images */}
          {hasMultipleImages && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 bg-white/80 hover:bg-white rounded-full shadow-lg z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 bg-white/80 hover:bg-white rounded-full shadow-lg z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* Image dots indicator for multiple images */}
          {hasMultipleImages && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex 
                      ? 'bg-orange-400 shadow-lg' 
                      : 'bg-white/50'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      );
    }

    // Render actual product images with carousel
    return (
      <motion.div 
        className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden cursor-grab active:cursor-grabbing"
        drag={hasMultipleImages ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(e, { offset, velocity }) => {
          if (!hasMultipleImages) return;
          
          const swipe = swipePower(offset.x, velocity.x);

          if (swipe < -swipeConfidenceThreshold) {
            nextImage();
          } else if (swipe > swipeConfidenceThreshold) {
            prevImage();
          }
        }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex].src}
            alt={images[currentImageIndex].alt}
            className="w-full h-full object-contain absolute inset-0 pointer-events-none bg-white"
            variants={{
              enter: (direction: number) => ({
                x: direction > 0 ? "100%" : "-100%",
                opacity: 0
              }),
              center: {
                x: 0,
                opacity: 1
              },
              exit: (direction: number) => ({
                x: direction > 0 ? "-100%" : "100%",
                opacity: 0
              })
            }}
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ 
              type: "tween",
              ease: [0.25, 0.46, 0.45, 0.94],
              duration: 0.5
            }}
          />
        </AnimatePresence>

        {/* Carousel controls */}
        {hasMultipleImages && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 bg-white/80 hover:bg-white rounded-full shadow-lg z-10 transition-all hover:scale-110 opacity-100 md:opacity-0 md:group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 bg-white/80 hover:bg-white rounded-full shadow-lg z-10 transition-all hover:scale-110 opacity-100 md:opacity-0 md:group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* Image dots indicator */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-125 ${
                  index === currentImageIndex 
                    ? 'bg-white shadow-lg scale-110' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  goToImage(index);
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  const renderListProductImage = () => {
    // Check if we have valid images to display (not placeholder URLs)
    const hasValidImages = images && images.length > 0 && images[0]?.src && 
                          !images[0].src.includes("/api/placeholder") && 
                          !images[0].src.includes("placeholder");
    
    if (!hasValidImages) {
      // Render tire visualization for tire products when no real images are available
      return (
        <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
          <div className="w-32 h-32 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center shadow-inner">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center shadow-lg">
              <div className="w-8 h-8 bg-slate-800 rounded-full shadow-inner"></div>
            </div>
          </div>
        </div>
      );
    }

    // Render actual product images
    return (
      <div className="relative h-full overflow-hidden bg-gray-50">
        <Image
          src={images[currentImageIndex]?.src}
          alt={images[currentImageIndex]?.alt || name}
          className="w-full h-full object-contain aspect-square transition-all duration-300"
        />
        
        {/* Navigation arrows for list view if multiple images */}
        {hasMultipleImages && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}
        
        {/* Image dots indicator */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      className={`group ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ y: isListView ? 0 : -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card 
        className={`${isListView ? 'flex flex-row h-62 w-full' : 'h-full flex flex-col'} hover:shadow-2xl py-0 transition-all duration-300 border-0 shadow-lg overflow-hidden bg-white cursor-pointer`}
        onClick={() => router.push(`/product/${slug || id}`)}
      >
        {/* Image Section */}
        <div className={`relative ${isListView ? ' flex-shrink-0' : ''}`}>
          {isListView ? renderListProductImage() : renderProductImage()}
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            {badge && (
              <Badge className={`${badgeColor} text-white border-0 shadow-lg`}>
                {badge}
              </Badge>
            )}
            {!inStock && (
              <Badge className="bg-red-500 text-white border-0 shadow-lg">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <Button
              size="sm"
              variant="secondary"
              className="w-10 h-10 p-0 rounded-full bg-white/90 hover:bg-white shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                openQuickView();
              }}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className={`w-10 h-10 p-0 rounded-full shadow-lg ${
                (isFavorite || isInFavorites(id))
                  ? 'bg-red-100 hover:bg-red-200 text-red-600' 
                  : 'bg-white/90 hover:bg-white'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                console.log('Toggling favorite for:', id, 'Current status:', isInFavorites(id));
                toggleFavorite(id);
                // Also call the prop callback if provided
                if (onToggleFavorite) {
                  onToggleFavorite(id);
                }
              }}
            >
              <Heart className={`w-4 h-4 ${(isFavorite || isInFavorites(id)) ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Discount badge */}
          {discountPercentage > 0 && (
            <Badge className="absolute bottom-4 left-4 bg-red-500 text-white border-0 shadow-lg">
              -{discountPercentage}%
            </Badge>
          )}

          {/* Performance indicator */}
          {category === "tire" && (
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
              <Zap className="w-3 h-3 inline mr-1" />
              {rating} ★
            </div>
          )}
        </div>
        
        {/* Content Section */}
        <CardContent className={`${isListView ? 'p-4 flex-1 flex flex-col justify-between' : 'p-6 py-0 flex-1 flex flex-col'}`}>
          {isListView ? (
            // List View Layout
            <div className="flex flex-col h-full">
              {/* Top section with brand, rating and name */}
              <div className="space-y-2">
                {/* Brand and Rating */}
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-gray-600 border-gray-300">
                    {typeof brand === 'string' ? brand : brand?.name || 'Unknown'}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{rating}</span>
                    <span className="text-sm text-gray-500">({reviews})</span>
                  </div>
                </div>

                {/* Product Name */}
                <h3 className="font-bold text-lg text-gray-900 line-clamp-2 leading-tight">
                  {name}
                </h3>
              </div>

              {/* Middle section with specifications and features */}
              <div className="flex-1 space-y-2 py-2">
                {/* Specifications in horizontal layout */}
                {(size || season || speedRating) && (
                  <div className="flex flex-wrap gap-4 text-sm">
                    {size && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">Size:</span>
                        <span className="font-medium">{size}</span>
                      </div>
                    )}
                    {season && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">Season:</span>
                        <div className="flex items-center space-x-1">
                          {getSeasonIcon(season)}
                          <span className="font-medium">{season}</span>
                        </div>
                      </div>
                    )}
                    {speedRating && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">Speed:</span>
                        <span className="font-medium text-xs">{speedRating}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Features in horizontal layout */}
                {features && features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="text-xs text-gray-600 flex items-center bg-gray-50 px-2 py-1 rounded">
                        <div className="w-1 h-1 bg-orange-500 rounded-full mr-2 flex-shrink-0"></div>
                        {feature}
                      </div>
                    ))}
                    {features.length > 3 && (
                      <span className="text-xs text-gray-500">+{features.length - 3} more</span>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom section with price and actions */}
              <div className="space-y-2">
                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {originalPrice && originalPrice > price && (
                      <span className="text-sm text-gray-500 line-through">€{originalPrice}</span>
                    )}
                    <span className="text-xl font-bold text-gray-900">€{price}</span>
                  </div>
                  {!inStock && (
                    <Badge className="bg-red-100 text-red-700 border-red-200">
                      Out of Stock
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      try {
                        const tireData = convertToTireData();
                        const defaultSize = tireData.size;
                        addItem(tireData, defaultSize, 1);
                      } catch (error) {
                        console.error('Error adding to cart:', error);
                        // Fallback: use callback if provided
                        if (onAddToCart) {
                          onAddToCart(id);
                        }
                      }
                    }}
                    disabled={!inStock}
                    className="flex-1 bg-tire-gradient hover:bg-tire-gradient/90 disabled:opacity-50"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('List view: Toggling favorite for:', id, 'Current status:', isInFavorites(id));
                      toggleFavorite(id);
                      // Also call the prop callback if provided
                      if (onToggleFavorite) {
                        onToggleFavorite(id);
                      }
                    }}
                    className="p-2"
                  >
                    <Heart className={`w-4 h-4 ${(isFavorite || isInFavorites(id)) ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            // Grid View Layout (original)
            <>
              {/* Brand and Rating */}
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className="text-gray-600 border-gray-300">
                  {typeof brand === 'string' ? brand : brand?.name || 'Unknown'}
                </Badge>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{rating}</span>
                  <span className="text-sm text-gray-500">({reviews})</span>
                </div>
              </div>

              {/* Product Name */}
              <h3 className="font-bold text-lg text-gray-900 line-clamp-2 min-h-[3.5rem] leading-tight mb-3">
                {name}
              </h3>

              {/* Specifications */}
              {(size || season || speedRating) && (
                <div className="space-y-2 text-sm mb-3 flex-1">
                  {size && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Size:</span>
                      <span className="font-medium">{size}</span>
                    </div>
                  )}
                  {season && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Season:</span>
                      <div className="flex items-center space-x-1">
                        {getSeasonIcon(season)}
                        <span className="font-medium">{season}</span>
                      </div>
                    </div>
                  )}
                  {speedRating && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Speed:</span>
                      <span className="font-medium text-xs">{speedRating}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Features */}
              <div className="space-y-1 mb-4 flex-1">
                {features.slice(0, 3).map((feature, idx) => (
                  <div key={idx} className="text-xs text-gray-600 flex items-center">
                    <div className="w-1 h-1 bg-orange-500 rounded-full mr-2 flex-shrink-0"></div>
                    <span className="truncate">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Price */}
              <div className="flex items-center space-x-2 mt-auto">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(price)}
                </span>
                {originalPrice && safeToNumber(originalPrice) > safeToNumber(price) && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>
            </>
          )}
        </CardContent>

        {/* Footer Section - Only for Grid View */}
        {!isListView && (
          <CardFooter className="p-6 pt-0">
          <Button 
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
            disabled={!inStock}
            onClick={(e) => {
              e.stopPropagation();
              try {
                const tireData = convertToTireData();
                const defaultSize = tireData.size;
                addItem(tireData, defaultSize, 1);
              } catch (error) {
                console.error('Error adding to cart:', error);
                // Fallback: use callback if provided
                if (onAddToCart) {
                  onAddToCart(id);
                }
              }
            }}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
         
        </CardFooter>
        )}
      </Card>

      {/* Quick View Modal */}
      <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
        <DialogContent className="min-w-[65vw] max-w-6xl max-h-[95vh] overflow-y-auto p-4 sm:p-6">
          <div className="container mx-auto p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold text-tire-dark">
                {name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Section */}
              <div className="space-y-4">
                <div className="relative">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={images[quickViewImageIndex]?.src || "/api/placeholder/400/400"}
                      alt={images[quickViewImageIndex]?.alt || name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Navigation arrows */}
                  {images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 p-0 bg-white/80 hover:bg-white rounded-full shadow-lg"
                        onClick={prevQuickViewImage}
                        disabled={quickViewImageIndex === 0}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 p-0 bg-white/80 hover:bg-white rounded-full shadow-lg"
                        onClick={nextQuickViewImage}
                        disabled={quickViewImageIndex === images.length - 1}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </>
                  )}
                </div>
                
                {/* Thumbnail navigation */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setQuickViewImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          index === quickViewImageIndex 
                            ? 'border-tire-orange' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-tire-orange text-white">
                      {typeof brand === 'string' ? brand : brand?.name || 'Unknown'}
                    </Badge>
                    {badge && (
                      <Badge className={`${badgeColor} text-white`}>
                        {badge}
                      </Badge>
                    )}
                    {!inStock && (
                      <Badge className="bg-red-500 text-white">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-tire-dark mb-3">
                    {name}
                  </h2>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-tire-gray">
                    {size && <span>{size}</span>}
                    {season && (
                      <>
                        {size && <span className="hidden sm:inline">•</span>}
                        <div className="flex items-center gap-1">
                          {getSeasonIcon(season)}
                          <span>{season}</span>
                        </div>
                      </>
                    )}
                    {speedRating && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span>Speed Rating: {speedRating}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < Math.floor(rating) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-tire-gray">
                    {rating} ({reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <span className="text-2xl sm:text-3xl font-bold text-tire-dark">
                      {formatPrice(price)}
                    </span>
                    {originalPrice && safeToNumber(originalPrice) > safeToNumber(price) && (
                      <span className="text-lg sm:text-xl text-gray-400 line-through">
                        {formatPrice(originalPrice)}
                      </span>
                    )}
                  </div>
                  {originalPrice && safeToNumber(originalPrice) > safeToNumber(price) && (
                    <div className="text-sm text-green-600 font-semibold">
                      Save {formatPrice(safeToNumber(originalPrice) - safeToNumber(price))}
                    </div>
                  )}
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-semibold text-tire-dark mb-3">Key Features</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-tire-gray">
                        <div className="w-2 h-2 bg-tire-orange rounded-full mr-3 flex-shrink-0"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div>
                  <label className="block text-sm font-semibold text-tire-dark mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-tire-gradient hover:opacity-90 text-white py-3"
                    disabled={!inStock}
                    onClick={() => {
                      try {
                        const tireData = convertToTireData();
                        const defaultSize = tireData.size;
                        addItem(tireData, defaultSize, quantity);
                        closeQuickView();
                      } catch (error) {
                        console.error('Error adding to cart:', error);
                        // Fallback: use callback if provided
                        if (onAddToCart) {
                          onAddToCart(id);
                          closeQuickView();
                        }
                      }
                    }}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {inStock ? `Add ${quantity} to Cart` : 'Out of Stock'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full py-3"
                    onClick={() => {
                      console.log('Quick view: Toggling favorite for:', id, 'Current status:', isInFavorites(id));
                      toggleFavorite(id);
                      // Also call the prop callback if provided
                      if (onToggleFavorite) {
                        onToggleFavorite(id);
                      }
                    }}
                  >
                    <Heart className={`w-5 h-5 mr-2 ${(isFavorite || isInFavorites(id)) ? 'fill-current text-red-500' : ''}`} />
                    {(isFavorite || isInFavorites(id)) ? 'Remove from Favorites' : 'Add to Favorites'}
                  </Button>
                </div>

                {/* Stock Status */}
                <div className={`p-3 rounded-lg ${inStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-semibold">
                      {inStock ? 'In Stock - Ready to Ship' : 'Currently Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ProductCard;
