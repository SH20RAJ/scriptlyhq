import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { hexclave } from "./hexclave";

export async function getOrCreateDbUser() {
  const hexclaveUser = await hexclave.getUser();
  if (!hexclaveUser) {
    return null;
  }

  const id = hexclaveUser.id;
  const email = hexclaveUser.primaryEmail || "";
  const name = hexclaveUser.displayName || "";

  // Check database for existing user record
  const existing = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  if (existing) {
    // Make sure role is updated if they were added to ADMIN_EMAILS later
    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase());
    const shouldBeAdmin = adminEmails.includes(email.toLowerCase());

    if (shouldBeAdmin && existing.role !== "admin") {
      const [updated] = await db
        .update(users)
        .set({ role: "admin", updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning();
      return updated;
    }
    return existing;
  }

  // Determine role based on ADMIN_EMAILS environment variable
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase());
  const role = adminEmails.includes(email.toLowerCase()) ? "admin" : "user";

  const [newUser] = await db
    .insert(users)
    .values({
      id,
      email,
      name,
      role,
    })
    .returning();

  return newUser;
}

export async function isAdmin() {
  const user = await getOrCreateDbUser();
  return user?.role === "admin";
}
