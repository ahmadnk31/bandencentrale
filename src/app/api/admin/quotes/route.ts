import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { quotes, quoteItems, user, products, services } from '@/lib/db/schema';
import { eq, ilike, and, or, desc, asc, count, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const dateRange = searchParams.get('dateRange') || 'all';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where conditions
    const conditions = [];
    
    if (search) {
      conditions.push(
        or(
          ilike(quotes.quoteNumber, `%${search}%`),
          ilike(quotes.customerName, `%${search}%`),
          ilike(quotes.customerEmail, `%${search}%`),
          ilike(quotes.customerPhone, `%${search}%`),
          ilike(quotes.vehicleMake, `%${search}%`),
          ilike(quotes.vehicleModel, `%${search}%`)
        )
      );
    }

    if (status !== 'all') {
      conditions.push(eq(quotes.status, status));
    }

    // Date range filtering
    if (dateRange !== 'all') {
      const now = new Date();
      let startDate = new Date();
      
      switch (dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(now.getMonth() - 3);
          break;
      }
      
      conditions.push(sql`${quotes.createdAt} >= ${startDate}`);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const [{ totalCount }] = await db
      .select({ totalCount: count() })
      .from(quotes)
      .where(whereClause);

    // Build order by clause
    let orderByClause;
    switch (sortBy) {
      case 'quoteNumber':
        orderByClause = sortOrder === 'asc' ? asc(quotes.quoteNumber) : desc(quotes.quoteNumber);
        break;
      case 'customerName':
        orderByClause = sortOrder === 'asc' ? asc(quotes.customerName) : desc(quotes.customerName);
        break;
      case 'totalAmount':
        orderByClause = sortOrder === 'asc' ? asc(quotes.totalAmount) : desc(quotes.totalAmount);
        break;
      case 'status':
        orderByClause = sortOrder === 'asc' ? asc(quotes.status) : desc(quotes.status);
        break;
      case 'validUntil':
        orderByClause = sortOrder === 'asc' ? asc(quotes.validUntil) : desc(quotes.validUntil);
        break;
      case 'createdAt':
      default:
        orderByClause = sortOrder === 'asc' ? asc(quotes.createdAt) : desc(quotes.createdAt);
    }

    // Get quotes with pagination
    const quotesList = await db
      .select({
        id: quotes.id,
        quoteNumber: quotes.quoteNumber,
        userId: quotes.userId,
        customerEmail: quotes.customerEmail,
        customerPhone: quotes.customerPhone,
        customerName: quotes.customerName,
        status: quotes.status,
        type: quotes.type,
        vehicleYear: quotes.vehicleYear,
        vehicleMake: quotes.vehicleMake,
        vehicleModel: quotes.vehicleModel,
        subtotal: quotes.subtotal,
        taxAmount: quotes.taxAmount,
        discountAmount: quotes.discountAmount,
        totalAmount: quotes.totalAmount,
        validUntil: quotes.validUntil,
        sentAt: quotes.sentAt,
        acceptedAt: quotes.acceptedAt,
        notes: quotes.notes,
        internalNotes: quotes.internalNotes,
        requirements: quotes.requirements,
        createdAt: quotes.createdAt,
        updatedAt: quotes.updatedAt,
      })
      .from(quotes)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset((page - 1) * limit);

    // Get items for each quote
    const quotesWithItems = await Promise.all(
      quotesList.map(async (quote) => {
        const items = await db
          .select({
            id: quoteItems.id,
            quoteId: quoteItems.quoteId,
            productId: quoteItems.productId,
            serviceId: quoteItems.serviceId,
            name: quoteItems.name,
            description: quoteItems.description,
            quantity: quoteItems.quantity,
            unitPrice: quoteItems.unitPrice,
            totalPrice: quoteItems.totalPrice,
            notes: quoteItems.notes,
            metadata: quoteItems.metadata,
            createdAt: quoteItems.createdAt,
          })
          .from(quoteItems)
          .where(eq(quoteItems.quoteId, quote.id));

        return {
          ...quote,
          items,
        };
      })
    );

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: quotesWithItems,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch quotes',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['customerName', 'customerEmail', 'items'];
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

    // Validate items array
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'At least one item is required',
        },
        { status: 400 }
      );
    }

    // Validate each item
    for (const item of body.items) {
      if (!item.name || !item.quantity || !item.unitPrice) {
        return NextResponse.json(
          {
            success: false,
            message: 'Each item must have name, quantity, and unitPrice',
          },
          { status: 400 }
        );
      }
    }

    // Generate quote number
    const quoteCount = await db.select({ count: count() }).from(quotes);
    const quoteNumber = `QUO-${new Date().getFullYear()}-${String(quoteCount[0].count + 1).padStart(4, '0')}`;

    // Calculate totals
    const subtotal = body.items.reduce((sum: number, item: any) => 
      sum + (item.quantity * item.unitPrice), 0
    );
    
    const taxRate = 0.21; // 21% VAT
    const taxAmount = subtotal * taxRate;
    const discountAmount = body.discountAmount || 0;
    const totalAmount = subtotal + taxAmount - discountAmount;

    // Set valid until date
    const validDays = body.validDays || 30;
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + validDays);

    // Create quote
    const [newQuote] = await db
      .insert(quotes)
      .values({
        quoteNumber,
        userId: body.userId || null,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone || null,
        customerName: body.customerName,
        status: body.sendImmediately ? 'sent' : 'draft',
        type: body.type || 'tire',
        vehicleYear: body.vehicleYear || null,
        vehicleMake: body.vehicleMake || null,
        vehicleModel: body.vehicleModel || null,
        subtotal: subtotal.toString(),
        taxAmount: taxAmount.toString(),
        discountAmount: discountAmount.toString(),
        totalAmount: totalAmount.toString(),
        validUntil,
        sentAt: body.sendImmediately ? new Date() : null,
        notes: body.notes || null,
        internalNotes: body.internalNotes || null,
        requirements: body.requirements || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Create quote items
    const quoteItemsData = body.items.map((item: any) => ({
      quoteId: newQuote.id,
      productId: item.productId || null,
      serviceId: item.serviceId || null,
      name: item.name,
      description: item.description || null,
      quantity: item.quantity,
      unitPrice: item.unitPrice.toString(),
      totalPrice: (item.quantity * item.unitPrice).toString(),
      notes: item.notes || null,
      metadata: item.metadata || null,
      createdAt: new Date(),
    }));

    const createdItems = await db
      .insert(quoteItems)
      .values(quoteItemsData)
      .returning();

    return NextResponse.json({
      success: true,
      data: {
        ...newQuote,
        items: createdItems,
      },
      message: `Quote ${newQuote.quoteNumber} created successfully`,
    });
  } catch (error) {
    console.error('Error creating quote:', error);
    
    // Handle unique constraint errors
    if (error instanceof Error && error.message.includes('unique')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Quote number already exists',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create quote',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
