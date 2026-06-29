import { BlogPost } from "../blog-data";

export const post1: BlogPost = {
  slug: "build-telegram-bot-cloudflare-workers-2026",
  title: "How to Build a Telegram Bot with Cloudflare Workers in 2026",
  excerpt: "Learn how to build and deploy a serverless, high-frequency Telegram bot on Cloudflare Workers with Manifest MV3 compliance and edge caching.",
  category: "AI",
  readTime: "14 min read",
  createdAt: "2026-06-29",
  thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
  author: {
    name: "Sarah Chen",
    role: "Edge Security Engineer",
    bio: "Sarah Chen is a backend engineer specializing in serverless execution environments, Cloudflare API gateway setups, and decentralized message brokers.",
    github: "https://github.com/sarahchen-dev",
    twitter: "https://twitter.com/sarahchen_dev"
  },
  content: `Traditional chatbot hosting is expensive and slow. Running a node process on a VPS 24/7 just to wait for occasional webhook calls from Telegram wastes money and computing resources. In 2026, developers are moving to serverless edge architectures like Cloudflare Workers. 

By leveraging V8 runtimes, Cloudflare Workers spin up in milliseconds, handle requests globally, and offer a massive free tier of 100,000 requests per day. This guide is your ultimate blueprint to design, code, and deploy a serverless Telegram bot.

---

### Why Serverless for Chatbots?

When a user sends a message to your Telegram bot, Telegram forwards it as an HTTP POST request to your webhook. If you use a traditional server, that server must run constantly:

| Metric | VPS Hosting (24/7) | Cloudflare Workers (Edge) |
|---|---|---|
| **Monthly Cost** | $5.00 - $20.00 | $0.00 (Free Tier) |
| **Response Latency** | 120ms - 300ms | < 15ms globally |
| **Cold Starts** | N/A | Near 0ms |
| **Scaling** | Manual scaling | Automatic to infinity |
| **Maintenance** | OS updates, security patches | Zero maintenance |

---

### Step 1: Create Your Bot with BotFather

1. Open Telegram and search for **@BotFather**.
2. Send the \`/newbot\` command.
3. Choose a display name and a unique username ending in \`bot\` (e.g., \`MyCloudflareBot\`).
4. Copy the secure **HTTP API Token** (e.g., \`123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ\`). Keep this token completely private.

---

### Step 2: Initialize Your Cloudflare Worker Project

Ensure you have \`bun\` installed on your machine, then run:

\`\`\`bash
bun create cloudflare@latest telegram-bot-worker
\`\`\`

Select **\"Hello World\" Worker**, choose **TypeScript**, and opt to deploy via Wrangler. Navigate to your project directory:

\`\`\`bash
cd telegram-bot-worker
\`\`\`

Create a \`wrangler.jsonc\` configuration file to store your variables:

\`\`\`json
{
  "name": "telegram-bot-worker",
  "main": "src/index.ts",
  "compatibility_date": "2026-06-29",
  "compatibility_flags": ["nodejs_compat"],
  "vars": {
    "TELEGRAM_BOT_TOKEN": "YOUR_SECRET_TOKEN"
  }
}
\`\`\`

> **💡 Deploy Tested Serverless Telegram Bots Instantly**
> Skip manually writing webhook parsers, state caches, and command routing. Speed up your workflow and look professional by deploying our premium [LYNX — Telegram URL Shortener Worker](https://scriptly.store/products/lynx-url-shortener-worker) or checkout the [AETHERA — Telegram AI Assistant Worker](https://scriptly.store/products/aethera-telegram-ai-worker) for interactive ChatGPT capabilities.

---

### Step 3: Coding the Telegram Webhook Handler

Open \`src/index.ts\` and write the core serverless router. We will parse the incoming JSON payload from Telegram and route message commands:

\`\`\`typescript
export interface Env {
  TELEGRAM_BOT_TOKEN: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      const payload: any = await request.json();
      if (payload.message) {
        await handleMessage(payload.message, env);
      }
      return new Response("OK", { status: 200 });
    } catch (err: any) {
      console.error(err);
      return new Response(err.message || "Error", { status: 500 });
    }
  },
};

async function handleMessage(message: any, env: Env) {
  const chatId = message.chat.id;
  const text = message.text || "";

  if (text.startsWith("/start")) {
    await sendTelegramMessage(chatId, "Welcome to your Cloudflare serverless bot! Send /help to see commands.", env);
  } else if (text.startsWith("/help")) {
    await sendTelegramMessage(chatId, "Available commands:\n/start - Welcome\n/help - Help menu\n/time - Current system time", env);
  } else if (text.startsWith("/time")) {
    await sendTelegramMessage(chatId, \`Serverless Time: \${new Date().toISOString()}\`, env);
  } else {
    await sendTelegramMessage(chatId, \`You said: "\${text}"\`, env);
  }
}

async function sendTelegramMessage(chatId: number, text: string, env: Env) {
  const url = \`https://api.telegram.org/bot\${env.TELEGRAM_BOT_TOKEN}/sendMessage\`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "Markdown",
    }),
  });
}
\`\`\`

---

### Step 4: Register the Webhook with Telegram

For Telegram to send user messages to your Worker, you must register your Worker's URL. Once you deploy your worker, run the following HTTP request in your terminal:

\`\`\`bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://telegram-bot-worker.<your-subdomain>.workers.dev"}'
\`\`\`

Verify that the registration was successful by visiting:
\`https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo\`

---

### Advanced Feature: Handling State Cache with Cloudflare KV

Standard V8 isolates are stateless. If your bot needs to remember user preferences, api keys, or conversational context, bind a **Cloudflare KV Namespace** to your worker. 

Create a KV namespace:
\`\`\`bash
npx wrangler kv:namespace create BOT_STORAGE
\`\`\`

Add the binding to your \`wrangler.jsonc\`:
\`\`\`json
"kv_namespaces": [
  {
    "binding": "BOT_STORAGE",
    "id": "YOUR_KV_NAMESPACE_ID"
  }
]
\`\`\`

Now, read and write data directly within your message routing logic:
\`\`\`typescript
// Save user preferences
await env.BOT_STORAGE.put(\`user_pref_\${chatId}\`, JSON.stringify({ theme: "dark" }));

// Read user preferences
const prefs = await env.BOT_STORAGE.get(\`user_pref_\${chatId}\`);
\`\`\`

> **⚡ Track Cryptocurrency Prices with Serverless Automation**
> Need a bot that does more than echo text? Build a high-performance alert tool that polls APIs and notifies users. Buy our [CRYPTOBULK — Telegram Crypto Price Alert Bot](https://scriptly.store/products/cryptobulk-crypto-alert-bot) to get a production-ready price bot with database connection pooling and cron updates pre-configured.

---

### Frequently Asked Questions (FAQ)

#### How do I keep my Bot Token secure in production?
Do not paste the token directly into \`wrangler.jsonc\` for production. Instead, upload it as a Cloudflare Worker secret:
\`npx wrangler secret put TELEGRAM_BOT_TOKEN\`
The secret will automatically become available in your \`env\` object at runtime.

#### Can I use NPM packages inside my Cloudflare Worker?
Yes, Wrangler resolves standard ESM dependencies during compilation. You can install and import packages like \`lodash\`, \`zod\`, or \`marked\` normally.

#### How do I handle heavy tasks or external API limits?
Use Cloudflare Queue or ExecutionContext's \`ctx.waitUntil(promise)\` to run long tasks asynchronously in the background. This allows your HTTP request to respond instantly back to Telegram within the 10-second webhook limit.`
};
