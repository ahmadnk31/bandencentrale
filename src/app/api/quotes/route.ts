import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/config";
import { quotes, quoteItems } from "@/lib/db/schema";
import { randomBytes } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      // Customer info
      customerName,
      customerEmail,
      customerPhone,
      
      // Vehicle info
      vehicleYear,
      vehicleMake,
      vehicleModel,
      
      // Quote items
      items,
      
      // Additional info
      notes,
      requirements
    } = body;

    // Validate required fields
    if (!customerName || !customerEmail) {
      return NextResponse.json(
        { error: "Customer name and email are required" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "At least one quote item is required" },
        { status: 400 }
      );
    }

    // Generate quote number
    const quoteNumber = `Q-${Date.now()}-${randomBytes(3).toString('hex').toUpperCase()}`;

    // Calculate totals
    let subtotal = 0;
    const validItems = items.filter(item => item.quantity > 0 && item.unitPrice > 0);
    
    validItems.forEach(item => {
      subtotal += parseFloat(item.unitPrice) * parseInt(item.quantity);
    });

    const taxAmount = subtotal * 0.21; // 21% VAT
    const totalAmount = subtotal + taxAmount;

    // Set validity (30 days from now)
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);

    // Create quote
    const [newQuote] = await db
      .insert(quotes)
      .values({
        quoteNumber,
        customerName,
        customerEmail,
        customerPhone,
        vehicleYear,
        vehicleMake,
        vehicleModel,
        subtotal: subtotal.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        validUntil,
        notes,
        requirements: requirements ? JSON.stringify(requirements) : null,
        status: 'pending',
        type: 'tire'
      })
      .returning();

    // Add quote items
    const quoteItemsData = validItems.map(item => ({
      quoteId: newQuote.id,
      productId: item.productId || null,
      serviceId: item.serviceId || null,
      name: item.name,
      description: item.description || null,
      quantity: parseInt(item.quantity),
      unitPrice: parseFloat(item.unitPrice).toFixed(2),
      totalPrice: (parseFloat(item.unitPrice) * parseInt(item.quantity)).toFixed(2),
      notes: item.notes || null,
      metadata: item.metadata ? JSON.stringify(item.metadata) : null
    }));

    await db.insert(quoteItems).values(quoteItemsData);

    return NextResponse.json({
      success: true,
      data: {
        id: newQuote.id,
        quoteNumber: newQuote.quoteNumber,
        status: newQuote.status,
        validUntil: newQuote.validUntil,
        totalAmount: newQuote.totalAmount
      },
      message: "Quote request submitted successfully"
    });

  } catch (error) {
    console.error("Error creating quote:", error);
    return NextResponse.json(
      { error: "Failed to submit quote request" },
      { status: 500 }
    );
  }
}
