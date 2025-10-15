import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { products, brands, categories } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const [product] = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        sku: products.sku,
        description: products.description,
        price: products.price,
        compareAtPrice: products.compareAtPrice,
        stockQuantity: products.stockQuantity,
        lowStockThreshold: products.lowStockThreshold,
        isActive: products.isActive,
        isFeatured: products.isFeatured,
        images: products.images,
        categoryId: products.categoryId,
        brandId: products.brandId,
        size: products.size,
        speedRating: products.speedRating,
        loadIndex: products.loadIndex,
        seasonType: products.season,
        fuelEfficiency: products.fuelEfficiency,
        wetGrip: products.wetGrip,
        noiseLevel: products.noiseLevel,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        brand: {
          id: brands.id,
          name: brands.name,
          slug: brands.slug,
        },
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        },
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.slug, slug));

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch product',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    // Check if product exists
    const [existingProduct] = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, slug));

    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product not found',
        },
        { status: 404 }
      );
    }

    // Update product by ID (more reliable)
    const [updatedProduct] = await db
      .update(products)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(products.id, existingProduct.id))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully',
    });
  } catch (error) {
    console.error('Error updating product:', error);
    
    // Handle unique constraint errors
    if (error instanceof Error && error.message.includes('unique')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product with this SKU or slug already exists',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update product',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Check if product exists
    const [existingProduct] = await db
      .select({ id: products.id, name: products.name })
      .from(products)
      .where(eq(products.slug, slug));

    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product not found',
        },
        { status: 404 }
      );
    }

    // Delete product by ID (more reliable)
    await db.delete(products).where(eq(products.id, existingProduct.id));

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete product',
      },
      { status: 500 }
    );
  }
}
