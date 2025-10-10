"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import ProductCard from "@/components/product-card";
import { useFavorites } from "@/lib/favorites-context";
import { tires } from "@/lib/data";
import { useRouter } from "next/navigation";
import { 
  Heart,
  ArrowLeft,
  ShoppingCart
} from "lucide-react";

const FavoritesPage = () => {
  const { favorites } = useFavorites();
  const router = useRouter();

  const favoriteTires = tires.filter(tire => favorites.includes(tire.id));

  if (favoriteTires.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-tire-dark mb-4">No Favorites Yet</h1>
            <p className="text-tire-gray mb-8">
              Start adding tires to your favorites to see them here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => router.push('/tires')} size="lg">
                Browse Tires
              </Button>
              <Button variant="outline" onClick={() => router.push('/')} size="lg">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Header */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-tire-dark">
                Your Favorites
              </h1>
              <p className="text-tire-gray mt-2">
                {favoriteTires.length} {favoriteTires.length === 1 ? 'tire' : 'tires'} in your favorites
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="hidden sm:flex"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </section>

      {/* Favorites Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteTires.map((tire, index) => (
              <motion.div
                key={tire.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProductCard
                  {...tire}
                  onAddToCart={() => {}}
                  onViewDetails={(id) => router.push(`/product/${id}`)}
                  onToggleFavorite={() => {}}
                  season={tire.season}
                  size={tire.size || ""}
                  speedRating={tire.speedRating}
                  features={tire.features}
                />
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button onClick={() => router.push('/tires')} size="lg">
              Browse More Tires
            </Button>
            <Button variant="outline" onClick={() => router.push('/cart')} size="lg">
              <ShoppingCart className="w-5 h-5 mr-2" />
              View Cart
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FavoritesPage;
