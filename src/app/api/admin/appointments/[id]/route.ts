import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/lib/auth/admin-middleware';
import { db } from '@/lib/db/config';

import { appointments, services, user } from '@/lib/db/schema';

import { eq, sql } from 'drizzle-orm';


async function getHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database connection not available' },
        { status: 500 }
      );
    }

    const { id } = await params;

    const [appointment] = await db
      .select({
        id: appointments.id,
        appointmentNumber: appointments.appointmentNumber,
        userId: appointments.userId,
        orderId: appointments.orderId,
        customerEmail: appointments.customerEmail,
        customerPhone: appointments.customerPhone,
        customerName: appointments.customerName,
        serviceId: appointments.serviceId,
        status: appointments.status,
        type: appointments.type,
        vehicleYear: appointments.vehicleYear,
        vehicleMake: appointments.vehicleMake,
        vehicleModel: appointments.vehicleModel,
        vehicleLicense: appointments.vehicleLicense,
        vehicleVin: appointments.vehicleVin,
        scheduledDate: appointments.scheduledDate,
        scheduledTime: appointments.scheduledTime,
        estimatedDuration: appointments.estimatedDuration,
        actualStartTime: appointments.actualStartTime,
        actualEndTime: appointments.actualEndTime,
        assignedTechnician: appointments.assignedTechnician,
        notes: appointments.notes,
        internalNotes: appointments.internalNotes,
        reminderSent: appointments.reminderSent,
        confirmationSent: appointments.confirmationSent,
        createdAt: appointments.createdAt,
        updatedAt: appointments.updatedAt,
        serviceName: services.name,
        serviceCategory: services.categoryId,
        servicePrice: services.basePrice,
        userName: user.name,
        userEmail: user.email,
        userPhone: user.phone,
        technicianName: sql<string>`technician.name`,
        technicianEmail: sql<string>`technician.email`,
      })
      .from(appointments)
      .leftJoin(services, eq(appointments.serviceId, services.id))
      .leftJoin(user, eq(appointments.userId, user.id))
      .leftJoin(
        sql`${user} as technician`, 
        eq(appointments.assignedTechnician, sql`technician.id`)
      )
      .where(eq(appointments.id, id));

    if (!appointment) {
      return NextResponse.json(
        { 
          message: 'Appointment not found',
          success: false 
        },
        { status: 404 }
      );
    }

    const formattedAppointment = {
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
      service: appointment.serviceName ? {
        id: appointment.serviceId,
        name: appointment.serviceName,
        category: appointment.serviceCategory,
        price: appointment.servicePrice,
      } : undefined,
      user: appointment.userName ? {
        id: appointment.userId!,
        name: appointment.userName,
        email: appointment.userEmail!,
        phone: appointment.userPhone,
      } : undefined,
      technician: appointment.technicianName ? {
        id: appointment.assignedTechnician!,
        name: appointment.technicianName,
        email: appointment.technicianEmail,
      } : undefined,
    };

    return NextResponse.json({
      data: formattedAppointment,
      success: true,
    });

  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { 
        message: 'Failed to fetch appointment',
        success: false,
        errors: error instanceof Error ? { general: [error.message] } : undefined 
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

    // Check if appointment exists
    const [existingAppointment] = await db
      .select({ id: appointments.id })
      .from(appointments)
      .where(eq(appointments.id, id));

    if (!existingAppointment) {
      return NextResponse.json(
        { 
          message: 'Appointment not found',
          success: false 
        },
        { status: 404 }
      );
    }

    // Update appointment
    const updateData: any = {};
    
    if (body.userId !== undefined) updateData.userId = body.userId;
    if (body.orderId !== undefined) updateData.orderId = body.orderId;
    if (body.customerEmail !== undefined) updateData.customerEmail = body.customerEmail;
    if (body.customerPhone !== undefined) updateData.customerPhone = body.customerPhone;
    if (body.customerName !== undefined) updateData.customerName = body.customerName;
    if (body.serviceId !== undefined) updateData.serviceId = body.serviceId;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.vehicleYear !== undefined) updateData.vehicleYear = body.vehicleYear;
    if (body.vehicleMake !== undefined) updateData.vehicleMake = body.vehicleMake;
    if (body.vehicleModel !== undefined) updateData.vehicleModel = body.vehicleModel;
    if (body.vehicleLicense !== undefined) updateData.vehicleLicense = body.vehicleLicense;
    if (body.vehicleVin !== undefined) updateData.vehicleVin = body.vehicleVin;
    if (body.scheduledDate !== undefined) updateData.scheduledDate = new Date(body.scheduledDate);
    if (body.scheduledTime !== undefined) updateData.scheduledTime = body.scheduledTime;
    if (body.estimatedDuration !== undefined) updateData.estimatedDuration = body.estimatedDuration;
    if (body.actualStartTime !== undefined) updateData.actualStartTime = body.actualStartTime ? new Date(body.actualStartTime) : null;
    if (body.actualEndTime !== undefined) updateData.actualEndTime = body.actualEndTime ? new Date(body.actualEndTime) : null;
    if (body.assignedTechnician !== undefined) updateData.assignedTechnician = body.assignedTechnician;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.internalNotes !== undefined) updateData.internalNotes = body.internalNotes;
    if (body.reminderSent !== undefined) updateData.reminderSent = body.reminderSent;
    if (body.confirmationSent !== undefined) updateData.confirmationSent = body.confirmationSent;

    updateData.updatedAt = new Date();

    await db
      .update(appointments)
      .set(updateData)
      .where(eq(appointments.id, id));

    // Fetch updated appointment
    const [updatedAppointment] = await db
      .select({
        id: appointments.id,
        appointmentNumber: appointments.appointmentNumber,
        userId: appointments.userId,
        orderId: appointments.orderId,
        customerEmail: appointments.customerEmail,
        customerPhone: appointments.customerPhone,
        customerName: appointments.customerName,
        serviceId: appointments.serviceId,
        status: appointments.status,
        type: appointments.type,
        vehicleYear: appointments.vehicleYear,
        vehicleMake: appointments.vehicleMake,
        vehicleModel: appointments.vehicleModel,
        vehicleLicense: appointments.vehicleLicense,
        vehicleVin: appointments.vehicleVin,
        scheduledDate: appointments.scheduledDate,
        scheduledTime: appointments.scheduledTime,
        estimatedDuration: appointments.estimatedDuration,
        actualStartTime: appointments.actualStartTime,
        actualEndTime: appointments.actualEndTime,
        assignedTechnician: appointments.assignedTechnician,
        notes: appointments.notes,
        internalNotes: appointments.internalNotes,
        reminderSent: appointments.reminderSent,
        confirmationSent: appointments.confirmationSent,
        createdAt: appointments.createdAt,
        updatedAt: appointments.updatedAt,
        serviceName: services.name,
        serviceCategory: services.categoryId,
        servicePrice: services.basePrice,
      })
      .from(appointments)
      .leftJoin(services, eq(appointments.serviceId, services.id))
      .where(eq(appointments.id, id));

    const formattedAppointment = {
      ...updatedAppointment,
      scheduledDate: updatedAppointment.scheduledDate?.toISOString(),
      actualStartTime: updatedAppointment.actualStartTime?.toISOString(),
      actualEndTime: updatedAppointment.actualEndTime?.toISOString(),
      createdAt: updatedAppointment.createdAt.toISOString(),
      updatedAt: updatedAppointment.updatedAt.toISOString(),
      service: updatedAppointment.serviceName ? {
        id: updatedAppointment.serviceId,
        name: updatedAppointment.serviceName,
        category: updatedAppointment.serviceCategory,
        price: updatedAppointment.servicePrice,
      } : undefined,
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

async function deleteHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if appointment exists
    const [existingAppointment] = await db
      .select({ id: appointments.id })
      .from(appointments)
      .where(eq(appointments.id, id));

    if (!existingAppointment) {
      return NextResponse.json(
        { 
          message: 'Appointment not found',
          success: false 
        },
        { status: 404 }
      );
    }

    // Delete appointment
    await db
      .delete(appointments)
      .where(eq(appointments.id, id));

    return NextResponse.json({
      success: true,
      message: 'Appointment deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { 
        message: 'Failed to delete appointment',
        success: false,
        errors: error instanceof Error ? { general: [error.message] } : undefined 
      },
      { status: 500 }
    );
  }
}


// Apply admin middleware to all routes
export const GET = withAdmin(getHandler);
export const PUT = withAdmin(putHandler);
export const DELETE = withAdmin(deleteHandler);
