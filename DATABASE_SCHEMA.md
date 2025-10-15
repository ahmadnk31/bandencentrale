# BandenCentrale Database Schema Documentation

## Overview

This document outlines the comprehensive database schema for BandenCentrale, a modern tire shop e-commerce platform built with Next.js, Drizzle ORM, Better Auth, and AWS services.

## 🏗️ **Architecture Overview**

### **Technology Stack**
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth with email verification
- **Email Service**: AWS SES
- **File Storage**: AWS S3
- **Framework**: Next.js 15 with App Router
- **Type Safety**: Full TypeScript integration

### **Key Features**
- ✅ **Two-Role Authentication System** (Customer & Admin)
- ✅ **Email Verification** with AWS SES
- ✅ **Password Reset** functionality
- ✅ **Two-Factor Authentication** support
- ✅ **Social Login** (Google, Facebook)
- ✅ **Complete E-commerce** functionality
- ✅ **Service Appointment** booking
- ✅ **Quote Management** system
- ✅ **Inventory Tracking**
- ✅ **Review System**
- ✅ **Newsletter Management**
- ✅ **Audit Logging**
- ✅ **Analytics Dashboard**

## 📊 **Database Schema**

### **Core Tables Structure**

#### **Authentication & Users**
```
users (Primary user table)
├── accounts (OAuth providers)
├── sessions (User sessions)
├── verification_tokens (Email verification)
├── password_reset_tokens (Password reset)
└── customer_profiles (Extended customer data)
    └── addresses (Customer addresses)
```

#### **Product Management**
```
brands (Tire brands: Michelin, Continental, etc.)
├── categories (Product categories)
└── products (Tire inventory)
    ├── stock_movements (Inventory tracking)
    └── reviews (Product reviews)
```

#### **Order Management**
```
orders (Purchase orders)
├── order_items (Individual items)
└── appointments (Service bookings)
```

#### **Service System**
```
service_categories (Service types)
└── services (Available services)
    ├── appointments (Scheduled services)
    └── quotes (Service estimates)
        └── quote_items (Quote line items)
```

#### **Marketing & Communication**
```
newsletter_subscriptions (Email subscribers)
├── email_campaigns (Marketing campaigns)
└── reviews (Customer feedback)
```

#### **System Management**
```
system_settings (Application configuration)
└── audit_logs (Activity tracking)
```

## 🔐 **Authentication System**

### **User Roles**
1. **Customer Role**
   - Product browsing and purchasing
   - Service appointment booking
   - Quote requests
   - Order history and tracking
   - Profile management

2. **Admin Role**
   - Full system access
   - Product and inventory management
   - Order and appointment management
   - Customer management
   - Analytics and reporting
   - System configuration

### **Authentication Features**
- **Email/Password Registration** with verification
- **Social Login** (Google, Facebook)
- **Password Reset** with secure tokens
- **Two-Factor Authentication** (TOTP)
- **Session Management** with configurable expiry
- **Rate Limiting** protection
- **Account Lockout** after failed attempts

### **Email Verification Flow**
1. User registers with email/password
2. System sends verification email via AWS SES
3. User clicks verification link
4. Account is activated and user can login
5. Email templates include company branding

## 📧 **Email System (AWS SES)**

### **Email Templates**
1. **Account Verification**
   - Welcome message with verification link
   - Branded HTML template
   - 24-hour expiry

2. **Password Reset**
   - Secure reset link
   - Security warnings
   - 1-hour expiry

3. **Order Confirmation**
   - Order details and tracking
   - Payment confirmation
   - Delivery information

4. **Appointment Confirmation**
   - Service details and timing
   - Location and contact info
   - Cancellation policy

5. **Newsletter Welcome**
   - 10% discount code
   - Subscription benefits
   - Unsubscribe option

### **Email Features**
- **HTML and Text** versions
- **Professional branding**
- **Responsive design**
- **Tracking and analytics**
- **Bounce handling**
- **Unsubscribe management**

## 🛒 **E-commerce Features**

### **Product Management**
- **Comprehensive tire catalog** with technical specifications
- **Brand and category organization**
- **Advanced filtering** (size, season, brand, price)
- **Stock tracking** with low inventory alerts
- **Multi-image support** with AWS S3 storage
- **SEO optimization** with meta tags and structured data

### **Tire-Specific Fields**
- Size (e.g., "225/55R16")
- Width, Aspect Ratio, Rim Diameter
- Season (Summer, Winter, All-Season)
- Speed Rating (H, V, W, etc.)
- Load Index
- Run-Flat capability
- EU tire labels (Fuel efficiency, Wet grip, Noise)

### **Order Processing**
- **Guest and registered** user checkout
- **Multiple payment methods** (Stripe, PayPal, Bank Transfer)
- **Address management**
- **Order tracking**
- **Invoice generation**
- **Inventory adjustment**

## 🔧 **Service Management**

### **Appointment System**
- **Real-time availability** checking
- **Service duration** estimation
- **Technician assignment**
- **Vehicle information** tracking
- **Reminder notifications**
- **Status updates**

