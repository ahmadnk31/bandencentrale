import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/lib/auth/admin-middleware';
import { db } from '@/lib/db/config';
import { withAdmin } from '@/lib/auth/admin-middleware';
import { products } from '@/lib/db/schema';
import { withAdmin } from '@/lib/auth/admin-middleware';
import { count, eq, sql, lte } from 'drizzle-orm';
import { withAdmin } from '@/lib/auth/admin-middleware';

async function getHandler(request: NextRequest) {
  try {
    // Get basic stats
    const [totalProductsResult] = await db
      .select({ count: count() })
      .from(products);

    const [activeProductsResult] = await db
      .select({ count: count() })
      .from(products)
      .where(eq(products.isActive, true));

    const [inactiveProductsResult] = await db
      .select({ count: count() })
      .from(products)
      .where(eq(products.isActive, false));

    // Get low stock and out of stock products
    const [lowStockResult] = await db
      .select({ count: count() })
      .from(products)
      .where(
        sql`${products.stockQuantity} <= ${products.lowStockThreshold} AND ${products.stockQuantity} > 0`
      );

    const [outOfStockResult] = await db
      .select({ count: count() })
      .from(products)
      .where(eq(products.stockQuantity, 0));

    const [featuredProductsResult] = await db
      .select({ count: count() })
      .from(products)
      .where(eq(products.isFeatured, true));

    // Get total value and average price
    const [valueResult] = await db
      .select({
        totalValue: sql<number>`SUM(${products.price} * ${products.stockQuantity})`,
        averagePrice: sql<number>`AVG(${products.price})`,
      })
      .from(products)
      .where(eq(products.isActive, true));

    const stats = {
      totalProducts: totalProductsResult.count,
      activeProducts: activeProductsResult.count,
      inactiveProducts: inactiveProductsResult.count,
      lowStockProducts: lowStockResult.count,
      outOfStockProducts: outOfStockResult.count,
      featuredProducts: featuredProductsResult.count,
      totalValue: valueResult.totalValue || 0,
      averagePrice: valueResult.averagePrice || 0,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching product stats:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch product statistics',
      },
      { status: 500 }
    );
  }
}


// Apply admin middleware to all routes
export const GET = withAdmin(getHandler);
