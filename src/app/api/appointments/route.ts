import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/config";
import { appointments } from "@/lib/db/schema";
import { randomBytes } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      serviceId,
      customerName,
      customerEmail,
      customerPhone,
      vehicleYear,
      vehicleMake,
      vehicleModel,
      scheduledDate,
      scheduledTime,
      notes,
      estimatedDuration = 60
    } = body;

    // Validate required fields
    if (!serviceId || !customerName || !customerEmail || !scheduledDate || !scheduledTime) {
      return NextResponse.json(
        { error: "Service, customer name, email, date, and time are required" },
        { status: 400 }
      );
    }

    // Generate appointment number
    const appointmentNumber = `A-${Date.now()}-${randomBytes(3).toString('hex').toUpperCase()}`;

    // Convert date and time
    const appointmentDate = new Date(`${scheduledDate}T${scheduledTime}:00`);

    // Create appointment
    const [newAppointment] = await db
      .insert(appointments)
      .values({
        appointmentNumber,
        serviceId,
        customerName,
        customerEmail,
        customerPhone,
        vehicleYear,
        vehicleMake,
        vehicleModel,
        scheduledDate: appointmentDate,
        scheduledTime,
        estimatedDuration,
        notes,
        status: 'scheduled',
        type: 'service'
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: {
        id: newAppointment.id,
        appointmentNumber: newAppointment.appointmentNumber,
        status: newAppointment.status,
        scheduledDate: newAppointment.scheduledDate,
        scheduledTime: newAppointment.scheduledTime
      },
      message: "Appointment booked successfully"
    });

  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to book appointment" },
      { status: 500 }
    );
  }
}
