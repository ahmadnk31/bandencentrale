import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { db } from './config';
import { eq } from 'drizzle-orm';
import { 
  user, 
  brands, 
  categories, 
  serviceCategories, 
  services, 
  products, 
  systemSettings,
  customerProfiles
} from './schema';
import { seedHeroBanners } from './seed-hero-banners';

// Sample data for initial database seeding
async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Check if admin user already exists
    console.log('👤 Checking for existing admin user...');
    const existingAdmin = await db.select().from(user).where(eq(user.email, 'admin@bandencentrale.be')).limit(1);

    if (existingAdmin.length > 0) {
      console.log('ℹ️ Admin user already exists, skipping user creation...');
    } else {
      // 1. Create initial admin user
      console.log('👤 Creating admin user...');
      const [adminUser] = await db.insert(user).values({
        email: 'admin@bandencentrale.be',
        name: 'Admin User',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        emailVerified: true,
        isActive: true,
      }).returning();

      // 2. Create sample customer
      console.log('👥 Creating sample customer...');
      const [customerUser] = await db.insert(user).values({
        email: 'customer@example.com',
        name: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+32 467 12 3456',
        role: 'customer',
        emailVerified: true,
        isActive: true,
      }).returning();

      // Create customer profile
      await db.insert(customerProfiles).values({
        userId: customerUser.id,
        loyaltyPoints: 0,
        totalSpent: '0',
        marketingOptIn: true,
      });
    }

    // 3. Create tire brands
    console.log('🏷️ Creating tire brands...');
    const brandData = [
      { name: 'Michelin', slug: 'michelin', description: 'Premium French tire manufacturer', countryOfOrigin: 'France' },
      { name: 'Continental', slug: 'continental', description: 'German engineering excellence', countryOfOrigin: 'Germany' },
      { name: 'Bridgestone', slug: 'bridgestone', description: 'Japanese innovation leader', countryOfOrigin: 'Japan' },
      { name: 'Pirelli', slug: 'pirelli', description: 'Italian motorsport heritage', countryOfOrigin: 'Italy' },
      { name: 'Goodyear', slug: 'goodyear', description: 'American tire pioneer', countryOfOrigin: 'USA' },
      { name: 'Dunlop', slug: 'dunlop', description: 'British racing legacy', countryOfOrigin: 'UK' },
      { name: 'Yokohama', slug: 'yokohama', description: 'Japanese performance focus', countryOfOrigin: 'Japan' },
      { name: 'Hankook', slug: 'hankook', description: 'Korean quality innovation', countryOfOrigin: 'South Korea' },
    ];

    const insertedBrands = await db.insert(brands).values(brandData).returning();

    // 4. Create product categories
    console.log('📂 Creating product categories...');
    const categoryData = [
      { name: 'Summer Tires', slug: 'summer-tires', description: 'High-performance tires for dry and wet conditions' },
      { name: 'Winter Tires', slug: 'winter-tires', description: 'Specialized tires for snow and ice conditions' },
      { name: 'All-Season Tires', slug: 'all-season-tires', description: 'Versatile tires for year-round use' },
      { name: 'Performance Tires', slug: 'performance-tires', description: 'High-performance tires for sports cars' },
      { name: 'SUV Tires', slug: 'suv-tires', description: 'Specialized tires for SUVs and crossovers' },
      { name: 'Truck Tires', slug: 'truck-tires', description: 'Heavy-duty tires for trucks and vans' },
    ];

    const insertedCategories = await db.insert(categories).values(categoryData).returning();

    // 5. Create service categories
    console.log('🔧 Creating service categories...');
    const serviceCategoryData = [
      { name: 'Installation', slug: 'installation', description: 'Tire mounting and installation services', icon: 'wrench' },
      { name: 'Maintenance', slug: 'maintenance', description: 'Regular tire and vehicle maintenance', icon: 'settings' },
      { name: 'Repair', slug: 'repair', description: 'Tire and wheel repair services', icon: 'tool' },
      { name: 'Emergency', slug: 'emergency', description: '24/7 emergency roadside assistance', icon: 'alert-circle' },
    ];

    const insertedServiceCategories = await db.insert(serviceCategories).values(serviceCategoryData).returning();

    // 6. Create services
    console.log('⚙️ Creating services...');
    const serviceData = [
      {
        name: 'Tire Installation',
        slug: 'tire-installation',
        description: 'Professional tire mounting and balancing service',
        categoryId: insertedServiceCategories[0].id,
        basePrice: '25.00',
        estimatedDuration: 45,
        requiresAppointment: true,
        features: ['Professional mounting', 'Wheel balancing', 'TPMS reset', 'Quality inspection'],
        warranty: 'Workmanship guaranteed for 12 months',
      },
      {
        name: 'Wheel Alignment',
        slug: 'wheel-alignment',
        description: 'Precision wheel alignment service',
        categoryId: insertedServiceCategories[1].id,
        basePrice: '89.00',
        estimatedDuration: 75,
        requiresAppointment: true,
        features: ['Computer alignment', 'Suspension check', 'Steering adjustment', 'Precision measurement'],
        warranty: 'Alignment service guaranteed for 12 months',
      },
      {
        name: 'Tire Rotation',
        slug: 'tire-rotation',
        description: 'Regular tire rotation for even wear',
        categoryId: insertedServiceCategories[1].id,
        basePrice: '35.00',
        estimatedDuration: 30,
        requiresAppointment: true,
        features: ['Even wear distribution', 'Extended tire life', 'Performance optimization', 'Inspection included'],
        warranty: 'Service guarantee for 30 days',
      },
      {
        name: '24/7 Roadside Assistance',
        slug: 'roadside-assistance',
        description: 'Emergency tire service and roadside assistance',
        categoryId: insertedServiceCategories[3].id,
        basePrice: '149.00',
        estimatedDuration: 60,
        requiresAppointment: false,
        availableOnline: false,
        features: ['24/7 emergency service', 'Mobile tire installation', 'Quick response time', 'Professional emergency technicians'],
        warranty: 'Emergency service guarantee',
      },
    ];

    await db.insert(services).values(serviceData);

    // 7. Create sample products
    console.log('🛞 Creating sample tire products...');
    const productData = [
      {
        name: 'Michelin Pilot Sport 4',
        slug: 'michelin-pilot-sport-4-225-45r17',
        description: 'High-performance summer tire with excellent grip and handling',
        sku: 'MICH-PS4-225-45R17',
        brandId: insertedBrands.find(b => b.name === 'Michelin')!.id,
        categoryId: insertedCategories.find(c => c.name === 'Performance Tires')!.id,
        size: '225/45R17',
        width: 225,
        aspectRatio: 45,
        rimDiameter: 17,
        season: 'summer',
        tireType: 'performance',
        speedRating: 'W',
        loadIndex: 94,
        runFlat: false,
        fuelEfficiency: 'C',
        wetGrip: 'A',
        noiseLevel: 71,
        price: '189.99',
        compareAtPrice: '219.99',
        stockQuantity: 24,
        lowStockThreshold: 5,
        isFeatured: true,
        features: ['Bi-compound technology', 'Dynamic Response Technology', 'Premium Touch Design'],
        publishedAt: new Date(),
      },
      {
        name: 'Continental WinterContact TS 860',
        slug: 'continental-wintercontact-ts-860-205-55r16',
        description: 'Premium winter tire with superior snow and ice performance',
        sku: 'CONT-WC-TS860-205-55R16',
        brandId: insertedBrands.find(b => b.name === 'Continental')!.id,
        categoryId: insertedCategories.find(c => c.name === 'Winter Tires')!.id,
        size: '205/55R16',
        width: 205,
        aspectRatio: 55,
        rimDiameter: 16,
        season: 'winter',
        tireType: 'touring',
        speedRating: 'H',
        loadIndex: 91,
        runFlat: false,
        fuelEfficiency: 'C',
        wetGrip: 'B',
        noiseLevel: 72,
        price: '142.99',
        compareAtPrice: '159.99',
        stockQuantity: 18,
        lowStockThreshold: 5,
        isFeatured: true,
        features: ['Advanced tread compound', 'Optimized groove design', 'Enhanced snow traction'],
        publishedAt: new Date(),
      },
      {
        name: 'Bridgestone Turanza T005',
        slug: 'bridgestone-turanza-t005-195-65r15',
        description: 'Premium all-season tire for comfort and safety',
        sku: 'BRID-TUR-T005-195-65R15',
        brandId: insertedBrands.find(b => b.name === 'Bridgestone')!.id,
        categoryId: insertedCategories.find(c => c.name === 'All-Season Tires')!.id,
        size: '195/65R15',
        width: 195,
        aspectRatio: 65,
        rimDiameter: 15,
        season: 'all-season',
        tireType: 'touring',
        speedRating: 'H',
        loadIndex: 91,
        runFlat: false,
        fuelEfficiency: 'B',
        wetGrip: 'A',
        noiseLevel: 69,
        price: '98.99',
        compareAtPrice: '112.99',
        stockQuantity: 32,
        lowStockThreshold: 8,
        isFeatured: false,
        features: ['Enliten technology', 'Nano Pro-Tech compound', 'Optimized contact patch'],
        publishedAt: new Date(),
      },
      {
        name: 'Pirelli P Zero',
        slug: 'pirelli-p-zero-245-35r19',
        description: 'Ultra-high performance tire for sports cars',
        sku: 'PIR-PZERO-245-35R19',
        brandId: insertedBrands.find(b => b.name === 'Pirelli')!.id,
        categoryId: insertedCategories.find(c => c.name === 'Performance Tires')!.id,
        size: '245/35R19',
        width: 245,
        aspectRatio: 35,
        rimDiameter: 19,
        season: 'summer',
        tireType: 'performance',
        speedRating: 'Y',
        loadIndex: 93,
        runFlat: false,
        fuelEfficiency: 'C',
        wetGrip: 'A',
        noiseLevel: 73,
        price: '289.99',
        compareAtPrice: '319.99',
        stockQuantity: 12,
        lowStockThreshold: 3,
        isFeatured: true,
        features: ['Racing-derived compound', 'Asymmetric tread pattern', 'Motorsport technology'],
        publishedAt: new Date(),
      },
    ];

    await db.insert(products).values(productData);

    // 8. Create system settings
    console.log('⚙️ Creating system settings...');
    const settingsData = [
      { key: 'store_name', value: 'BandenCentrale', description: 'Store name', type: 'string', category: 'general', isPublic: true },
      { key: 'store_description', value: 'Premium Tire Solutions in Belgium', description: 'Store description', type: 'string', category: 'general', isPublic: true },
      { key: 'store_email', value: 'info@bandencentrale.be', description: 'Store contact email', type: 'string', category: 'general', isPublic: true },
      { key: 'store_phone', value: '+32 467 87 1205', description: 'Store contact phone', type: 'string', category: 'general', isPublic: true },
      { key: 'store_address', value: '123 Main Street, Ghent, Belgium', description: 'Store address', type: 'string', category: 'general', isPublic: true },
      { key: 'default_currency', value: 'EUR', description: 'Default currency', type: 'string', category: 'general', isPublic: true },
      { key: 'tax_rate', value: '0.21', description: 'Default tax rate (21% VAT)', type: 'number', category: 'general', isPublic: false },
      { key: 'free_shipping_threshold', value: '100', description: 'Free shipping threshold in EUR', type: 'number', category: 'shipping', isPublic: true },
      { key: 'standard_shipping_rate', value: '25', description: 'Standard shipping rate in EUR', type: 'number', category: 'shipping', isPublic: true },
      { key: 'express_shipping_rate', value: '45', description: 'Express shipping rate in EUR', type: 'number', category: 'shipping', isPublic: true },
      { key: 'newsletter_enabled', value: 'true', description: 'Enable newsletter functionality', type: 'boolean', category: 'marketing', isPublic: false },
      { key: 'reviews_enabled', value: 'true', description: 'Enable product reviews', type: 'boolean', category: 'features', isPublic: false },
      { key: 'appointments_enabled', value: 'true', description: 'Enable appointment booking', type: 'boolean', category: 'features', isPublic: false },
      { key: 'quotes_enabled', value: 'true', description: 'Enable quote requests', type: 'boolean', category: 'features', isPublic: false },
    ];

    await db.insert(systemSettings).values(settingsData);

    // Seed hero banners
    await seedHeroBanners();

    console.log('✅ Database seeding completed successfully!');
    console.log('');
    console.log('📊 Seeded data summary:');
    console.log(`👤 Users: 2 (1 admin, 1 customer)`);
    console.log(`🏷️ Brands: ${brandData.length}`);
    console.log(`📂 Categories: ${categoryData.length}`);
    console.log(`🔧 Service Categories: ${serviceCategoryData.length}`);
    console.log(`⚙️ Services: ${serviceData.length}`);
    console.log(`🛞 Products: ${productData.length}`);
    console.log(`⚙️ Settings: ${settingsData.length}`);
    console.log(`🎨 Hero Banners: 4`);
    console.log('');
    console.log('🔑 Admin Login:');
    console.log('Email: admin@bandencentrale.be');
    console.log('Password: (Set during first login)');
    console.log('');
    console.log('👥 Sample Customer:');
    console.log('Email: customer@example.com');
    console.log('Password: (Set during first login)');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export { seedDatabase };
