import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var db: ReturnType<typeof drizzle<typeof schema>> | undefined;
}

const connectionString = process.env.DATABASE_URL || "postgres://localhost:5432/scriptlyhq";

// For serverless/development environments, reuse the connection
const client = postgres(connectionString, { max: 1 });
export const db = globalThis.db || drizzle(client, { schema });

if (process.env.NODE_ENV !== "production") {
  globalThis.db = db;
}
