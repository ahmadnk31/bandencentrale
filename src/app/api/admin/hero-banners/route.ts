import { NextRequest, NextResponse } from "next/server";
import { withAdmin } from '@/lib/auth/admin-middleware';
import { eq, desc, asc } from "drizzle-orm";

import { db } from "@/lib/db/config";

import { heroBanners } from "@/lib/db/schema";

import { auth } from "@/lib/auth/config";


// GET - List all hero banners
async function getHandler(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "sortOrder";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const active = searchParams.get("active");

    const offset = (page - 1) * limit;

    let whereCondition;
    if (active !== null && active !== undefined) {
      whereCondition = eq(heroBanners.isActive, active === "true");
    }

    // Define allowed sort columns to prevent dynamic property access issues
    const allowedSortColumns = {
      sortOrder: heroBanners.sortOrder,
      title: heroBanners.title,
      createdAt: heroBanners.createdAt,
      updatedAt: heroBanners.updatedAt,
      isActive: heroBanners.isActive,
    };

    const sortColumn = allowedSortColumns[sortBy as keyof typeof allowedSortColumns] || heroBanners.sortOrder;
    const orderBy = sortOrder === "desc" ? desc(sortColumn) : asc(sortColumn);

    const bannersQuery = db
      .select()
      .from(heroBanners)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    if (whereCondition) {
      bannersQuery.where(whereCondition);
    }

    const banners = await bannersQuery;

    // Get total count
    const totalQuery = db
      .select({ count: heroBanners.id })
      .from(heroBanners);

    if (whereCondition) {
      totalQuery.where(whereCondition);
    }

    const [{ count: total }] = await totalQuery;

    return NextResponse.json({
      banners,
      pagination: {
        page,
        limit,
        total: Number(total),
        totalPages: Math.ceil(Number(total) / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch hero banners:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero banners" },
      { status: 500 }
    );
  }
}

// POST - Create new hero banner
async function postHandler(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      subtitle,
      description,
      badge,
      discount,
      cta,
      ctaLink,
      image,
      gradient,
      bgGradient,
      isActive = true,
      sortOrder = 0,
    } = body;

    if (!title || !cta || !ctaLink) {
      return NextResponse.json(
        { error: "Title, CTA, and CTA link are required" },
        { status: 400 }
      );
    }

    const [newBanner] = await db
      .insert(heroBanners)
      .values({
        title,
        subtitle,
        description,
        badge,
        discount,
        cta,
        ctaLink,
        image,
        gradient: gradient || "from-orange-500 to-amber-500",
        bgGradient: bgGradient || "from-black/60 to-black/40",
        isActive,
        sortOrder,
        createdBy: session.user.id,
      })
      .returning();

    return NextResponse.json(newBanner, { status: 201 });
  } catch (error) {
    console.error("Failed to create hero banner:", error);
    return NextResponse.json(
      { error: "Failed to create hero banner" },
      { status: 500 }
    );
  }
}


// Apply admin middleware to all routes
export const GET = withAdmin(getHandler);
export const POST = withAdmin(postHandler);
