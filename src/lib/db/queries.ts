import { db } from './config';
import { user, customerProfiles, orders, orderItems, products, services, appointments, quotes, quoteItems, brands, categories } from './schema';
import { eq, and, or, desc, asc, count, sum, avg, like, ilike, gte, lte, inArray } from 'drizzle-orm';
import type { User, Session } from '../auth/auth';

// ========================================
// USER MANAGEMENT
// ========================================

export const createUser = async (userData: {
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: 'customer' | 'admin';
}) => {
  const [newuser] = await db.insert(user).values({
    ...userData,
    role: userData.role || 'customer',
  }).returning();

  // Create customer profile if role is customer
  if (newuser.role === 'customer') {
    await db.insert(customerProfiles).values({
      userId: newuser.id,
    });
  }

  return newuser;
};

export const getUserById = async (id: string) => {
  const [newuser] = await db
    .select()
    .from(user)
    .where(eq(user.id, id))
    .limit(1);

  return user || null;
};

export const getUserByEmail = async (email: string) => {
  const [newuser] = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  return user || null;
};

export const updateUserLastLogin = async (userId: string) => {
  await db
    .update(user)
    .set({ updatedAt: new Date() })
    .where(eq(user.id, userId));
};

export const updateUserProfile = async (userId: string, updates: Partial<typeof user.$inferInsert>) => {
  const [newuser] = await db
    .update(user)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(user.id, userId))
    .returning();

  return user;
};

// ========================================
// PRODUCT MANAGEMENT
// ========================================

export const getProducts = async (filters?: {
  brand?: string;
  category?: string;
  season?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  inStock?: boolean;
  featured?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'price' | 'name' | 'created' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}) => {
  let query = db.select().from(products);
  const conditions = [eq(products.isActive, true)];

  // Apply filters
  if (filters?.brand) {
    conditions.push(eq(products.brandId, filters.brand));
  }
  if (filters?.category) {
    conditions.push(eq(products.categoryId, filters.category));
  }
  if (filters?.season) {
    conditions.push(eq(products.season, filters.season));
  }
  if (filters?.size) {
    conditions.push(eq(products.size, filters.size));
  }
  if (filters?.minPrice) {
    conditions.push(gte(products.price, filters.minPrice.toString()));
  }
  if (filters?.maxPrice) {
    conditions.push(lte(products.price, filters.maxPrice.toString()));
  }
  if (filters?.search) {
    const searchCondition = or(
      ilike(products.name, `%${filters.search}%`),
      ilike(products.description, `%${filters.search}%`),
      ilike(products.sku, `%${filters.search}%`)
    );
    if (searchCondition) {
      conditions.push(searchCondition);
    }
  }
  if (filters?.inStock) {
    conditions.push(gte(products.stockQuantity, 1));
  }
  if (filters?.featured) {
    conditions.push(eq(products.isFeatured, true));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
  }

  // Apply sorting
  const sortBy = filters?.sortBy || 'created';
  const sortOrder = filters?.sortOrder || 'desc';
  
  switch (sortBy) {
    case 'price':
      query = query.orderBy(sortOrder === 'asc' ? asc(products.price) : desc(products.price)) as typeof query;
      break;
    case 'name':
      query = query.orderBy(sortOrder === 'asc' ? asc(products.name) : desc(products.name)) as typeof query;
      break;
    case 'created':
      query = query.orderBy(sortOrder === 'asc' ? asc(products.createdAt) : desc(products.createdAt)) as typeof query;
      break;
    default:
      query = query.orderBy(desc(products.createdAt)) as typeof query;
  }

  // Apply pagination
  if (filters?.limit) {
    query = query.limit(filters.limit) as typeof query;
  }
  if (filters?.offset) {
    query = query.offset(filters.offset) as typeof query;
  }

  return query.execute();
};

export const getProductById = async (id: string) => {
  const [product] = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      shortDescription: products.shortDescription,
      sku: products.sku,
      brandId: products.brandId,
      categoryId: products.categoryId,
      size: products.size,
      width: products.width,
      aspectRatio: products.aspectRatio,
      rimDiameter: products.rimDiameter,
      season: products.season,
      speedRating: products.speedRating,
      loadIndex: products.loadIndex,
      fuelEfficiency: products.fuelEfficiency,
      wetGrip: products.wetGrip,
      noiseLevel: products.noiseLevel,
      tireType: products.tireType,
      runFlat: products.runFlat,
      price: products.price,
      compareAtPrice: products.compareAtPrice,
      cost: products.cost,
      stockQuantity: products.stockQuantity,
      lowStockThreshold: products.lowStockThreshold,
      trackQuantity: products.trackQuantity,
      weight: products.weight,
      dimensions: products.dimensions,
      images: products.images,
      features: products.features,
      specifications: products.specifications,
      metaTitle: products.metaTitle,
      metaDescription: products.metaDescription,
      isActive: products.isActive,
      isFeatured: products.isFeatured,
      publishedAt: products.publishedAt,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      brand: {
        id: brands.id,
        name: brands.name,
        slug: brands.slug,
        description: brands.description,
        logo: brands.logo,
        website: brands.website,
      },
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
      }
    })
    .from(products)
    .leftJoin(brands, eq(products.brandId, brands.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.id, id), eq(products.isActive, true)))
    .limit(1);

  return product || null;
};

