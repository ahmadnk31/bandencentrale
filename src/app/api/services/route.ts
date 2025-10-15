import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/config";
import { services, serviceCategories } from "@/lib/db/schema";
import { eq, and, or, desc, asc, ilike, count } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const featured = searchParams.get("featured") === "true";

    const offset = (page - 1) * limit;

    // Build filters
    const filters = [];
    
    // Only show active services
    filters.push(eq(services.isActive, true));

    if (search) {
      filters.push(
        or(
          ilike(services.name, `%${search}%`),
          ilike(services.description, `%${search}%`)
        )
      );
    }

    if (category) {
      const categoryRecord = await db.select().from(serviceCategories).where(eq(serviceCategories.name, category)).limit(1);
      if (categoryRecord.length > 0) {
        filters.push(eq(services.categoryId, categoryRecord[0].id));
      }
    }

    if (featured) {
      filters.push(eq(services.isFeatured, true));
    }

    // Build sort order
    let orderByClause;
    const sortColumn = sortBy === "price" ? services.basePrice : services.name;
    orderByClause = sortOrder === "desc" ? desc(sortColumn) : asc(sortColumn);

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: count() })
      .from(services)
      .where(filters.length > 0 ? and(...filters) : undefined);

    const totalCount = totalCountResult[0]?.count || 0;

    // Get services with categories
    const servicesData = await db
      .select({
        id: services.id,
        name: services.name,
        slug: services.slug,
        description: services.description,
        shortDescription: services.shortDescription,
        basePrice: services.basePrice,
        hourlyRate: services.hourlyRate,
        estimatedDuration: services.estimatedDuration,
        requiresAppointment: services.requiresAppointment,
        availableOnline: services.availableOnline,
        features: services.features,
        requirements: services.requirements,
        included: services.included,
        warranty: services.warranty,
        isFeatured: services.isFeatured,
        category: serviceCategories.name,
        categoryIcon: serviceCategories.icon,
        createdAt: services.createdAt,
        updatedAt: services.updatedAt
      })
      .from(services)
      .leftJoin(serviceCategories, eq(services.categoryId, serviceCategories.id))
      .where(filters.length > 0 ? and(...filters) : undefined)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      success: true,
      data: servicesData,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPreviousPage: page > 1
      }
    });

  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
