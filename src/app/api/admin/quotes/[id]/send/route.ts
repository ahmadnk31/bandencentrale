import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { quotes, quoteItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Get quote details
    const [quote] = await db
      .select()
      .from(quotes)
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

    // Check if quote can be sent
    if (quote.status === 'accepted' || quote.status === 'expired') {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot send quote with status: ${quote.status}`,
        },
        { status: 400 }
      );
    }

    // Get quote items for email content
    const items = await db
      .select()
      .from(quoteItems)
      .where(eq(quoteItems.quoteId, id));

    // Update quote status and sent date
    await db
      .update(quotes)
      .set({
        status: 'sent',
        sentAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(quotes.id, id));

    // TODO: Integrate with email service (AWS SES or similar)
    // For now, we'll simulate the email sending
    const emailContent = {
      to: quote.customerEmail,
      subject: `Quote ${quote.quoteNumber} from BandenCentrale`,
      template: 'quote',
      data: {
        customerName: quote.customerName,
        quoteNumber: quote.quoteNumber,
        items: items.map(item => ({
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          unitPrice: parseFloat(item.unitPrice),
          totalPrice: parseFloat(item.totalPrice),
        })),
        subtotal: parseFloat(quote.subtotal),
        taxAmount: parseFloat(quote.taxAmount),
        discountAmount: parseFloat(quote.discountAmount),
        totalAmount: parseFloat(quote.totalAmount),
        validUntil: quote.validUntil,
        notes: quote.notes,
        requirements: quote.requirements,
        vehicleInfo: quote.vehicleMake && quote.vehicleModel ? {
          make: quote.vehicleMake,
          model: quote.vehicleModel,
          year: quote.vehicleYear,
        } : null,
      },
    };

    // Here you would integrate with your email service
    console.log('Email would be sent with content:', emailContent);

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: `Quote ${quote.quoteNumber} sent successfully to ${quote.customerEmail}`,
      data: {
        quoteId: id,
        quoteNumber: quote.quoteNumber,
        customerEmail: quote.customerEmail,
        sentAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Error sending quote:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send quote',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Get send history for a quote
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get quote send history
    const [quote] = await db
      .select({
        id: quotes.id,
        quoteNumber: quotes.quoteNumber,
        status: quotes.status,
        createdAt: quotes.createdAt,
        sentAt: quotes.sentAt,
        acceptedAt: quotes.acceptedAt,
        customerEmail: quotes.customerEmail,
      })
      .from(quotes)
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

    // Build send history timeline
    const timeline = [
      {
        event: 'created',
        date: quote.createdAt,
        description: 'Quote created',
      },
    ];

    if (quote.sentAt) {
      timeline.push({
        event: 'sent',
        date: quote.sentAt,
        description: `Quote sent to ${quote.customerEmail}`,
      });
    }

    if (quote.acceptedAt) {
      timeline.push({
        event: 'accepted',
        date: quote.acceptedAt,
        description: 'Quote accepted by customer',
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        quote: {
          id: quote.id,
          quoteNumber: quote.quoteNumber,
          status: quote.status,
          customerEmail: quote.customerEmail,
        },
        timeline: timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      },
    });
  } catch (error) {
    console.error('Error fetching quote send history:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch quote send history',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
