export interface TireSize {
  width: string;
  aspectRatio: string;
  rimDiameter: string;
  sizeDisplay: string; // e.g., "225/45R17"
}

export interface ProductSpecs {
  loadIndex: string;
  speedRating: string;
  treadDepth: string;
  weight: string;
  treadPattern: string;
  sidewallConstruction: string;
  maxPressure: string;
}

export interface SizeVariant {
  id: string;
  size: TireSize;
  specs: ProductSpecs;
  inventory: ProductInventory;
  pricing: ProductPricing;
  salesData: {
    totalSold: number;
    revenue: number;
  };
  isDefault?: boolean; // Marks the default/featured size
}

export interface ProductFeatures {
  fuelEfficiency: string; // A-G rating
  wetGrip: string; // A-G rating
  roadNoise: string; // dB value
  season: 'summer' | 'winter' | 'all-season';
  vehicleType: string[];
  runFlat: boolean;
  reinforced: boolean;
  studded: boolean;
  eco: boolean;
}

export interface ProductInventory {
  sku: string;
  barcode: string;
  stockQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  reorderLevel: number;
  maxStockLevel: number;
  location: string;
  supplier: string;
  supplierSku: string;
  lastRestocked: string;
  expirationDate?: string;
}

export interface ProductPricing {
  basePrice: number;
  salePrice?: number;
  costPrice: number;
  margin: number;
  currency: string;
  priceHistory: Array<{
    price: number;
    date: string;
    reason: string;
  }>;
  bulkPricing: Array<{
    minQuantity: number;
    price: number;
    discount: number;
  }>;
}

export interface ProductSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  slug: string;
  canonicalUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  brand: string;
  category: string;
  subcategory?: string;
  model: string;
  
  // Base product features (same across all sizes)
  features: ProductFeatures;
  
  // Size variants - each tire model can have multiple sizes
  sizeVariants: SizeVariant[];
  
  // Images and media (shared across all sizes)
  images: string[];
  thumbnailImage: string;
  videos?: string[];
  documents?: Array<{
    name: string;
    url: string;
    type: 'datasheet' | 'manual' | 'certificate' | 'warranty';
  }>;
  
  // Aggregated sales data across all sizes
  salesData: {
    totalSold: number;
    revenue: number;
    averageRating: number;
    reviewCount: number;
    viewCount: number;
    wishlistCount: number;
  };
  
  // SEO and marketing
  seo: ProductSEO;
  tags: string[];
  relatedProducts: string[];
  
  // Status and metadata
  status: 'active' | 'inactive' | 'discontinued' | 'coming-soon';
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  
  // Additional fields
  warranty: string;
  manufacturer: string;
  countryOfOrigin: string;
  certifications: string[];
  
  // Helper properties for display
  priceRange?: {
    min: number;
    max: number;
  };
  availableSizes?: string[];
}

export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'salesData'>;

export interface ProductFilter {
  search?: string;
  category?: string;
  brand?: string;
  status?: string;
  priceRange?: [number, number];
  stockStatus?: 'in-stock' | 'low-stock' | 'out-of-stock';
  season?: string;
  featured?: boolean;
  sortBy?: 'name' | 'price' | 'stock' | 'sales' | 'created' | 'updated';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  featuredProducts: number;
  newArrivals: number;
  bestSellers: number;
  totalValue: number;
  avgPrice: number;
}

