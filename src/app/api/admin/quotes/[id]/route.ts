import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/lib/auth/admin-middleware';
import { db } from '@/lib/db/config';

import { quotes, quoteItems, user, products, services } from '@/lib/db/schema';

import { eq, and } from 'drizzle-orm';


async function getHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get quote details
    const [quote] = await db
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
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      })
      .from(quotes)
      .leftJoin(user, eq(quotes.userId, user.id))
      .where(eq(quotes.id, id));

    if (!quote) {
      return NextResponse.json(
        {
          success: false,
          message: 'Quote not found',
        },
        { status: 404 }
      );
    }

    // Get quote items
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
        product: {
          id: products.id,
          name: products.name,
          sku: products.sku,
        },
        service: {
          id: services.id,
          name: services.name,
        },
      })
      .from(quoteItems)
      .leftJoin(products, eq(quoteItems.productId, products.id))
      .leftJoin(services, eq(quoteItems.serviceId, services.id))
      .where(eq(quoteItems.quoteId, id));

    return NextResponse.json({
      success: true,
      data: {
        ...quote,
        items,
      },
    });
  } catch (error) {
    console.error('Error fetching quote:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch quote',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function putHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if quote exists
    const [existingQuote] = await db
      .select()
      .from(quotes)
      .where(eq(quotes.id, id));

    if (!existingQuote) {
      return NextResponse.json(
        {
          success: false,
          message: 'Quote not found',
        },
        { status: 404 }
      );
    }

    // If updating items, recalculate totals
    let updateData = { ...body };
    if (body.items) {
      const subtotal = body.items.reduce((sum: number, item: any) => 
        sum + (item.quantity * item.unitPrice), 0
      );
      
      const taxRate = 0.21; // 21% VAT
      const taxAmount = subtotal * taxRate;
      const discountAmount = body.discountAmount || 0;
      const totalAmount = subtotal + taxAmount - discountAmount;

      updateData = {
        ...updateData,
        subtotal: subtotal.toString(),
        taxAmount: taxAmount.toString(),
        discountAmount: discountAmount.toString(),
        totalAmount: totalAmount.toString(),
      };

      // Delete existing items and create new ones
      await db.delete(quoteItems).where(eq(quoteItems.quoteId, id));

      const quoteItemsData = body.items.map((item: any) => ({
        quoteId: id,
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

      await db.insert(quoteItems).values(quoteItemsData);
    }

    // Update quote
    const [updatedQuote] = await db
      .update(quotes)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(quotes.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedQuote,
      message: 'Quote updated successfully',
    });
  } catch (error) {
    console.error('Error updating quote:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update quote',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function deleteHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if quote exists
    const [existingQuote] = await db
      .select()
      .from(quotes)
      .where(eq(quotes.id, id));

    if (!existingQuote) {
      return NextResponse.json(
        {
          success: false,
          message: 'Quote not found',
        },
        { status: 404 }
      );
    }

    // Check if quote can be deleted (e.g., not if it's accepted)
    if (existingQuote.status === 'accepted') {
      return NextResponse.json(
        {
          success: false,
          message: 'Cannot delete an accepted quote',
        },
        { status: 400 }
      );
    }

    // Delete quote items first (cascade will handle this, but being explicit)
    await db.delete(quoteItems).where(eq(quoteItems.quoteId, id));

    // Delete quote
    await db.delete(quotes).where(eq(quotes.id, id));

    return NextResponse.json({
      success: true,
      message: 'Quote deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting quote:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete quote',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


// Apply admin middleware to all routes
export const GET = withAdmin(getHandler);
export const PUT = withAdmin(putHandler);
export const DELETE = withAdmin(deleteHandler);
