import { pgTable, text, timestamp, boolean, integer, decimal, varchar, uuid, jsonb, index, unique, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ========================================
// BETTER AUTH TABLES (Modified to use UUID for compatibility)
// ========================================

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  role: varchar("role", { length: 50 }).default("customer"),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  isActive: boolean("is_active").default(true),
});

export const session = pgTable("session", {
  id: uuid("id").primaryKey().defaultRandom(),
  expiresAt: timestamp("expires_at").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: varchar("account_id", { length: 255 }).notNull(),
  providerId: varchar("provider_id", { length: 255 }).notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: uuid("id").primaryKey().defaultRandom(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});



// ========================================
// CUSTOMER PROFILES
// ========================================

export const customerProfiles = pgTable('customer_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }).unique(),
  dateOfBirth: timestamp('date_of_birth'),
  gender: varchar('gender', { length: 10 }),
  loyaltyPoints: integer('loyalty_points').notNull().default(0),
  totalSpent: decimal('total_spent', { precision: 10, scale: 2 }).notNull().default('0'),
  preferredContactMethod: varchar('preferred_contact_method', { length: 20 }).default('email'),
  marketingOptIn: boolean('marketing_opt_in').notNull().default(false),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const addresses = pgTable('addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 20 }).notNull(), // 'billing', 'shipping', 'both'
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  company: varchar('company', { length: 255 }),
  addressLine1: varchar('address_line_1', { length: 255 }).notNull(),
  addressLine2: varchar('address_line_2', { length: 255 }),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }),
  postalCode: varchar('postal_code', { length: 20 }).notNull(),
  country: varchar('country', { length: 100 }).notNull().default('Belgium'),
  isDefault: boolean('is_default').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('addresses_user_id_idx').on(table.userId),
}));

// ========================================
// PRODUCTS & INVENTORY
// ========================================

export const brands = pgTable('brands', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  logo: text('logo'),
  website: varchar('website', { length: 255 }),
  countryOfOrigin: varchar('country_of_origin', { length: 100 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  slugIdx: index('brands_slug_idx').on(table.slug),
}));

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  parentId: uuid('parent_id'),
  image: text('image'),
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  slugIdx: index('categories_slug_idx').on(table.slug),
  parentIdIdx: index('categories_parent_id_idx').on(table.parentId),
}));

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  shortDescription: text('short_description'),
  sku: varchar('sku', { length: 100 }).notNull().unique(),
  brandId: uuid('brand_id').notNull().references(() => brands.id),
  categoryId: uuid('category_id').notNull().references(() => categories.id),
  
  // Tire-specific fields
  size: varchar('size', { length: 50 }).notNull(), // e.g., "225/55R16"
  width: integer('width').notNull(), // e.g., 225
  aspectRatio: integer('aspect_ratio').notNull(), // e.g., 55
  rimDiameter: integer('rim_diameter').notNull(), // e.g., 16
  season: varchar('season', { length: 20 }).notNull(), // 'summer', 'winter', 'all-season'
  tireType: varchar('tire_type', { length: 50 }), // 'performance', 'touring', 'suv', etc.
  speedRating: varchar('speed_rating', { length: 5 }), // 'H', 'V', 'W', etc.
  loadIndex: integer('load_index'), // e.g., 91
  runFlat: boolean('run_flat').notNull().default(false),
  fuelEfficiency: varchar('fuel_efficiency', { length: 1 }), // A-G rating
  wetGrip: varchar('wet_grip', { length: 1 }), // A-G rating
  noiseLevel: integer('noise_level'), // dB
  
  // Pricing
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal('compare_at_price', { precision: 10, scale: 2 }),
  cost: decimal('cost', { precision: 10, scale: 2 }),
  
  // Inventory
  stockQuantity: integer('stock_quantity').notNull().default(0),
  lowStockThreshold: integer('low_stock_threshold').notNull().default(10),
  trackQuantity: boolean('track_quantity').notNull().default(true),
  
  // Product attributes
  weight: decimal('weight', { precision: 8, scale: 2 }),
  dimensions: jsonb('dimensions'), // {length, width, height}
  images: jsonb('images'), // Array of image URLs
  features: jsonb('features'), // Array of feature strings
  specifications: jsonb('specifications'), // Key-value pairs
  
  // SEO & Status
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: text('meta_description'),
  isActive: boolean('is_active').notNull().default(true),
  isFeatured: boolean('is_featured').notNull().default(false),
  publishedAt: timestamp('published_at'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  slugIdx: index('products_slug_idx').on(table.slug),
  skuIdx: index('products_sku_idx').on(table.sku),
  brandIdIdx: index('products_brand_id_idx').on(table.brandId),
  categoryIdIdx: index('products_category_id_idx').on(table.categoryId),
  sizeIdx: index('products_size_idx').on(table.size),
  seasonIdx: index('products_season_idx').on(table.season),
  priceIdx: index('products_price_idx').on(table.price),
  stockIdx: index('products_stock_idx').on(table.stockQuantity),
  featuredIdx: index('products_featured_idx').on(table.isFeatured),
}));

