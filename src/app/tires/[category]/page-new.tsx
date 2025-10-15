"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import ProductCard from "@/components/product-card";
import Header from "@/components/header";
import { useRouter, useParams } from "next/navigation";
import { useProducts, useBrands, ProductFilters, Product } from "@/hooks/use-store-data";
import { 
  Search, 
  Grid, 
  List,
  Loader2,
  Car,
  Truck,
  SlidersHorizontal,
  ArrowLeft,
  Snowflake,
  Sun,
  CloudRain
} from "lucide-react";

const CategoryPage = () => {
  const router = useRouter();
  const params = useParams();
  const category = params.category as string;
  
  const [viewMode, setViewMode] = useState("grid");
  const [priceRange, setPriceRange] = useState([50, 500]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const tiresPerPage = 12;

  // Get the correct season name for API
  const seasonFilter = category === "all-season" ? "all-season" : 
                      category === "summer" ? "summer" :
                      category === "winter" ? "winter" : "";

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
    if (seasonFilter) f.season = seasonFilter;
    if (priceRange[0] > 50) f.minPrice = priceRange[0];
    if (priceRange[1] < 500) f.maxPrice = priceRange[1];

    return f;
  }, [searchTerm, selectedBrand, seasonFilter, priceRange, sortBy, sortOrder, currentPage]);

  // Fetch data
  const { data: productsResponse, isLoading: productsLoading, error: productsError } = useProducts(filters);
  const { data: brandsResponse, isLoading: brandsLoading } = useBrands();

  const tires = productsResponse?.data || [];
  const pagination = productsResponse?.pagination;
  const brands = brandsResponse?.data || [];
  const availableBrands = brands.map((brand: any) => brand.name);
  const availableSizes = ["185/60R14", "195/65R15", "205/55R16", "215/60R16", "225/45R17", "225/50R17", "235/45R17", "245/40R18", "255/35R19"];

  // Category info
  const getCategoryInfo = () => {
    switch (category) {
      case "summer":
        return {
          title: "Summer Tires",
          description: "High-performance tires designed for warm weather and dry conditions",
          icon: Sun,
          color: "from-orange-500 to-red-600"
        };
      case "winter":
        return {
          title: "Winter Tires",
          description: "Specialized tires for cold weather, snow, and ice conditions",
          icon: Snowflake,
          color: "from-blue-500 to-indigo-600"
        };
      case "all-season":
        return {
          title: "All-Season Tires",
          description: "Versatile tires for year-round performance in various conditions",
          icon: CloudRain,
          color: "from-green-500 to-teal-600"
        };
      default:
        return {
          title: "Tire Category",
          description: "Premium tires for your vehicle",
          icon: Car,
          color: "from-tire-dark to-primary"
        };
    }
  };

  const categoryInfo = getCategoryInfo();
  const IconComponent = categoryInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className={`bg-gradient-to-r ${categoryInfo.color} text-white py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="text-white border-white hover:bg-white hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="bg-white/20 p-3 rounded-full">
                <IconComponent className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">{categoryInfo.title}</h1>
                <p className="text-xl text-gray-200 mt-2">
                  {categoryInfo.description}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search tires..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Brand Filter */}
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-brands">All Brands</SelectItem>
                  {availableBrands.map((brand: string) => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Size Filter */}
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Sizes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-sizes">All Sizes</SelectItem>
                  {availableSizes.map((size: string) => (
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
              
              {/* View Mode */}
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

            {/* Price Range */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Price Range: €{priceRange[0]} - €{priceRange[1]}
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedBrand("");
                    setSelectedSize("");
                    setPriceRange([50, 500]);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={500}
                min={50}
                step={10}
                className="w-full"
              />
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-tire-dark">
              {pagination?.totalCount || 0} Tires Found
            </h2>
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

          {/* Products Grid */}
          {!productsLoading && !productsError && (
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"
            }`}>
              {tires.map((tire: Product, index: number) => (
                <motion.div
                  key={tire.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ProductCard
                    id={parseInt(tire.id)}
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
                <IconComponent className="w-12 h-12 text-gray-400" />
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
                  setSelectedSize("");
                  setPriceRange([50, 500]);
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
};

export default CategoryPage;
