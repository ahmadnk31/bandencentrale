"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/product-card";
import Header from "@/components/header";
import { useRouter, useParams } from "next/navigation";
import { useProducts, useBrands, ProductFilters, Product } from "@/hooks/use-store-data";
import { 
  Search, 
  Grid, 
  List,
  SlidersHorizontal,
  ArrowLeft,
  Star,
  Award,
  MapPin,
  Calendar,
  Loader2
} from "lucide-react";

const BrandPage = () => {
  const router = useRouter();
  const params = useParams();
  const brandSlug = params.brand as string;
  
  const [viewMode, setViewMode] = useState("grid");
  const [priceRange, setPriceRange] = useState([50, 500]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const tiresPerPage = 12;
  const brandName = brandSlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const seasons = ["all-season", "summer", "winter"];
  const seasonsDisplay = ["All-Season", "Summer", "Winter"];
  const sizes = ["185/60R14", "195/65R15", "205/55R16", "215/60R16", "225/45R17", "225/50R17", "235/45R17", "245/40R18", "255/35R19"];

  // Prepare filters for API call
  const filters: ProductFilters = useMemo(() => {
    const f: ProductFilters = {
      page: currentPage,
      limit: tiresPerPage,
      sortBy,
      sortOrder,
      inStock: true,
      brand: brandName
    };

    if (searchTerm.trim()) f.search = searchTerm.trim();
    if (selectedSeason) f.season = selectedSeason;
    if (priceRange[0] > 50) f.minPrice = priceRange[0];
    if (priceRange[1] < 500) f.maxPrice = priceRange[1];

    return f;
  }, [searchTerm, selectedSeason, brandName, priceRange, sortBy, sortOrder, currentPage]);

  // Fetch data
  const { data: productsResponse, isLoading: productsLoading, error: productsError } = useProducts(filters);
  const { data: brandsResponse, isLoading: brandsLoading } = useBrands();

  const tires = productsResponse?.data || [];
  const pagination = productsResponse?.pagination;
  const brands = brandsResponse?.data || [];
  
  // Find the brand data from API
  const brand = brands.find((b: any) => b.name.toLowerCase().replace(/\s+/g, '-') === brandSlug);

  useEffect(() => {
    // Reset filters when brand changes
    setSearchTerm("");
    setSelectedSeason("");
    setSelectedSize("");
    setPriceRange([50, 500]);
    setCurrentPage(1);
  }, [brandSlug]);

  if (!productsLoading && !brand && tires.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-tire-dark mb-4">Brand not found</h1>
          <p className="text-tire-gray mb-8">The brand you're looking for doesn't exist in our catalog.</p>
          <Button onClick={() => router.push('/brands')}>
            Browse All Brands
          </Button>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center justify-center mb-6">
              {brand?.logo ? (
                <img 
                  src={brand.logo} 
                  alt={brandName} 
                  className="w-24 h-24 object-contain bg-white rounded-lg p-2 mr-6"
                />
              ) : (
                <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center mr-6">
                  <Award className="w-12 h-12 text-tire-dark" />
                </div>
              )}
              <div>
                <h1 className="text-4xl lg:text-6xl font-bold">
                  {brandName}
                </h1>
                <p className="text-xl text-gray-200 mt-2">
                  Premium Tire Collection
                </p>
              </div>
            </div>
            
            {brand && (
              <div className="max-w-4xl mx-auto">
                <p className="text-lg text-gray-200 mb-6">
                  {brand.description}
                </p>
                <div className="flex flex-wrap justify-center gap-6 text-sm">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Founded {brand.founded}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {brand.country}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    Specialties: {brand.specialties.join(", ")}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-center mt-8">
              <Button 
                variant="outline" 
                className="text-black border-white hover:bg-white hover:text-tire-dark mr-4"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Brands
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brand Stats */}
      {brand && !productsLoading && tires.length > 0 && (
        <section className="bg-white py-8 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-tire-dark">{pagination?.totalCount || tires.length}</div>
                <div className="text-sm text-tire-gray">Models Available</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-tire-dark">
                  €{Math.min(...tires.map((t: Product) => parseFloat(t.price)))} - €{Math.max(...tires.map((t: Product) => parseFloat(t.price)))}
                </div>
                <div className="text-sm text-tire-gray">Price Range</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-tire-dark">
                  {[...new Set(tires.map((t: Product) => t.season))].length}
                </div>
                <div className="text-sm text-tire-gray">Season Types</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-tire-dark">
                  4.5★
                </div>
                <div className="text-sm text-tire-gray">Average Rating</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filters and Search */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder={`Search ${brandName} tires...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-4">
              <Select value={selectedSeason || "all-seasons"} onValueChange={(value) => setSelectedSeason(value === "all-seasons" ? "" : value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-seasons">All Seasons</SelectItem>
                  {seasons.map((season, index) => (
                    <SelectItem key={season} value={season}>{seasonsDisplay[index]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSize || "all-sizes"} onValueChange={(value) => setSelectedSize(value === "all-sizes" ? "" : value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-sizes">All Sizes</SelectItem>
                  {sizes.map(size => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                const [newSortBy, newSortOrder] = value.split('-');
                setSortBy(newSortBy);
                setSortOrder(newSortOrder as "asc" | "desc");
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
                  onValueChange={setPriceRange}
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
          {/* Loading State */}
          {productsLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-tire-orange mr-2" />
              <span className="text-lg">Loading {brandName} tires...</span>
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

          {/* Results Header */}
          {!productsLoading && !productsError && (
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-tire-dark">
                  {pagination?.totalCount || 0} {brandName} Tires Found
                </h2>
                <p className="text-tire-gray">
                  Showing {brandName} tires in our collection
                </p>
              </div>
            </div>
          )}

          {/* Category Tags */}
          {!productsLoading && !productsError && tires.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {seasons.map(season => (
                <Badge 
                  key={season} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-tire-orange hover:text-white"
                  onClick={() => setSelectedSeason(selectedSeason === season ? "" : season)}
                >
                  {season}
                </Badge>
              ))}
            </div>
          )}

          {/* Tire Grid */}
          {!productsLoading && !productsError && (
            <div className={`grid ${
              viewMode === "grid" 
                ? "gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "gap-3 grid-cols-1"
            }`}>
              {tires.map((tire: Product, index: number) => (
                <motion.div
                  key={tire.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ProductCard
                    id={tire.id}
                    name={tire.name}
                    brand={tire.brand || "Unknown"}
                    price={parseFloat(tire.price)}
                    originalPrice={tire.compareAtPrice ? parseFloat(tire.compareAtPrice) : undefined}
                    images={tire.images || []}
                    rating={4.5}
                    reviews={Math.floor(Math.random() * 200) + 50}
                    size={tire.size}
                    season={tire.season as "All-Season" | "Summer" | "Winter"}
                    speedRating={tire.speedRating || undefined}
                    features={tire.features || []}
                    inStock={tire.inStock}
                    className={viewMode === "list" ? "flex" : ""}
                    onAddToCart={(id) => console.log("Add to cart:", id)}
                    onViewDetails={(id) => router.push(`/product/${id}`)}
                    onToggleFavorite={(id) => console.log("Toggle favorite:", id)}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!productsLoading && !productsError && tires.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-tire-dark mb-4">
                No {brandName} tires found
              </h3>
              <p className="text-tire-gray mb-8">
                Try adjusting your search criteria or browse other brands
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedSeason("");
                    setSelectedSize("");
                    setPriceRange([50, 500]);
                  }}
                >
                  Clear Filters
                </Button>
                <Button variant="outline" onClick={() => router.push('/brands')}>
                  Browse All Brands
                </Button>
              </div>
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
};

export default BrandPage;
