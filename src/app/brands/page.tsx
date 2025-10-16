"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/header";
import { useRouter, useSearchParams } from "next/navigation";
import { useBrands } from "@/hooks/use-store-data";
import { useState, useEffect, useMemo } from "react";
import { 
  Star, 
  Award, 
  Globe, 
  Truck, 
  Car,
  Users,
  TrendingUp,
  ArrowRight,
  Loader2,
  ExternalLink,
  Search,
  Filter,
  Grid,
  List,
  SlidersHorizontal
} from "lucide-react";

const BrandsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: brandsResponse, isLoading: brandsLoading, error: brandsError } = useBrands();
  const allBrands = brandsResponse?.data || [];

  // Filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get("country") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">((searchParams.get("order") as "asc" | "desc") || "asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Extract unique countries from brands
  const countries = useMemo(() => {
    const uniqueCountries = [...new Set(allBrands.map((brand: any) => brand.countryOfOrigin).filter(Boolean))];
    return uniqueCountries.sort();
  }, [allBrands]);

  // Filter and sort brands
  const brands = useMemo(() => {
    let filtered = [...allBrands];

    // Search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((brand: any) =>
        brand.name?.toLowerCase().includes(search) ||
        brand.description?.toLowerCase().includes(search) ||
        brand.countryOfOrigin?.toLowerCase().includes(search)
      );
    }

    // Country filter
    if (selectedCountry) {
      filtered = filtered.filter((brand: any) => brand.countryOfOrigin === selectedCountry);
    }

    // Sort
    filtered.sort((a: any, b: any) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "name":
          aValue = a.name || "";
          bValue = b.name || "";
          break;
        case "country":
          aValue = a.countryOfOrigin || "";
          bValue = b.countryOfOrigin || "";
          break;
        default:
          aValue = a.name || "";
          bValue = b.name || "";
      }

      const comparison = aValue.localeCompare(bValue);
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [allBrands, searchTerm, selectedCountry, sortBy, sortOrder]);

  // Update URL when filters change
  const updateURL = (params: Record<string, string | number>) => {
    const url = new URL(window.location.href);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "" && value !== "all") {
        url.searchParams.set(key, value.toString());
      } else {
        url.searchParams.delete(key);
      }
    });

    router.replace(url.pathname + url.search, { scroll: false });
  };

  // Initialize filters from URL on mount
  useEffect(() => {
    const search = searchParams.get("search") || "";
    const country = searchParams.get("country") || "";
    const sort = searchParams.get("sort") || "name";
    const order = (searchParams.get("order") as "asc" | "desc") || "asc";

    setSearchTerm(search);
    setSelectedCountry(country);
    setSortBy(sort);
    setSortOrder(order);
  }, [searchParams]);

  const brandStats = [
    { icon: Globe, label: "Global Brands", value: "15+" },
    { icon: Star, label: "Average Rating", value: "4.7/5" },
    { icon: Users, label: "Satisfied Customers", value: "100K+" },
    { icon: TrendingUp, label: "Years Combined Experience", value: "500+" }
  ];

  const categories = [
    {
      name: "Passenger Cars",
      icon: Car,
      description: "Tires for everyday driving comfort and efficiency",
      brands: ["Michelin", "Continental", "Bridgestone"]
    },
    {
      name: "High Performance",
      icon: TrendingUp,
      description: "Racing-inspired tires for maximum performance",
      brands: ["Pirelli", "Michelin", "Continental"]
    },
    {
      name: "Commercial & Truck",
      icon: Truck,
      description: "Heavy-duty tires built for commercial use",
      brands: ["Bridgestone", "Continental", "Michelin"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-tire-dark to-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Trusted Tire{" "}
              <span className="text-tire-orange">Brands</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Discover premium tire brands from around the world. Each brand represents 
              decades of innovation, quality, and performance excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {brandStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-tire-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-tire-dark mb-2">
                  {stat.value}
                </div>
                <div className="text-tire-gray">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-tire-dark mb-4">
              Browse by{" "}
              <span className="bg-gradient-to-r from-tire-orange to-primary bg-clip-text text-transparent">
                Category
              </span>
            </h2>
            <p className="text-xl text-tire-gray max-w-3xl mx-auto">
              Find the perfect brand for your specific vehicle and driving needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full p-6 hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardContent className="p-0 text-center">
                    <div className="bg-tire-gradient p-4 rounded-full w-fit mx-auto mb-4">
                      <category.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-tire-dark mb-3">
                      {category.name}
                    </h3>
                    <p className="text-tire-gray mb-4">
                      {category.description}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {category.brands.map(brand => (
                        <span key={brand} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-tire-gray">
                          {brand}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search brands by name, description, or country..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    updateURL({
                      search: e.target.value,
                      country: selectedCountry,
                      sort: sortBy,
                      order: sortOrder
                    });
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <Select value={selectedCountry === "" ? "all" : selectedCountry} onValueChange={(value) => {
                const newCountry = value === "all" ? "" : value;
                setSelectedCountry(newCountry);
                updateURL({
                  search: searchTerm,
                  country: newCountry,
                  sort: sortBy,
                  order: sortOrder
                });
              }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country as string} value={country as string}>{country as string}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                const [newSortBy, newSortOrder] = value.split('-');
                setSortBy(newSortBy);
                setSortOrder(newSortOrder as "asc" | "desc");
                updateURL({
                  search: searchTerm,
                  country: selectedCountry,
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
                  <SelectItem value="country-asc">Country A-Z</SelectItem>
                  <SelectItem value="country-desc">Country Z-A</SelectItem>
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
      </section>

      {/* Brands Grid Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-tire-dark mb-4">
                  Featured{" "}
                  <span className="bg-gradient-to-r from-tire-orange to-primary bg-clip-text text-transparent">
                    Brands
                  </span>
                </h2>
                <p className="text-xl text-tire-gray max-w-3xl">
                  {brands.length} brand{brands.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {brandsLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-tire-orange mr-2" />
              <span className="text-lg">Loading brands...</span>
            </div>
          )}

          {/* Error State */}
          {brandsError && (
            <div className="text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-600">Failed to load brands. Please try again.</p>
              </div>
            </div>
          )}

          {/* Brands Grid */}
          {!brandsLoading && !brandsError && (
            <div className={`grid gap-8 ${
              viewMode === "grid" 
                ? "md:grid-cols-2 lg:grid-cols-3 auto-rows-fr items-stretch" 
                : "grid-cols-1"
            }`}>
              {brands.map((brand: any, index: number) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group flex"
                >
                  <Card className={`w-full hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden ${
                    viewMode === "list" ? "flex-row" : ""
                  }`}>
                    <CardContent className={`p-6 h-full flex ${
                      viewMode === "list" ? "flex-row items-center gap-6" : "flex-col min-h-[280px]"
                    }`}>
                      {/* Brand Header */}
                      <div className={`flex items-center ${viewMode === "list" ? "flex-shrink-0" : "mb-4"}`}>
                        {brand.logo && (
                          <div className="bg-gray-50 rounded-lg p-3 mr-4 flex-shrink-0">
                            <img 
                              src={brand.logo} 
                              alt={`${brand.name} logo`}
                              className={`object-contain ${viewMode === "list" ? "w-16 h-16" : "w-12 h-12"}`}
                            />
                          </div>
                        )}
                        <div className="flex-grow">
                          <h3 className={`font-bold text-tire-dark mb-1 ${
                            viewMode === "list" ? "text-2xl" : "text-xl line-clamp-2"
                          }`}>{brand.name}</h3>
                          {brand.countryOfOrigin && (
                            <p className="text-sm text-tire-gray flex items-center">
                              <Globe className="w-4 h-4 mr-1 flex-shrink-0" />
                              <span className="truncate">{brand.countryOfOrigin}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Brand Description */}
                      <div className={`flex-grow ${viewMode === "list" ? "" : "mb-6"}`}>
                        <p className={`text-tire-gray text-sm ${
                          viewMode === "list" ? "line-clamp-2" : "line-clamp-4"
                        }`}>
                          {brand.description || "Premium tire brand known for quality and innovation. Explore our selection of tires from this manufacturer."}
                        </p>
                      </div>

                      {/* Brand Actions */}
                      <div className={`flex gap-2 ${viewMode === "list" ? "flex-shrink-0" : "mt-auto"}`}>
                        <Button 
                          className="flex-1 bg-tire-gradient hover:bg-tire-gradient/90"
                          onClick={() => router.push(`/tires?brand=${encodeURIComponent(brand.name)}`)}
                        >
                          View Tires
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                        {brand.website && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(brand.website, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!brandsLoading && !brandsError && brands.length === 0 && allBrands.length > 0 && (
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
                No brands found
              </h3>
              <p className="text-tire-gray mb-8">
                Try adjusting your search criteria or browse all brands
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCountry("");
                  setSortBy("name");
                  setSortOrder("asc");
                  router.push('/brands');
                }}
              >
                Clear Filters
              </Button>
            </motion.div>
          )}

          {/* No Brands Available */}
          {!brandsLoading && !brandsError && allBrands.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-tire-dark mb-4">
                No brands available
              </h3>
              <p className="text-tire-gray">
                Check back later for our brand collection.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-tire-dark to-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Can't Find Your Brand?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              We work with many tire manufacturers and can special order tires from 
              brands not listed here. Contact us for availability.
            </p>
            <Button 
              size="lg" 
              className="bg-tire-orange hover:bg-tire-orange/90 px-8"
              onClick={() => router.push('/contact')}
            >
              Contact Us
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BrandsPage;
