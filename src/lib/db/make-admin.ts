import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { db } from './config';
import { user } from './schema';
import { eq } from 'drizzle-orm';

async function makeUserAdmin(email: string) {
  console.log(`🔧 Making user ${email} an admin...`);

  try {
    const result = await db
      .update(user)
      .set({
        role: 'admin',
        emailVerified: true,
        isActive: true,
      })
      .where(eq(user.email, email))
      .returning();

    if (result.length > 0) {
      console.log('✅ User successfully made admin!');
      console.log(`📧 Email: ${result[0].email}`);
      console.log(`👤 Name: ${result[0].name}`);
      console.log(`🎭 Role: ${result[0].role}`);
      console.log('');
      console.log('🚀 You can now login at: http://localhost:3001/login');
    } else {
      console.log('❌ User not found. Please make sure the user exists first.');
    }

  } catch (error) {
    console.error('❌ Error making user admin:', error);
  }
}

// Get email from command line argument or use default
const email = process.argv[2] || 'admin@bandencentrale.be';

// Run if this file is executed directly
if (require.main === module) {
  makeUserAdmin(email)
    .then(() => {
      console.log('🎉 Admin setup completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Admin setup failed:', error);
      process.exit(1);
    });
}

export { makeUserAdmin };
