import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | ScriptlyStore",
  description: "Our cancellation and refund policies for digital products.",
};

export default function RefundPage() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-20 space-y-12" id="refund-page-root">
      <div className="space-y-4 border-b border-border/60 pb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-foreground">Cancellation & Refund Policy</h1>
        <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Last updated June 13, 2026</p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground font-medium leading-relaxed">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">1. Nature of Digital Goods</h2>
          <p>
            Due to the downloadable nature of digital products, SaaS templates, boilerplates, ebooks, prompts, scripts, and UI kits hosted on ScriptlyStore, all purchases are final and non-refundable. Once a file link is generated or access is unlocked, we cannot revoke files or issue refunds.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">2. Exceptions</h2>
          <p>
            We only issue refunds under the following unique conditions:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>**Double Purchase**: If you accidentally purchased the same product twice within 24 hours.</li>
            <li>**Corrupt or Defective File**: If the provided ZIP package is corrupt and cannot be opened or contains missing files (requires support verification).</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">3. Request Process</h2>
          <p>
            To request a refund under valid exception cases, email support@strivio.world with your transaction receipt, registered email, and detailed reasoning within 7 days of purchase. Approved refunds will be processed via Razorpay within 5-7 business days back to your original payment method.
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
