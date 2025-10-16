import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { products, brands, categories } from '@/lib/db/schema';
import { eq, ilike, and, or, desc, asc, count } from 'drizzle-orm';
import { withAdmin } from '@/lib/auth/admin-middleware';

async function getProducts(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const category = searchParams.get('category') || 'all';
    const brand = searchParams.get('brand') || 'all';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where conditions
    const conditions = [];
    
    if (search) {
      conditions.push(
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.sku, `%${search}%`),
          ilike(products.description, `%${search}%`)
        )
      );
    }

    if (status !== 'all') {
      conditions.push(eq(products.isActive, status === 'active'));
    }

    if (category !== 'all') {
      conditions.push(eq(products.categoryId, category));
    }

    if (brand !== 'all') {
      conditions.push(eq(products.brandId, brand));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const [{ totalCount }] = await db
      .select({ totalCount: count() })
      .from(products)
      .where(whereClause);

    // Build order by clause
    let orderByClause;
    switch (sortBy) {
      case 'name':
        orderByClause = sortOrder === 'asc' ? asc(products.name) : desc(products.name);
        break;
      case 'price':
        orderByClause = sortOrder === 'asc' ? asc(products.price) : desc(products.price);
        break;
      case 'stockQuantity':
        orderByClause = sortOrder === 'asc' ? asc(products.stockQuantity) : desc(products.stockQuantity);
        break;
      case 'createdAt':
        orderByClause = sortOrder === 'asc' ? asc(products.createdAt) : desc(products.createdAt);
        break;
      default:
        orderByClause = sortOrder === 'asc' ? asc(products.createdAt) : desc(products.createdAt);
    }

    // Get products with pagination
    const productList = await db
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
        season: products.season,
        tireType: products.tireType,
        runFlat: products.runFlat,
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
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset((page - 1) * limit);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: productList,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch products',
      },
      { status: 500 }
    );
  }
}

async function createProduct(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'price', 'categoryId', 'brandId'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            message: `${field} is required`,
          },
          { status: 400 }
        );
      }
    }

    // Generate slug from name if not provided
    if (!body.slug) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    // Create product
    const [newProduct] = await db
      .insert(products)
      .values({
        ...body,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Product created successfully',
    });
  } catch (error) {
    console.error('Error creating product:', error);
    
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
        message: 'Failed to create product',
      },
      { status: 500 }
    );
  }
}

// Apply admin middleware to both GET and POST routes
export const GET = withAdmin(getProducts);
export const POST = withAdmin(createProduct);
