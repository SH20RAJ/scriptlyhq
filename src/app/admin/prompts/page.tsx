"use client";

import { useState } from "react";
import {
  FileCode2,
  Copy,
  Check,
  Search,
  Sparkles,
  Link2,
  Package,
  CreditCard,
  Store,
  Gift,
  ShieldCheck,
  Terminal,
  Code,
  Lock,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface ProcessPrompt {
  id: string;
  title: string;
  category: string;
  icon: any;
  summary: string;
  systemPrompt: string;
  schemaExample: string;
  implementationCode: string;
  keyEdgeCases: string[];
}

const PROCESS_PROMPTS: ProcessPrompt[] = [
  {
    id: "payment-links",
    title: "Dynamic & Encrypted Payment Links Engine",
    category: "Payments & Commerce",
    icon: Link2,
    summary:
      "Generate zero-setup, tamper-proof payment links with guaranteed post-payment redirection. Supports URL-safe Base64 encoding, optional 256-bit AES key encryption, and REST API creation.",
    systemPrompt: `You are an expert developer commerce agent integrating ScriptlyStore's open payment links engine.

OBJECTIVE:
Generate or parse dynamic payment checkout links using ScriptlyStore's endpoint:
- Checkout Page: https://scriptly.store/pay?data={TOKEN}
- Or Plain Query: https://scriptly.store/pay?title={TITLE}&price={PRICE_IN_INR}&redirect={REDIRECT_URL}
- REST API: POST https://scriptly.store/api/pay/create

RULES & SCHEMA:
1. All monetary prices MUST be represented in Indian Rupee (INR ₹). Minimum price is ₹1.
2. The payload MUST conform to this exact JSON schema:
   {
     "title": "string (Required): Product or service name",
     "price": "number (Required): Amount in INR",
     "redirectUrl": "string (Required): Verified HTTP/HTTPS destination post-payment",
     "description": "string (Optional): Subtitle or deliverable notes",
     "currency": "INR",
     "sig": "string (Optional): HMAC-SHA256 signature for tamper verification"
   }
3. ENCODING OPTIONS:
   - Standard Base64: JSON stringify -> Base64 URL-safe (replace + with -, / with _, remove =).
   - Key-Protected AES: Encrypt with AES-256-GCM. Token prefix: "k1.<iv_hex>.<tag_hex>.<ciphertext_hex>".
     When accessed, buyer is prompted for the key, or pass &key={KEY} to unlock automatically.
4. VERIFICATION:
   - Calculate HMAC-SHA256 signature over: "\${title.trim()}|\${price}|\${redirectUrl.trim()}"
   - Reject any transaction where the signature does not match.`,
    schemaExample: `{
  "title": "Full-Stack SaaS Boilerplate",
  "price": 1499,
  "redirectUrl": "https://github.com/sh20raj/nexus-saas-template",
  "description": "Next.js 16 + TailwindCSS production starter kit",
  "currency": "INR",
  "sig": "e7b301f92a10cb5d"
}`,
    implementationCode: `// TypeScript / Node.js Helper
import crypto from "crypto";

export function createPaymentUrl(params: {
  title: string;
  price: number;
  redirectUrl: string;
  key?: string;
}) {
  const { title, price, redirectUrl, key } = params;

  if (key) {
    // AES-256-GCM Key Encryption
    const derivedKey = crypto.createHash("sha256").update(key).digest();
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", derivedKey, iv);
    const json = JSON.stringify({ title, price, redirectUrl, currency: "INR" });
    let ct = cipher.update(json, "utf8", "hex");
    ct += cipher.final("hex");
    const tag = cipher.getAuthTag().toString("hex");
    const token = \`k1.\${iv.toString("hex")}.\${tag}.\${ct}\`;
    return \`https://scriptly.store/pay?data=\${token}&key=\${encodeURIComponent(key)}\`;
  }

  // URL-Safe Base64
  const payload = { title, price, redirectUrl, currency: "INR" };
  const token = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return \`https://scriptly.store/pay?data=\${token}\`;
}`,
    keyEdgeCases: [
      "Redirect URLs must include protocol (https://) or default to https automatically.",
      "If user enters wrong encryption key on /pay, KeyUnlockCard shows clear error state without crashing.",
      "Base64 padding must be safely normalized (+/- and _// replacements).",
    ],
  },
  {
    id: "product-publishing",
    title: "Product Packaging & Marketplace Publishing",
    category: "Inventory & Catalog",
    icon: Package,
    summary:
      "Automate digital product packaging, private ZIP archive placement under /uploads, database metadata indexing, and category/subcategory classification.",
    systemPrompt: `You are the ScriptlyStore Product Lifecycle & Asset Packaging Agent.

OBJECTIVE:
Validate, package, and insert new digital code products, SaaS templates, and developer scripts into the Neon PostgreSQL database via Drizzle ORM.

RULES & SCHEMA:
1. Product assets (ZIP packages) MUST be stored securely in the local private storage:
   Path: /uploads/{productId}.zip (NEVER exposed publicly, served only via /api/download/[productId]).
2. Drizzle Schema Model ('products' table):
   - id: text (cuid / uuid)
   - title: text (e.g. "Vetra AI Marketing SaaS")
   - slug: text (unique, url-friendly kebab-case)
   - description: text (markdown overview & tech specs)
   - price: integer (in paise, e.g. ₹999 = 99900 paise)
   - categoryId: text (references categories table)
   - subcategoryId: text (optional, references subcategories table)
   - creatorId: text (references users table)
   - status: "draft" | "pending" | "approved" | "rejected"
   - fileKey: text (relative path in /uploads)
   - demoUrl: text (optional live preview URL)
   - githubRepo: text (optional repository link)
3. SCALABILITY:
   - Use indexed category slugs: /explore/[category] and /explore/[category]/[subcategory]
   - All explore queries must push pagination and filters down to SQL using LIMIT and OFFSET.`,
    schemaExample: `{
  "title": "Nexus SaaS Template",
  "slug": "nexus-saas-template",
  "price": 199900,
  "currency": "INR",
  "category": "saas-templates",
  "subcategory": "nextjs",
  "fileKey": "/uploads/nexus-saas-template.zip",
  "techStack": ["Next.js 16", "Tailwind CSS", "Neon Postgres", "Drizzle ORM"]
}`,
    implementationCode: `// Drizzle Insertion Example
import { db } from "@/db";
import { products } from "@/db/schema";

export async function publishProduct(data: {
  title: string;
  slug: string;
  description: string;
  priceInRupees: number;
  categoryId: string;
  creatorId: string;
  fileKey: string;
}) {
  return await db.insert(products).values({
    title: data.title,
    slug: data.slug,
    description: data.description,
    price: Math.round(data.priceInRupees * 100), // convert to paise
    categoryId: data.categoryId,
    creatorId: data.creatorId,
    fileKey: data.fileKey,
    status: "approved",
    createdAt: new Date(),
  }).returning();
}`,
    keyEdgeCases: [
      "Slugs must be strictly unique. Generate a numerical suffix if a conflict occurs.",
      "Product prices must always be converted to paise when saving to SQL database.",
      "Downloads must verify completed order ownership before streaming bytes.",
    ],
  },
  {
    id: "razorpay-webhooks",
    title: "Razorpay Signature Verification & Webhook Handling",
    category: "Payments & Commerce",
    icon: CreditCard,
    summary:
      "Authenticate payment callbacks, compute HMAC SHA-256 order signatures, fulfill orders, generate digital receipts, and trigger automated redirections.",
    systemPrompt: `You are the Razorpay Payment Verification & Fulfillment Agent for ScriptlyStore.

OBJECTIVE:
Verify client-side Razorpay payment signatures or incoming webhook events to prevent fraudulent order fulfillment.

RULES:
1. Signature Verification Formula:
   Expected Signature = HMAC_SHA256(
     message: "\${razorpay_order_id}|\${razorpay_payment_id}",
     secret: RAZORPAY_KEY_SECRET
   )
2. Comparison MUST use timingSafeEqual to guard against timing side-channel attacks.
3. Upon verified success:
   - Update order record status from "pending" to "completed".
   - Record paymentId, timestamp, and buyer contact details.
   - Record ledger split: 95% creator balance, 5% platform commission.
   - If dynamic payment link, redirect buyer to link's redirectUrl.`,
    schemaExample: `{
  "razorpay_order_id": "order_Q123456789ABCD",
  "razorpay_payment_id": "pay_P987654321WXYZ",
  "razorpay_signature": "4a7b9c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z"
}`,
    implementationCode: `import crypto from "crypto";

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): boolean {
  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(\`\${orderId}|\${paymentId}\`)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(generatedSignature),
    Buffer.from(signature)
  );
}`,
    keyEdgeCases: [
      "Buffer lengths must match before invoking timingSafeEqual to avoid ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH.",
      "Never trust client-reported payment status without backend HMAC check or Razorpay API verification.",
      "Double webhook deliveries must be idempotent—check if order is already 'completed'.",
    ],
  },
  {
    id: "creator-payouts",
    title: "Creator Storefronts & 95/5 Commission Split",
    category: "Creators & Revenue",
    icon: Store,
    summary:
      "Enforce ScriptlyStore's developer-first 95% revenue share model. Calculate ledger balances, manage payouts, and power custom creator storefronts.",
    systemPrompt: `You are the ScriptlyStore Creator Revenue & Split Architecture Agent.

OBJECTIVE:
Calculate, allocate, and audit earnings splits for all digital sales across the marketplace.

BUSINESS LOGIC:
1. ScriptlyStore guarantees a 95% creator payout model on direct developer sales:
   - Creator Share = 95% of Net Sale Price
   - Platform Commission = 5% of Net Sale Price
2. Ledger Architecture:
   - Every completed order MUST create an immutable ledger transaction.
   - creator_ledger fields: id, creatorId, orderId, amount, splitRatio (0.95), platformFee, status ("pending" | "settled").
3. Creator Storefronts:
   - Accessible via /stores/[id] or custom slug.
   - Displays creator bio, verified badge, listed digital products, and total shipped assets.`,
    schemaExample: `{
  "orderAmount": 100000,
  "creatorSplit": 95000,
  "platformFee": 5000,
  "currency": "INR",
  "creatorId": "user_creator_sh20raj",
  "payoutMethod": "UPI / Razorpay Fund Account"
}`,
    implementationCode: `export function calculateCreatorSplit(grossAmountInPaise: number) {
  const creatorShare = Math.floor(grossAmountInPaise * 0.95);
  const platformFee = grossAmountInPaise - creatorShare;

  return {
    creatorShare,   // 95% in paise
    platformFee,    // 5% in paise
    grossAmount: grossAmountInPaise,
  };
}`,
    keyEdgeCases: [
      "Rounding issues: Always round down creator paise and allocate remaining difference to platform to ensure sum equals gross.",
      "Refunded orders must debit the creator's ledger balance or freeze corresponding pending payout.",
    ],
  },
  {
    id: "coupons-discounts",
    title: "Discount Engine & Coupon Campaigns",
    category: "Marketing & Growth",
    icon: Gift,
    summary:
      "Validate and apply percent or flat INR discounts, calculate cart deductions, enforce redemption limits, and manage campaign schedules.",
    systemPrompt: `You are the ScriptlyStore Discount & Promotions Engine Agent.

OBJECTIVE:
Validate, evaluate, and deduct discount codes during customer checkout at /cart or /pay.

RULES:
1. Types:
   - "percentage": e.g. 20% off total cart value.
   - "flat": e.g. ₹200 off (deducted in paise).
2. Constraints:
   - Check isActive === true.
   - Check current time < expiresAt.
   - Check timesUsed < maxUses (if maxUses is set).
   - Check cart total >= minCartValue.
3. Return discounted total in INR and paise with clear discount breakdown.`,
    schemaExample: `{
  "code": "LAUNCH20",
  "discountType": "percentage",
  "discountValue": 20,
  "minCartValue": 50000,
  "maxUses": 100,
  "timesUsed": 14,
  "expiresAt": "2026-12-31T23:59:59Z"
}`,
    implementationCode: `export function calculateDiscount(cartTotalPaise: number, coupon: {
  discountType: "percentage" | "flat";
  discountValue: number;
}) {
  let discountPaise = 0;
  if (coupon.discountType === "percentage") {
    discountPaise = Math.round((cartTotalPaise * coupon.discountValue) / 100);
  } else {
    discountPaise = coupon.discountValue * 100; // flat in rupees -> paise
  }

  const finalTotal = Math.max(0, cartTotalPaise - discountPaise);
  return { discountPaise, finalTotal };
}`,
    keyEdgeCases: [
      "Discount cannot exceed order total; final payable amount cannot fall below ₹0.",
      "Atomic usage increments: Update timesUsed using atomic SQL increment (sql\`times_used + 1\`) to prevent race conditions.",
    ],
  },
  {
    id: "customer-support-downloads",
    title: "Secure Downloads & Protected Digital Asset Delivery",
    category: "Support & Security",
    icon: ShieldCheck,
    summary:
      "Handle customer digital fulfillment, stream private assets via /api/download/[productId], verify user ownership, and resolve download disputes.",
    systemPrompt: `You are the ScriptlyStore Digital Asset Delivery & Customer Support Agent.

OBJECTIVE:
Validate download authorization and securely serve digital archive ZIP packages to verified customers.

SECURITY & WORKFLOW:
1. Endpoint: /api/download/[productId]
2. Verification Pipeline:
   - Extract authenticated user session via getOrCreateDbUser().
   - Query orders table for (userId == user.id AND productId == productId AND status == 'completed').
   - If no valid order exists, return 403 Forbidden with helpful purchase redirect.
   - If valid order exists, stream file from /uploads/{productId}.zip with Content-Disposition: attachment.
3. Support Inquiries:
   - Verify paymentId in Razorpay dashboard if customer claims payment completed but order shows pending.`,
    schemaExample: `{
  "productId": "prod_vetra_ai",
  "userId": "user_2xABC123",
  "hasCompletedOrder": true,
  "fileSize": "14.2 MB",
  "downloadLimit": "unlimited"
}`,
    implementationCode: `// Protected Download Handler
import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function handleProtectedDownload(userId: string, productId: string) {
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.userId, userId), eq(orders.productId, productId), eq(orders.status, "completed")));

  if (!order) {
    return new NextResponse("Unauthorized: No completed purchase found.", { status: 403 });
  }

  const filePath = path.join(process.cwd(), "uploads", \`\${productId}.zip\`);
  if (!fs.existsSync(filePath)) {
    return new NextResponse("File archive not found.", { status: 404 });
  }

  const fileStream = fs.createReadStream(filePath);
  return new NextResponse(fileStream as any, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": \`attachment; filename="\${productId}.zip"\`,
    },
  });
}`,
    keyEdgeCases: [
      "Path traversal protection: Sanitize productId to prevent ../ directory escaping.",
      "Verify file exists on disk before attempting to stream to prevent server hangs.",
    ],
  },
];

export default function AdminPromptDocsPage() {
  const [activeProcessId, setActiveProcessId] = useState<string>("payment-links");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredProcesses = PROCESS_PROMPTS.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeProcess =
    PROCESS_PROMPTS.find((p) => p.id === activeProcessId) || PROCESS_PROMPTS[0];

  const handleCopy = (text: string, id: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-500 font-black uppercase text-xs tracking-wider mb-1">
            <FileCode2 className="w-4 h-4" /> AI Operations & Architecture
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
            Process Prompt Docs & System Specifications
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Production-ready prompts, JSON schemas, and code implementations for each ScriptlyStore process.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="rounded-xl text-xs font-bold border-border/60">
            <a href="/docs/api/payment-links" target="_blank" rel="noreferrer">
              Public API Docs <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </a>
          </Button>
          <Button asChild size="sm" className="bg-[#58CC02] hover:bg-[#58CC02]/90 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_3px_0_#46A302]">
            <a href="/admin/payment-links">Payment Links Tool</a>
          </Button>
        </div>
      </div>

      {/* Search & Process Selector Grid */}
      <div className="space-y-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search processes or prompts..."
            className="pl-9 h-10 rounded-xl text-xs bg-card/40 border-border/50"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {filteredProcesses.map((proc) => {
            const Icon = proc.icon;
            const isActive = proc.id === activeProcess.id;
            return (
              <button
                key={proc.id}
                onClick={() => setActiveProcessId(proc.id)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                  isActive
                    ? "border-[#58CC02] bg-[#58CC02]/10 shadow-sm"
                    : "border-border/40 bg-card/30 hover:border-border/80 hover:bg-card/60"
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-card border border-border/50 flex items-center justify-center text-foreground">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#58CC02]" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <p className="font-black text-xs text-foreground line-clamp-1">{proc.title}</p>
                  <p className="text-[10px] text-muted-foreground line-clamp-1">{proc.category}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Process Workspace */}
      <div className="rounded-3xl border border-border/50 bg-card/35 backdrop-blur-xl p-6 sm:p-8 space-y-8 shadow-sm">
        {/* Header of Active Process */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/30 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary border-primary/20">
                {activeProcess.category}
              </Badge>
              <span className="text-xs font-mono text-muted-foreground">id: {activeProcess.id}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground">{activeProcess.title}</h2>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              {activeProcess.summary}
            </p>
          </div>

          <Button
            onClick={() =>
              handleCopy(
                activeProcess.systemPrompt,
                `prompt-${activeProcess.id}`,
                "System Prompt"
              )
            }
            className="bg-[#58CC02] hover:bg-[#58CC02]/90 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_3px_0_#46A302] active:translate-y-px active:shadow-none shrink-0"
          >
            {copiedId === `prompt-${activeProcess.id}` ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5" /> Copied Prompt
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Agent Prompt
              </>
            )}
          </Button>
        </div>

        {/* Workspace Tabs */}
        <Tabs defaultValue="prompt" className="w-full">
          <TabsList className="bg-muted/40 p-1 rounded-xl border border-border/50 mb-6">
            <TabsTrigger value="prompt" className="rounded-lg text-xs font-bold gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> System Prompt (for AI)
            </TabsTrigger>
            <TabsTrigger value="schema" className="rounded-lg text-xs font-bold gap-1.5">
              <Code className="w-3.5 h-3.5 text-sky-500" /> JSON Schema Specification
            </TabsTrigger>
            <TabsTrigger value="code" className="rounded-lg text-xs font-bold gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-500" /> Implementation Code
            </TabsTrigger>
            <TabsTrigger value="edge-cases" className="rounded-lg text-xs font-bold gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-500" /> Edge Cases & Guardrails
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: System Prompt */}
          <TabsContent value="prompt" className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                AI Coding Agent Instructions (Drop into Claude, Antigravity, or GPT)
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  handleCopy(
                    activeProcess.systemPrompt,
                    `prompt-inner-${activeProcess.id}`,
                    "Prompt"
                  )
                }
                className="text-xs font-bold"
              >
                {copiedId === `prompt-inner-${activeProcess.id}` ? "Copied" : "Copy"}
              </Button>
            </div>
            <pre className="p-5 rounded-2xl bg-background/90 border border-border/50 font-mono text-xs text-foreground whitespace-pre-wrap leading-relaxed select-all">
              {activeProcess.systemPrompt}
            </pre>
          </TabsContent>

          {/* Tab 2: JSON Schema */}
          <TabsContent value="schema" className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                Payload / Contract Data Structure
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  handleCopy(
                    activeProcess.schemaExample,
                    `schema-${activeProcess.id}`,
                    "Schema"
                  )
                }
                className="text-xs font-bold"
              >
                {copiedId === `schema-${activeProcess.id}` ? "Copied" : "Copy"}
              </Button>
            </div>
            <pre className="p-5 rounded-2xl bg-background/90 border border-border/50 font-mono text-xs text-foreground overflow-x-auto leading-relaxed select-all">
              {activeProcess.schemaExample}
            </pre>
          </TabsContent>

          {/* Tab 3: Implementation Code */}
          <TabsContent value="code" className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                Production Reference Code (TypeScript / Node.js)
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  handleCopy(
                    activeProcess.implementationCode,
                    `code-${activeProcess.id}`,
                    "Code snippet"
                  )
                }
                className="text-xs font-bold"
              >
                {copiedId === `code-${activeProcess.id}` ? "Copied" : "Copy"}
              </Button>
            </div>
            <pre className="p-5 rounded-2xl bg-background/90 border border-border/50 font-mono text-xs text-foreground overflow-x-auto leading-relaxed select-all">
              {activeProcess.implementationCode}
            </pre>
          </TabsContent>

          {/* Tab 4: Edge Cases */}
          <TabsContent value="edge-cases" className="space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              Critical Guardrails & Production Edge Cases
            </span>
            <div className="grid grid-cols-1 gap-3">
              {activeProcess.keyEdgeCases.map((edgeCase, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-muted/20 border border-border/40 flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    !
                  </div>
                  <p className="text-xs text-foreground leading-relaxed font-medium">
                    {edgeCase}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
