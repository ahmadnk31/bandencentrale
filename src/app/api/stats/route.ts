import { NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { user, products, brands, orders } from '@/lib/db/schema';
import { count, sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Get total active customers
    const [customersResult] = await db
      .select({ count: count() })
      .from(user)
      .where(sql`${user.role} = 'customer'`);

    // Get total active brands
    const [brandsResult] = await db
      .select({ count: count() })
      .from(brands)
      .where(sql`${brands.isActive} = true`);

    // Get total active products
    const [productsResult] = await db
      .select({ count: count() })
      .from(products)
      .where(sql`${products.isActive} = true`);

    // Get total orders (as a measure of transactions)
    const [ordersResult] = await db
      .select({ count: count() })
      .from(orders);

    // Calculate years in business (assuming business started in 2010)
    const businessStartYear = 2010;
    const currentYear = new Date().getFullYear();
    const yearsInBusiness = currentYear - businessStartYear;

    // Format the numbers for display
    const formatNumber = (num: number): string => {
      if (num >= 1000) {
        return `${Math.floor(num / 1000)}K+`;
      }
      return `${num}+`;
    };

    const stats = [
      {
        value: formatNumber(customersResult.count),
        label: "Customers",
        icon: "👥",
        actualValue: customersResult.count
      },
      {
        value: `${yearsInBusiness}+`,
        label: "Years",
        icon: "⭐",
        actualValue: yearsInBusiness
      },
      {
        value: `${brandsResult.count}+`,
        label: "Brands",
        icon: "🏷️",
        actualValue: brandsResult.count
      },
      {
        value: "24/7",
        label: "Support",
        icon: "📞",
        actualValue: 24
      }
    ];

    return NextResponse.json({
      success: true,
      data: stats,
      metadata: {
        totalCustomers: customersResult.count,
        totalBrands: brandsResult.count,
        totalProducts: productsResult.count,
        totalOrders: ordersResult.count,
        yearsInBusiness
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    
    // Return fallback stats if database query fails
    const fallbackStats = [
      { value: "50K+", label: "Customers", icon: "👥", actualValue: 50000 },
      { value: "15+", label: "Years", icon: "⭐", actualValue: 15 },
      { value: "100+", label: "Brands", icon: "🏷️", actualValue: 100 },
      { value: "24/7", label: "Support", icon: "📞", actualValue: 24 }
    ];

    return NextResponse.json({
      success: false,
      data: fallbackStats,
      error: error instanceof Error ? error.message : 'Failed to fetch stats',
      fallback: true
    });
  }
}