// ========================================
// SERVICES
// ========================================

export const serviceCategories = pgTable('service_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }),
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  shortDescription: text('short_description'),
  categoryId: uuid('category_id').notNull().references(() => serviceCategories.id),
  
  // Pricing
  basePrice: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
  hourlyRate: decimal('hourly_rate', { precision: 10, scale: 2 }),
  
  // Service details
  estimatedDuration: integer('estimated_duration').notNull(), // in minutes
  requiresAppointment: boolean('requires_appointment').notNull().default(true),
  availableOnline: boolean('available_online').notNull().default(false),
  
  // Service attributes
  features: jsonb('features'), // Array of feature strings
  requirements: jsonb('requirements'), // Array of requirement strings
  included: jsonb('included'), // Array of what's included
  warranty: text('warranty'),
  
  // SEO & Status
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: text('meta_description'),
  isActive: boolean('is_active').notNull().default(true),
  isFeatured: boolean('is_featured').notNull().default(false),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  slugIdx: index('services_slug_idx').on(table.slug),
  categoryIdIdx: index('services_category_id_idx').on(table.categoryId),
  priceIdx: index('services_price_idx').on(table.basePrice),
  featuredIdx: index('services_featured_idx').on(table.isFeatured),
}));

// ========================================
// ORDERS & TRANSACTIONS
// ========================================

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  userId: uuid('user_id').references(() => user.id),
  
  // Order details
  status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, confirmed, processing, shipped, delivered, cancelled
  type: varchar('type', { length: 20 }).notNull().default('product'), // 'product', 'service', 'mixed'
  
  // Customer info (for guest orders)
  customerEmail: varchar('customer_email', { length: 255 }),
  customerPhone: varchar('customer_phone', { length: 20 }),
  customerName: varchar('customer_name', { length: 255 }),
  
  // Pricing
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  taxAmount: decimal('tax_amount', { precision: 10, scale: 2 }).notNull().default('0'),
  shippingAmount: decimal('shipping_amount', { precision: 10, scale: 2 }).notNull().default('0'),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).notNull().default('0'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  
  // Addresses
  billingAddress: jsonb('billing_address'),
  shippingAddress: jsonb('shipping_address'),
  
  // Payment
  paymentStatus: varchar('payment_status', { length: 50 }).notNull().default('pending'),
  paymentMethod: varchar('payment_method', { length: 50 }),
  paidAt: timestamp('paid_at'),
  
  // Fulfillment
  shippedAt: timestamp('shipped_at'),
  deliveredAt: timestamp('delivered_at'),
  trackingNumber: varchar('tracking_number', { length: 100 }),
  
  // Additional info
  notes: text('notes'),
  internalNotes: text('internal_notes'),
  metadata: jsonb('metadata'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  orderNumberIdx: index('orders_order_number_idx').on(table.orderNumber),
  userIdIdx: index('orders_user_id_idx').on(table.userId),
  statusIdx: index('orders_status_idx').on(table.status),
  typeIdx: index('orders_type_idx').on(table.type),
  createdAtIdx: index('orders_created_at_idx').on(table.createdAt),
}));

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').references(() => products.id),
  serviceId: uuid('service_id').references(() => services.id),
  
  // Item details
  name: varchar('name', { length: 255 }).notNull(),
  sku: varchar('sku', { length: 100 }),
  quantity: integer('quantity').notNull().default(1),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  
  // Product/Service snapshot
  variant: jsonb('variant'), // Size, color, etc.
  metadata: jsonb('metadata'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  orderIdIdx: index('order_items_order_id_idx').on(table.orderId),
  productIdIdx: index('order_items_product_id_idx').on(table.productId),
  serviceIdIdx: index('order_items_service_id_idx').on(table.serviceId),
}));

// ========================================
// APPOINTMENTS & BOOKINGS
// ========================================