// Sample product data for development with size variants
export const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Michelin Pilot Sport 4S",
    description: "Ultra-high performance summer tire with exceptional grip and handling for sports cars and high-performance vehicles. Features a hybrid belt of aramid and nylon for ultimate precision and a bi-compound tread for maximum grip in dry and wet conditions.",
    shortDescription: "Premium summer tire for sports cars",
    brand: "Michelin",
    category: "Summer",
    subcategory: "Ultra High Performance",
    model: "Pilot Sport 4S",
    features: {
      fuelEfficiency: "C",
      wetGrip: "A",
      roadNoise: "69",
      season: "summer",
      vehicleType: ["Sports Car", "Sedan", "Coupe"],
      runFlat: false,
      reinforced: false,
      studded: false,
      eco: false
    },
    sizeVariants: [
      {
        id: "1-225-45-17",
        size: {
          width: "225",
          aspectRatio: "45",
          rimDiameter: "17",
          sizeDisplay: "225/45R17"
        },
        specs: {
          loadIndex: "94",
          speedRating: "Y",
          treadDepth: "8.5",
          weight: "12.5",
          treadPattern: "Asymmetric",
          sidewallConstruction: "Radial",
          maxPressure: "51"
        },
        inventory: {
          sku: "MIC-PS4S-225-45-17",
          barcode: "3528701234567",
          stockQuantity: 24,
          reservedQuantity: 4,
          availableQuantity: 20,
          reorderLevel: 10,
          maxStockLevel: 50,
          location: "A-1-B",
          supplier: "Michelin Direct",
          supplierSku: "PS4S-225/45R17",
          lastRestocked: "2024-09-15",
        },
        pricing: {
          basePrice: 289.99,
          salePrice: 259.99,
          costPrice: 195.00,
          margin: 32.8,
          currency: "EUR",
          priceHistory: [
            { price: 289.99, date: "2024-01-01", reason: "Regular pricing" },
            { price: 259.99, date: "2024-09-01", reason: "Seasonal sale" }
          ],
          bulkPricing: [
            { minQuantity: 4, price: 275.99, discount: 4.8 },
            { minQuantity: 8, price: 265.99, discount: 8.3 }
          ]
        },
        salesData: {
          totalSold: 134,
          revenue: 38866.34
        },
        isDefault: true
      },
      {
        id: "1-225-50-17",
        size: {
          width: "225",
          aspectRatio: "50",
          rimDiameter: "17",
          sizeDisplay: "225/50R17"
        },
        specs: {
          loadIndex: "98",
          speedRating: "Y",
          treadDepth: "8.5",
          weight: "13.2",
          treadPattern: "Asymmetric",
          sidewallConstruction: "Radial",
          maxPressure: "51"
        },
        inventory: {
          sku: "MIC-PS4S-225-50-17",
          barcode: "3528701234574",
          stockQuantity: 18,
          reservedQuantity: 2,
          availableQuantity: 16,
          reorderLevel: 10,
          maxStockLevel: 40,
          location: "A-1-C",
          supplier: "Michelin Direct",
          supplierSku: "PS4S-225/50R17",
          lastRestocked: "2024-09-12",
        },
        pricing: {
          basePrice: 299.99,
          salePrice: 269.99,
          costPrice: 205.00,
          margin: 31.7,
          currency: "EUR",
          priceHistory: [
            { price: 299.99, date: "2024-01-01", reason: "Regular pricing" },
            { price: 269.99, date: "2024-09-01", reason: "Seasonal sale" }
          ],
          bulkPricing: [
            { minQuantity: 4, price: 285.99, discount: 4.7 }
          ]
        },
        salesData: {
          totalSold: 100,
          revenue: 28993.66
        }
      },
      {
        id: "1-245-45-17",
        size: {
          width: "245",
          aspectRatio: "45",
          rimDiameter: "17",
          sizeDisplay: "245/45R17"
        },
        specs: {
          loadIndex: "99",
          speedRating: "Y",
          treadDepth: "8.5",
          weight: "14.1",
          treadPattern: "Asymmetric",
          sidewallConstruction: "Radial",
          maxPressure: "51"
        },
        inventory: {
          sku: "MIC-PS4S-245-45-17",
          barcode: "3528701234581",
          stockQuantity: 12,
          reservedQuantity: 1,
          availableQuantity: 11,
          reorderLevel: 8,
          maxStockLevel: 35,
          location: "A-1-D",
          supplier: "Michelin Direct",
          supplierSku: "PS4S-245/45R17",
          lastRestocked: "2024-09-08",
        },
        pricing: {
          basePrice: 329.99,
          costPrice: 225.00,
          margin: 31.8,
          currency: "EUR",
          priceHistory: [
            { price: 329.99, date: "2024-01-01", reason: "Regular pricing" }
          ],
          bulkPricing: []
        },
        salesData: {
          totalSold: 67,
          revenue: 22109.33
        }
      }
    ],
    images: [
      "/api/placeholder/400/400",
      "/api/placeholder/400/400",
      "/api/placeholder/400/400"
    ],
    thumbnailImage: "/api/placeholder/400/400",
    salesData: {
      totalSold: 301, // Sum of all size variants
      revenue: 89969.33, // Sum of all size variants
      averageRating: 4.8,
      reviewCount: 89,
      viewCount: 2340,
      wishlistCount: 156
    },
    seo: {
      metaTitle: "Michelin Pilot Sport 4S - Premium Summer Tire",
      metaDescription: "Buy Michelin Pilot Sport 4S summer tire. Available in multiple sizes. Exceptional grip, handling and performance for sports cars. Free shipping available.",
      keywords: ["michelin", "pilot sport", "summer tire", "sports car"],
      slug: "michelin-pilot-sport-4s"
    },
    tags: ["premium", "sports", "high-performance", "summer"],
    relatedProducts: ["2", "5"],
    status: "active",
    featured: true,
    bestseller: true,
    newArrival: false,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-09-20T14:22:00Z",
    publishedAt: "2024-01-15T12:00:00Z",
    warranty: "6 years manufacturer warranty",
    manufacturer: "Michelin",
    countryOfOrigin: "France",
    certifications: ["ECE R30", "DOT", "ISO 9001"],
    priceRange: {
      min: 289.99,
      max: 329.99
    },
    availableSizes: ["225/45R17", "225/50R17", "245/45R17"]
];

