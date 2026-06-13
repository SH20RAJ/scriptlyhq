import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | ScriptlyStore",
  description: "How we handle your data at ScriptlyStore.",
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-20 space-y-12">
      <div className="space-y-4 border-b border-border/60 pb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-foreground">Privacy Policy</h1>
        <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Last updated June 13, 2026</p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground font-medium leading-relaxed">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">1. Information Collection</h2>
          <p>
            We collect minimal information required to provide our services. This includes your email address and name provided during sign-up through our authentication partner, Hexclave.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">2. Payment Data</h2>
          <p>
            Payments are processed securely via Razorpay. ScriptlyStore does not store or have access to your full credit card details or bank credentials.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">3. Use of Data</h2>
          <p>
            Your data is used strictly for:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Granting access to purchased digital assets.</li>
            <li>Sending critical transaction updates and receipts.</li>
            <li>Improving our marketplace recommendations.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">4. Security</h2>
          <p>
            We employ industry-standard security measures including SSL encryption and secure serverless computing provided by Cloudflare.
          </p>
        </section>

        <section className="space-y-4 border-t border-border/40 pt-10">
          <p className="text-xs italic">
            Questions? Contact privacy@strivio.world.
          </p>
        </section>
      </div>
    </div>
  );
}
