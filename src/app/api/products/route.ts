import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/config";
import { products, brands, categories } from "@/lib/db/schema";
import { eq, and, or, desc, asc, gte, lte, ilike, sql, count } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const brand = searchParams.get("brand") || "";
    const category = searchParams.get("category") || "";
    const season = searchParams.get("season") || "";
    const size = searchParams.get("size") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const inStock = searchParams.get("inStock") === "true";

    const offset = (page - 1) * limit;

    // Build filters
    const filters = [];
    
    // Only show active products
    filters.push(eq(products.isActive, true));

    if (search) {
      filters.push(
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.description, `%${search}%`)
        )
      );
    }

    if (brand) {
      const brandRecord = await db.select().from(brands).where(eq(brands.name, brand)).limit(1);
      if (brandRecord.length > 0) {
        filters.push(eq(products.brandId, brandRecord[0].id));
      }
    }

    if (category) {
      const categoryRecord = await db.select().from(categories).where(eq(categories.name, category)).limit(1);
      if (categoryRecord.length > 0) {
        filters.push(eq(products.categoryId, categoryRecord[0].id));
      }
    }

    if (season) {
      filters.push(eq(products.season, season));
    }

    if (size) {
      filters.push(eq(products.size, size));
    }

    if (minPrice) {
      filters.push(gte(products.price, minPrice));
    }

    if (maxPrice) {
      filters.push(lte(products.price, maxPrice));
    }

    if (inStock) {
      filters.push(gte(products.stockQuantity, 1));
    }

    // Build sort order
    let orderByClause;
    const sortColumn = sortBy === "price" ? products.price : products.name;
    orderByClause = sortOrder === "desc" ? desc(sortColumn) : asc(sortColumn);

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: count() })
      .from(products)
      .where(filters.length > 0 ? and(...filters) : undefined);

    const totalCount = totalCountResult[0]?.count || 0;

    // Get products with brands and categories
    const productsData = await db
      .select({
        id: products.id,
        slug: products.slug,
        name: products.name,
        description: products.description,
        shortDescription: products.shortDescription,
        sku: products.sku,
        price: products.price,
        compareAtPrice: products.compareAtPrice,
        images: products.images,
        size: products.size,
        season: products.season,
        speedRating: products.speedRating,
        loadIndex: products.loadIndex,
        runFlat: products.runFlat,
        features: products.features,
        specifications: products.specifications,
        inStock: sql<boolean>`${products.stockQuantity} > 0`,
        stockQuantity: products.stockQuantity,
        isFeatured: products.isFeatured,
        brand: brands.name,
        brandLogo: brands.logo,
        category: categories.name,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(filters.length > 0 ? and(...filters) : undefined)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      success: true,
      data: productsData,
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
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