// Simple sample product for testing (keeping the full data structure for later)
export const simpleSampleProducts: Product[] = [
  {
    id: "1",
    name: "Michelin Pilot Sport 4S",
    description: "Ultra-high performance summer tire with exceptional grip and handling for sports cars and high-performance vehicles.",
    shortDescription: "Premium summer tire for sports cars",
    brand: "Michelin",
    category: "Summer",
    subcategory: "Ultra High Performance",
    model: "Pilot Sport 4S",
    features: {
      fuelEfficiency: "C",
      wetGrip: "A",
      roadNoise: "69",
      season: "summer",
      vehicleType: ["Sports Car", "Sedan", "Coupe"],
      runFlat: false,
      reinforced: false,
      studded: false,
      eco: false
    },
    sizeVariants: [
      {
        id: "1-225-45-17",
        size: { width: "225", aspectRatio: "45", rimDiameter: "17", sizeDisplay: "225/45R17" },
        specs: { loadIndex: "94", speedRating: "Y", treadDepth: "8.5", weight: "12.5", treadPattern: "Asymmetric", sidewallConstruction: "Radial", maxPressure: "51" },
        inventory: { sku: "MIC-PS4S-225-45-17", barcode: "3528701234567", stockQuantity: 24, reservedQuantity: 4, availableQuantity: 20, reorderLevel: 10, maxStockLevel: 50, location: "A-1-B", supplier: "Michelin Direct", supplierSku: "PS4S-225/45R17", lastRestocked: "2024-09-15" },
        pricing: { basePrice: 289.99, salePrice: 259.99, costPrice: 195.00, margin: 32.8, currency: "EUR", priceHistory: [], bulkPricing: [] },
        salesData: { totalSold: 134, revenue: 38866.34 },
        isDefault: true
      },
      {
        id: "1-225-50-17",
        size: { width: "225", aspectRatio: "50", rimDiameter: "17", sizeDisplay: "225/50R17" },
        specs: { loadIndex: "98", speedRating: "Y", treadDepth: "8.5", weight: "13.2", treadPattern: "Asymmetric", sidewallConstruction: "Radial", maxPressure: "51" },
        inventory: { sku: "MIC-PS4S-225-50-17", barcode: "3528701234574", stockQuantity: 18, reservedQuantity: 2, availableQuantity: 16, reorderLevel: 10, maxStockLevel: 40, location: "A-1-C", supplier: "Michelin Direct", supplierSku: "PS4S-225/50R17", lastRestocked: "2024-09-12" },
        pricing: { basePrice: 299.99, salePrice: 269.99, costPrice: 205.00, margin: 31.7, currency: "EUR", priceHistory: [], bulkPricing: [] },
        salesData: { totalSold: 100, revenue: 28993.66 }
      },
      {
        id: "1-245-45-17",
        size: { width: "245", aspectRatio: "45", rimDiameter: "17", sizeDisplay: "245/45R17" },
        specs: { loadIndex: "99", speedRating: "Y", treadDepth: "8.5", weight: "14.1", treadPattern: "Asymmetric", sidewallConstruction: "Radial", maxPressure: "51" },
        inventory: { sku: "MIC-PS4S-245-45-17", barcode: "3528701234581", stockQuantity: 12, reservedQuantity: 1, availableQuantity: 11, reorderLevel: 8, maxStockLevel: 35, location: "A-1-D", supplier: "Michelin Direct", supplierSku: "PS4S-245/45R17", lastRestocked: "2024-09-08" },
        pricing: { basePrice: 329.99, costPrice: 225.00, margin: 31.8, currency: "EUR", priceHistory: [], bulkPricing: [] },
        salesData: { totalSold: 67, revenue: 22109.33 }
      }
    ],
    images: ["/api/placeholder/400/400", "/api/placeholder/400/400", "/api/placeholder/400/400"],
    thumbnailImage: "/api/placeholder/400/400",
    salesData: { totalSold: 301, revenue: 89969.33, averageRating: 4.8, reviewCount: 89, viewCount: 2340, wishlistCount: 156 },
    seo: { metaTitle: "Michelin Pilot Sport 4S - Premium Summer Tire", metaDescription: "Buy Michelin Pilot Sport 4S summer tire. Available in multiple sizes.", keywords: ["michelin", "pilot sport", "summer tire"], slug: "michelin-pilot-sport-4s" },
    tags: ["premium", "sports", "high-performance", "summer"],
    relatedProducts: ["2", "5"],
    status: "active",
    featured: true,
    bestseller: true,
    newArrival: false,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-09-20T14:22:00Z",
    publishedAt: "2024-01-15T12:00:00Z",
    warranty: "6 years manufacturer warranty",
    manufacturer: "Michelin",
    countryOfOrigin: "France",
    certifications: ["ECE R30", "DOT", "ISO 9001"],
    priceRange: { min: 289.99, max: 329.99 },
    availableSizes: ["225/45R17", "225/50R17", "245/45R17"]
  }
];
  {
    id: "2",
    name: "Continental WinterContact TS 870",
    description: "Advanced winter tire engineered for superior performance in cold, wet, and snowy conditions. Features an optimized tread compound and pattern for enhanced safety and control during winter months.",
    shortDescription: "High-performance winter tire with excellent snow grip",
    brand: "Continental",
    category: "Winter",
    subcategory: "Premium Winter",
    model: "WinterContact TS 870",
    specs: {
      width: "205",
      aspectRatio: "55",
      rimDiameter: "16",
      loadIndex: "91",
      speedRating: "H",
      treadDepth: "8.0",
      weight: "11.2",
      treadPattern: "Directional",
      sidewallConstruction: "Radial",
      maxPressure: "44"
    },
    features: {
      fuelEfficiency: "B",
      wetGrip: "A",
      roadNoise: "70",
      season: "winter",
      vehicleType: ["Sedan", "Hatchback", "SUV"],
      runFlat: false,
      reinforced: false,
      studded: false,
      eco: true
    },
    images: [
      "/api/placeholder/400/400",
      "/api/placeholder/400/400"
    ],
    thumbnailImage: "/api/placeholder/400/400",
    inventory: {
      sku: "CON-WC870-205-55-16",
      barcode: "4019238890123",
      stockQuantity: 18,
      reservedQuantity: 2,
      availableQuantity: 16,
      reorderLevel: 15,
      maxStockLevel: 60,
      location: "B-2-A",
      supplier: "Continental Europe",
      supplierSku: "WC870-205/55R16",
      lastRestocked: "2024-09-10",
    },
    pricing: {
      basePrice: 199.99,
      costPrice: 145.00,
      margin: 27.5,
      currency: "EUR",
      priceHistory: [
        { price: 199.99, date: "2024-08-01", reason: "Regular pricing" }
      ],
      bulkPricing: [
        { minQuantity: 4, price: 189.99, discount: 5.0 }
      ]
    },
    salesData: {
      totalSold: 189,
      revenue: 37798.11,
      averageRating: 4.6,
      reviewCount: 67,
      viewCount: 1890,
      wishlistCount: 98
    },
    seo: {
      metaTitle: "Continental WinterContact TS 870 205/55R16 - Winter Tire",
      metaDescription: "Premium Continental winter tire with excellent snow and ice performance. Perfect for cold weather conditions.",
      keywords: ["continental", "winter tire", "205/55r16", "snow", "ice"],
      slug: "continental-wintercontact-ts-870-205-55r16"
    },
    tags: ["winter", "safety", "premium", "eco"],
    relatedProducts: ["1", "3"],
    status: "active",
    featured: false,
    bestseller: true,
    newArrival: false,
    onSale: false,
    createdAt: "2024-02-01T09:15:00Z",
    updatedAt: "2024-09-18T11:30:00Z",
    publishedAt: "2024-02-01T10:00:00Z",
    warranty: "5 years manufacturer warranty",
    manufacturer: "Continental",
    countryOfOrigin: "Germany",
    certifications: ["ECE R30", "DOT", "3PMSF"]
  },
  {
    id: "3",
    name: "Bridgestone Turanza T005",
    description: "All-season tire designed for optimal performance in both dry and wet conditions. Features an advanced compound and tread design for enhanced comfort and reduced road noise.",
    shortDescription: "Premium all-season tire for year-round performance",
    brand: "Bridgestone",
    category: "All-Season",
    subcategory: "Touring",
    model: "Turanza T005",
    specs: {
      width: "195",
      aspectRatio: "65",
      rimDiameter: "15",
      loadIndex: "91",
      speedRating: "V",
      treadDepth: "7.5",
      weight: "9.8",
      treadPattern: "Symmetric",
      sidewallConstruction: "Radial",
      maxPressure: "44"
    },
    features: {
      fuelEfficiency: "A",
      wetGrip: "A",
      roadNoise: "68",
      season: "all-season",
      vehicleType: ["Sedan", "Hatchback", "Wagon"],
      runFlat: false,
      reinforced: false,
      studded: false,
      eco: true
    },
    images: [
      "/api/placeholder/400/400"
    ],
    thumbnailImage: "/api/placeholder/400/400",
    inventory: {
      sku: "BRI-T005-195-65-15",
      barcode: "4981910890456",
      stockQuantity: 5,
      reservedQuantity: 1,
      availableQuantity: 4,
      reorderLevel: 10,
      maxStockLevel: 40,
      location: "C-1-C",
      supplier: "Bridgestone Europe",
      supplierSku: "T005-195/65R15",
      lastRestocked: "2024-08-20",
    },
    pricing: {
      basePrice: 159.99,
      costPrice: 115.00,
      margin: 28.1,
      currency: "EUR",
      priceHistory: [
        { price: 169.99, date: "2024-01-01", reason: "Launch pricing" },
        { price: 159.99, date: "2024-07-01", reason: "Price adjustment" }
      ],
      bulkPricing: [
        { minQuantity: 4, price: 149.99, discount: 6.25 }
      ]
    },
    salesData: {
      totalSold: 156,
      revenue: 24958.44,
      averageRating: 4.4,
      reviewCount: 52,
      viewCount: 1560,
      wishlistCount: 78
    },
    seo: {
      metaTitle: "Bridgestone Turanza T005 195/65R15 - All-Season Tire",
      metaDescription: "Eco-friendly all-season tire with excellent fuel efficiency and wet grip performance.",
      keywords: ["bridgestone", "turanza", "all-season", "195/65r15", "eco"],
      slug: "bridgestone-turanza-t005-195-65r15"
    },
    tags: ["all-season", "eco", "comfort", "touring"],
    relatedProducts: ["4", "5"],
    status: "active",
    featured: false,
    bestseller: false,
    newArrival: false,
    onSale: false,
    createdAt: "2024-01-20T14:45:00Z",
    updatedAt: "2024-09-15T16:20:00Z",
    publishedAt: "2024-01-20T15:00:00Z",
    warranty: "5 years manufacturer warranty",
    manufacturer: "Bridgestone",
    countryOfOrigin: "Japan",
    certifications: ["ECE R30", "DOT", "EU Tyre Label"]
  },
  {
    id: "4",
    name: "Pirelli P Zero",
    description: "Ultra-high performance tire engineered for supercars and high-end sports vehicles. Features racing-derived technology for maximum grip and precision at high speeds.",
    shortDescription: "Racing-inspired performance tire for supercars",
    brand: "Pirelli",
    category: "Performance",
    subcategory: "Ultra High Performance",
    model: "P Zero",
    specs: {
      width: "255",
      aspectRatio: "35",
      rimDiameter: "19",
      loadIndex: "96",
      speedRating: "Y",
      treadDepth: "8.2",
      weight: "15.8",
      treadPattern: "Asymmetric",
      sidewallConstruction: "Radial",
      maxPressure: "50"
    },
    features: {
      fuelEfficiency: "C",
      wetGrip: "A",
      roadNoise: "72",
      season: "summer",
      vehicleType: ["Sports Car", "Supercar", "Performance Sedan"],
      runFlat: true,
      reinforced: true,
      studded: false,
      eco: false
    },
    images: [
      "/api/placeholder/400/400",
      "/api/placeholder/400/400",
      "/api/placeholder/400/400",
      "/api/placeholder/400/400"
    ],
    thumbnailImage: "/api/placeholder/400/400",
    inventory: {
      sku: "PIR-PZ-255-35-19",
      barcode: "8019227890789",
      stockQuantity: 0,
      reservedQuantity: 0,
      availableQuantity: 0,
      reorderLevel: 5,
      maxStockLevel: 25,
      location: "A-3-A",
      supplier: "Pirelli International",
      supplierSku: "PZ-255/35R19",
      lastRestocked: "2024-08-01",
    },
    pricing: {
      basePrice: 349.99,
      costPrice: 245.00,
      margin: 30.0,
      currency: "EUR",
      priceHistory: [
        { price: 349.99, date: "2024-01-01", reason: "Premium pricing" }
      ],
      bulkPricing: [
        { minQuantity: 4, price: 329.99, discount: 5.7 }
      ]
    },
    salesData: {
      totalSold: 134,
      revenue: 46898.66,
      averageRating: 4.9,
      reviewCount: 78,
      viewCount: 3450,
      wishlistCount: 234
    },
    seo: {
      metaTitle: "Pirelli P Zero 255/35R19 - Ultra High Performance Tire",
      metaDescription: "Professional racing tire technology for ultimate performance and precision on track and street.",
      keywords: ["pirelli", "p zero", "performance", "255/35r19", "racing"],
      slug: "pirelli-p-zero-255-35r19"
    },
    tags: ["performance", "racing", "premium", "run-flat"],
    relatedProducts: ["1", "5"],
    status: "active",
    featured: true,
    bestseller: false,
    newArrival: false,
    onSale: false,
    createdAt: "2024-03-01T12:30:00Z",
    updatedAt: "2024-09-22T09:45:00Z",
    publishedAt: "2024-03-01T13:00:00Z",
    warranty: "4 years manufacturer warranty",
    manufacturer: "Pirelli",
    countryOfOrigin: "Italy",
    certifications: ["ECE R30", "DOT", "FIA Approved"]
  },
  {
    id: "5",
    name: "Goodyear Eagle F1 Asymmetric",
    description: "High-performance summer tire combining racing technology with everyday usability. Features an asymmetric tread pattern for optimal performance in dry and wet conditions.",
    shortDescription: "High-performance summer tire with racing DNA",
    brand: "Goodyear",
    category: "Summer",
    subcategory: "High Performance",
    model: "Eagle F1 Asymmetric",
    specs: {
      width: "225",
      aspectRatio: "40",
      rimDiameter: "18",
      loadIndex: "92",
      speedRating: "Y",
      treadDepth: "8.0",
      weight: "13.2",
      treadPattern: "Asymmetric",
      sidewallConstruction: "Radial",
      maxPressure: "51"
    },
    features: {
      fuelEfficiency: "B",
      wetGrip: "A",
      roadNoise: "71",
      season: "summer",
      vehicleType: ["Sports Car", "Performance Sedan", "Coupe"],
      runFlat: false,
      reinforced: false,
      studded: false,
      eco: false
    },
    images: [
      "/api/placeholder/400/400",
      "/api/placeholder/400/400"
    ],
    thumbnailImage: "/api/placeholder/400/400",
    inventory: {
      sku: "GOO-EF1A-225-40-18",
      barcode: "5452000890345",
      stockQuantity: 31,
      reservedQuantity: 3,
      availableQuantity: 28,
      reorderLevel: 12,
      maxStockLevel: 45,
      location: "B-1-B",
      supplier: "Goodyear EMEA",
      supplierSku: "EF1A-225/40R18",
      lastRestocked: "2024-09-05",
    },
    pricing: {
      basePrice: 245.99,
      costPrice: 175.00,
      margin: 28.9,
      currency: "EUR",
      priceHistory: [
        { price: 245.99, date: "2024-06-01", reason: "Summer season pricing" }
      ],
      bulkPricing: [
        { minQuantity: 4, price: 229.99, discount: 6.5 }
      ]
    },
    salesData: {
      totalSold: 98,
      revenue: 24106.02,
      averageRating: 4.5,
      reviewCount: 43,
      viewCount: 1890,
      wishlistCount: 112
    },
    seo: {
      metaTitle: "Goodyear Eagle F1 Asymmetric 225/40R18 - Performance Tire",
      metaDescription: "Racing-inspired summer tire with asymmetric design for superior handling and wet grip performance.",
      keywords: ["goodyear", "eagle f1", "asymmetric", "225/40r18", "performance"],
      slug: "goodyear-eagle-f1-asymmetric-225-40r18"
    },
    tags: ["summer", "performance", "racing", "asymmetric"],
    relatedProducts: ["1", "4"],
    status: "active",
    featured: false,
    bestseller: false,
    newArrival: true,
    onSale: false,
    createdAt: "2024-06-01T10:00:00Z",
    updatedAt: "2024-09-20T14:15:00Z",
    publishedAt: "2024-06-01T11:00:00Z",
    warranty: "5 years manufacturer warranty",
    manufacturer: "Goodyear",
    countryOfOrigin: "Luxembourg",
    certifications: ["ECE R30", "DOT", "EU Tyre Label"]
  }
];