export const appointments = pgTable('appointments', {
  id: uuid('id').primaryKey().defaultRandom(),
  appointmentNumber: varchar('appointment_number', { length: 50 }).notNull().unique(),
  userId: uuid('user_id').references(() => user.id),
  orderId: uuid('order_id').references(() => orders.id),
  
  // Customer info (for guest appointments)
  customerEmail: varchar('customer_email', { length: 255 }),
  customerPhone: varchar('customer_phone', { length: 20 }),
  customerName: varchar('customer_name', { length: 255 }),
  
  // Appointment details
  serviceId: uuid('service_id').notNull().references(() => services.id),
  status: varchar('status', { length: 50 }).notNull().default('scheduled'), // scheduled, confirmed, in-progress, completed, cancelled, no-show
  type: varchar('type', { length: 50 }).notNull().default('service'), // 'service', 'installation', 'consultation'
  
  // Vehicle information
  vehicleYear: varchar('vehicle_year', { length: 4 }),
  vehicleMake: varchar('vehicle_make', { length: 100 }),
  vehicleModel: varchar('vehicle_model', { length: 100 }),
  vehicleLicense: varchar('vehicle_license', { length: 50 }),
  vehicleVin: varchar('vehicle_vin', { length: 17 }),
  
  // Scheduling
  scheduledDate: timestamp('scheduled_date').notNull(),
  scheduledTime: varchar('scheduled_time', { length: 10 }).notNull(), // "09:00"
  estimatedDuration: integer('estimated_duration').notNull(), // in minutes
  actualStartTime: timestamp('actual_start_time'),
  actualEndTime: timestamp('actual_end_time'),
  
  // Staff assignment
  assignedTechnician: uuid('assigned_technician').references(() => user.id),
  
  // Additional info
  notes: text('notes'),
  internalNotes: text('internal_notes'),
  reminderSent: boolean('reminder_sent').notNull().default(false),
  confirmationSent: boolean('confirmation_sent').notNull().default(false),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  appointmentNumberIdx: index('appointments_appointment_number_idx').on(table.appointmentNumber),
  userIdIdx: index('appointments_user_id_idx').on(table.userId),
  serviceIdIdx: index('appointments_service_id_idx').on(table.serviceId),
  statusIdx: index('appointments_status_idx').on(table.status),
  scheduledDateIdx: index('appointments_scheduled_date_idx').on(table.scheduledDate),
  technicianIdx: index('appointments_technician_idx').on(table.assignedTechnician),
}));

// ========================================
// QUOTES & ESTIMATES
// ========================================

export const quotes = pgTable('quotes', {
  id: uuid('id').primaryKey().defaultRandom(),
  quoteNumber: varchar('quote_number', { length: 50 }).notNull().unique(),
  userId: uuid('user_id').references(() => user.id),
  
  // Customer info (for guest quotes)
  customerEmail: varchar('customer_email', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 20 }),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  
  // Quote details
  status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, sent, accepted, rejected, expired
  type: varchar('type', { length: 20 }).notNull().default('tire'), // 'tire', 'service', 'mixed'
  
  // Vehicle information
  vehicleYear: varchar('vehicle_year', { length: 4 }),
  vehicleMake: varchar('vehicle_make', { length: 100 }),
  vehicleModel: varchar('vehicle_model', { length: 100 }),
  
  // Pricing
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  taxAmount: decimal('tax_amount', { precision: 10, scale: 2 }).notNull().default('0'),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).notNull().default('0'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  
  // Validity
  validUntil: timestamp('valid_until').notNull(),
  sentAt: timestamp('sent_at'),
  acceptedAt: timestamp('accepted_at'),
  
  // Additional info
  notes: text('notes'),
  internalNotes: text('internal_notes'),
  requirements: jsonb('requirements'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  quoteNumberIdx: index('quotes_quote_number_idx').on(table.quoteNumber),
  userIdIdx: index('quotes_user_id_idx').on(table.userId),
  statusIdx: index('quotes_status_idx').on(table.status),
  validUntilIdx: index('quotes_valid_until_idx').on(table.validUntil),
}));

export const quoteItems = pgTable('quote_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  quoteId: uuid('quote_id').notNull().references(() => quotes.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').references(() => products.id),
  serviceId: uuid('service_id').references(() => services.id),
  
  // Item details
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  quantity: integer('quantity').notNull().default(1),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  
  // Additional info
  notes: text('notes'),
  metadata: jsonb('metadata'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  quoteIdIdx: index('quote_items_quote_id_idx').on(table.quoteId),
  productIdIdx: index('quote_items_product_id_idx').on(table.productId),
  serviceIdIdx: index('quote_items_service_id_idx').on(table.serviceId),
}));

// ========================================
// INVENTORY & STOCK
// ========================================

