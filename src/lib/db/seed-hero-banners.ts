import { db } from "./config";
import { heroBanners } from "./schema";

export async function seedHeroBanners() {
  try {
    console.log("🌱 Seeding hero banners...");

    // Check if banners already exist
    const existingBanners = await db.select().from(heroBanners).limit(1);
    
    if (existingBanners.length > 0) {
      console.log("✅ Hero banners already seeded");
      return;
    }

    const defaultBanners = [
      {
        title: "Premium Winter Tires",
        subtitle: "Get Ready for Winter",
        description: "Superior grip and safety for harsh winter conditions. Professional installation included with every purchase.",
        badge: "Limited Time",
        discount: "Up to 40% OFF",
        cta: "Shop Winter Tires",
        ctaLink: "/tires?season=winter",
        image: "/images/winter-tires.jpg",
        gradient: "from-blue-500 to-purple-600",
        bgGradient: "from-blue-900/60 to-purple-900/40",
        isActive: true,
        sortOrder: 0,
      },
      {
        title: "Expert Tire Services",
        subtitle: "Professional Installation",
        description: "Complete tire services including mounting, balancing, and alignment. Book your appointment today.",
        badge: "Free Installation",
        discount: "25% OFF Services",
        cta: "Book Service",
        ctaLink: "/services",
        image: "/images/tire-service.jpg",
        gradient: "from-green-500 to-emerald-600",
        bgGradient: "from-green-900/60 to-emerald-900/40",
        isActive: true,
        sortOrder: 1,
      },
      {
        title: "Summer Tire Collection",
        subtitle: "Performance & Comfort",
        description: "High-performance summer tires for optimal driving experience. Premium brands at competitive prices.",
        badge: "New Arrivals",
        discount: "Buy 3 Get 1 Free",
        cta: "Explore Collection",
        ctaLink: "/tires?season=summer",
        image: "/images/summer-tires.jpg",
        gradient: "from-orange-500 to-red-500",
        bgGradient: "from-orange-900/60 to-red-900/40",
        isActive: true,
        sortOrder: 2,
      },
      {
        title: "Premium Brand Partners",
        subtitle: "Michelin, Continental & More",
        description: "Authorized dealer of world's leading tire brands. Quality guaranteed with manufacturer warranty.",
        badge: "Authorized Dealer",
        discount: "Up to 30% OFF",
        cta: "View Brands",
        ctaLink: "/brands",
        image: "/images/tire-brands.jpg",
        gradient: "from-purple-500 to-pink-500",
        bgGradient: "from-purple-900/60 to-pink-900/40",
        isActive: true,
        sortOrder: 3,
      },
    ];

    await db.insert(heroBanners).values(defaultBanners);

    console.log(`✅ Seeded ${defaultBanners.length} hero banners`);
  } catch (error) {
    console.error("❌ Error seeding hero banners:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedHeroBanners()
    .then(() => {
      console.log("🎉 Hero banners seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Hero banners seeding failed:", error);
      process.exit(1);
    });
}
