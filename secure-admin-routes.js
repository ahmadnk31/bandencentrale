#!/usr/bin/env node

/**
 * Script to secure all admin API routes with authentication middleware
 */

const fs = require('fs');
const path = require('path');

const adminRoutes = [
  'src/app/api/admin/services/route.ts',
  'src/app/api/admin/appointments/route.ts',
  'src/app/api/admin/hero-banners/route.ts',
  'src/app/api/admin/quotes/stats/route.ts',
  'src/app/api/admin/quotes/route.ts',
  'src/app/api/admin/hero-banners/[id]/route.ts',
  'src/app/api/admin/products/[slug]/route.ts',
  'src/app/api/admin/products/stats/route.ts',
  'src/app/api/admin/appointments/stats/route.ts',
  'src/app/api/admin/service-categories/[id]/route.ts',
  'src/app/api/admin/appointments/[id]/route.ts',
  'src/app/api/admin/quotes/[id]/route.ts',
  'src/app/api/admin/quotes/[id]/send/route.ts'
];

function secureAdminRoute(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Check if already secured
  if (content.includes('withAdmin') || content.includes('admin-middleware')) {
    console.log(`✅ Already secured: ${filePath}`);
    return;
  }

  // Add import
  if (!content.includes('admin-middleware')) {
    content = content.replace(
      /(import .* from ['"].*['"];?\n)/g,
      "$1import { withAdmin } from '@/lib/auth/admin-middleware';\n"
    );
  }

  // Wrap GET function
  content = content.replace(
    /export async function GET\(/g,
    'async function getHandler('
  );

  // Wrap POST function
  content = content.replace(
    /export async function POST\(/g,
    'async function postHandler('
  );

  // Wrap PUT function
  content = content.replace(
    /export async function PUT\(/g,
    'async function putHandler('
  );

  // Wrap DELETE function
  content = content.replace(
    /export async function DELETE\(/g,
    'async function deleteHandler('
  );

  // Add exports at the end
  const exportLines = [];
  if (content.includes('getHandler(')) {
    exportLines.push('export const GET = withAdmin(getHandler);');
  }
  if (content.includes('postHandler(')) {
    exportLines.push('export const POST = withAdmin(postHandler);');
  }
  if (content.includes('putHandler(')) {
    exportLines.push('export const PUT = withAdmin(putHandler);');
  }
  if (content.includes('deleteHandler(')) {
    exportLines.push('export const DELETE = withAdmin(deleteHandler);');
  }

  if (exportLines.length > 0) {
    content += '\n\n// Apply admin middleware to all routes\n' + exportLines.join('\n') + '\n';
  }

  fs.writeFileSync(fullPath, content);
  console.log(`🔒 Secured: ${filePath}`);
}

console.log('🔐 Securing admin API routes...\n');

adminRoutes.forEach(secureAdminRoute);

console.log('\n✅ Admin route security update completed!');
