// console.log('[db/index.ts] File started processing.');
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private'; // Using SvelteKit's dynamic environment variables

// console.log('[db/index.ts] Initializing database connection module...');

if (!env.DATABASE_URL) {
	// console.error('[db/index.ts] FATAL ERROR: DATABASE_URL environment variable is not set.');
	throw new Error('DATABASE_URL is not set. Please check your .env file.');
}
// console.log('[db/index.ts] DATABASE_URL is present.');

let client: postgres.Sql<{}>;
let db: PostgresJsDatabase<typeof schema>;

try {
	// Initialize the postgres.js client
	// If you specifically need max:1, add { max: 1 } here. Otherwise, default pooling is used.
	client = postgres(env.DATABASE_URL);
	// console.log('[db/index.ts] Postgres client (postgres-js) initialized successfully.');
	// console.log('[db/index.ts] Exported client (instance details omitted for brevity)');

	// Initialize and export the Drizzle ORM instance
	db = drizzle(client, { schema }); // Pass the initialized postgres client
	// console.log('[db/index.ts] Drizzle ORM instance initialized successfully.');
} catch (error) {
	console.error('[db/index.ts] FATAL ERROR: Failed to initialize database client or Drizzle ORM:', error);
	throw error; // Re-throw to halt further execution if the client fails
}

export { client, db };
// console.log('[db/index.ts] Database module initialized and db exported. (instance details omitted for brevity)');
