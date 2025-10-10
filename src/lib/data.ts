// Tire and brand data for the BandenCentrale website

export interface TireData {
  id: number;
  name: string;
  brand: string;
  model: string;
  price: number;
  originalPrice?: number;
  images: Array<{ src: string; alt: string }>;
  rating: number;
  reviews: number;
  size: string;
  season: "All-Season" | "Summer" | "Winter";
  speedRating: string;
  loadIndex: string;
  features: string[];
  specifications: {
    pattern: string;
    construction: string;
    sidewallType: string;
    runFlat: boolean;
    studded: boolean;
    reinforced: boolean;
  };
  description: string;
  warranty: string;
  category: string;
  inStock: boolean;
  stockCount: number;
  badge?: string;
  badgeColor?: string;
}

export interface BrandData {
  id: number;
  name: string;
  logo: string;
  description: string;
  founded: string;
  country: string;
  specialties: string[];
  features: string[];
  popularModels: string[];
  rating: number;
  color: string;
  website?: string;
  headquarters?: string;
}

export const brands: BrandData[] = [
  {
    id: 1,
    name: "Michelin",
    logo: "/api/placeholder/200/80",
    description: "World leader in tire technology with over 130 years of innovation, known for premium quality and sustainable mobility solutions.",
    founded: "1889",
    country: "France",
    headquarters: "Clermont-Ferrand, France",
    specialties: ["Passenger Cars", "Performance", "Commercial", "Motorsport"],
    features: ["MICHELIN® Total Performance", "Green Technology", "Long-lasting Durability", "Fuel Efficiency"],
    popularModels: ["Pilot Sport 4", "Primacy 4", "CrossClimate 2", "Energy Saver"],
    rating: 4.9,
    color: "bg-blue-600",
    website: "www.michelin.com"
  },
  {
    id: 2,
    name: "Continental",
    logo: "/api/placeholder/200/80",
    description: "German engineering excellence with cutting-edge automotive technology and innovative tire solutions for all vehicle types.",
    founded: "1871",
    country: "Germany",
    headquarters: "Hanover, Germany",
    specialties: ["Performance", "Luxury", "Technology", "Safety"],
    features: ["ContiSeal Technology", "EcoPlus Technology", "Silent Ride", "Advanced Grip"],
    popularModels: ["SportContact 6", "PremiumContact 6", "WinterContact TS 860", "EcoContact 6"],
    rating: 4.8,
    color: "bg-orange-500",
    website: "www.continental-tires.com"
  },
  {
    id: 3,
    name: "Bridgestone",
    logo: "/api/placeholder/200/80", 
    description: "Japanese precision and reliability in tire manufacturing, committed to providing solutions for sustainable mobility.",
    founded: "1931",
    country: "Japan",
    headquarters: "Tokyo, Japan",
    specialties: ["All-Season", "Winter", "Truck", "Commercial"],
    features: ["NanoPro-Tech", "Fuel Efficiency", "Enhanced Safety", "Weather Versatility"],
    popularModels: ["Potenza Sport", "Turanza T005", "Blizzak LM005", "Ecopia EP500"],
    rating: 4.7,
    color: "bg-red-600",
    website: "www.bridgestone.com"
  },
  {
    id: 4,
    name: "Goodyear",
    logo: "/api/placeholder/200/80",
    description: "American innovation with a heritage of performance and durability, delivering mobility solutions for over 125 years.",
    founded: "1898",
    country: "USA",
    headquarters: "Akron, Ohio, USA",
    specialties: ["SUV", "Truck", "Commercial", "All-Terrain"],
    features: ["SoundComfort Technology", "FuelMax Technology", "DuraWall Technology", "Weather Reactive"],
    popularModels: ["Eagle F1 Asymmetric 5", "EfficientGrip Performance 2", "UltraGrip Performance", "Wrangler All-Terrain"],
    rating: 4.6,
    color: "bg-yellow-500",
    website: "www.goodyear.com"
  },
  {
    id: 5,
    name: "Pirelli",
    logo: "/api/placeholder/200/80",
    description: "Italian luxury and performance with motorsport heritage, providing high-performance tires for premium vehicles.",
    founded: "1872",
    country: "Italy",
    headquarters: "Milan, Italy",
    specialties: ["High Performance", "Luxury", "Motorsport", "Premium"],
    features: ["P Zero Technology", "Noise Cancelling System", "Cyber Technology", "Run Flat Technology"],
    popularModels: ["P Zero", "Cinturato P7", "Scorpion Verde", "Winter Sottozero 3"],
    rating: 4.8,
    color: "bg-black",
    website: "www.pirelli.com"
  },
  {
    id: 6,
    name: "Hankook",
    logo: "/api/placeholder/200/80",
    description: "Korean innovation offering excellent value and quality, rapidly growing global tire manufacturer with advanced technology.",
    founded: "1941",
    country: "South Korea",
    headquarters: "Seoul, South Korea",
    specialties: ["Value", "Performance", "All-Season", "Technology"],
    features: ["Kontrol Technology", "Eco-Friendly Compounds", "Advanced Silica", "Optimized Performance"],
    popularModels: ["Ventus S1 evo3", "Kinergy 4S2", "Winter i*cept evo3", "DynaPro AT2"],
    rating: 4.5,
    color: "bg-green-600",
    website: "www.hankooktire.com"
  },
  {
    id: 7,
    name: "Yokohama",
    logo: "/api/placeholder/200/80",
    description: "Japanese tire manufacturer with motorsport DNA, focusing on high-performance and environmentally friendly tire solutions.",
    founded: "1917",
    country: "Japan",
    headquarters: "Tokyo, Japan",
    specialties: ["Motorsport", "Performance", "Eco-Friendly", "Technology"],
    features: ["BluEarth Technology", "ADVAN Racing Heritage", "Orange Oil Technology", "Fuel Efficient"],
    popularModels: ["ADVAN Sport V105", "BluEarth-GT AE51", "GEOLANDAR A/T G015", "WinterMAXX WM03"],
    rating: 4.4,
    color: "bg-indigo-600",
    website: "www.yokohamatire.com"
  },
  {
    id: 8,
    name: "Dunlop",
    logo: "/api/placeholder/200/80",
    description: "British heritage brand with innovative tire technology, part of Goodyear group, known for motorsport excellence.",
    founded: "1888",
    country: "United Kingdom",
    headquarters: "Birmingham, UK",
    specialties: ["Motorsport", "Performance", "Touring", "Sport"],
    features: ["Sport Maxx Technology", "MultiTread", "Touch Technology", "Grip Enhancement"],
    popularModels: ["Sport Maxx RT 2", "SP Sport FastResponse", "Winter Sport 5", "Grandtrek AT20"],
    rating: 4.3,
    color: "bg-gray-700",
    website: "www.dunlop.com"
  }
];