### **Available Services**
- Tire Installation
- Wheel Alignment
- Tire Rotation
- Wheel Balancing
- Brake Service
- Oil Change
- 24/7 Roadside Assistance

### **Quote System**
- **Detailed estimates** for products and services
- **Valid until date** tracking
- **Acceptance workflow**
- **Conversion to orders**

## 📊 **Analytics & Reporting**

### **Dashboard Metrics**
- Total customers and orders
- Revenue and average order value
- Popular products and services
- Low stock alerts
- Recent activity feed

### **Advanced Analytics**
- Sales trends and forecasting
- Customer segmentation
- Product performance
- Service utilization
- Geographic analysis

## 🔍 **Search & Filtering**

### **Product Search**
- **Full-text search** across name, description, SKU
- **Filter combinations** (brand + season + size)
- **Price range** filtering
- **Stock availability** filtering
- **Sort options** (price, name, popularity, date)

### **Advanced Filters**
- Tire size compatibility
- Vehicle make/model matching
- Performance characteristics
- Brand preferences
- Budget constraints

## 📱 **API Design**

### **RESTful Endpoints**
```
GET    /api/products              # List products with filters
GET    /api/products/:id          # Get product details
POST   /api/orders                # Create new order
GET    /api/orders/:id            # Get order details
POST   /api/appointments          # Book appointment
POST   /api/quotes                # Request quote
POST   /api/auth/register         # User registration
POST   /api/auth/login            # User login
POST   /api/newsletter/subscribe  # Newsletter signup
```

### **Query Parameters**
- Pagination (limit, offset)
- Sorting (sortBy, sortOrder)
- Filtering (brand, category, size, price range)
- Search (q, searchFields)

## 🚀 **Setup Instructions**

### **1. Install Dependencies**
```bash
# Install Drizzle ORM and database dependencies
npm install drizzle-orm postgres better-auth @aws-sdk/client-ses
npm install -D drizzle-kit tsx @types/postgres
```

### **2. Environment Configuration**
```bash
# Copy environment template
cp .env.template .env.local

# Configure your database URL
DATABASE_URL="postgresql://user:password@localhost:5432/bandencentrale"

# Set up AWS credentials for SES
AWS_ACCESS_KEY_ID="your-key-id"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="eu-west-1"

# Configure Better Auth
BETTER_AUTH_SECRET="your-super-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
```

### **3. Database Setup**
```bash
# Generate migration files
npm run db:generate

# Run migrations
npm run db:migrate

# Seed initial data (optional)
npm run db:seed

# Open Drizzle Studio for database management
npm run db:studio
```

### **4. AWS SES Configuration**
1. Set up AWS SES in your region
2. Verify your domain and email addresses
3. Configure DKIM and SPF records
4. Move out of sandbox mode for production

### **5. Initial Admin User**
```sql
-- Create initial admin user
INSERT INTO users (email, name, role, email_verified, is_active)
VALUES ('admin@bandencentrale.be', 'Admin User', 'admin', NOW(), true);
```

## 🔒 **Security Features**

### **Data Protection**
- **Encrypted passwords** with bcrypt
- **JWT tokens** for API authentication
- **CSRF protection**
- **SQL injection** prevention with parameterized queries
- **XSS protection** with input sanitization

### **Access Control**
- **Role-based permissions**
- **API route protection**
- **Admin panel restrictions**
- **Data access logging**

### **Privacy Compliance**
- **GDPR compliance** features
- **Data retention** policies
- **User data export**
- **Right to deletion**
- **Cookie consent** management

## 📈 **Performance Optimization**

### **Database Optimization**
- **Proper indexing** on frequently queried columns
- **Connection pooling**
- **Query optimization**
- **Caching strategies**

### **Caching Strategy**
- **Redis caching** for sessions and frequently accessed data
- **CDN integration** for static assets
- **Database query caching**
- **API response caching**

## 🧪 **Testing Strategy**

### **Database Testing**
- **Unit tests** for database queries
- **Integration tests** for API endpoints
- **Migration testing**
- **Performance testing**

### **Authentication Testing**
- **Login/logout flows**
- **Password reset process**
- **Email verification**
- **Role-based access**

## 🚀 **Deployment**

### **Production Considerations**
- **Database migrations** in CI/CD pipeline
- **Environment-specific configurations**
- **Monitoring and logging**
- **Backup strategies**
- **Disaster recovery**

### **Scaling Considerations**
- **Read replicas** for high traffic
- **Database sharding** strategies
- **Microservices** architecture preparation
- **Load balancing**

## 📚 **Documentation & Maintenance**

### **Code Documentation**
- **Comprehensive comments** in schema files
- **API documentation** with examples
- **Database relationship** diagrams
- **Migration notes**

### **Maintenance Tasks**
- **Regular backups**
- **Performance monitoring**
- **Security updates**
- **Data cleanup** routines
- **Analytics review**

---

This schema provides a solid foundation for a modern, scalable tire shop e-commerce platform with comprehensive features for both customers and administrators. The design emphasizes data integrity, security, and performance while maintaining flexibility for future enhancements.
