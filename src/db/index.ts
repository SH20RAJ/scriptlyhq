import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var db: ReturnType<typeof drizzle<typeof schema>> | undefined;
}

const connectionString = process.env.DATABASE_URL || "postgres://localhost:5432/scriptlyhq";

// For serverless/development environments, reuse the connection
const client = postgres(connectionString, { 
  max: 1,
  connect_timeout: 5, // 5 seconds connect timeout to prevent hangs
  idle_timeout: 10    // 10 seconds idle timeout
});
export const db = globalThis.db || drizzle(client, { schema });

if (process.env.NODE_ENV !== "production") {
  globalThis.db = db;
}
