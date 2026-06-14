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
          <h2 className="text-xl font-bold text-foreground tracking-tight">1. Introduction</h2>
          <p>
            Strivio Inc. ("we," "us," or "our") operates the ScriptlyStore marketplace (https://scriptly.store/). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and disclose information from and about users of our website and services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">2. Information We Collect</h2>
          <p>
            To provide our services, we collect minimal personal data. This includes:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Account Details:</strong> When you register or sign in, we collect your email address and name. Authentication is handled securely through our partner, Hexclave, and we do not store passwords.</li>
            <li><strong>Transaction Details:</strong> When you make a purchase, details such as name, email address, transaction currency, payment status, and order details are registered.</li>
            <li><strong>Usage & Device Data:</strong> We may automatically log information about your device, browser type, operating system, and interaction details to optimize page speed and functionality.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">3. Payment Information</h2>
          <p>
            All payment transactions on ScriptlyStore are securely processed through <strong>Razorpay</strong>. We do not collect, view, or store credit card numbers, CVVs, net banking logins, or other sensitive payment credentials on our servers. All such data is entered directly on Razorpay's PCI-DSS compliant secure checkout page.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">4. How We Use Your Data</h2>
          <p>
            Your collected information is used solely for the following purposes:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Processing and facilitating payment transactions via Razorpay.</li>
            <li>Delivering purchased digital assets and managing licenses.</li>
            <li>Sending transactional notifications, receipts, and order updates.</li>
            <li>Providing client support and debugging service issues.</li>
            <li>Complying with applicable legal, accounting, and taxation requirements.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">5. Cookies & Tracking Technologies</h2>
          <p>
            We use essential cookies and session tokens to keep you logged in and preserve items in your shopping cart. You can configure your browser to reject cookies, though some parts of our marketplace may not function properly as a result.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">6. Data Security</h2>
          <p>
            We implement robust security measures to keep your data safe, including HTTPS/TLS 1.3 encryption for all web traffic and secure serverless computing provided by Cloudflare. However, please be aware that no method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">7. Your Rights</h2>
          <p>
            You have the right to request access to the personal data we hold about you, request corrections to any inaccuracies, or request the deletion of your account and related data. To exercise these rights, please contact support@scriptly.store.
          </p>
        </section>

        <section className="space-y-4 border-t border-border/40 pt-10">
          <p className="text-xs italic">
            If you have questions about this Privacy Policy or how your data is handled, please contact our data team at privacy@scriptly.store.
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Address:</strong> Strivio Inc., DLF Phase 3, Sector 24, Gurugram, Haryana - 122002, India | Support Phone: +91 81783 85203
          </p>
        </section>
      </div>
    </div>
  );
}
