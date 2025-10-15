import { NextResponse } from "next/server";
import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db/config";
import { heroBanners } from "@/lib/db/schema";

// GET - Get active hero banners for public display
export async function GET() {
  try {
    const activeBanners = await db
      .select({
        id: heroBanners.id,
        title: heroBanners.title,
        subtitle: heroBanners.subtitle,
        description: heroBanners.description,
        badge: heroBanners.badge,
        discount: heroBanners.discount,
        cta: heroBanners.cta,
        ctaLink: heroBanners.ctaLink,
        image: heroBanners.image,
        gradient: heroBanners.gradient,
        bgGradient: heroBanners.bgGradient,
        sortOrder: heroBanners.sortOrder,
      })
      .from(heroBanners)
      .where(eq(heroBanners.isActive, true))
      .orderBy(asc(heroBanners.sortOrder));

    return NextResponse.json(activeBanners);
  } catch (error) {
    console.error("Failed to fetch hero banners:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero banners" },
      { status: 500 }
    );
  }
}
