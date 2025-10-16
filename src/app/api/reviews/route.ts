import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { reviews, products, services, user, orders, orderItems } from '@/lib/db/schema';
import { eq, desc, and, or, like, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth/config';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const productId = searchParams.get('productId') || '';
    const serviceId = searchParams.get('serviceId') || '';
    const rating = searchParams.get('rating') || '';

    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];

    // Check if this is an admin request (accessing all reviews or non-approved status)
    const isAdminRequest = !productId && !serviceId || (status && status !== 'approved' && status !== 'all');
    
    if (isAdminRequest) {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (!session?.user || session.user.role !== 'admin') {
        return NextResponse.json(
          { success: false, error: 'Unauthorized. Admin access required.' },
          { status: 401 }
        );
      }
    }

    // For public access, force approved status
    if (!isAdminRequest) {
      conditions.push(eq(reviews.status, 'approved'));
    }

    if (search) {
      conditions.push(
        or(
          like(reviews.title, `%${search}%`),
          like(reviews.content, `%${search}%`),
          like(reviews.reviewerName, `%${search}%`),
          like(reviews.reviewerEmail, `%${search}%`)
        )
      );
    }

    // Only add status condition if it's not 'all' and is a valid status
    if (status && status !== 'all' && ['pending', 'approved', 'rejected', 'spam'].includes(status)) {
      conditions.push(eq(reviews.status, status));
    }

    if (productId) {
      // Validate UUID format before using it
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(productId)) {
        conditions.push(sql`${reviews.productId}::text = ${productId}`);
      }
    }

    if (serviceId) {
      // Validate UUID format before using it
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(serviceId)) {
        conditions.push(sql`${reviews.serviceId}::text = ${serviceId}`);
      }
    }

    // Only add rating condition if it's not 'all' and is a valid number
    if (rating && rating !== 'all' && !isNaN(parseInt(rating))) {
      const ratingNum = parseInt(rating);
      if (ratingNum >= 1 && ratingNum <= 5) {
        conditions.push(eq(reviews.rating, ratingNum));
      }
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get reviews with relations
    const reviewsData = await db
      .select({
        id: reviews.id,
        userId: reviews.userId,
        productId: reviews.productId,
        serviceId: reviews.serviceId,
        orderId: reviews.orderId,
        rating: reviews.rating,
        title: reviews.title,
        content: reviews.content,
        reviewerName: reviews.reviewerName,
        reviewerEmail: reviews.reviewerEmail,
        status: reviews.status,
        isVerifiedPurchase: reviews.isVerifiedPurchase,
        helpfulCount: reviews.helpfulCount,
        moderatedBy: reviews.moderatedBy,
        moderatedAt: reviews.moderatedAt,
        moderationNotes: reviews.moderationNotes,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
        userName: user.name,
        userEmail: user.email,
        productName: products.name,
        productSlug: products.slug,
        serviceName: services.name,
        serviceSlug: services.slug,
      })
      .from(reviews)
      .leftJoin(user, sql`${reviews.userId}::text = ${user.id}::text`)
      .leftJoin(products, sql`${reviews.productId}::text = ${products.id}::text`)
      .leftJoin(services, sql`${reviews.serviceId}::text = ${services.id}::text`)
      .where(whereClause)
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(reviews)
      .where(whereClause);

    const totalPages = Math.ceil(count / limit);

    return NextResponse.json({
      success: true,
      data: reviewsData,
      pagination: {
        page,
        limit,
        totalCount: count,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      productId,
      serviceId,
      orderId,
      rating,
      title,
      content,
      reviewerName,
      reviewerEmail,
    } = body;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (!content?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Review content is required' },
        { status: 400 }
      );
    }

    if (!productId && !serviceId) {
      return NextResponse.json(
        { success: false, error: 'Product ID or Service ID is required' },
        { status: 400 }
      );
    }

    // For guest reviews, require name and email
    if (!userId && (!reviewerName?.trim() || !reviewerEmail?.trim())) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required for guest reviews' },
        { status: 400 }
      );
    }

    // Check if product/service exists
    if (productId) {
      const product = await db
        .select({ id: products.id })
        .from(products)
        .where(sql`${products.id}::text = ${productId}`)
        .limit(1);

      if (product.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }
    }

    if (serviceId) {
      const service = await db
        .select({ id: services.id })
        .from(services)
        .where(sql`${services.id}::text = ${serviceId}`)
        .limit(1);

      if (service.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Service not found' },
          { status: 404 }
        );
      }
    }

    // Check if this is a verified purchase
    let isVerifiedPurchase = false;
    if (userId && (productId || serviceId)) {
      // Check if the user has purchased this product or service
      const purchaseQuery = db
        .select({ id: orderItems.id })
        .from(orderItems)
        .innerJoin(orders, eq(orderItems.orderId, orders.id))
        .where(
          and(
            eq(orders.userId, userId),
            or(
              eq(orders.status, 'delivered'),
              eq(orders.status, 'completed')
            ),
            productId ? eq(orderItems.productId, productId) : sql`1=1`,
            serviceId ? eq(orderItems.serviceId, serviceId) : sql`1=1`
          )
        )
        .limit(1);

      const purchase = await purchaseQuery;
      isVerifiedPurchase = purchase.length > 0;
    }

    // Create the review
    const [newReview] = await db
      .insert(reviews)
      .values({
        userId: userId || null,
        productId: productId || null,
        serviceId: serviceId || null,
        orderId: orderId || null,
        rating,
        title: title?.trim() || null,
        content: content.trim(),
        reviewerName: userId ? null : reviewerName?.trim(),
        reviewerEmail: userId ? null : reviewerEmail?.trim(),
        status: 'pending', // All reviews start as pending for moderation
        isVerifiedPurchase, // Now properly calculated
        helpfulCount: 0,
        moderatedBy: null,
        moderatedAt: null,
        moderationNotes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newReview,
      message: 'Review submitted successfully and is pending moderation',
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
