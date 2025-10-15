"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import ProductCard from "@/components/product-card";
import Header from "@/components/header";
import { useRouter, useSearchParams } from "next/navigation";
import { useProducts, useBrands, useCategories, ProductFilters, Product } from "@/hooks/use-store-data";
import { 
  Search, 
  Filter, 
  Grid, 
  List,
  Star,
  Car,
  Truck,
  Bike,
  SlidersHorizontal,
  Loader2
} from "lucide-react";

function TiresPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [viewMode, setViewMode] = useState("grid");
  const [priceRange, setPriceRange] = useState([50, 500]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize filters from URL parameters
  useEffect(() => {
    const brand = searchParams.get('brand');
    const category = searchParams.get('category');
    const season = searchParams.get('season');
    const size = searchParams.get('size');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort');
    const order = searchParams.get('order');

    if (brand) setSelectedBrand(brand);
    if (category) setSelectedCategory(category);
    if (season) setSelectedSeason(season);
    if (size) setSelectedSize(size);
    if (search) setSearchTerm(search);
    if (sort) setSortBy(sort);
    if (order && (order === 'asc' || order === 'desc')) setSortOrder(order);
    
    if (minPrice || maxPrice) {
      const min = minPrice ? parseInt(minPrice) : 50;
      const max = maxPrice ? parseInt(maxPrice) : 500;
      setPriceRange([min, max]);
    }
  }, [searchParams]);

  // Update URL when filters change
  const updateURL = (newFilters: {
    brand?: string;
    category?: string;
    season?: string;
    size?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    order?: string;
  }) => {
    const params = new URLSearchParams();
    
    if (newFilters.brand) params.set('brand', newFilters.brand);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.season) params.set('season', newFilters.season);
    if (newFilters.size) params.set('size', newFilters.size);
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.minPrice && newFilters.minPrice > 50) params.set('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice && newFilters.maxPrice < 500) params.set('maxPrice', newFilters.maxPrice.toString());
    if (newFilters.sort && newFilters.sort !== 'name') params.set('sort', newFilters.sort);
    if (newFilters.order && newFilters.order !== 'asc') params.set('order', newFilters.order);

    const newURL = params.toString() ? `/tires?${params.toString()}` : '/tires';
    router.push(newURL, { scroll: false });
  };

  const tiresPerPage = 12;
  const seasons = ["all-season", "summer", "winter"];
  const seasonsDisplay = ["All-Season", "Summer", "Winter"];
  const sizes = ["195/65R15", "205/55R16", "245/35R19"];

  // Helper function to map category slug to name
  const getCategoryNameFromSlug = (slug: string): string | null => {
    const categoryMap: { [key: string]: string } = {
      'summer-tires': 'Summer Tires',
      'winter-tires': 'Winter Tires',
      'all-season-tires': 'All-Season Tires',
      'performance-tire': 'Performance Tire',
      'suv-tires': 'SUV Tires',
      'truck-tires': 'Truck Tires'
    };
    return categoryMap[slug] || null;
  };

  // Helper function to get season from category slug (fallback)
  const getSeasonFromCategorySlug = (slug: string): string | null => {
    const seasonMap: { [key: string]: string } = {
      'summer-tires': 'summer',
      'winter-tires': 'winter',
      'all-season-tires': 'all-season'
    };
    return seasonMap[slug] || null;
  };

  // Helper function to map category name to slug
  const getCategorySlugFromName = (name: string): string | null => {
    const slugMap: { [key: string]: string } = {
      'Summer Tires': 'summer-tires',
      'Winter Tires': 'winter-tires',
      'All-Season Tires': 'all-season-tires',
      'Performance Tire': 'performance-tire',
      'SUV Tires': 'suv-tires',
      'Truck Tires': 'truck-tires'
    };
    return slugMap[name] || null;
  };

  // Prepare filters for API call
  const filters: ProductFilters = useMemo(() => {
    const f: ProductFilters = {
      page: currentPage,
      limit: tiresPerPage,
      sortBy,
      sortOrder,
      inStock: true
    };

    if (searchTerm.trim()) f.search = searchTerm.trim();
    if (selectedBrand) f.brand = selectedBrand;
    if (selectedCategory) {
      // For season-based categories, try season filtering first
      const seasonFromCategory = getSeasonFromCategorySlug(selectedCategory);
      if (seasonFromCategory) {
        f.season = seasonFromCategory;
      } else {
        // For other categories, use category filtering
        const categoryName = getCategoryNameFromSlug(selectedCategory);
        if (categoryName) f.category = categoryName;
      }
    }
    if (selectedSeason) f.season = selectedSeason;
    if (selectedSize) f.size = selectedSize;
    if (priceRange[0] > 50) f.minPrice = priceRange[0];
    if (priceRange[1] < 500) f.maxPrice = priceRange[1];

    return f;
  }, [searchTerm, selectedBrand, selectedCategory, selectedSeason, selectedSize, priceRange, sortBy, sortOrder, currentPage]);

  // Fetch data
  const { data: productsResponse, isLoading: productsLoading, error: productsError } = useProducts(filters);
  const { data: brandsResponse, isLoading: brandsLoading } = useBrands();
  const { data: categoriesResponse, isLoading: categoriesLoading } = useCategories();

  const tires = productsResponse?.data || [];
  const pagination = productsResponse?.pagination;
  const brands = brandsResponse?.data || [];
  const categories = categoriesResponse?.data || [];
  const brandNames = brands.map((brand: any) => brand.name);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-tire-dark to-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Premium Tire Collection
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Discover our extensive range of high-quality tires from world-renowned brands. 
              Find the perfect tires for your vehicle and driving needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-tire-orange hover:bg-tire-orange/90" onClick={() => router.push('/tires/summer')}>
                <Car className="w-5 h-5 mr-2" />
                Summer Tires
              </Button>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => router.push('/tires/winter')}>
                <Truck className="w-5 h-5 mr-2" />
                Winter Tires
              </Button>
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => router.push('/tires/all-season')}>
                <Bike className="w-5 h-5 mr-2" />
                All-Season Tires
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Quick Links */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => router.push('/tires/summer')}
              className="hover:bg-orange-50 hover:border-orange-300"
            >
              <Car className="w-4 h-4 mr-2" />
              Summer Tires
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/tires/winter')}
              className="hover:bg-blue-50 hover:border-blue-300"
            >
              <Truck className="w-4 h-4 mr-2" />
              Winter Tires
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/tires/all-season')}
              className="hover:bg-green-50 hover:border-green-300"
            >
              <Bike className="w-4 h-4 mr-2" />
              All-Season Tires
            </Button>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search tires by name or brand..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    // Debounce URL update for search
                    if (searchTimeoutRef.current) {
                      clearTimeout(searchTimeoutRef.current);
                    }
                    searchTimeoutRef.current = setTimeout(() => {
                      updateURL({
                        brand: selectedBrand,
                        category: selectedCategory,
                        season: selectedSeason,
                        size: selectedSize,
                        search: e.target.value,
                        minPrice: priceRange[0],
                        maxPrice: priceRange[1],
                        sort: sortBy,
                        order: sortOrder
                      });
                    }, 500);
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-4">
              <Select value={selectedBrand === "" ? "all" : selectedBrand} onValueChange={(value) => {
                const newBrand = value === "all" ? "" : value;
                setSelectedBrand(newBrand);
                updateURL({
                  brand: newBrand,
                  category: selectedCategory,
                  season: selectedSeason,
                  size: selectedSize,
                  search: searchTerm,
                  minPrice: priceRange[0],
                  maxPrice: priceRange[1],
                  sort: sortBy,
                  order: sortOrder
                });
              }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brandNames.map((brand: string) => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory === "" ? "all" : selectedCategory} onValueChange={(value) => {
                const newCategory = value === "all" ? "" : value;
                setSelectedCategory(newCategory);
                updateURL({
                  brand: selectedBrand,
                  category: newCategory,
                  season: selectedSeason,
                  size: selectedSize,
                  search: searchTerm,
                  minPrice: priceRange[0],
                  maxPrice: priceRange[1],
                  sort: sortBy,
                  order: sortOrder
                });
              }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category: any) => (
                    <SelectItem key={category.slug} value={category.slug}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSeason === "" ? "all" : selectedSeason} onValueChange={(value) => {
                const newSeason = value === "all" ? "" : value;
                setSelectedSeason(newSeason);
                updateURL({
                  brand: selectedBrand,
                  category: selectedCategory,
                  season: newSeason,
                  size: selectedSize,
                  search: searchTerm,
                  minPrice: priceRange[0],
                  maxPrice: priceRange[1],
                  sort: sortBy,
                  order: sortOrder
                });
              }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Seasons</SelectItem>
                  {seasons.map((season, index) => (
                    <SelectItem key={season} value={season}>{seasonsDisplay[index]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSize === "" ? "all" : selectedSize} onValueChange={(value) => {
                const newSize = value === "all" ? "" : value;
                setSelectedSize(newSize);
                updateURL({
                  brand: selectedBrand,
                  category: selectedCategory,
                  season: selectedSeason,
                  size: newSize,
                  search: searchTerm,
                  minPrice: priceRange[0],
                  maxPrice: priceRange[1],
                  sort: sortBy,
                  order: sortOrder
                });
              }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  {sizes.map(size => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-4">
                <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                  const [newSortBy, newSortOrder] = value.split('-');
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder as "asc" | "desc");
                  updateURL({
                    brand: selectedBrand,
                    category: selectedCategory,
                    season: selectedSeason,
                    size: selectedSize,
                    search: searchTerm,
                    minPrice: priceRange[0],
                    maxPrice: priceRange[1],
                    sort: newSortBy,
                    order: newSortOrder
                  });
                }}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Name A-Z</SelectItem>
                    <SelectItem value="name-desc">Name Z-A</SelectItem>
                    <SelectItem value="price-asc">Price Low-High</SelectItem>
                    <SelectItem value="price-desc">Price High-Low</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium">Price Range:</span>
              </div>
              <div className="flex-1 max-w-xs">
                <Slider
                  value={priceRange}
                  onValueChange={(newRange) => {
                    setPriceRange(newRange);
                    updateURL({
                      brand: selectedBrand,
                      category: selectedCategory,
                      season: selectedSeason,
                      size: selectedSize,
                      search: searchTerm,
                      minPrice: newRange[0],
                      maxPrice: newRange[1],
                      sort: sortBy,
                      order: sortOrder
                    });
                  }}
                  min={50}
                  max={500}
                  step={10}
                  className="w-full"
                />
              </div>
              <div className="text-sm text-gray-600">
                €{priceRange[0]} - €{priceRange[1]}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-tire-dark">
                {pagination?.totalCount || 0} Tires Found
              </h2>
              <p className="text-tire-gray">
                Showing results for your search criteria
              </p>
            </div>
          </div>

          {/* Loading State */}
          {productsLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-tire-orange mr-2" />
              <span className="text-lg">Loading tires...</span>
            </div>
          )}

          {/* Error State */}
          {productsError && (
            <div className="text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-600">Failed to load tires. Please try again.</p>
              </div>
            </div>
          )}

          {/* Tire Grid */}
          {!productsLoading && !productsError && (
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr items-stretch" 
                : "grid-cols-1"
            }`}>
              {tires.map((tire: Product, index: number) => (
              <motion.div
                key={tire.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex" // Ensure the motion div stretches full height
              >
                <ProductCard
                  id={tire.id}
                  slug={tire.slug}
                  name={tire.name}
                  brand={tire.brand || "Unknown"}
                  price={parseFloat(tire.price)}
                  originalPrice={tire.compareAtPrice ? parseFloat(tire.compareAtPrice) : undefined}
                  images={tire.images && tire.images.length > 0 ? tire.images : [
                    { src: "/api/placeholder/300/300", alt: `${tire.name} - Tire Image` }
                  ]}
                  rating={4.5}
                  reviews={Math.floor(Math.random() * 200) + 50}
                  size={tire.size}
                  season={tire.season as "All-Season" | "Summer" | "Winter"}
                  speedRating={tire.speedRating || undefined}
                  features={tire.features || []}
                  inStock={tire.inStock}
                  className={viewMode === "list" ? "flex" : "h-full w-full"}
                  onAddToCart={(id) => console.log("Add to cart:", id)}
                  onViewDetails={(id, slug) => router.push(`/product/${slug || id}`)}
                  onToggleFavorite={(id) => console.log("Toggle favorite:", id)}
                />
              </motion.div>
            ))}
            </div>
          )}

          {/* No Results */}
          {tires.length === 0 && !productsLoading && (
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
                No tires found
              </h3>
              <p className="text-tire-gray mb-8">
                Try adjusting your search criteria or browse our full catalog
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedBrand("");
                  setSelectedCategory("");
                  setSelectedSeason("");
                  setSelectedSize("");
                  setPriceRange([50, 500]);
                  setSortBy("name");
                  setSortOrder("asc");
                  setCurrentPage(1);
                  // Clear URL parameters
                  router.push('/tires');
                }}
              >
                Clear Filters
              </Button>
            </motion.div>
          )}

          {/* Pagination */}
          {!productsLoading && pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <Button 
                variant="outline"
                disabled={!pagination.hasPreviousPage}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              
              <span className="text-tire-gray">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              
              <Button 
                variant="outline"
                disabled={!pagination.hasNextPage}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </section>

      
    </div>
  );
}

const TiresPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tire-orange mx-auto mb-4"></div>
          <p className="text-tire-gray">Loading tires...</p>
        </div>
      </div>
    }>
      <TiresPageContent />
    </Suspense>
  );
};

export default TiresPage;
