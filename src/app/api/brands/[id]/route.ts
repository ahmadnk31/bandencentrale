import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { brands } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [brand] = await db
      .select({
        id: brands.id,
        name: brands.name,
        slug: brands.slug,
        description: brands.description,
        logo: brands.logo,
        website: brands.website,
        countryOfOrigin: brands.countryOfOrigin,
        isActive: brands.isActive,
        createdAt: brands.createdAt,
        updatedAt: brands.updatedAt,
      })
      .from(brands)
      .where(eq(brands.id, id));

    if (!brand) {
      return NextResponse.json(
        { success: false, error: 'Brand not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: brand,
    });
  } catch (error) {
    console.error('Error fetching brand:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch brand' },
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
    const { name, description, logo, website, countryOfOrigin, isActive } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    // Check if brand exists
    const [existingBrand] = await db
      .select({ id: brands.id })
      .from(brands)
      .where(eq(brands.id, id));

    if (!existingBrand) {
      return NextResponse.json(
        { success: false, error: 'Brand not found' },
        { status: 404 }
      );
    }

    // Generate slug from name
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const [updatedBrand] = await db
      .update(brands)
      .set({
        name,
        slug,
        description,
        logo,
        website,
        countryOfOrigin,
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(brands.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedBrand,
    });
  } catch (error) {
    console.error('Error updating brand:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update brand' },
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

    // Check if brand exists
    const [existingBrand] = await db
      .select({ id: brands.id })
      .from(brands)
      .where(eq(brands.id, id));

    if (!existingBrand) {
      return NextResponse.json(
        { success: false, error: 'Brand not found' },
        { status: 404 }
      );
    }

    await db
      .delete(brands)
      .where(eq(brands.id, id));

    return NextResponse.json({
      success: true,
      message: 'Brand deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting brand:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete brand' },
      { status: 500 }
    );
  }
}
