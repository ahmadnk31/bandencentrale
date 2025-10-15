const { db } = require('./src/lib/db/index.js');
const { services } = require('./src/lib/db/schema.js');

async function createTestService() {
  try {
    const [service] = await db
      .insert(services)
      .values({
        name: 'Test Service',
        slug: 'test-service',
        description: 'A test service for appointments',
        categoryId: null,
        basePrice: 50.00,
        hourlyRate: 75.00,
        estimatedDuration: 60,
        isActive: true,
        requiresAppointment: true,
        popularity: 0,
        metadata: {}
      })
      .returning();
    
    console.log('Created test service:', service.id);
    console.log('Service details:', JSON.stringify(service, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

createTestService();
