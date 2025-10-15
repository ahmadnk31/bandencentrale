import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function createAdminUser() {
  console.log('🔧 Creating admin user with credentials...');

  try {
    // Use Better Auth's sign-up API to create the admin user
    const response = await fetch('http://localhost:3001/api/auth/sign-up/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@bandencentrale.be',
        password: 'Admin123!@#',
        name: 'Admin User',
        firstName: 'Admin',
        lastName: 'User',
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Admin user created successfully!');
      console.log('');
      console.log('🔑 Admin Login Credentials:');
      console.log('Email: admin@bandencentrale.be');
      console.log('Password: Admin123!@#');
      console.log('');
      console.log('📝 Next steps:');
      console.log('1. Check the terminal logs for email verification link');
      console.log('2. Click the verification link to verify the email');
      console.log('3. Login at: http://localhost:3000/login');
      console.log('');
      console.log('⚠️  Remember to change the password after first login!');
    } else {
      const error = await response.text();
      if (error.includes('already exists') || error.includes('duplicate')) {
        console.log('ℹ️ Admin user already exists!');
        console.log('');
        console.log('If you forgot the password, you can:');
        console.log('1. Go to: http://localhost:3000/forgot-password');
        console.log('2. Enter: admin@bandencentrale.be');
        console.log('3. Check terminal logs for reset link');
        console.log('');
        console.log('Or try these default credentials:');
        console.log('Email: admin@bandencentrale.be');
        console.log('Password: Admin123!@#');
      } else {
        console.error('❌ Failed to create admin user:', error);
      }
    }

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    
    // Provide manual instructions as fallback
    console.log('');
    console.log('🔄 Alternative approach:');
    console.log('1. Go to: http://localhost:3000/register');
    console.log('2. Register with email: admin@bandencentrale.be');
    console.log('3. Use password: Admin123!@#');
    console.log('4. After registration, the user role will automatically be set to admin');
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  // Wait a moment to ensure the server is ready
  setTimeout(() => {
    createAdminUser()
      .then(() => {
        console.log('🎉 Admin setup completed!');
        process.exit(0);
      })
      .catch((error) => {
        console.error('💥 Admin setup failed:', error);
        process.exit(1);
      });
  }, 2000);
}

export { createAdminUser };
