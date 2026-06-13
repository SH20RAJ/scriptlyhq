import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | ScriptlyStore",
  description: "Terms and conditions for using the ScriptlyStore marketplace.",
};

export default function TermsPage() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-20 space-y-12">
      <div className="space-y-4 border-b border-border/60 pb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-foreground">Terms of Service</h1>
        <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Effective as of June 13, 2026</p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground font-medium leading-relaxed">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">1. Acceptance of Terms</h2>
          <p>
            By accessing or using ScriptlyStore, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">2. Digital Products & Licensing</h2>
          <p>
            All products sold on ScriptlyStore are digital assets. Upon purchase, you are granted a non-exclusive, non-transferable license to use the asset according to the specific license type selected at checkout.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Standard License: Personal or single-client use.</li>
            <li>Commercial License: Multi-project and commercial use.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">3. Refunds & Cancellations</h2>
          <p>
            Due to the nature of digital products, all sales are final. Refunds are only issued in exceptional circumstances where the product is fundamentally broken or mislabeled, at the sole discretion of Strivio Inc.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">4. User Accounts</h2>
          <p>
            You are responsible for maintaining the security of your account and any activities that occur under your account. We use Hexclave for secure authentication and do not store passwords on our servers.
          </p>
        </section>

        <section className="space-y-4 border-t border-border/40 pt-10">
          <p className="text-xs italic">
            ScriptlyStore is a product of Strivio Inc. For legal inquiries, please contact legal@strivio.world.
          </p>
        </section>
      </div>
    </div>
  );
}
