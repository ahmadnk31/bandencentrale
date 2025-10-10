"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/product-card";
import Header from "@/components/header";
import { useRouter, useParams } from "next/navigation";
import { tires, brands, getTiresByBrand } from "@/lib/data";
import { 
  Search, 
  Grid, 
  List,
  SlidersHorizontal,
  ArrowLeft,
  Star,
  Award,
  MapPin,
  Calendar
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

  // Find the brand data
  const brand = brands.find(b => b.name.toLowerCase().replace(/\s+/g, '-') === brandSlug);
  const brandName = brand?.name || brandSlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const seasons = ["All-Season", "Summer", "Winter"];
  const sizes = ["185/60R14", "195/65R15", "205/55R16", "215/60R16", "225/45R17", "225/50R17", "235/45R17", "245/40R18", "255/35R19"];

  // Get tires for this brand
  const brandTires = brandName ? getTiresByBrand(brandName) : [];

  const filteredTires = brandTires.filter(tire => {
    const matchesSearch = tire.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeason = !selectedSeason || tire.season === selectedSeason;
    const matchesSize = !selectedSize || tire.size === selectedSize;
    const matchesPrice = tire.price >= priceRange[0] && tire.price <= priceRange[1];

    return matchesSearch && matchesSeason && matchesSize && matchesPrice;
  });

  useEffect(() => {
    // Reset filters when brand changes
    setSearchTerm("");
    setSelectedSeason("");
    setSelectedSize("");
    setPriceRange([50, 500]);
  }, [brandSlug]);

  if (!brand && brandTires.length === 0) {
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
      {brand && (
        <section className="bg-white py-8 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-tire-dark">{brandTires.length}</div>
                <div className="text-sm text-tire-gray">Models Available</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-tire-dark">
                  €{Math.min(...brandTires.map(t => t.price))} - €{Math.max(...brandTires.map(t => t.price))}
                </div>
                <div className="text-sm text-tire-gray">Price Range</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-tire-dark">
                  {[...new Set(brandTires.map(t => t.season))].length}
                </div>
                <div className="text-sm text-tire-gray">Season Types</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-tire-dark">
                  {(brandTires.reduce((sum, t) => sum + t.rating, 0) / brandTires.length).toFixed(1)}★
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
                  {seasons.map(season => (
                    <SelectItem key={season} value={season}>{season}</SelectItem>
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
                {filteredTires.length} {brandName} Tires Found
              </h2>
              <p className="text-tire-gray">
                Showing {brandName} tires in our collection
              </p>
            </div>
          </div>

          {/* Category Tags */}
          {brand && (
            <div className="flex flex-wrap gap-2 mb-8">
              {[...new Set(brandTires.map(t => t.season))].map(season => (
                <Badge 
                  key={season} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-tire-orange hover:text-white"
                  onClick={() => setSelectedSeason(selectedSeason === season ? "" : season)}
                >
                  {season} ({brandTires.filter(t => t.season === season).length})
                </Badge>
              ))}
            </div>
          )}

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
        </div>
      </section>
    </div>
  );
};

export default BrandPage;
