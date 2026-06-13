import { StackClientApp } from "@hexclave/next";

export const stack = new StackClientApp({
  projectId: process.env.NEXT_PUBLIC_HEXCLAVE_PROJECT_ID!,
  publishableClientKey: process.env.NEXT_PUBLIC_HEXCLAVE_PUBLISHABLE_CLIENT_KEY!,
  tokenStore: "nextjs-cookie",
});
