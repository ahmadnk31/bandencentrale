"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/header";
import ProductCard from "@/components/product-card";
import { 
  Star, 
  ShoppingCart, 
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Truck,
  Shield,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Users,
  Calendar,
  Phone,
  MapPin,
  ArrowLeft,
  Gauge,
  Snowflake,
  Sun,
  Mountain
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getTireById } from "@/lib/data";

const ProductPage = () => {
  const params = useParams();
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Get product data from our data store
  const product = getTireById(Number(params.id));

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-tire-dark mb-4">Product Not Found</h1>
          <Button onClick={() => router.push('/tires')}>Back to Tires</Button>
        </div>
      </div>
    );
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const getSeasonIcon = () => {
    switch (product.season) {
      case "Summer":
        return <Sun className="w-5 h-5" />;
      case "Winter":
        return <Snowflake className="w-5 h-5" />;
      case "All-Season":
        return <Mountain className="w-5 h-5" />;
      default:
        return <Sun className="w-5 h-5" />;
    }
  };

  const relatedProducts = [
    {
      id: 2,
      name: "Continental SportContact 6",
      brand: "Continental",
      price: 149.99,
      originalPrice: 179.99,
      images: [{ src: "/api/placeholder/300/300", alt: "Continental SportContact 6" }],
      rating: 4.7,
      reviews: 189,
      size: "225/45R17",
      season: "Summer" as const,
      speedRating: "Y",
      features: ["Sport Handling", "High Performance", "Wet Grip"],
      badge: "Performance",
      badgeColor: "bg-red-500",
      category: "Performance",
      inStock: true
    },
    {
      id: 3,
      name: "Pirelli P Zero",
      brand: "Pirelli",
      price: 169.99,
      images: [{ src: "/api/placeholder/300/300", alt: "Pirelli P Zero" }],
      rating: 4.9,
      reviews: 156,
      size: "225/45R17",
      season: "Summer" as const,
      speedRating: "Y",
      features: ["Motorsport Heritage", "Ultimate Performance", "Precision"],
      badge: "Premium",
      badgeColor: "bg-purple-500",
      category: "Performance",
      inStock: true
    },
    {
      id: 4,
      name: "Bridgestone Potenza Sport",
      brand: "Bridgestone",
      price: 155.99,
      images: [{ src: "/api/placeholder/300/300", alt: "Bridgestone Potenza Sport" }],
      rating: 4.6,
      reviews: 198,
      size: "225/45R17",
      season: "Summer" as const,
      speedRating: "Y",
      features: ["Racing Technology", "Enhanced Grip", "Responsive Handling"],
      badge: "Sport",
      badgeColor: "bg-orange-500",
      category: "Performance",
      inStock: true
    }
  ];

  const reviews = [
    {
      id: 1,
      name: "John Smith",
      rating: 5,
      date: "2024-09-15",
      title: "Excellent performance tire",
      comment: "Amazing grip and handling. Perfect for spirited driving. Would definitely recommend!",
      verified: true,
      helpful: 12
    },
    {
      id: 2,
      name: "Sarah Johnson",
      rating: 5,
      date: "2024-08-22",
      title: "Great in wet conditions",
      comment: "These tires perform exceptionally well in the rain. Very confident inspiring.",
      verified: true,
      helpful: 8
    },
    {
      id: 3,
      name: "Mike Wilson",
      rating: 4,
      date: "2024-08-10",
      title: "Good tire but expensive",
      comment: "Quality is excellent but price is on the higher side. Worth it for the performance though.",
      verified: true,
      helpful: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb */}
      <section className="bg-white py-4 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-tire-gray">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 hover:text-tire-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <span>/</span>
            <span>Tires</span>
            <span>/</span>
            <span>{product.brand}</span>
            <span>/</span>
            <span className="text-tire-dark font-medium">{product.name}</span>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <motion.div 
                className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={product.images[currentImageIndex].src}
                    alt={product.images[currentImageIndex].alt}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {/* Navigation arrows */}
                {product.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 p-0 bg-white/80 hover:bg-white rounded-full shadow-lg"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 p-0 bg-white/80 hover:bg-white rounded-full shadow-lg"
                      onClick={nextImage}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.badge && (
                    <Badge className={`${product.badgeColor} text-white`}>
                      {product.badge}
                    </Badge>
                  )}
                  {discountPercentage > 0 && (
                    <Badge className="bg-red-500 text-white">
                      -{discountPercentage}%
                    </Badge>
                  )}
                </div>
              </motion.div>

              {/* Thumbnail Navigation */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex 
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

            {/* Product Information */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-tire-orange text-white text-sm">
                    {product.brand}
                  </Badge>
                  <div className="flex items-center gap-2 text-tire-gray">
                    {getSeasonIcon()}
                    <span className="text-sm">{product.season}</span>
                  </div>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-tire-dark mb-4">
                  {product.name}
                </h1>
                <p className="text-tire-gray leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-tire-dark">{product.rating}</span>
                  <span className="text-tire-gray">({product.reviews} reviews)</span>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-tire-dark">
                    €{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-2xl text-gray-400 line-through">
                      €{product.originalPrice}
                    </span>
                  )}
                </div>
                {product.originalPrice && (
                  <div className="text-lg text-green-600 font-semibold">
                    Save €{(product.originalPrice - product.price).toFixed(2)}
                  </div>
                )}
                <p className="text-sm text-tire-gray">Price per tire, installation available</p>
              </div>

              {/* Product Size */}
              <div>
                <label className="block text-lg font-semibold text-tire-dark mb-3">
                  Tire Size
                </label>
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                  <span className="text-xl font-bold text-tire-dark">
                    {product.size}
                  </span>
                  <p className="text-sm text-tire-gray mt-1">
                    Standard size for this tire model
                  </p>
                </div>
              </div>

              {/* Technical Specs */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-tire-dark mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-tire-gray">Speed Rating:</span>
                    <span className="font-semibold text-tire-dark ml-2">{product.speedRating}</span>
                  </div>
                  <div>
                    <span className="text-tire-gray">Load Index:</span>
                    <span className="font-semibold text-tire-dark ml-2">{product.loadIndex}</span>
                  </div>
                  <div>
                    <span className="text-tire-gray">Pattern:</span>
                    <span className="font-semibold text-tire-dark ml-2">{product.specifications.pattern}</span>
                  </div>
                  <div>
                    <span className="text-tire-gray">Construction:</span>
                    <span className="font-semibold text-tire-dark ml-2">{product.specifications.construction}</span>
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-lg font-semibold text-tire-dark mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="h-12 w-12 p-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-16 text-center font-semibold text-lg">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-12 w-12 p-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-tire-gray">
                    Total: €{(product.price * quantity).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="w-full bg-tire-gradient hover:opacity-90 text-white py-4 text-lg"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-6 h-6 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>

                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full py-4 border-2 border-tire-orange text-tire-orange hover:bg-tire-orange hover:text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Button clicked!');
                    const url = `/quote?product=${product.id}&size=${product.size || ''}&quantity=${quantity}`;
                    console.log('Navigating to:', url);
                    window.location.href = url;
                  }}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Installation
                </Button>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="py-4"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
                    {isFavorite ? 'Favorited' : 'Add to Favorites'}
                  </Button>
                  <Button variant="outline" size="lg" className="py-4">
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Stock & Delivery Info */}
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${product.inStock ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center gap-2">
                    {product.inStock ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-semibold ${product.inStock ? 'text-green-700' : 'text-red-700'}`}>
                      {product.inStock ? `In Stock (${product.stockCount} available)` : 'Currently Out of Stock'}
                    </span>
                  </div>
                  {product.inStock && (
                    <p className="text-sm text-green-600 mt-1">
                      Usually ships within 1-2 business days
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-tire-gray">
                    <Truck className="w-5 h-5" />
                    <span>Free shipping over €100</span>
                  </div>
                  <div className="flex items-center gap-2 text-tire-gray">
                    <Shield className="w-5 h-5" />
                    <span>{product.warranty} warranty</span>
                  </div>
                  <div className="flex items-center gap-2 text-tire-gray">
                    <RotateCcw className="w-5 h-5" />
                    <span>30-day returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="features" className="space-y-8">
            <div className="w-full overflow-x-auto">
              <TabsList className="inline-flex h-12 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground min-w-full sm:min-w-0 sm:grid sm:grid-cols-4 sm:w-full">
                <TabsTrigger value="features" className="whitespace-nowrap px-3 py-1.5 text-sm font-medium">Features</TabsTrigger>
                <TabsTrigger value="specifications" className="whitespace-nowrap px-3 py-1.5 text-sm font-medium">Specifications</TabsTrigger>
                <TabsTrigger value="reviews" className="whitespace-nowrap px-3 py-1.5 text-sm font-medium">Reviews ({product.reviews})</TabsTrigger>
                <TabsTrigger value="installation" className="whitespace-nowrap px-3 py-1.5 text-sm font-medium">Installation</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="features">
              <Card className="p-8 shadow-lg border-0">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold text-tire-dark mb-6">Key Features</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-3 h-3 bg-tire-orange rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-tire-gray leading-relaxed">{feature}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications">
              <Card className="p-8 shadow-lg border-0">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold text-tire-dark mb-6">Technical Specifications</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-tire-gray">Season Type:</span>
                        <span className="font-semibold text-tire-dark">{product.season}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-tire-gray">Speed Rating:</span>
                        <span className="font-semibold text-tire-dark">{product.speedRating}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-tire-gray">Load Index:</span>
                        <span className="font-semibold text-tire-dark">{product.loadIndex}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-tire-gray">Tread Pattern:</span>
                        <span className="font-semibold text-tire-dark">{product.specifications.pattern}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-tire-gray">Construction:</span>
                        <span className="font-semibold text-tire-dark">{product.specifications.construction}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-tire-gray">Sidewall Type:</span>
                        <span className="font-semibold text-tire-dark">{product.specifications.sidewallType}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-tire-gray">Run Flat:</span>
                        <span className="font-semibold text-tire-dark">{product.specifications.runFlat ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-tire-gray">Reinforced:</span>
                        <span className="font-semibold text-tire-dark">{product.specifications.reinforced ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card className="p-8 shadow-lg border-0">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-tire-dark">Customer Reviews</h3>
                    <Button variant="outline">Write a Review</Button>
                  </div>
                  
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-6 last:border-b-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-semibold text-tire-dark">{review.name}</span>
                              {review.verified && (
                                <Badge variant="outline" className="text-xs">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verified Purchase
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${
                                      i < review.rating 
                                        ? 'text-yellow-400 fill-current' 
                                        : 'text-gray-300'
                                    }`} 
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-tire-gray">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <h4 className="font-semibold text-tire-dark mb-2">{review.title}</h4>
                        <p className="text-tire-gray leading-relaxed mb-3">{review.comment}</p>
                        <div className="flex items-center gap-4 text-sm text-tire-gray">
                          <button className="hover:text-tire-dark transition-colors">
                            Helpful ({review.helpful})
                          </button>
                          <button className="hover:text-tire-dark transition-colors">
                            Reply
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="installation">
              <Card className="p-8 shadow-lg border-0">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold text-tire-dark mb-6">Professional Installation</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xl font-semibold text-tire-dark mb-4">What's Included</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span>Professional tire mounting</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span>Wheel balancing</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span>TPMS sensor reset</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span>Road test</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-tire-dark mb-4">Book Installation</h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-tire-gray">
                          <Calendar className="w-5 h-5" />
                          <span>Usually completed in 45-60 minutes</span>
                        </div>
                        <div className="flex items-center gap-3 text-tire-gray">
                          <MapPin className="w-5 h-5" />
                          <span>Technologiepark 15, 9052 Ghent</span>
                        </div>
                        <div className="flex items-center gap-3 text-tire-gray">
                          <Phone className="w-5 h-5" />
                          <span>+32 467 87 1205</span>
                        </div>
                        <Button

                        onClick={()=> {
                          const url = `/quote?product=${product.id}&size=${product.size || ''}`;
                          window.location.href = url;
                        }}
                        variant="outline"
                         className="w-full py-4 border-2 border-tire-orange text-tire-orange hover:bg-tire-orange hover:text-white">
                          <Calendar className="w-5 h-5 mr-2" />
                          Schedule Installation
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-tire-dark mb-4">
              You Might Also Like
            </h2>
            <p className="text-xl text-tire-gray">
              Similar high-performance tires from premium brands
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((relatedProduct, index) => (
              <motion.div
                key={relatedProduct.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard
                  {...relatedProduct}
                  onAddToCart={(id) => console.log("Add to cart:", id)}
                  onViewDetails={(id) => router.push(`/product/${id}`)}
                  onToggleFavorite={(id) => console.log("Toggle favorite:", id)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
