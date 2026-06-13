import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var db: ReturnType<typeof drizzle<typeof schema>> | undefined;
}

const connectionString = process.env.DATABASE_URL || "postgres://localhost:5432/scriptlyhq";

// For serverless/development environments, reuse the connection
const pool = new Pool({ connectionString });
export const db = globalThis.db || drizzle(pool, { schema });

if (process.env.NODE_ENV !== "production") {
  globalThis.db = db;
}
