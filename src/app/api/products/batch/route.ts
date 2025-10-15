import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/config";
import { products, brands, categories } from "@/lib/db/schema";
import { eq, inArray, sql } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { ids } = await request.json();
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    // Get products with brands and categories
    const productsData = await db
      .select({
        id: products.id,
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
      .where(inArray(products.id, ids));

    return NextResponse.json({
      success: true,
      data: productsData
    });

  } catch (error) {
    console.error("Error fetching products by IDs:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
