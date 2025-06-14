console.log('[db/index.ts] File started processing.');
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import 'dotenv/config'; // Load .env file for standalone scripts

console.log(`[db/index.ts] DATABASE_URL: ${process.env.DATABASE_URL ? 'Defined' : 'Undefined'}`);
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in your environment.');
}

console.log('[db/index.ts] Initializing database connection module...');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export const db = drizzle(pool, { schema });

console.log('[db/index.ts] Database module initialized and db exported. (instance details omitted for brevity)');
