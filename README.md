# ScriptlyHQ - Premium Digital Product Marketplace

ScriptlyHQ is a modern, simple, clean, and production-ready digital product marketplace. Users can discover, search, filter, and purchase assets (landing pages, boilerplates, ebooks, scripts, AI prompts, and UI kits) with Razorpay payments and secure downloads, backed by Hexclave Authentication.

## Tech Stack

- **Framework**: Next.js 15+ App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (dark mode support)
- **Database ORM**: Drizzle ORM
- **Database Driver**: PostgreSQL (hosted on Neon)
- **Authentication**: Hexclave (formerly Stack Auth)
- **Payments**: Razorpay

---

## Directory Structure

```text
scriptlyhq/
├── src/
│   ├── app/
│   │   ├── admin/             # Admin panel routes (overview, catalog management, orders)
│   │   ├── api/
│   │   │   ├── auth/role/     # API exposing DB user role to client
│   │   │   ├── download/      # Secure dynamic ZIP downloads endpoint
│   │   │   └── webhooks/      # Razorpay webhook receiver
│   │   ├── dashboard/         # Customer purchases & download center
│   │   ├── handler/           # Catch-all Hexclave auth route handler
│   │   ├── products/          # Product details page (checkout integration)
│   │   ├── globals.css        # Tailwind v4 theme configurations
│   │   └── layout.tsx         # Global Providers, Navbar, and Razorpay script loading
│   ├── components/            # Reusable UI components (Navbar, SearchFilter, ProductForm)
│   ├── db/
│   │   ├── index.ts           # Drizzle Postgres database client
│   │   └── schema.ts          # Database tables schema definition
│   └── lib/
│       ├── actions/           # Next.js Server Actions (CRUD, checkout, verification)
│       ├── auth-utils.ts      # Syncing users & admin access checks
│       ├── hexclave.ts        # Server app initializer
│       └── storage.ts         # Secure local ZIP upload & thumbnail helper
├── uploads/                   # Non-public folder storing secure ZIP files
└── public/
    └── thumbnails/            # Publicly accessible thumbnail upload folder
```

---

## Setup Instructions

### 1. Pre-requisites

Make sure you have [Bun](https://bun.sh) installed.

### 2. Environment Variables

Create or update the `.env` file in the root of the project:

```env
# Hexclave Authentication (Provided by CLI init)
NEXT_PUBLIC_HEXCLAVE_PROJECT_ID=25eb3b80-274f-4c41-b4d0-79d11070e070
NEXT_PUBLIC_HEXCLAVE_PUBLISHABLE_CLIENT_KEY=pck_qfzm0sgb5rz8eh4eypns6wvf0v13815zkksazh6518zgg
HEXCLAVE_SECRET_SERVER_KEY=ssk_50ze9a4w0waw3g3j8aze2mm0tnf6vnwq3xgj4a4266sa0

# PostgreSQL Database Connection
DATABASE_URL=postgresql://neondb_owner:npg_Jm8eVuf9QLZq@ep-snowy-waterfall-aolziam1-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Razorpay Payment Gateway API
RAZORPAY_KEY_ID=rzp_test_mockkeyid123
RAZORPAY_KEY_SECRET=rzp_test_mocksecret123
RAZORPAY_WEBHOOK_SECRET=rzp_test_mockwebhooksecret123

# Administrator Access Emails (Comma-separated)
ADMIN_EMAILS=shaswatraj@gmail.com,admin@scriptlyhq.com
```

### 3. Database Sync

Drizzle Kit has been configured. Run the following command to sync your local schemas to your Neon PostgreSQL instance:

```bash
bun x drizzle-kit push
```

### 4. Running the Dev Server

Start the local server in development mode:

```bash
bun run dev
```

The database tables (Categories and 5 minimal Test Products with pricing ₹1, ₹3, ₹4, ₹10, and ₹49) will be automatically seeded on the first page load!

---

## How to Set Up Razorpay Payments

Follow these steps to transition from local testing mock keys to a real Razorpay Integration:

### 1. Obtain API Keys
1. Sign up/Log in to the [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Switch to **Test Mode** (or Live Mode in production) from the top navigation toggle.
3. Navigate to **Account & Settings** > **API Keys**.
4. Click **Generate Key** to receive your `Key ID` and `Key Secret`.
5. Add them to your `.env` file:
   - `RAZORPAY_KEY_ID=<your_key_id>`
   - `RAZORPAY_KEY_SECRET=<your_key_secret>`

### 2. Configure Webhooks (Asynchronous Payment Completion)
To handle scenarios where users close their browser before the client redirects:
1. Navigate to **Account & Settings** > **Webhooks**.
2. Click **Add New Webhook**.
3. Set the Webhook URL:
   - In production: `https://yourdomain.com/api/webhooks/razorpay`
   - In local development: Use a tunnel service like `ngrok` (e.g. `ngrok http 3000`) and configure the URL as `https://<ngrok-id>.ngrok-free.app/api/webhooks/razorpay`.
4. In **Active Events**, select:
   - `payment.captured`
   - `order.paid`
5. Add a secure string in the **Secret** field.
6. Save the webhook and add this secret to your `.env` file:
   - `RAZORPAY_WEBHOOK_SECRET=<your_configured_secret>`

---

## Mock Developer Mode (Instant Local Testing)

If `RAZORPAY_KEY_ID` in `.env` is set to `rzp_test_mockkeyid123` (or any string starting with `rzp_test_mock`), the application automatically runs in **Mock Checkout Mode**:

- Creating an order generates a mock order ID without making an external HTTP request to Razorpay.
- The checkout panel skips signature verification, allowing you to instantly complete successful purchases locally.
- Access to dynamic downloads is unlocked in the Customer Dashboard (`/dashboard`) immediately.