export const stockMovements = pgTable('stock_movements', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id),
  type: varchar('type', { length: 50 }).notNull(), // 'purchase', 'sale', 'adjustment', 'return', 'transfer'
  quantity: integer('quantity').notNull(),
  previousQuantity: integer('previous_quantity').notNull(),
  newQuantity: integer('new_quantity').notNull(),
  unitCost: decimal('unit_cost', { precision: 10, scale: 2 }),
  totalCost: decimal('total_cost', { precision: 10, scale: 2 }),
  reference: varchar('reference', { length: 100 }), // Order ID, PO number, etc.
  notes: text('notes'),
  createdBy: uuid('created_by').references(() => user.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  productIdIdx: index('stock_movements_product_id_idx').on(table.productId),
  typeIdx: index('stock_movements_type_idx').on(table.type),
  createdAtIdx: index('stock_movements_created_at_idx').on(table.createdAt),
}));

// ========================================
// MARKETING & COMMUNICATIONS
// ========================================

export const newsletterSubscriptions = pgTable('newsletter_subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  status: varchar('status', { length: 20 }).notNull().default('active'), // 'active', 'unsubscribed', 'bounced'
  source: varchar('source', { length: 50 }), // 'website', 'store', 'social', etc.
  interests: jsonb('interests'), // Array of interest categories
  subscribedAt: timestamp('subscribed_at').defaultNow().notNull(),
  unsubscribedAt: timestamp('unsubscribed_at'),
  lastEmailSent: timestamp('last_email_sent'),
}, (table) => ({
  emailIdx: index('newsletter_subscriptions_email_idx').on(table.email),
  statusIdx: index('newsletter_subscriptions_status_idx').on(table.status),
}));

export const emailCampaigns = pgTable('email_campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  htmlContent: text('html_content'),
  textContent: text('text_content'),
  status: varchar('status', { length: 20 }).notNull().default('draft'), // 'draft', 'scheduled', 'sending', 'sent', 'cancelled'
  scheduledAt: timestamp('scheduled_at'),
  sentAt: timestamp('sent_at'),
  recipientCount: integer('recipient_count').notNull().default(0),
  openCount: integer('open_count').notNull().default(0),
  clickCount: integer('click_count').notNull().default(0),
  unsubscribeCount: integer('unsubscribe_count').notNull().default(0),
  bounceCount: integer('bounce_count').notNull().default(0),
  createdBy: uuid('created_by').notNull().references(() => user.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  statusIdx: index('email_campaigns_status_idx').on(table.status),
  scheduledAtIdx: index('email_campaigns_scheduled_at_idx').on(table.scheduledAt),
}));

// ========================================
// REVIEWS & RATINGS
// ========================================

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => user.id),
  productId: uuid('product_id').references(() => products.id),
  serviceId: uuid('service_id').references(() => services.id),
  orderId: uuid('order_id').references(() => orders.id),
  
  // Review details
  rating: integer('rating').notNull(), // 1-5 stars
  title: varchar('title', { length: 255 }),
  content: text('content'),
  
  // Reviewer info (for guest reviews)
  reviewerName: varchar('reviewer_name', { length: 255 }),
  reviewerEmail: varchar('reviewer_email', { length: 255 }),
  
  // Status
  status: varchar('status', { length: 20 }).notNull().default('pending'), // 'pending', 'approved', 'rejected'
  isVerifiedPurchase: boolean('is_verified_purchase').notNull().default(false),
  helpfulCount: integer('helpful_count').notNull().default(0),
  
  // Moderation
  moderatedBy: uuid('moderated_by').references(() => user.id),
  moderatedAt: timestamp('moderated_at'),
  moderationNotes: text('moderation_notes'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('reviews_user_id_idx').on(table.userId),
  productIdIdx: index('reviews_product_id_idx').on(table.productId),
  serviceIdIdx: index('reviews_service_id_idx').on(table.serviceId),
  statusIdx: index('reviews_status_idx').on(table.status),
  ratingIdx: index('reviews_rating_idx').on(table.rating),
}));

// ========================================
// SYSTEM SETTINGS & CONFIGURATIONS
// ========================================

