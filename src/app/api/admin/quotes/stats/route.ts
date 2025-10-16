import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/lib/auth/admin-middleware';
import { db } from '@/lib/db/config';

import { quotes, quoteItems } from '@/lib/db/schema';

import { eq, and, count, sum, sql, desc, gte, lte } from 'drizzle-orm';


async function getHandler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30days'; // 7days, 30days, 90days, 1year

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '7days':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Get overall stats
    const [totalQuotesResult] = await db
      .select({ count: count() })
      .from(quotes);

    const [pendingQuotesResult] = await db
      .select({ count: count() })
      .from(quotes)
      .where(eq(quotes.status, 'sent'));

    const [acceptedQuotesResult] = await db
      .select({ count: count() })
      .from(quotes)
      .where(eq(quotes.status, 'accepted'));

    const [rejectedQuotesResult] = await db
      .select({ count: count() })
      .from(quotes)
      .where(eq(quotes.status, 'rejected'));

    const [expiredQuotesResult] = await db
      .select({ count: count() })
      .from(quotes)
      .where(eq(quotes.status, 'expired'));

    // Get value stats
    const [totalValueResult] = await db
      .select({ 
        totalValue: sum(quotes.totalAmount),
        avgValue: sql<number>`AVG(${quotes.totalAmount})`,
      })
      .from(quotes)
      .where(eq(quotes.status, 'accepted'));

    const [periodValueResult] = await db
      .select({ 
        totalValue: sum(quotes.totalAmount),
        avgValue: sql<number>`AVG(${quotes.totalAmount})`,
        count: count(),
      })
      .from(quotes)
      .where(and(
        eq(quotes.status, 'accepted'),
        gte(quotes.createdAt, startDate)
      ));

    // Get conversion rate
    const [totalSentResult] = await db
      .select({ count: count() })
      .from(quotes)
      .where(sql`${quotes.status} IN ('sent', 'accepted', 'rejected')`);

    const conversionRate = totalSentResult.count > 0 
      ? (acceptedQuotesResult.count / totalSentResult.count) * 100 
      : 0;

    // Get recent activity (last 30 days by status)
    const recentActivity = await db
      .select({
        status: quotes.status,
        count: count(),
        date: sql<string>`DATE(${quotes.createdAt})`,
      })
      .from(quotes)
      .where(gte(quotes.createdAt, startDate))
      .groupBy(quotes.status, sql`DATE(${quotes.createdAt})`)
      .orderBy(sql`DATE(${quotes.createdAt})`);

    // Get top quote types
    const topQuoteTypes = await db
      .select({
        type: quotes.type,
        count: count(),
        totalValue: sum(quotes.totalAmount),
      })
      .from(quotes)
      .where(gte(quotes.createdAt, startDate))
      .groupBy(quotes.type)
      .orderBy(desc(count()));

    // Get average response time (time from sent to accepted/rejected)
    const responseTimeResult = await db
      .select({
        avgResponseTime: sql<number>`AVG(EXTRACT(EPOCH FROM (${quotes.acceptedAt} - ${quotes.sentAt})) / 3600)`,
      })
      .from(quotes)
      .where(and(
        sql`${quotes.status} IN ('accepted', 'rejected')`,
        sql`${quotes.sentAt} IS NOT NULL`,
        sql`${quotes.acceptedAt} IS NOT NULL`
      ));

    // Get pending quotes about to expire (within 7 days)
    const [expiringQuotesResult] = await db
      .select({ count: count() })
      .from(quotes)
      .where(and(
        eq(quotes.status, 'sent'),
        lte(quotes.validUntil, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
      ));

    // Calculate growth compared to previous period
    const previousStartDate = new Date(startDate);
    const periodDuration = now.getTime() - startDate.getTime();
    previousStartDate.setTime(startDate.getTime() - periodDuration);

    const [previousPeriodResult] = await db
      .select({ 
        count: count(),
        totalValue: sum(quotes.totalAmount),
      })
      .from(quotes)
      .where(and(
        eq(quotes.status, 'accepted'),
        gte(quotes.createdAt, previousStartDate),
        lte(quotes.createdAt, startDate)
      ));

    const quotesGrowth = previousPeriodResult.count > 0
      ? ((periodValueResult.count - previousPeriodResult.count) / previousPeriodResult.count) * 100
      : 0;

    const valueGrowth = (previousPeriodResult.totalValue && parseFloat(previousPeriodResult.totalValue) > 0)
      ? ((parseFloat(periodValueResult.totalValue || '0') - parseFloat(previousPeriodResult.totalValue)) / parseFloat(previousPeriodResult.totalValue)) * 100
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalQuotes: totalQuotesResult.count,
          pendingQuotes: pendingQuotesResult.count,
          acceptedQuotes: acceptedQuotesResult.count,
          rejectedQuotes: rejectedQuotesResult.count,
          expiredQuotes: expiredQuotesResult.count,
          expiringQuotes: expiringQuotesResult.count,
          conversionRate: Math.round(conversionRate * 100) / 100,
        },
        financial: {
          totalValue: parseFloat(totalValueResult.totalValue || '0'),
          averageValue: Math.round((typeof totalValueResult.avgValue === 'number' ? totalValueResult.avgValue : parseFloat(totalValueResult.avgValue || '0')) * 100) / 100,
          periodValue: parseFloat(periodValueResult.totalValue || '0'),
          periodCount: periodValueResult.count,
          valueGrowth: Math.round(valueGrowth * 100) / 100,
          quotesGrowth: Math.round(quotesGrowth * 100) / 100,
        },
        performance: {
          averageResponseTime: Math.round((responseTimeResult[0]?.avgResponseTime || 0) * 100) / 100, // in hours
        },
        activity: recentActivity,
        quoteTypes: topQuoteTypes,
        period: {
          startDate: startDate.toISOString(),
          endDate: now.toISOString(),
          period,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching quote stats:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch quote statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


// Apply admin middleware to all routes
export const GET = withAdmin(getHandler);
