import { HexclaveServerApp } from "@hexclave/next";
import { stack } from "@/lib/stack";

export const hexclave = new HexclaveServerApp({
  projectId: process.env.NEXT_PUBLIC_HEXCLAVE_PROJECT_ID!,
  publishableClientKey: process.env.NEXT_PUBLIC_HEXCLAVE_PUBLISHABLE_CLIENT_KEY!,
  secretServerKey: process.env.HEXCLAVE_SECRET_SERVER_KEY!,
  inheritsFrom: stack,
});
