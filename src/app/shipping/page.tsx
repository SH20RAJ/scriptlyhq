import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | ScriptlyStore",
  description: "Immediate delivery policy for digital files and templates.",
};

export default function ShippingPage() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-20 space-y-12" id="shipping-page-root">
      <div className="space-y-4 border-b border-border/60 pb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-foreground">Shipping & Delivery Policy</h1>
        <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Last updated June 13, 2026</p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground font-medium leading-relaxed">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">1. Delivery Method</h2>
          <p>
            ScriptlyStore sells downloadable digital assets. There is no physical shipping involved. All purchased templates, code scripts, prompts, and kit files are delivered instantly after payment confirmation.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">2. How to Access Purchases</h2>
          <p>
            Upon successful payment capture, you will be redirected to the **Purchase Success** screen. You can also download your files directly from your customer account **Dashboard** at `/dashboard` at any time.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">3. Verification Issues</h2>
          <p>
            If your payment was completed but downloads are not active, please wait up to 15 minutes for payment verification webhooks to sync. If access remains locked, contact support@strivio.world with your transaction ID.
          </p>
        </section>

        <section className="space-y-4 border-t border-border/40 pt-10">
          <p className="text-xs italic">
            Questions? Contact support@strivio.world.
          </p>
        </section>
      </div>
    </div>
  );
}
