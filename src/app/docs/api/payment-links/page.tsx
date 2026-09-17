import { Metadata } from "next";
import Link from "next/link";
import { CyberBackground } from "@/components/ui/CyberBackground";
import { ArrowLeft, Code, Link2, ExternalLink, ShieldCheck, Sparkles, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Open Payment Links API Documentation | ScriptlyStore",
  description: "Learn how to generate instant, zero-setup payment links with post-payment redirects using ScriptlyStore's open API and encoded URLs.",
};

export default function PaymentLinksDocPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between relative overflow-hidden">
      <CyberBackground />

      {/* Header */}
      <header className="border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-[#58CC02] flex items-center justify-center text-white font-black text-base shadow-[0_3px_0_#46A302]">
              S
            </div>
            <span className="font-black text-lg tracking-tight group-hover:text-[#58CC02] transition-colors">
              Scriptly<span className="text-[#58CC02]">Docs</span>
            </span>
          </Link>

          <Button asChild variant="ghost" size="sm" className="text-xs font-bold text-muted-foreground hover:text-foreground">
            <Link href="/">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Store
            </Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-12 relative z-10">
        {/* Intro */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider">
            <Link2 className="w-3.5 h-3.5" /> Open Developer Commerce API
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
            Payment Links & Instant Checkouts
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Create zero-setup payment links with Razorpay processing and guaranteed post-payment redirection. Open to everyone—no API keys or signups required.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-card/40 border border-border/50 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              ✓
            </div>
            <h3 className="font-black text-sm">No Authentication Needed</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Anyone—even logged-out developers—can construct a URL or call the API to collect payments.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card/40 border border-border/50 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold">
              ⚡
            </div>
            <h3 className="font-black text-sm">Automatic Redirection</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Upon Razorpay signature verification, the customer is immediately redirected to your target destination.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card/40 border border-border/50 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
              🔒
            </div>
            <h3 className="font-black text-sm">256-bit Encrypted</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Payments are processed via official Razorpay SDK with HMAC SHA-256 server-side signature validation.
            </p>
          </div>
        </div>

        {/* Method 1: Encoded URL */}
        <section className="space-y-6">
          <div className="border-b border-border/40 pb-3">
            <h2 className="text-2xl font-black tracking-tight">Method 1: Direct Encoded URL</h2>
            <p className="text-xs text-muted-foreground mt-1">
              The simplest approach. No code or server required—just construct a link with query parameters.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-2">
            <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">URL Pattern 1: Base64 Encoded (Signed or Plain Schema)</p>
            <pre className="p-3 rounded-xl bg-background/90 border border-emerald-500/30 font-mono text-xs text-foreground overflow-x-auto">
              https://scriptly.store/pay?data=BASE64_ENCODED_PAYLOAD
            </pre>
            <p className="text-[11px] text-muted-foreground pt-1">
              Conceals price and destination parameters in a URL-safe Base64 token conforming to the JSON schema below. Supports optional HMAC-SHA256 signature verification.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <p className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">URL Pattern 2: Key-Protected (AES-256-GCM Encrypted)</p>
            <pre className="p-3 rounded-xl bg-background/90 border border-amber-500/40 font-mono text-xs text-foreground overflow-x-auto">
              https://scriptly.store/pay?data=k1.IV.TAG.CIPHERTEXT
            </pre>
            <p className="text-[11px] text-muted-foreground pt-1">
              Encrypted using a secret key. Buyers are prompted for the key on checkout, or pass <code className="font-mono text-foreground font-bold">&key=YOUR_SECRET_KEY</code> to unlock automatically.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 space-y-2">
            <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">URL Pattern 3: Plain Query String</p>
            <pre className="p-3 rounded-xl bg-background/90 border border-border/60 font-mono text-xs text-foreground overflow-x-auto">
              https://scriptly.store/pay?title=YOUR_TITLE&price=PRICE_IN_INR&redirect=REDIRECT_URL
            </pre>
          </div>

          {/* Schema Spec */}
          <div className="p-4 rounded-2xl bg-card/50 border border-border/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-primary" /> Base64 Payload Schema (Raw JSON)
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">UTF-8 JSON string Base64 encoded</span>
            </div>
            <pre className="p-3 rounded-xl bg-background/90 border border-border/60 font-mono text-xs text-foreground overflow-x-auto">
{`{
  "title": "Architecture Review",        // [Required] string: Product or service name
  "price": 1499,                         // [Required] number: Amount in INR (₹)
  "redirectUrl": "https://example.com",  // [Required] string: Target URL after payment
  "description": "Optional notes",       // [Optional] string: Subtitle displayed on card
  "currency": "INR",                     // [Optional] string: Defaults to "INR"
  "sig": "a1b2c3d4e5f67890"              // [Optional] string: HMAC-SHA256 signature
}`}
            </pre>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground">Query Parameters</h3>
            <div className="overflow-x-auto rounded-xl border border-border/50">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/30 border-b border-border/40 text-muted-foreground font-black uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Parameter</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Required</th>
                    <th className="p-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  <tr>
                    <td className="p-3 font-mono font-bold text-foreground">title</td>
                    <td className="p-3 text-muted-foreground">string</td>
                    <td className="p-3 text-emerald-500 font-bold">Yes</td>
                    <td className="p-3 text-muted-foreground">Product, service, or call title shown to buyer. (Alias: <code>name</code>)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-foreground">price</td>
                    <td className="p-3 text-muted-foreground">number</td>
                    <td className="p-3 text-emerald-500 font-bold">Yes</td>
                    <td className="p-3 text-muted-foreground">Price in INR (e.g. <code>499</code> or <code>1500</code>). (Alias: <code>prize</code>)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-foreground">redirect</td>
                    <td className="p-3 text-muted-foreground">string (URL)</td>
                    <td className="p-3 text-emerald-500 font-bold">Yes</td>
                    <td className="p-3 text-muted-foreground">Destination URL to redirect buyer after verified payment. (Alias: <code>redirectUrl</code>)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-foreground">data</td>
                    <td className="p-3 text-muted-foreground">string</td>
                    <td className="p-3 text-muted-foreground font-bold">No*</td>
                    <td className="p-3 text-muted-foreground">Base64 encoded payload or AES encrypted token (<code>k1....</code>). Replaces title, price, and redirect parameters.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-foreground">key</td>
                    <td className="p-3 text-muted-foreground">string</td>
                    <td className="p-3 text-muted-foreground font-bold">No</td>
                    <td className="p-3 text-muted-foreground">Decryption key/passphrase for AES-encrypted tokens. Automatically unlocks the checkout without user input. (Alias: <code>secret</code>)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-foreground">desc</td>
                    <td className="p-3 text-muted-foreground">string</td>
                    <td className="p-3 text-muted-foreground font-bold">No</td>
                    <td className="p-3 text-muted-foreground">Optional short explanation displayed on checkout card. (Alias: <code>description</code>)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card/60 border border-border/50 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-foreground">Live Working Example</p>
              <p className="text-[11px] text-muted-foreground">Click to test the live hosted checkout card.</p>
            </div>
            <Button asChild size="sm" className="bg-[#58CC02] hover:bg-[#58CC02]/90 text-white font-black text-xs uppercase tracking-wider rounded-xl">
              <a href="/pay?title=Architecture+Review&price=999&redirect=https%3A%2F%2Fexample.com%2Fbooking" target="_blank">
                Try Example <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </a>
            </Button>
          </div>
        </section>

        {/* Method 2: REST API */}
        <section className="space-y-6">
          <div className="border-b border-border/40 pb-3">
            <h2 className="text-2xl font-black tracking-tight">Method 2: REST API Endpoint</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Programmatically create stored payment links with clean slugs from your backend, webhooks, or scripts.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 font-mono text-xs font-black">
                POST
              </span>
              <code className="font-mono text-sm text-foreground">https://scriptly.store/api/pay/create</code>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">cURL Example</p>
              <pre className="p-4 rounded-xl bg-card/80 border border-border/60 font-mono text-xs text-foreground overflow-x-auto leading-relaxed">
{`curl -X POST https://scriptly.store/api/pay/create \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "API Access Pass",
    "price": 799,
    "redirectUrl": "https://myapp.com/onboarding?token=abc123xyz",
    "description": "Lifetime access to REST endpoints."
  }'`}
              </pre>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">JSON Response</p>
              <pre className="p-4 rounded-xl bg-card/80 border border-border/60 font-mono text-xs text-emerald-500 overflow-x-auto leading-relaxed">
{`{
  "success": true,
  "message": "Payment link created successfully",
  "data": {
    "id": "pl_8f9e2b10a4",
    "slug": "api-access-pass-7d2a",
    "url": "https://scriptly.store/pay/api-access-pass-7d2a",
    "dynamicUrl": "https://scriptly.store/pay?title=API+Access+Pass&price=799...",
    "price": 799,
    "currency": "INR",
    "redirectUrl": "https://myapp.com/onboarding?token=abc123xyz"
  }
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* Code Snippets */}
        <section className="space-y-4">
          <h2 className="text-xl font-black tracking-tight">JavaScript / TypeScript Integration</h2>
          <pre className="p-4 rounded-xl bg-card/80 border border-border/60 font-mono text-xs text-foreground overflow-x-auto leading-relaxed">
{`// Generate payment link from your frontend or server
const response = await fetch("https://scriptly.store/api/pay/create", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "1-on-1 Mentorship",
    price: 1200,
    redirectUrl: "https://calendar.google.com/calendar/u/0/r",
    description: "45-minute live mentorship session",
  }),
});

const { data } = await response.json();
console.log("Send buyer to:", data.url);
// Redirect user: window.location.href = data.url;`}
          </pre>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground relative z-10">
        <p>© {new Date().getFullYear()} ScriptlyStore. Open Developer Commerce Platform.</p>
      </footer>
    </div>
  );
}
