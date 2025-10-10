"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import ProductCard from "@/components/product-card";
import Header from "@/components/header";
import { useRouter, useParams } from "next/navigation";
import { tires, brands, getTiresBySeason } from "@/lib/data";
import { 
  Search, 
  Grid, 
  List,
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

  // Normalize category for display and filtering
  const normalizedCategory = category?.charAt(0).toUpperCase() + category?.slice(1);
  const seasonFilter = category === 'all-season' ? 'All-Season' : normalizedCategory;

  // Get tires for this category
  const validSeasons: ("Summer" | "Winter")[] = ["Summer", "Winter"];
  const isValidSeason = (season: string): season is "Summer" | "Winter" => {
    return validSeasons.includes(season as "Summer" | "Winter");
  };

  const categoryTires = category === 'all' 
    ? tires 
    : isValidSeason(seasonFilter) 
      ? getTiresBySeason(seasonFilter)
      : tires.filter(tire => tire.season.toLowerCase() === category?.toLowerCase());

  // Generate dynamic filter options based on actual category data
  const availableBrands = [...new Set(categoryTires.map(tire => tire.brand))].sort();
  const availableSizes = [...new Set(categoryTires.flatMap(tire => tire.size))].sort();

  const filteredTires = categoryTires.filter(tire => {
    const matchesSearch = tire.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tire.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = !selectedBrand || tire.brand === selectedBrand;
    const matchesSize = !selectedSize || tire.size === selectedSize;
    const matchesPrice = tire.price >= priceRange[0] && tire.price <= priceRange[1];

    return matchesSearch && matchesBrand && matchesSize && matchesPrice;
  });

  const getCategoryInfo = (cat: string) => {
    switch(cat?.toLowerCase()) {
      case 'summer':
        return {
          title: 'Summer Tires',
          subtitle: 'High performance tires for warm weather driving',
          icon: Sun,
          description: 'Designed for optimal performance in warm weather conditions with superior grip and handling.',
          gradient: 'from-yellow-500 to-orange-600'
        };
      case 'winter':
        return {
          title: 'Winter Tires',
          subtitle: 'Superior traction for cold weather and snow',
          icon: Snowflake,
          description: 'Engineered for cold weather, snow, and ice with enhanced traction and safety features.',
          gradient: 'from-blue-500 to-cyan-600'
        };
      case 'all-season':
        return {
          title: 'All-Season Tires',
          subtitle: 'Versatile performance for year-round driving',
          icon: CloudRain,
          description: 'Balanced performance for various weather conditions throughout the year.',
          gradient: 'from-green-500 to-teal-600'
        };
      default:
        return {
          title: 'All Tires',
          subtitle: 'Complete tire collection',
          icon: Car,
          description: 'Browse our complete selection of premium tires.',
          gradient: 'from-tire-dark to-primary'
        };
    }
  };

  const categoryInfo = getCategoryInfo(category);

  useEffect(() => {
    // Reset filters when category changes
    setSearchTerm("");
    setSelectedBrand("");
    setSelectedSize("");
    setPriceRange([50, 500]);
  }, [category]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className={`bg-gradient-to-r ${categoryInfo.gradient} text-white py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-6">
              <categoryInfo.icon className="w-16 h-16 mr-4" />
              <div>
                <h1 className="text-4xl lg:text-6xl font-bold">
                  {categoryInfo.title}
                </h1>
                <p className="text-xl text-gray-200 mt-2">
                  {categoryInfo.subtitle}
                </p>
              </div>
            </div>
            <p className="text-lg text-gray-200 max-w-3xl mx-auto mb-8">
              {categoryInfo.description}
            </p>
            <div className="flex items-center justify-center">
              <Button 
                variant="outline" 
                className="text-black border-white hover:bg-white hover:text-tire-dark mr-4"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to All Tires
              </Button>
            </div>
          </motion.div>
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
                  placeholder={`Search ${categoryInfo.title.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-4">
              <Select value={selectedBrand === "" ? "all-brands" : selectedBrand} onValueChange={(value) => setSelectedBrand(value === "all-brands" ? "" : value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-brands">All Brands</SelectItem>
                  {availableBrands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSize === "" ? "all-sizes" : selectedSize} onValueChange={(value) => setSelectedSize(value === "all-sizes" ? "" : value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-sizes">All Sizes</SelectItem>
                  {availableSizes.map(size => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
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
          {/* Results Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-tire-dark">
                {filteredTires.length} {categoryInfo.title} Found
              </h2>
              <p className="text-tire-gray">
                {category === 'all' ? 'Showing all available tires' : `Showing ${categoryInfo.title.toLowerCase()} in our collection`}
              </p>
            </div>
          </div>

          {/* Tire Grid */}
          <div className={`grid ${
            viewMode === "grid" 
              ? "gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "gap-3 grid-cols-1"
          }`}>
            {filteredTires.map((tire, index) => (
              <motion.div
                key={tire.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProductCard
                  {...tire}
                  className={viewMode === "list" ? "flex" : ""}
                  onAddToCart={(id) => console.log("Add to cart:", id)}
                  onViewDetails={(id) => router.push(`/product/${id}`)}
                  onToggleFavorite={(id) => console.log("Toggle favorite:", id)}
                  season={tire.season as "All-Season" | "Summer" | "Winter" | undefined}
                  size={tire.size || ""}
                  speedRating={tire.speedRating}
                  features={tire.features}
                />
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredTires.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <categoryInfo.icon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-tire-dark mb-4">
                No {categoryInfo.title.toLowerCase()} found
              </h3>
              <p className="text-tire-gray mb-8">
                Try adjusting your search criteria or browse other categories
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                <Button variant="outline" onClick={() => router.push('/tires')}>
                  Browse All Tires
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
