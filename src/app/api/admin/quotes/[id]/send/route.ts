import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/lib/auth/admin-middleware';
import { db } from '@/lib/db/config';

import { quotes, quoteItems } from '@/lib/db/schema';

import { eq } from 'drizzle-orm';


async function postHandler(
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
    interface QuoteItem {
        name: string;
        description: string | null;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
    }

    interface VehicleInfo {
        make: string;
        model: string;
        year: number | null;
    }

    interface EmailTemplateData {
        customerName: string | null;
        quoteNumber: string;
        items: QuoteItem[];
        subtotal: number;
        taxAmount: number;
        discountAmount: number;
        totalAmount: number;
        validUntil: Date | null;
        notes: string | null;
        requirements: string | null;
        vehicleInfo: VehicleInfo | null;
    }

    interface EmailContent {
        to: string;
        subject: string;
        template: string;
        data: EmailTemplateData;
    }

    interface QuoteDbItem {
        name: string;
        description: string | null;
        quantity: number;
        unitPrice: string;
        totalPrice: string;
    }

    interface QuoteDbRecord {
        customerEmail: string;
        customerName: string | null;
        quoteNumber: string;
        subtotal: string;
        taxAmount: string;
        discountAmount: string;
        totalAmount: string;
        validUntil: Date | null;
        notes: string | null;
        requirements: string | null;
        vehicleMake: string | null;
        vehicleModel: string | null;
        vehicleYear: number | null;
    }

    const emailContent: EmailContent = {
        to: (quote as QuoteDbRecord).customerEmail,
        subject: `Quote ${(quote as QuoteDbRecord).quoteNumber} from BandenCentrale`,
        template: 'quote',
        data: {
            customerName: (quote as QuoteDbRecord).customerName,
            quoteNumber: (quote as QuoteDbRecord).quoteNumber,
            items: (items as QuoteDbItem[]).map((item): QuoteItem => ({
                name: item.name,
                description: item.description,
                quantity: item.quantity,
                unitPrice: parseFloat(item.unitPrice),
                totalPrice: parseFloat(item.totalPrice),
            })),
            subtotal: parseFloat((quote as QuoteDbRecord).subtotal),
            taxAmount: parseFloat((quote as QuoteDbRecord).taxAmount),
            discountAmount: parseFloat((quote as QuoteDbRecord).discountAmount),
            totalAmount: parseFloat((quote as QuoteDbRecord).totalAmount),
            validUntil: (quote as QuoteDbRecord).validUntil,
            notes: (quote as QuoteDbRecord).notes,
            requirements: (quote as QuoteDbRecord).requirements,
            vehicleInfo: (quote as QuoteDbRecord).vehicleMake && (quote as QuoteDbRecord).vehicleModel ? {
                make: (quote as QuoteDbRecord).vehicleMake!,
                model: (quote as QuoteDbRecord).vehicleModel!,
                year: (quote as QuoteDbRecord).vehicleYear,
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
async function getHandler(
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


// Apply admin middleware to all routes
export const GET = withAdmin(getHandler);
export const POST = withAdmin(postHandler);