// Helper functions for working with size variants
export const getDefaultSizeVariant = (product: Product): SizeVariant | null => {
  return product.sizeVariants.find(variant => variant.isDefault) || product.sizeVariants[0] || null;
};

export const getPriceRange = (product: Product): { min: number; max: number } => {
  if (product.sizeVariants.length === 0) return { min: 0, max: 0 };
  
  const prices = product.sizeVariants.map(variant => 
    variant.pricing.salePrice || variant.pricing.basePrice
  );
  
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
};

export const getTotalStock = (product: Product): number => {
  return product.sizeVariants.reduce((total, variant) => 
    total + variant.inventory.availableQuantity, 0
  );
};

export const getAvailableSizes = (product: Product): string[] => {
  return product.sizeVariants
    .filter(variant => variant.inventory.availableQuantity > 0)
    .map(variant => variant.size.sizeDisplay);
};

// Mock API functions for development
export const productAPI = {
  async getProducts(filter: ProductFilter = {}): Promise<{ products: Product[]; total: number; stats: ProductStats }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredProducts = [...sampleProducts];
    
    // Apply filters
    if (filter.search) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(filter.search!.toLowerCase()) ||
        p.brand.toLowerCase().includes(filter.search!.toLowerCase())
      );
    }
    
    if (filter.category && filter.category !== 'all') {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase() === filter.category!.toLowerCase()
      );
    }
    
    if (filter.brand && filter.brand !== 'all') {
      filteredProducts = filteredProducts.filter(p => 
        p.brand.toLowerCase() === filter.brand!.toLowerCase()
      );
    }
    
    if (filter.status && filter.status !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.status === filter.status);
    }
    
    // Calculate stats based on size variants
    const allVariants = sampleProducts.flatMap(p => p.sizeVariants);
    const lowStockVariants = allVariants.filter(v => v.inventory.availableQuantity <= v.inventory.reorderLevel);
    const outOfStockVariants = allVariants.filter(v => v.inventory.availableQuantity === 0);
    
    const stats: ProductStats = {
      totalProducts: sampleProducts.length,
      activeProducts: sampleProducts.filter(p => p.status === 'active').length,
      inactiveProducts: sampleProducts.filter(p => p.status === 'inactive').length,
      lowStockProducts: lowStockVariants.length,
      outOfStockProducts: outOfStockVariants.length,
      featuredProducts: sampleProducts.filter(p => p.featured).length,
      newArrivals: sampleProducts.filter(p => p.newArrival).length,
      bestSellers: sampleProducts.filter(p => p.bestseller).length,
      totalValue: allVariants.reduce((sum, v) => sum + (v.pricing.basePrice * v.inventory.stockQuantity), 0),
      avgPrice: allVariants.reduce((sum, v) => sum + v.pricing.basePrice, 0) / allVariants.length
    };
    
    return {
      products: filteredProducts,
      total: filteredProducts.length,
      stats
    };
  },
  
  async getProduct(id: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return sampleProducts.find(p => p.id === id) || null;
  },
  
  async getSizeVariant(productId: string, variantId: string): Promise<SizeVariant | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const product = sampleProducts.find(p => p.id === productId);
    if (!product) return null;
    return product.sizeVariants.find(v => v.id === variantId) || null;
  },
  
  async createProduct(productData: ProductFormData): Promise<Product> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Note: This would need to be updated to handle the new structure
    // For now, creating a basic product with one size variant
    const newProduct: Product = {
      id: Math.random().toString(36).substring(7),
      name: productData.name,
      description: productData.description,
      shortDescription: productData.shortDescription,
      brand: productData.brand,
      category: productData.category,
      model: productData.model,
      features: productData.features,
      sizeVariants: [{
        id: `${Math.random().toString(36).substring(7)}-default`,
        size: {
          width: "225", // This would come from form
          aspectRatio: "45",
          rimDiameter: "17",
          sizeDisplay: "225/45R17"
        },
        specs: {
          loadIndex: "94",
          speedRating: "Y",
          treadDepth: "8.0",
          weight: "12.0",
          treadPattern: "Symmetric",
          sidewallConstruction: "Radial",
          maxPressure: "44"
        },
        inventory: productData.inventory,
        pricing: productData.pricing,
        salesData: { totalSold: 0, revenue: 0 },
        isDefault: true
      }],
      images: productData.images,
      thumbnailImage: productData.thumbnailImage,
      salesData: {
        totalSold: 0,
        revenue: 0,
        averageRating: 0,
        reviewCount: 0,
        viewCount: 0,
        wishlistCount: 0
      },
      seo: productData.seo,
      tags: productData.tags,
      relatedProducts: productData.relatedProducts,
      status: productData.status,
      featured: productData.featured,
      bestseller: productData.bestseller,
      newArrival: productData.newArrival,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: productData.publishedAt,
      warranty: productData.warranty,
      manufacturer: productData.manufacturer,
      countryOfOrigin: productData.countryOfOrigin,
      certifications: productData.certifications
    };
    sampleProducts.push(newProduct);
    return newProduct;
  },
  
  async updateProduct(id: string, updates: Partial<ProductFormData>): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = sampleProducts.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    sampleProducts[index] = {
      ...sampleProducts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return sampleProducts[index];
  },
  
  async deleteProduct(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = sampleProducts.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    sampleProducts.splice(index, 1);
    return true;
  }
};