export const systemSettings = pgTable('system_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: varchar('key', { length: 255 }).notNull().unique(),
  value: jsonb('value'),
  description: text('description'),
  type: varchar('type', { length: 50 }).notNull(), // 'string', 'number', 'boolean', 'json', 'array'
  category: varchar('category', { length: 100 }).notNull(), // 'general', 'email', 'payment', 'shipping', etc.
  isPublic: boolean('is_public').notNull().default(false),
  updatedBy: uuid('updated_by').references(() => user.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  keyIdx: index('system_settings_key_idx').on(table.key),
  categoryIdx: index('system_settings_category_idx').on(table.category),
}));

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => user.id),
  action: varchar('action', { length: 100 }).notNull(),
  resource: varchar('resource', { length: 100 }).notNull(),
  resourceId: varchar('resource_id', { length: 255 }),
  oldValues: jsonb('old_values'),
  newValues: jsonb('new_values'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('audit_logs_user_id_idx').on(table.userId),
  actionIdx: index('audit_logs_action_idx').on(table.action),
  resourceIdx: index('audit_logs_resource_idx').on(table.resource),
  createdAtIdx: index('audit_logs_created_at_idx').on(table.createdAt),
}));

// ========================================
// RELATIONS
// ========================================

export const userRelations = relations(user, ({ one, many }) => ({
  profile: one(customerProfiles),
  addresses: many(addresses),
  orders: many(orders),
  appointments: many(appointments),
  quotes: many(quotes),
  reviews: many(reviews),
  sessions: many(session),
  accounts: many(account),
}));

export const customerProfilesRelations = relations(customerProfiles, ({ one }) => ({
  user: one(user, {
    fields: [customerProfiles.userId],
    references: [user.id],
  }),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(user, {
    fields: [addresses.userId],
    references: [user.id],
  }),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  orderItems: many(orderItems),
  quoteItems: many(quoteItems),
  reviews: many(reviews),
  stockMovements: many(stockMovements),
}));

export const serviceCategoriesRelations = relations(serviceCategories, ({ many }) => ({
  services: many(services),
}));

export const servicesRelations = relations(services, ({ one, many }) => ({
  category: one(serviceCategories, {
    fields: [services.categoryId],
    references: [serviceCategories.id],
  }),
  appointments: many(appointments),
  orderItems: many(orderItems),
  quoteItems: many(quoteItems),
  reviews: many(reviews),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(user, {
    fields: [orders.userId],
    references: [user.id],
  }),
  items: many(orderItems),
  appointments: many(appointments),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  service: one(services, {
    fields: [orderItems.serviceId],
    references: [services.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  user: one(user, {
    fields: [appointments.userId],
    references: [user.id],
  }),
  service: one(services, {
    fields: [appointments.serviceId],
    references: [services.id],
  }),
  order: one(orders, {
    fields: [appointments.orderId],
    references: [orders.id],
  }),
  technician: one(user, {
    fields: [appointments.assignedTechnician],
    references: [user.id],
  }),
}));

export const quotesRelations = relations(quotes, ({ one, many }) => ({
  user: one(user, {
    fields: [quotes.userId],
    references: [user.id],
  }),
  items: many(quoteItems),
}));

export const quoteItemsRelations = relations(quoteItems, ({ one }) => ({
  quote: one(quotes, {
    fields: [quoteItems.quoteId],
    references: [quotes.id],
  }),
  product: one(products, {
    fields: [quoteItems.productId],
    references: [products.id],
  }),
  service: one(services, {
    fields: [quoteItems.serviceId],
    references: [services.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(user, {
    fields: [reviews.userId],
    references: [user.id],
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  service: one(services, {
    fields: [reviews.serviceId],
    references: [services.id],
  }),
  order: one(orders, {
    fields: [reviews.orderId],
    references: [orders.id],
  }),
}));

export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
  product: one(products, {
    fields: [stockMovements.productId],
    references: [products.id],
  }),
  createdBy: one(user, {
    fields: [stockMovements.createdBy],
    references: [user.id],
  }),
}));

// ========================================
// HERO BANNERS TABLE
// ========================================

export const heroBanners = pgTable("hero_banners", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  description: text("description"),
  badge: varchar("badge", { length: 100 }),
  discount: varchar("discount", { length: 50 }),
  cta: varchar("cta", { length: 100 }).notNull(),
  ctaLink: varchar("cta_link", { length: 255 }).notNull(),
  image: text("image"),
  gradient: varchar("gradient", { length: 255 }).default("from-orange-500 to-amber-500"),
  bgGradient: varchar("bg_gradient", { length: 255 }).default("from-black/60 to-black/40"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
  createdBy: uuid("created_by")
    .references(() => user.id, { onDelete: "set null" }),
}, (table) => ({
  activeIndex: index("hero_banners_active_idx").on(table.isActive),
  sortOrderIndex: index("hero_banners_sort_order_idx").on(table.sortOrder),
}));

export const heroBannersRelations = relations(heroBanners, ({ one }) => ({
  createdBy: one(user, {
    fields: [heroBanners.createdBy],
    references: [user.id],
  }),
}));
