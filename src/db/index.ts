import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/db/schema";

const getDbInstance = () => {
  const connectionString = process.env.DATABASE_URL || "postgres://localhost:5432/scriptlystore";
  const client = neon(connectionString);
  return drizzle(client, { schema });
};

// Create a proxy that forwards all database calls to a fresh per-request/query instance
export const db = new Proxy({} as ReturnType<typeof getDbInstance>, {
  get(target, prop, receiver) {
    const instance = getDbInstance();
    return Reflect.get(instance, prop, receiver);
  }
});

