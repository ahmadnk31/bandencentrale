"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useProducts, Product } from "@/hooks/use-store-data";
import { 
  Star, 
  ShoppingCart, 
  Heart,
  X,
  Gauge,
  Snowflake,
  Sun,
  Mountain,
  Shield,
  Truck,
  Clock,
  Award,
  Loader2
} from "lucide-react";
import ProductCard from "@/components/product-card";

const FeaturedTires = () => {
  const router = useRouter();
  
  // Fetch featured products from API
  const { data: productsResponse, isLoading: productsLoading, error: productsError } = useProducts({ 
    limit: 8, 
    inStock: true,
    sortBy: 'name',
    sortOrder: 'asc'
  });
  
  // Filter only featured products or use all if none are featured
  const allTires = productsResponse?.data || [];
  const featuredTires = allTires.filter((tire: Product) => tire.isFeatured);
  const tires = featuredTires.length > 0 ? featuredTires : allTires.slice(0, 4);

  const mockTires = [
    {
      id: 1,
      slug: "michelin-pilot-sport-4s",
      name: "Michelin Pilot Sport 4S",
      brand: "Michelin",
      price: 289.99,
      originalPrice: 329.99,
      images: [
        { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&crop=center", alt: "Michelin Pilot Sport 4S - Front View" },
        { src: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=300&h=300&fit=crop&crop=center", alt: "Michelin Pilot Sport 4S - Side View" },
        { src: "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=300&h=300&fit=crop&crop=center", alt: "Michelin Pilot Sport 4S - Tread Pattern" }
      ],
      rating: 4.9,
      reviews: 234,
      size: "225/45R17",
      season: "Summer" as const,
      speedRating: "Y (300 km/h)",
      features: ["Ultra High Performance", "Excellent Grip", "Low Noise", "Advanced Compound"],
      badge: "Best Seller",
      badgeColor: "bg-orange-500",
      category: "tire",
      inStock: true
    },
    {
      id: 2,
      slug: "continental-wintercontact-ts-870",
      name: "Continental WinterContact TS 870",
      brand: "Continental",
      price: 199.99,
      originalPrice: 219.99,
      images: [
        { src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=300&fit=crop&crop=center", alt: "Continental WinterContact - Front View" },
        { src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&crop=center", alt: "Continental WinterContact - Side Profile" }
      ],
      rating: 4.8,
      reviews: 189,
      size: "205/55R16",
      season: "Winter" as const,
      speedRating: "H (210 km/h)",
      features: ["Winter Compound", "Snow Traction", "Ice Grip", "Enhanced Safety"],
      badge: "Winter Special",
      badgeColor: "bg-blue-500",
      category: "tire",
      inStock: true
    },
    {
      id: 3,
      slug: "bridgestone-turanza-t005",
      name: "Bridgestone Turanza T005",
      brand: "Bridgestone",
      price: 159.99,
      originalPrice: 179.99,
      images: [
        { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&crop=center", alt: "Bridgestone Turanza - Main View" },
        { src: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=300&h=300&fit=crop&crop=center", alt: "Bridgestone Turanza - Side Angle" },
        { src: "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=300&h=300&fit=crop&crop=center", alt: "Bridgestone Turanza - Tread Design" }
      ],
      rating: 4.7,
      reviews: 156,
      size: "195/65R15",
      season: "All-Season" as const,
      speedRating: "H (210 km/h)",
      features: ["Fuel Efficient", "Long Lasting", "Comfort", "Eco-Friendly"],
      badge: "Eco Choice",
      badgeColor: "bg-green-500",
      category: "tire",
      inStock: true
    },
    {
      id: 4,
      slug: "pirelli-p-zero",
      name: "Pirelli P Zero",
      brand: "Pirelli",
      price: 349.99,
      originalPrice: 389.99,
      images: [
        { src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=300&fit=crop&crop=center", alt: "Pirelli P Zero - Performance View" },
        { src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&crop=center", alt: "Pirelli P Zero - Detail Shot" },
        { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&crop=center", alt: "Pirelli P Zero - Sidewall Design" },
        { src: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=300&h=300&fit=crop&crop=center", alt: "Pirelli P Zero - Tread Close-up" }
      ],
      rating: 4.9,
      reviews: 312,
      size: "255/35R19",
      season: "Summer" as const,
      speedRating: "Y (300 km/h)",
      features: ["Racing Heritage", "Maximum Performance", "Precise Handling", "Track Tested"],
      badge: "Premium",
      badgeColor: "bg-purple-500",
      category: "tire",
      inStock: true
    }
  ];

  const handleAddToCart = (id: number | string) => {
    console.log(`Added product ${id} to cart`);
    // Implement cart logic here
  };

  const handleViewDetails = (id: number | string, slug?: string) => {
    router.push(`/product/${slug || id}`);
  };

  const handleToggleFavorite = (id: number | string) => {
    console.log(`Toggled favorite for product ${id}`);
    // Implement favorite toggle logic
  };

  const getSeasonIcon = (season: string) => {
    switch (season) {
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

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Featured{" "}
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Premium Tires
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our handpicked selection of top-performing tires from the world's leading manufacturers.
            Each tire is tested for quality, performance, and durability.
          </p>
        </motion.div>

        {/* Loading State */}
        {productsLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-tire-orange mr-2" />
            <span className="text-lg">Loading featured tires...</span>
          </div>
        )}

        {/* Error State */}
        {productsError && (
          <div className="text-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600">Failed to load featured tires. Please try again.</p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!productsLoading && !productsError && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tires.map((tire: Product, index: number) => (
              <ProductCard
                key={tire.id}
                id={tire.id}
                slug={tire.slug}
                name={tire.name}
                brand={tire.brand || "Unknown"}
                price={parseFloat(tire.price)}
                originalPrice={tire.compareAtPrice ? parseFloat(tire.compareAtPrice) : undefined}
                images={tire.images && tire.images.length > 0 ? tire.images : [
                  { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&crop=center", alt: `${tire.name} - Tire Image` }
                ]}
                rating={4.5}
                reviews={Math.floor(Math.random() * 200) + 50}
                size={tire.size}
                season={
                  tire.season === 'all-season' ? 'All-Season' :
                  tire.season === 'summer' ? 'Summer' :
                  tire.season === 'winter' ? 'Winter' :
                  'All-Season'
                }
                speedRating={tire.speedRating || undefined}
                features={tire.features || []}
                inStock={tire.inStock}
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails}
                onToggleFavorite={handleToggleFavorite}
                className="opacity-0 animate-fade-in"
              />
            ))}
          </div>
        )}

        {/* Fallback to mock data if no API data */}
        {!productsLoading && !productsError && tires.length === 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mockTires.slice(0, 4).map((tire, index) => (
              <ProductCard
                key={tire.id}
                {...tire}
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails}
                onToggleFavorite={handleToggleFavorite}
                className="opacity-0 animate-fade-in"
              />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Button 
            size="lg" 
            variant="outline" 
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

export default FeaturedTires;
