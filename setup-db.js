#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 BandenCentrale Database Setup');
console.log('================================');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envTemplatePath = path.join(process.cwd(), '.env.template');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local from template...');
  
  if (fs.existsSync(envTemplatePath)) {
    fs.copyFileSync(envTemplatePath, envPath);
    console.log('✅ .env.local created! Please update the values with your actual configuration.');
  } else {
    console.log('❌ .env.template not found. Please create your environment configuration manually.');
  }
} else {
  console.log('✅ .env.local already exists.');
}

console.log('');
console.log('📋 Next Steps:');
console.log('1. Update .env.local with your database URL and AWS credentials');
console.log('2. Run: npm run db:generate    # Generate migration files');
console.log('3. Run: npm run db:migrate     # Apply migrations to database');
console.log('4. Run: npm run db:seed        # Seed initial data (optional)');
console.log('5. Run: npm run db:studio      # Open Drizzle Studio to view database');
console.log('');
console.log('🔧 Required Environment Variables:');
console.log('- DATABASE_URL');
console.log('- BETTER_AUTH_SECRET');
console.log('- AWS_ACCESS_KEY_ID');
console.log('- AWS_SECRET_ACCESS_KEY');
console.log('- FROM_EMAIL');
console.log('');
console.log('💡 For development, you can use a local PostgreSQL database:');
console.log('DATABASE_URL="postgresql://username:password@localhost:5432/bandencentrale"');
console.log('');
console.log('📚 See DATABASE_SCHEMA.md for complete documentation.');