export const getProductBySlug = async (slug: string) => {
  const [product] = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      shortDescription: products.shortDescription,
      sku: products.sku,
      brandId: products.brandId,
      categoryId: products.categoryId,
      size: products.size,
      width: products.width,
      aspectRatio: products.aspectRatio,
      rimDiameter: products.rimDiameter,
      season: products.season,
      speedRating: products.speedRating,
      loadIndex: products.loadIndex,
      fuelEfficiency: products.fuelEfficiency,
      wetGrip: products.wetGrip,
      noiseLevel: products.noiseLevel,
      tireType: products.tireType,
      runFlat: products.runFlat,
      price: products.price,
      compareAtPrice: products.compareAtPrice,
      cost: products.cost,
      stockQuantity: products.stockQuantity,
      lowStockThreshold: products.lowStockThreshold,
      trackQuantity: products.trackQuantity,
      weight: products.weight,
      dimensions: products.dimensions,
      images: products.images,
      features: products.features,
      specifications: products.specifications,
      metaTitle: products.metaTitle,
      metaDescription: products.metaDescription,
      isActive: products.isActive,
      isFeatured: products.isFeatured,
      publishedAt: products.publishedAt,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      brand: {
        id: brands.id,
        name: brands.name,
        slug: brands.slug,
        description: brands.description,
        logo: brands.logo,
        website: brands.website,
      },
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
      }
    })
    .from(products)
    .leftJoin(brands, eq(products.brandId, brands.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.slug, slug), eq(products.isActive, true)))
    .limit(1);

  return product || null;
};

export const getFeaturedProducts = async (limit = 8) => {
  return db
    .select()
    .from(products)
    .where(and(eq(products.isActive, true), eq(products.isFeatured, true)))
    .orderBy(desc(products.createdAt))
    .limit(limit)
    .execute();
};

// ========================================
// ORDER MANAGEMENT
// ========================================

