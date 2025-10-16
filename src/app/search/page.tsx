"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/header";
import ProductCard from "@/components/product-card";
import { useProducts, Product } from "@/hooks/use-store-data";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Search,
  ArrowLeft,
  Filter,
  Loader2
} from "lucide-react";

const SearchPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [currentPage, setCurrentPage] = useState(1);

  // Get search query from URL params
  const query = searchParams.get('q') || '';

  // Fetch products based on search query
  const { data: productsResponse, isLoading: productsLoading, error: productsError } = useProducts({
    search: query,
    page: currentPage,
    limit: 12,
    inStock: true,
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const searchResults = productsResponse?.data || [];
  const pagination = productsResponse?.pagination;

  useEffect(() => {
    if (query) {
      setSearchTerm(query);
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      setCurrentPage(1); // Reset to first page on new search
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Search Header */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl lg:text-3xl font-bold text-tire-dark">
              Search Results
            </h1>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search for tires by name, brand, or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-20 py-3 text-lg"
              />
              <Button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                size="sm"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-tire-dark">
                {searchResults.length} Results Found
              </h2>
              {searchTerm && (
                <p className="text-tire-gray">
                  Showing results for "{searchTerm}"
                </p>
              )}
            </div>
          </div>

          {/* Loading State */}
          {productsLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-tire-orange mr-2" />
              <span className="text-lg">Searching...</span>
            </div>
          )}

          {/* Error State */}
          {productsError && (
            <div className="text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-600">Search failed. Please try again.</p>
              </div>
            </div>
          )}

          {/* Results Grid */}
          {!productsLoading && !productsError && searchResults.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((tire: Product, index: number) => (
                <motion.div
                  key={tire.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ProductCard
                    id={tire.id}
                    slug={tire.slug}
                    name={tire.name}
                    brand={tire.brand || "Unknown"}
                    price={parseFloat(tire.price)}
                    originalPrice={tire.compareAtPrice ? parseFloat(tire.compareAtPrice) : undefined}
                    images={Array.isArray(tire.images) ? 
                      tire.images.map((img: any, index: number) => ({
                        src: typeof img === 'string' ? img : img?.src || img?.url || '',
                        alt: `${tire.name} - Image ${index + 1}`
                      })).filter((img: any) => img.src && !img.src.includes('placeholder')) :
                      []
                    }
                    rating={4.5}
                    reviews={Math.floor(Math.random() * 200) + 50}
                    size={tire.size}
                    season={tire.season as "All-Season" | "Summer" | "Winter"}
                    speedRating={tire.speedRating || undefined}
                    features={tire.features || []}
                    inStock={tire.inStock}
                    onAddToCart={() => {}}
                    onViewDetails={(id, slug) => router.push(`/product/${slug || id}`)}
                    onToggleFavorite={() => {}}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!productsLoading && !productsError && searchResults.length === 0 && query && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-tire-dark mb-4">
                No results found
              </h3>
              <p className="text-tire-gray mb-8">
                {searchTerm 
                  ? `We couldn't find any tires matching "${searchTerm}". Try a different search term.`
                  : "Try searching for tire brands, models, or types."
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => router.push('/tires')}>
                  Browse All Tires
                </Button>
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Clear Search
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

const SearchPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tire-orange mx-auto mb-4"></div>
          <p className="text-tire-gray">Loading search...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
};

export default SearchPage;
