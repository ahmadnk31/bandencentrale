"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import ProductCard from "@/components/product-card";
import Header from "@/components/header";
import { useRouter } from "next/navigation";
import { tires, brands, searchTires, getTiresByBrand, getTiresBySeason } from "@/lib/data";
import { 
  Search, 
  Filter, 
  Grid, 
  List,
  Star,
  Car,
  Truck,
  Bike,
  SlidersHorizontal
} from "lucide-react";

const TiresPage = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState("grid");
  const [priceRange, setPriceRange] = useState([50, 500]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const brandNames = brands.map(brand => brand.name);
  const seasons = ["All-Season", "Summer", "Winter"];
  const sizes = ["185/60R14", "195/65R15", "205/55R16", "215/60R16", "225/45R17", "225/50R17", "235/45R17", "245/40R18", "255/35R19"];
  const categories = ["All", "Performance", "Winter", "All-Season", "Touring", "Ultra High Performance", "All-Season Plus"];

  const filteredTires = tires.filter(tire => {
    const matchesSearch = tire.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tire.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = !selectedBrand || tire.brand === selectedBrand;
    const matchesSeason = !selectedSeason || tire.season === selectedSeason;
    const matchesSize = !selectedSize || tire.size.includes(selectedSize);
    const matchesPrice = tire.price >= priceRange[0] && tire.price <= priceRange[1];

    return matchesSearch && matchesBrand && matchesSeason && matchesSize && matchesPrice;
  });

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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-4">
              <Select value={selectedBrand === "" ? "all" : selectedBrand} onValueChange={(value) => setSelectedBrand(value === "all" ? "" : value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brandNames.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSeason === "" ? "all" : selectedSeason} onValueChange={(value) => setSelectedSeason(value === "all" ? "" : value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Seasons</SelectItem>
                  {seasons.map(season => (
                    <SelectItem key={season} value={season}>{season}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSize === "" ? "all" : selectedSize} onValueChange={(value) => setSelectedSize(value === "all" ? "" : value)}>
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
                {filteredTires.length} Tires Found
              </h2>
              <p className="text-tire-gray">
                Showing results for your search criteria
              </p>
            </div>
          </div>

          {/* Tire Grid */}
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
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
                  setSelectedSeason("");
                  setSelectedSize("");
                  setPriceRange([50, 500]);
                }}
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      
    </div>
  );
};

export default TiresPage;
