import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/config";
import { products, brands, categories } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: productSlug } = await params;

    // Validate slug format (should be a valid URL slug)
    if (!productSlug || productSlug.trim() === '') {
      return NextResponse.json(
        { error: "Invalid product slug" },
        { status: 400 }
      );
    }

    // Get product with brand and category information
    const productData = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        shortDescription: products.shortDescription,
        sku: products.sku,
        price: products.price,
        compareAtPrice: products.compareAtPrice,
        images: products.images,
        size: products.size,
        width: products.width,
        aspectRatio: products.aspectRatio,
        rimDiameter: products.rimDiameter,
        season: products.season,
        tireType: products.tireType,
        speedRating: products.speedRating,
        loadIndex: products.loadIndex,
        runFlat: products.runFlat,
        fuelEfficiency: products.fuelEfficiency,
        wetGrip: products.wetGrip,
        noiseLevel: products.noiseLevel,
        features: products.features,
        specifications: products.specifications,
        weight: products.weight,
        dimensions: products.dimensions,
        inStock: sql<boolean>`${products.stockQuantity} > 0`,
        stockQuantity: products.stockQuantity,
        lowStockThreshold: products.lowStockThreshold,
        isFeatured: products.isFeatured,
        metaTitle: products.metaTitle,
        metaDescription: products.metaDescription,
        publishedAt: products.publishedAt,
        brand: {
          id: brands.id,
          name: brands.name,
          slug: brands.slug,
          logo: brands.logo,
          website: brands.website,
          countryOfOrigin: brands.countryOfOrigin
        },
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
          image: categories.image
        },
        createdAt: products.createdAt,
        updatedAt: products.updatedAt
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(
        and(
          eq(products.slug, productSlug),
          eq(products.isActive, true)
        )
      )
      .limit(1);

    if (productData.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: productData[0]
    });

  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