export const tires: TireData[] = [
  {
    id: 1,
    name: "Pilot Sport 4",
    brand: "Michelin",
    model: "Pilot Sport 4",
    price: 159.99,
    originalPrice: 189.99,
    images: [
      { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop", alt: "Michelin Pilot Sport 4 main view" },
      { src: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=600&fit=crop", alt: "Michelin Pilot Sport 4 side view" },
      { src: "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=600&h=600&fit=crop", alt: "Michelin Pilot Sport 4 tread pattern" }
    ],
    rating: 4.8,
    reviews: 234,
    size: "205/55R16",
    season: "Summer",
    speedRating: "Y",
    loadIndex: "91",
    features: [
      "Dynamic Response Technology for precise steering",
      "Track Longevity for extended wear",
      "Functional Grooving for wet traction",
      "Bi-Compound Technology"
    ],
    specifications: {
      pattern: "Asymmetric",
      construction: "Radial",
      sidewallType: "Standard",
      runFlat: false,
      studded: false,
      reinforced: false
    },
    description: "The Michelin Pilot Sport 4 is designed for drivers who demand exceptional performance and handling. Featuring Dynamic Response Technology and Track Longevity compound, it delivers precise steering response and extended tread life without compromising on grip.",
    warranty: "6 years or 55,000 miles",
    category: "Performance",
    inStock: true,
    stockCount: 12,
    badge: "Best Seller",
    badgeColor: "bg-green-500"
  },
  {
    id: 2,
    name: "SportContact 6",
    brand: "Continental",
    model: "SportContact 6",
    price: 149.99,
    originalPrice: 179.99,
    images: [
      { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop", alt: "Continental SportContact 6" },
      { src: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=600&fit=crop", alt: "Continental SportContact 6 side view" }
    ],
    rating: 4.7,
    reviews: 189,
    size: "205/55R16",
    season: "Summer",
    speedRating: "Y",
    loadIndex: "94",
    features: [
      "BlackChili compound for superior grip",
      "Asymmetric tread pattern",
      "Optimized contact patch",
      "Enhanced wet performance"
    ],
    specifications: {
      pattern: "Asymmetric",
      construction: "Radial",
      sidewallType: "Standard",
      runFlat: false,
      studded: false,
      reinforced: false
    },
    description: "Continental SportContact 6 delivers maximum performance with BlackChili compound technology and optimized tread design for sports cars and high-performance vehicles.",
    warranty: "6 years or 50,000 miles",
    category: "Performance",
    inStock: true,
    stockCount: 8,
    badge: "Performance",
    badgeColor: "bg-red-500"
  },
  {
    id: 3,
    name: "Blizzak LM005",
    brand: "Bridgestone",
    model: "Blizzak LM005",
    price: 119.99,
    images: [
      { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop", alt: "Bridgestone Blizzak LM005" }
    ],
    rating: 4.7,
    reviews: 156,
    size: "205/55R16",
    season: "Winter",
    speedRating: "T",
    loadIndex: "91",
    features: [
      "NanoPro-Tech compound",
      "Enhanced ice grip",
      "Snow performance technology",
      "Improved fuel efficiency"
    ],
    specifications: {
      pattern: "Directional",
      construction: "Radial",
      sidewallType: "Standard",
      runFlat: false,
      studded: false,
      reinforced: false
    },
    description: "Bridgestone Blizzak LM005 provides exceptional winter performance with advanced NanoPro-Tech compound for superior grip on ice and snow.",
    warranty: "6 years or 40,000 miles",
    category: "Winter",
    inStock: true,
    stockCount: 15,
    badge: "Winter Approved",
    badgeColor: "bg-blue-500"
  },
  {
    id: 4,
    name: "Eagle F1 Asymmetric 5",
    brand: "Goodyear",
    model: "Eagle F1 Asymmetric 5",
    price: 135.99,
    originalPrice: 159.99,
    images: [
      { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop", alt: "Goodyear Eagle F1 Asymmetric 5" }
    ],
    rating: 4.6,
    reviews: 198,
    size: "205/55R16",
    season: "Summer",
    speedRating: "Y",
    loadIndex: "94",
    features: [
      "Asymmetric tread design",
      "Enhanced cornering performance",
      "Shorter braking distances",
      "Improved wet grip"
    ],
    specifications: {
      pattern: "Asymmetric",
      construction: "Radial",
      sidewallType: "Standard",
      runFlat: false,
      studded: false,
      reinforced: false
    },
    description: "Goodyear Eagle F1 Asymmetric 5 combines performance and comfort with advanced asymmetric tread technology for premium driving experience.",
    warranty: "6 years or 45,000 miles",
    category: "Performance",
    inStock: true,
    stockCount: 10,
    badge: "Premium",
    badgeColor: "bg-purple-500"
  },
  {
    id: 5,
    name: "P Zero",
    brand: "Pirelli",
    model: "P Zero",
    price: 179.99,
    images: [
      { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop", alt: "Pirelli P Zero" }
    ],
    rating: 4.9,
    reviews: 156,
    size: "205/55R16",
    season: "Summer",
    speedRating: "Y",
    loadIndex: "94",
    features: [
      "Motorsport-derived technology",
      "Asymmetric tread pattern",
      "Superior handling precision",
      "Reduced road noise"
    ],
    specifications: {
      pattern: "Asymmetric",
      construction: "Radial",
      sidewallType: "Standard",
      runFlat: false,
      studded: false,
      reinforced: false
    },
    description: "Pirelli P Zero represents the pinnacle of tire technology, combining motorsport heritage with street performance for luxury and sports cars.",
    warranty: "6 years or 40,000 miles",
    category: "Ultra High Performance",
    inStock: true,
    stockCount: 6,
    badge: "Luxury",
    badgeColor: "bg-black"
  },
  {
    id: 6,
    name: "Kinergy 4S2",
    brand: "Hankook",
    model: "Kinergy 4S2",
    price: 89.99,
    originalPrice: 109.99,
    images: [
      { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop", alt: "Hankook Kinergy 4S2" }
    ],
    rating: 4.5,
    reviews: 312,
    size: "205/55R16",
    season: "All-Season",
    speedRating: "H",
    loadIndex: "91",
    features: [
      "All-season versatility",
      "Excellent value proposition",
      "Enhanced fuel efficiency",
      "Comfortable ride quality"
    ],
    specifications: {
      pattern: "Symmetric",
      construction: "Radial",
      sidewallType: "Standard",
      runFlat: false,
      studded: false,
      reinforced: false
    },
    description: "Hankook Kinergy 4S2 offers exceptional value with all-season performance, combining comfort, efficiency, and reliable traction in various weather conditions.",
    warranty: "6 years or 60,000 miles",
    category: "All-Season",
    inStock: true,
    stockCount: 20,
    badge: "Best Value",
    badgeColor: "bg-green-600"
  },
  {
    id: 7,
    name: "CrossClimate 2",
    brand: "Michelin",
    model: "CrossClimate 2",
    price: 145.99,
    images: [
      { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop", alt: "Michelin CrossClimate 2" }
    ],
    rating: 4.8,
    reviews: 287,
    size: "205/55R16",
    season: "All-Season",
    speedRating: "V",
    loadIndex: "91",
    features: [
      "Summer performance + winter safety",
      "EverGrip technology",
      "Long-lasting tread life",
      "Excellent wet braking"
    ],
    specifications: {
      pattern: "Directional",
      construction: "Radial",
      sidewallType: "Standard",
      runFlat: false,
      studded: false,
      reinforced: false
    },
    description: "Michelin CrossClimate 2 revolutionizes all-season performance, delivering summer tire performance with reliable winter safety and exceptional longevity.",
    warranty: "6 years or 60,000 miles",
    category: "All-Season Plus",
    inStock: true,
    stockCount: 14,
    badge: "All-Season Champion",
    badgeColor: "bg-blue-600"
  },
  {
    id: 8,
    name: "PremiumContact 6",
    brand: "Continental",
    model: "PremiumContact 6",
    price: 125.99,
    images: [
      { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop", alt: "Continental PremiumContact 6" }
    ],
    rating: 4.6,
    reviews: 203,
    size: "205/55R16",
    season: "Summer",
    speedRating: "V",
    loadIndex: "91",
    features: [
      "Balanced performance",
      "Comfortable ride",
      "Low rolling resistance",
      "Good wet performance"
    ],
    specifications: {
      pattern: "Symmetric",
      construction: "Radial",
      sidewallType: "Standard",
      runFlat: false,
      studded: false,
      reinforced: false
    },
    description: "Continental PremiumContact 6 provides balanced performance for everyday driving with comfort, efficiency, and reliable handling characteristics.",
    warranty: "6 years or 50,000 miles",
    category: "Touring",
    inStock: true,
    stockCount: 18,
    badge: "Comfort",
    badgeColor: "bg-orange-500"
  }
];

// Helper functions
export const getTireById = (id: number): TireData | undefined => {
  return tires.find(tire => tire.id === id);
};

export const getBrandById = (id: number): BrandData | undefined => {
  return brands.find(brand => brand.id === id);
};

export const getTiresByBrand = (brandName: string): TireData[] => {
  return tires.filter(tire => tire.brand.toLowerCase() === brandName.toLowerCase());
};

export const getTiresBySeason = (season: "All-Season" | "Summer" | "Winter"): TireData[] => {
  return tires.filter(tire => tire.season === season);
};

export const getTiresByCategory = (category: string): TireData[] => {
  return tires.filter(tire => tire.category.toLowerCase() === category.toLowerCase());
};

export const searchTires = (query: string): TireData[] => {
  const searchTerm = query.toLowerCase();
  return tires.filter(tire => 
    tire.name.toLowerCase().includes(searchTerm) ||
    tire.brand.toLowerCase().includes(searchTerm) ||
    tire.model.toLowerCase().includes(searchTerm) ||
    tire.category.toLowerCase().includes(searchTerm)
  );
};
