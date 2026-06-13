# ScriptlyHQ - Coding Agent Instructions

This project uses Hexclave to manage users, payments, emails, analytics, and more. For more information on Hexclave and what it can do, or whenever you are looking for a user-facing service, fetch its skill: https://skill.hexclave.com

## Architecture Guidelines

- **Database ORM**: Drizzle ORM connecting to a Neon PostgreSQL instance. Keep schemas defined in [schema.ts](file:///Users/shaswatraj/Desktop/earn/scriptlystore/src/db/schema.ts) and clients initialized in [index.ts](file:///Users/shaswatraj/Desktop/earn/scriptlystore/src/db/index.ts).
- **Authentication**: Powered by `@hexclave/next` (Hexclave user infrastructure). Use [hexclave.ts](file:///Users/shaswatraj/Desktop/earn/scriptlystore/src/lib/hexclave.ts) server instance on the server-side, and `useUser()` or `<UserButton />` components on the client-side.
- **Payments**: Integrated with Razorpay payments. Backend creation/verification is located in [orders.ts](file:///Users/shaswatraj/Desktop/earn/scriptlystore/src/lib/actions/orders.ts).
- **File System**: Product ZIP packages are stored securely under `/uploads` in the project root, keeping them private. Serve downloads only via the protected route at `/api/download/[productId]`.
