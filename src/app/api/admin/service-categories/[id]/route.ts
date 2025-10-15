import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { serviceCategories } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get service category details
    const [category] = await db
      .select()
      .from(serviceCategories)
      .where(eq(serviceCategories.id, id));

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: 'Service category not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Error fetching service category:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch service category',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if service category exists
    const [existingCategory] = await db
      .select()
      .from(serviceCategories)
      .where(eq(serviceCategories.id, id));

    if (!existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: 'Service category not found',
        },
        { status: 404 }
      );
    }

    // Generate slug if name is being updated
    let updateData = { ...body };
    if (body.name && body.name !== existingCategory.name) {
      updateData.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    // Update service category
    const [updatedCategory] = await db
      .update(serviceCategories)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(serviceCategories.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: 'Service category updated successfully',
    });
  } catch (error) {
    console.error('Error updating service category:', error);
    
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
        message: 'Failed to update service category',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if service category exists
    const [existingCategory] = await db
      .select()
      .from(serviceCategories)
      .where(eq(serviceCategories.id, id));

    if (!existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: 'Service category not found',
        },
        { status: 404 }
      );
    }

    // TODO: Check if category has associated services before deleting
    // For now, we'll allow deletion

    // Delete service category
    await db.delete(serviceCategories).where(eq(serviceCategories.id, id));

    return NextResponse.json({
      success: true,
      message: 'Service category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting service category:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete service category',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
