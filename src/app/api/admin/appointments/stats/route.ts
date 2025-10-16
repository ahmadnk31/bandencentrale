import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/lib/auth/admin-middleware';
import { db } from '@/lib/db/config';
import { withAdmin } from '@/lib/auth/admin-middleware';
import { appointments } from '@/lib/db/schema';
import { withAdmin } from '@/lib/auth/admin-middleware';
import { eq, and, gte, lte, count, avg, sql } from 'drizzle-orm';
import { withAdmin } from '@/lib/auth/admin-middleware';

async function getHandler(request: NextRequest) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get basic counts
    const [totalCount] = await db
      .select({ count: count() })
      .from(appointments);

    const [todayCount] = await db
      .select({ count: count() })
      .from(appointments)
      .where(
        and(
          gte(appointments.scheduledDate, today),
          lte(appointments.scheduledDate, tomorrow)
        )
      );

    const [scheduledCount] = await db
      .select({ count: count() })
      .from(appointments)
      .where(eq(appointments.status, 'scheduled'));

    const [confirmedCount] = await db
      .select({ count: count() })
      .from(appointments)
      .where(eq(appointments.status, 'confirmed'));

    const [completedCount] = await db
      .select({ count: count() })
      .from(appointments)
      .where(eq(appointments.status, 'completed'));

    const [cancelledCount] = await db
      .select({ count: count() })
      .from(appointments)
      .where(eq(appointments.status, 'cancelled'));

    // Get upcoming appointments (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const [upcomingCount] = await db
      .select({ count: count() })
      .from(appointments)
      .where(
        and(
          gte(appointments.scheduledDate, today),
          lte(appointments.scheduledDate, nextWeek),
          sql`${appointments.status} IN ('scheduled', 'confirmed')`
        )
      );

    // Get overdue appointments (past scheduled date but not completed/cancelled)
    const [overdueCount] = await db
      .select({ count: count() })
      .from(appointments)
      .where(
        and(
          lte(appointments.scheduledDate, today),
          sql`${appointments.status} IN ('scheduled', 'confirmed')`
        )
      );

    // Get average duration
    const [avgDuration] = await db
      .select({ 
        average: avg(appointments.estimatedDuration) 
      })
      .from(appointments)
      .where(eq(appointments.status, 'completed'));

    const stats = {
      totalAppointments: totalCount.count || 0,
      todayAppointments: todayCount.count || 0,
      scheduledAppointments: scheduledCount.count || 0,
      confirmedAppointments: confirmedCount.count || 0,
      completedAppointments: completedCount.count || 0,
      cancelledAppointments: cancelledCount.count || 0,
      averageDuration: Math.round(Number(avgDuration.average) || 0),
      upcomingAppointments: upcomingCount.count || 0,
      overdueAppointments: overdueCount.count || 0,
    };

    return NextResponse.json({
      data: stats,
      success: true,
    });

  } catch (error) {
    console.error('Error fetching appointment stats:', error);
    return NextResponse.json(
      { 
        message: 'Failed to fetch appointment statistics',
        success: false,
        errors: error instanceof Error ? { general: [error.message] } : undefined 
      },
      { status: 500 }
    );
  }
}


// Apply admin middleware to all routes
export const GET = withAdmin(getHandler);
