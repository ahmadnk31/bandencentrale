import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { appointments, services, user } from '@/lib/db/schema';
import { eq, and, gte, lte, ilike, desc, asc, count, sql, inArray } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

// Generate appointment number
function generateAppointmentNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `APT-${year}${month}${day}-${random}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse filters with proper null/undefined handling
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Helper function to get clean string values (null if empty or "undefined")
    const getCleanParam = (param: string | null): string | null => {
      if (!param || param === 'undefined' || param === 'null' || param.trim() === '') {
        return null;
      }
      return param;
    };
    
    const search = getCleanParam(searchParams.get('search'));
    const status = getCleanParam(searchParams.get('status'));
    const type = getCleanParam(searchParams.get('type'));
    const serviceId = getCleanParam(searchParams.get('serviceId'));
    const technicianId = getCleanParam(searchParams.get('technicianId'));
    const dateFrom = getCleanParam(searchParams.get('dateFrom'));
    const dateTo = getCleanParam(searchParams.get('dateTo'));
    const sortBy = searchParams.get('sortBy') || 'scheduledDate';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Map sort fields to actual columns
    const sortFieldMap: Record<string, any> = {
      'scheduledDate': appointments.scheduledDate,
      'status': appointments.status,
      'customerName': appointments.customerName,
      'createdAt': appointments.createdAt,
      'updatedAt': appointments.updatedAt,
    };

    const sortField = sortFieldMap[sortBy] || appointments.scheduledDate;

    // Build where conditions
    const conditions = [];

    if (search) {
      conditions.push(
        sql`(${appointments.customerName} ILIKE ${`%${search}%`} OR 
            ${appointments.customerEmail} ILIKE ${`%${search}%`} OR 
            ${appointments.appointmentNumber} ILIKE ${`%${search}%`})`
      );
    }

    if (status) {
      conditions.push(eq(appointments.status, status));
    }

    if (type) {
      conditions.push(eq(appointments.type, type));
    }

    if (serviceId) {
      conditions.push(eq(appointments.serviceId, sql`${serviceId}::uuid`));
    }

    if (technicianId) {
      conditions.push(eq(appointments.assignedTechnician, sql`${technicianId}::uuid`));
    }

    if (dateFrom) {
      conditions.push(gte(appointments.scheduledDate, new Date(dateFrom)));
    }

    if (dateTo) {
      conditions.push(lte(appointments.scheduledDate, new Date(dateTo)));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const totalResult = await db
      .select({ count: count() })
      .from(appointments)
      .where(whereClause);
    
    const total = totalResult[0]?.count || 0;

    // Get appointments without relations for now - to avoid UUID issues
    const appointmentsList = await db
      .select()
      .from(appointments)
      .where(whereClause)
      .orderBy(
        sortOrder === 'desc' 
          ? desc(sortField)
          : asc(sortField)
      )
      .limit(limit)
      .offset((page - 1) * limit);

    // Format response
    const formattedAppointments = appointmentsList.map((appointment: any) => ({
        id: appointment.id,
        appointmentNumber: appointment.appointmentNumber,
        userId: appointment.userId,
        orderId: appointment.orderId,
        customerEmail: appointment.customerEmail,
        customerPhone: appointment.customerPhone,
        customerName: appointment.customerName,
        serviceId: appointment.serviceId,
        status: appointment.status,
        type: appointment.type,
        vehicleYear: appointment.vehicleYear,
        vehicleMake: appointment.vehicleMake,
        vehicleModel: appointment.vehicleModel,
        vehicleLicense: appointment.vehicleLicense,
        vehicleVin: appointment.vehicleVin,
        scheduledDate: appointment.scheduledDate?.toISOString(),
        scheduledTime: appointment.scheduledTime,
        estimatedDuration: appointment.estimatedDuration,
        actualStartTime: appointment.actualStartTime?.toISOString(),
        actualEndTime: appointment.actualEndTime?.toISOString(),
        assignedTechnician: appointment.assignedTechnician,
        notes: appointment.notes,
        internalNotes: appointment.internalNotes,
        reminderSent: appointment.reminderSent,
        confirmationSent: appointment.confirmationSent,
        createdAt: appointment.createdAt.toISOString(),
        updatedAt: appointment.updatedAt.toISOString(),
    }));
    return NextResponse.json({
      data: formattedAppointments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      success: true,
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { 
        message: 'Failed to fetch appointments',
        success: false,
        errors: error instanceof Error ? { general: [error.message] } : undefined 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.scheduledDate || !body.scheduledTime) {
      return NextResponse.json(
        { 
          message: 'Missing required fields',
          success: false,
          errors: {
            scheduledDate: !body.scheduledDate ? ['Scheduled date is required'] : [],
            scheduledTime: !body.scheduledTime ? ['Scheduled time is required'] : [],
          }
        },
        { status: 400 }
      );
    }

    // Generate appointment number
    const appointmentNumber = generateAppointmentNumber();

    // Create appointment
    const [appointment] = await db
      .insert(appointments)
      .values({
        appointmentNumber,
        userId: body.userId || null,
        orderId: body.orderId || null,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        customerName: body.customerName,
        serviceId: body.serviceId || null,
        type: body.type || 'service',
        vehicleYear: body.vehicleYear,
        vehicleMake: body.vehicleMake,
        vehicleModel: body.vehicleModel,
        vehicleLicense: body.vehicleLicense,
        vehicleVin: body.vehicleVin,
        scheduledDate: new Date(body.scheduledDate),
        scheduledTime: body.scheduledTime,
        estimatedDuration: body.estimatedDuration || 60,
        assignedTechnician: body.assignedTechnician || null,
        notes: body.notes,
        internalNotes: body.internalNotes,
        status: 'scheduled',
        reminderSent: false,
        confirmationSent: false,
      })
      .returning();

    // Fetch the created appointment (without joins for now to avoid UUID issues)
    const [createdAppointment] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, appointment.id));

    const formattedAppointment = {
      ...createdAppointment,
      scheduledDate: createdAppointment.scheduledDate?.toISOString(),
      actualStartTime: createdAppointment.actualStartTime?.toISOString(),
      actualEndTime: createdAppointment.actualEndTime?.toISOString(),
      createdAt: createdAppointment.createdAt.toISOString(),
      updatedAt: createdAppointment.updatedAt.toISOString(),
      // Add basic service info
      service: {
        id: createdAppointment.serviceId,
        name: 'Service',
        price: 0,
      },
      user: createdAppointment.customerName ? {
        id: createdAppointment.userId || 'guest',
        name: createdAppointment.customerName,
        email: createdAppointment.customerEmail,
        phone: createdAppointment.customerPhone,
      } : undefined,
    };

    return NextResponse.json({
      data: formattedAppointment,
      success: true,
      message: 'Appointment created successfully',
    });

  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { 
        message: 'Failed to create appointment',
        success: false,
        errors: error instanceof Error ? { general: [error.message] } : undefined 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        {
          message: 'Appointment ID is required',
          success: false,
        },
        { status: 400 }
      );
    }

    // Update appointment
    const [updatedAppointment] = await db
      .update(appointments)
      .set({
        customerEmail: updateData.customerEmail,
        customerPhone: updateData.customerPhone,
        customerName: updateData.customerName,
        serviceId: updateData.serviceId,
        type: updateData.type || 'service',
        vehicleYear: updateData.vehicleYear,
        vehicleMake: updateData.vehicleMake,
        vehicleModel: updateData.vehicleModel,
        vehicleLicense: updateData.vehicleLicense,
        vehicleVin: updateData.vehicleVin,
        scheduledDate: updateData.scheduledDate ? new Date(updateData.scheduledDate) : undefined,
        scheduledTime: updateData.scheduledTime,
        estimatedDuration: updateData.estimatedDuration || 60,
        assignedTechnician: updateData.assignedTechnician,
        notes: updateData.notes,
        internalNotes: updateData.internalNotes,
        status: updateData.status,
        actualStartTime: updateData.actualStartTime ? new Date(updateData.actualStartTime) : undefined,
        actualEndTime: updateData.actualEndTime ? new Date(updateData.actualEndTime) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(appointments.id, id))
      .returning();

    if (!updatedAppointment) {
      return NextResponse.json(
        {
          message: 'Appointment not found',
          success: false,
        },
        { status: 404 }
      );
    }

    // Format response (simplified without relations for now)
    const formattedAppointment = {
      id: updatedAppointment.id,
      appointmentNumber: updatedAppointment.appointmentNumber,
      userId: updatedAppointment.userId,
      orderId: updatedAppointment.orderId,
      customerEmail: updatedAppointment.customerEmail,
      customerPhone: updatedAppointment.customerPhone,
      customerName: updatedAppointment.customerName,
      serviceId: updatedAppointment.serviceId,
      status: updatedAppointment.status,
      type: updatedAppointment.type,
      vehicleYear: updatedAppointment.vehicleYear,
      vehicleMake: updatedAppointment.vehicleMake,
      vehicleModel: updatedAppointment.vehicleModel,
      vehicleLicense: updatedAppointment.vehicleLicense,
      vehicleVin: updatedAppointment.vehicleVin,
      scheduledDate: updatedAppointment.scheduledDate?.toISOString(),
      scheduledTime: updatedAppointment.scheduledTime,
      estimatedDuration: updatedAppointment.estimatedDuration,
      actualStartTime: updatedAppointment.actualStartTime?.toISOString(),
      actualEndTime: updatedAppointment.actualEndTime?.toISOString(),
      assignedTechnician: updatedAppointment.assignedTechnician,
      notes: updatedAppointment.notes,
      internalNotes: updatedAppointment.internalNotes,
      reminderSent: updatedAppointment.reminderSent,
      confirmationSent: updatedAppointment.confirmationSent,
      createdAt: updatedAppointment.createdAt.toISOString(),
      updatedAt: updatedAppointment.updatedAt.toISOString(),
    };

    return NextResponse.json({
      data: formattedAppointment,
      success: true,
      message: 'Appointment updated successfully',
    });

  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { 
        message: 'Failed to update appointment',
        success: false,
        errors: error instanceof Error ? { general: [error.message] } : undefined 
      },
      { status: 500 }
    );
  }
}
