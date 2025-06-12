import { defineConfig } from "drizzle-kit"
export default defineConfig({
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
  schema: "./src/lib/server/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  strict: true,  // Optional: Fail on warnings
  verbose: true, // Optional: More detailed output
})
