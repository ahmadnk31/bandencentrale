import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local if running as a script
if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
  dotenv.config({ path: resolve(process.cwd(), '.env.local') });
}

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create postgres client with SSL for production
const client = postgres(connectionString, {
  ssl: 'require', // Always require SSL for Neon
  max: 20,
  idle_timeout: 30,
  connect_timeout: 60,
});

export const db = drizzle(client, { schema });
export type Database = typeof db;