export const createOrder = async (orderData: {
  userId?: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  subtotal: number;
  taxAmount?: number;
  shippingAmount?: number;
  discountAmount?: number;
  totalAmount: number;
  billingAddress?: any;
  shippingAddress?: any;
  paymentMethod?: string;
  items: Array<{
    productId?: string;
    serviceId?: string;
    name: string;
    sku?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    variant?: any;
  }>;
}) => {
  return db.transaction(async (tx) => {
    // Generate order number
    const orderNumber = `BC${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Create order
    const [order] = await tx.insert(orders).values({
      orderNumber,
      userId: orderData.userId,
      customerEmail: orderData.customerEmail,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      subtotal: orderData.subtotal.toString(),
      taxAmount: (orderData.taxAmount || 0).toString(),
      shippingAmount: (orderData.shippingAmount || 0).toString(),
      discountAmount: (orderData.discountAmount || 0).toString(),
      totalAmount: orderData.totalAmount.toString(),
      billingAddress: orderData.billingAddress,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
    }).returning();

    // Create order items
    const createdOrderItems = await Promise.all(
      orderData.items.map(async (item) => {
        const [orderItem] = await tx.insert(orderItems).values({
          orderId: order.id,
          productId: item.productId,
          serviceId: item.serviceId,
          name: item.name,
          sku: item.sku,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toString(),
          totalPrice: item.totalPrice.toString(),
          variant: item.variant,
        }).returning();
        return orderItem;
      })
    );

    return { order, items: createdOrderItems };
  });
};

export const getOrdersByUser = async (userId: string) => {
  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))
    .execute();
};

export const getOrderById = async (id: string) => {
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);

  return order || null;
};

// ========================================
// APPOINTMENT MANAGEMENT
// ========================================

export const createAppointment = async (appointmentData: {
  userId?: string;
  serviceId: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  scheduledDate: Date;
  scheduledTime: string;
  estimatedDuration: number;
  vehicleYear?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  notes?: string;
}) => {
  // Generate appointment number
  const appointmentNumber = `APT${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

  const [appointment] = await db.insert(appointments).values({
    appointmentNumber,
    ...appointmentData,
  }).returning();

  return appointment;
};

export const getAppointmentsByUser = async (userId: string) => {
  return db
    .select()
    .from(appointments)
    .where(eq(appointments.userId, userId))
    .orderBy(desc(appointments.scheduledDate))
    .execute();
};

export const getAppointmentsByDate = async (date: Date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return db
    .select()
    .from(appointments)
    .where(
      and(
        gte(appointments.scheduledDate, startOfDay),
        lte(appointments.scheduledDate, endOfDay)
      )
    )
    .orderBy(asc(appointments.scheduledTime))
    .execute();
};

// ========================================
// QUOTE MANAGEMENT
// ========================================

export const createQuote = async (quoteData: {
  userId?: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  type: 'tire' | 'service' | 'mixed';
  vehicleYear?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  subtotal: number;
  taxAmount?: number;
  discountAmount?: number;
  totalAmount: number;
  validUntil: Date;
  notes?: string;
  requirements?: any;
  items: Array<{
    productId?: string;
    serviceId?: string;
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}) => {
  return db.transaction(async (tx) => {
    // Generate quote number
    const quoteNumber = `QT${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Create quote
    const [quote] = await tx.insert(quotes).values({
      quoteNumber,
      userId: quoteData.userId,
      customerEmail: quoteData.customerEmail,
      customerName: quoteData.customerName,
      customerPhone: quoteData.customerPhone,
      type: quoteData.type,
      vehicleYear: quoteData.vehicleYear,
      vehicleMake: quoteData.vehicleMake,
      vehicleModel: quoteData.vehicleModel,
      subtotal: quoteData.subtotal.toString(),
      taxAmount: (quoteData.taxAmount || 0).toString(),
      discountAmount: (quoteData.discountAmount || 0).toString(),
      totalAmount: quoteData.totalAmount.toString(),
      validUntil: quoteData.validUntil,
      notes: quoteData.notes,
      requirements: quoteData.requirements,
    }).returning();

    // Create quote items
    const createdQuoteItems = await Promise.all(
      quoteData.items.map(async (item) => {
        const [quoteItem] = await tx.insert(quoteItems).values({
          quoteId: quote.id,
          productId: item.productId,
          serviceId: item.serviceId,
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toString(),
          totalPrice: item.totalPrice.toString(),
        }).returning();
        return quoteItem;
      })
    );

    return { quote, items: createdQuoteItems };
  });
};

// ========================================
// ANALYTICS & REPORTING
// ========================================

export const getDashboardStats = async () => {
  const [totalUsers] = await db
    .select({ count: count() })
    .from(user)
    .where(eq(user.role, 'customer'));

  const [totalOrders] = await db
    .select({ count: count() })
    .from(orders);

  const [totalRevenue] = await db
    .select({ sum: sum(orders.totalAmount) })
    .from(orders)
    .where(eq(orders.paymentStatus, 'paid'));

  const [avgOrderValue] = await db
    .select({ avg: avg(orders.totalAmount) })
    .from(orders)
    .where(eq(orders.paymentStatus, 'paid'));

  return {
    totalUsers: totalUsers.count || 0,
    totalOrders: totalOrders.count || 0,
    totalRevenue: parseFloat(totalRevenue.sum || '0'),
    avgOrderValue: parseFloat(avgOrderValue.avg || '0'),
  };
};

export const getRecentOrders = async (limit = 10) => {
  return db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(limit)
    .execute();
};

export const getLowStockProducts = async (threshold = 10) => {
  return db
    .select()
    .from(products)
    .where(
      and(
        eq(products.isActive, true),
        eq(products.trackQuantity, true),
        lte(products.stockQuantity, threshold)
      )
    )
    .orderBy(asc(products.stockQuantity))
    .execute();
};

// ========================================
// SEARCH & FILTERS
// ========================================

export const searchProducts = async (searchTerm: string, limit = 20) => {
  return db
    .select()
    .from(products)
    .where(
      and(
        eq(products.isActive, true),
        or(
          ilike(products.name, `%${searchTerm}%`),
          ilike(products.description, `%${searchTerm}%`),
          ilike(products.sku, `%${searchTerm}%`),
          ilike(products.size, `%${searchTerm}%`)
        )
      )
    )
    .orderBy(desc(products.isFeatured), desc(products.createdAt))
    .limit(limit)
    .execute();
};

export const getFilterOptions = async () => {
  // Get unique brands, categories, seasons, sizes
  const brands = await db
    .selectDistinct({ value: products.brandId })
    .from(products)
    .where(eq(products.isActive, true))
    .execute();

  const seasons = await db
    .selectDistinct({ value: products.season })
    .from(products)
    .where(eq(products.isActive, true))
    .execute();

  const sizes = await db
    .selectDistinct({ value: products.size })
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(asc(products.size))
    .execute();

  return {
    brands,
    seasons,
    sizes,
  };
};

// ========================================
// TYPE EXPORTS
// ========================================

export type DbUser = typeof user.$inferSelect;
export type DbProduct = typeof products.$inferSelect;
export type DbOrder = typeof orders.$inferSelect;
export type DbAppointment = typeof appointments.$inferSelect;
export type DbQuote = typeof quotes.$inferSelect;
