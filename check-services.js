const { db } = require('./src/lib/db/index.ts');
const { services } = require('./src/lib/db/schema.ts');

async function checkServices() {
  try {
    const result = await db.select().from(services).limit(5);
    console.log('Services in database:', result.length);
    if (result.length > 0) {
      console.log('First service ID:', result[0].id);
      console.log('First service:', JSON.stringify(result[0], null, 2));
    } else {
      console.log('No services found in database');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

checkServices();
