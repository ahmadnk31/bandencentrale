import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { brands } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allBrands = await db
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
      .where(eq(brands.isActive, true))
      .orderBy(brands.name);

    return NextResponse.json({
      success: true,
      data: allBrands,
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, logo, website, countryOfOrigin } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    const newBrand = await db
      .insert(brands)
      .values({
        name,
        slug,
        description,
        logo,
        website,
        countryOfOrigin,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newBrand[0],
    });
  } catch (error) {
    console.error('Error creating brand:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create brand' },
      { status: 500 }
    );
  }
}
