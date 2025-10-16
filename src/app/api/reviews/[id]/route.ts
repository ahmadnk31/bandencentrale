import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { reviews } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth/config';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const review = await db
      .select()
      .from(reviews)
      .where(sql`${reviews.id}::text = ${id}`)
      .limit(1);

    if (review.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: review[0],
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch review' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication for admin operations
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status, moderationNotes, moderatedBy } = body;

    // Validate status
    if (status && !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Check if review exists
    const existingReview = await db
      .select()
      .from(reviews)
      .where(sql`${reviews.id}::text = ${id}`)
      .limit(1);

    if (existingReview.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    // Update the review
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (status) {
      updateData.status = status;
      updateData.moderatedAt = new Date();
    }

    if (moderationNotes !== undefined) {
      updateData.moderationNotes = moderationNotes;
    }

    // Use the authenticated admin user ID
    if (session.user.id) {
      updateData.moderatedBy = session.user.id;
    }

    const [updatedReview] = await db
      .update(reviews)
      .set(updateData)
      .where(sql`${reviews.id}::text = ${id}`)
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedReview,
      message: `Review ${status || 'updated'} successfully`,
    });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication for admin operations
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if review exists
    const existingReview = await db
      .select()
      .from(reviews)
      .where(sql`${reviews.id}::text = ${id}`)
      .limit(1);

    if (existingReview.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    // Delete the review
    await db
      .delete(reviews)
      .where(sql`${reviews.id}::text = ${id}`);

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}
