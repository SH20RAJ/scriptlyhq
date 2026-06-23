import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy",
  description: "Read our policy on instant electronic delivery of downloadable digital assets and code templates on ScriptlyStore.",
  alternates: {
    canonical: "https://scriptly.store/shipping",
  },
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
            ScriptlyStore sells downloadable digital assets, including website templates, SaaS boilerplates, ebooks, development scripts, UI kits, and prompts. <strong>There is no physical shipping or dispatch involved.</strong> Consequently, there are zero shipping charges, delivery fees, packaging costs, or customs duties applied to any order.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">2. Delivery Timeline</h2>
          <p>
            All purchases are delivered electronically. Upon successful payment capture through <strong>Razorpay</strong>, access to your purchased digital files is unlocked <strong>instantly</strong>. You will be redirected to the purchase success screen to download your items immediately, and a transaction receipt containing download instructions will be sent to your registered email address.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">3. How to Access Purchases</h2>
          <p>
            You can access all your purchased files at any time by logging into your customer account <strong>Dashboard</strong> at <a href="/dashboard" className="underline hover:text-foreground">/dashboard</a>. If you do not have an active account, one will be created under the email address utilized at checkout.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">4. Technical Delays & Resolution</h2>
          <p>
            In rare instances, network latency or webhook delays might defer order activation. If your payment was captured but downloads are not visible:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Wait up to 10-15 minutes and refresh your dashboard.</li>
            <li>Verify that the transaction amount was successfully debited from your card or bank account.</li>
            <li>If the download remains locked after 15 minutes, please contact mail@scriptly.store. We will verify the transaction and manually grant access within <strong>24 hours</strong>.</li>
          </ul>
        </section>

        <section className="space-y-4 border-t border-border/40 pt-10">
          <p className="text-xs italic">
            For delivery support or inquiries, please contact mail@scriptly.store.
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Registered Office:</strong> Strivio Inc., DLF Phase 3, Sector 24, Gurugram, Haryana - 122002, India.
          </p>
        </section>
      </div>
    </div>
  );
}
