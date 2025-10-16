import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/lib/auth/admin-middleware';
import { db } from '@/lib/db/config';

import { services } from '@/lib/db/schema';

import { eq, and, ilike, count, desc, asc } from 'drizzle-orm';

async function getHandler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const category = searchParams.get('category') || '';
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Build where conditions
    const conditions = [];
    
    if (search) {
      conditions.push(ilike(services.name, `%${search}%`));
    }
    
    if (status === 'active') {
      conditions.push(eq(services.isActive, true));
    } else if (status === 'inactive') {
      conditions.push(eq(services.isActive, false));
    }
    
    if (category && category !== 'all') {
      conditions.push(eq(services.categoryId, category));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const totalResult = await db
      .select({ count: count() })
      .from(services)
      .where(whereClause);
    
    const total = totalResult[0]?.count || 0;

    // Map sort fields
    const sortFieldMap: Record<string, any> = {
      'name': services.name,
      'basePrice': services.basePrice,
      'estimatedDuration': services.estimatedDuration,
      'createdAt': services.createdAt,
      'updatedAt': services.updatedAt,
    };

    const sortField = sortFieldMap[sortBy] || services.name;

    // Get services
    const servicesList = await db
      .select()
      .from(services)
      .where(whereClause)
      .orderBy(sortOrder === 'desc' ? desc(sortField) : asc(sortField))
      .limit(limit)
      .offset((page - 1) * limit);

    return NextResponse.json({
      success: true,
      data: servicesList,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch services',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function postHandler(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.slug) {
      return NextResponse.json(
        {
          success: false,
          message: 'Name and slug are required',
        },
        { status: 400 }
      );
    }

    // Create service
    const [service] = await db
      .insert(services)
      .values({
        name: body.name,
        slug: body.slug,
        description: body.description,
        shortDescription: body.shortDescription,
        categoryId: body.categoryId || null,
        basePrice: body.basePrice || '0',
        hourlyRate: body.hourlyRate || null,
        estimatedDuration: body.estimatedDuration || 60,
        requiresAppointment: body.requiresAppointment ?? true,
        availableOnline: body.availableOnline ?? false,
        features: body.features || [],
        requirements: body.requirements || null,
        included: body.included || null,
        warranty: body.warranty || null,
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
        isActive: body.isActive ?? true,
        isFeatured: body.isFeatured ?? false,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: service,
      message: 'Service created successfully'
    });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create service',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function putHandler(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Service ID is required',
        },
        { status: 400 }
      );
    }

    // Update service
    const [updatedService] = await db
      .update(services)
      .set({
        name: updateData.name,
        slug: updateData.slug,
        description: updateData.description,
        shortDescription: updateData.shortDescription,
        categoryId: updateData.categoryId,
        basePrice: updateData.basePrice?.toString(),
        hourlyRate: updateData.hourlyRate?.toString(),
        estimatedDuration: updateData.estimatedDuration,
        requiresAppointment: updateData.requiresAppointment,
        availableOnline: updateData.availableOnline,
        features: updateData.features,
        requirements: updateData.requirements,
        included: updateData.included,
        warranty: updateData.warranty,
        metaTitle: updateData.metaTitle,
        metaDescription: updateData.metaDescription,
        isActive: updateData.isActive,
        isFeatured: updateData.isFeatured,
        updatedAt: new Date(),
      })
      .where(eq(services.id, id))
      .returning();

    if (!updatedService) {
      return NextResponse.json(
        {
          success: false,
          message: 'Service not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedService,
      message: 'Service updated successfully'
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update service',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function deleteHandler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Service ID is required',
        },
        { status: 400 }
      );
    }

    // Delete service
    const [deletedService] = await db
      .delete(services)
      .where(eq(services.id, id))
      .returning();

    if (!deletedService) {
      return NextResponse.json(
        {
          success: false,
          message: 'Service not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete service',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}


// Apply admin middleware to all routes
export const GET = withAdmin(getHandler);
export const POST = withAdmin(postHandler);
export const PUT = withAdmin(putHandler);
export const DELETE = withAdmin(deleteHandler);
