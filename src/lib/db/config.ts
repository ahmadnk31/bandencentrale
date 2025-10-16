import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Get DATABASE_URL, but don't throw during build if it's missing
const connectionString = process.env.DATABASE_URL;

// Create a conditional export that works during build time
export const db = connectionString 
  ? drizzle(postgres(connectionString, {
      ssl: 'require', // Always require SSL for Neon
      max: 20,
      idle_timeout: 30,
      connect_timeout: 60,
    }), { schema })
  : null as any; // Allows TypeScript to work during build

export type Database = typeof db;
