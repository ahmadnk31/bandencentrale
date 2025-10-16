import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { serviceCategories } from '@/lib/db/schema';
import { eq, ilike, and, or, desc, asc, count } from 'drizzle-orm';
import { withAdmin } from '@/lib/auth/admin-middleware';

async function getServiceCategories(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const sortBy = searchParams.get('sortBy') || 'sortOrder';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Build where conditions
    const conditions = [];
    
    if (search) {
      conditions.push(
        or(
          ilike(serviceCategories.name, `%${search}%`),
          ilike(serviceCategories.description, `%${search}%`)
        )
      );
    }

    if (status !== 'all') {
      conditions.push(eq(serviceCategories.isActive, status === 'active'));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const [{ totalCount }] = await db
      .select({ totalCount: count() })
      .from(serviceCategories)
      .where(whereClause);

    // Build order by clause
    let orderByClause;
    switch (sortBy) {
      case 'name':
        orderByClause = sortOrder === 'asc' ? asc(serviceCategories.name) : desc(serviceCategories.name);
        break;
      case 'sortOrder':
        orderByClause = sortOrder === 'asc' ? asc(serviceCategories.sortOrder) : desc(serviceCategories.sortOrder);
        break;
      case 'createdAt':
        orderByClause = sortOrder === 'asc' ? asc(serviceCategories.createdAt) : desc(serviceCategories.createdAt);
        break;
      default:
        orderByClause = sortOrder === 'asc' ? asc(serviceCategories.sortOrder) : desc(serviceCategories.sortOrder);
    }

    // Get service categories with pagination
    const categoriesList = await db
      .select({
        id: serviceCategories.id,
        name: serviceCategories.name,
        slug: serviceCategories.slug,
        description: serviceCategories.description,
        icon: serviceCategories.icon,
        isActive: serviceCategories.isActive,
        sortOrder: serviceCategories.sortOrder,
        createdAt: serviceCategories.createdAt,
        updatedAt: serviceCategories.updatedAt,
      })
      .from(serviceCategories)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset((page - 1) * limit);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: categoriesList,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching service categories:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch service categories',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function createServiceCategory(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name'];
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
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // Create service category
    const [newCategory] = await db
      .insert(serviceCategories)
      .values({
        name: body.name,
        slug,
        description: body.description || null,
        icon: body.icon || null,
        isActive: body.isActive ?? true,
        sortOrder: body.sortOrder || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newCategory,
      message: 'Service category created successfully',
    });
  } catch (error) {
    console.error('Error creating service category:', error);
    
    // Handle unique constraint errors
    if (error instanceof Error && error.message.includes('unique')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Service category with this name or slug already exists',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create service category',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Apply admin middleware to both GET and POST routes
export const GET = withAdmin(getServiceCategories);
export const POST = withAdmin(createServiceCategory);
