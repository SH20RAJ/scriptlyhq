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
            Welcome to ScriptlyStore (https://scriptly.store/). This website is owned and operated by Strivio Inc. By accessing, browsing, or using this website, or by purchasing any digital products offered, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use this website.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">2. Changes to Terms</h2>
          <p>
            Strivio Inc. reserves the right to modify or replace these Terms of Service at any time without prior notice. Any changes will be updated directly on this page with a revised "effective date." Your continued use of the website following the posting of changes constitutes acceptance of those changes.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">3. User Eligibility & Accounts</h2>
          <p>
            By using this website, you represent that you are at least 18 years of age, or accessing the site under the supervision of a parent or guardian. 
          </p>
          <p>
            To purchase products or access specific areas, you must authenticate securely using Hexclave. You are solely responsible for maintaining the confidentiality of your credentials and accounts, and you agree to accept responsibility for all activities that occur under your account.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">4. Digital Products & Licensing</h2>
          <p>
            All templates, UI kits, boilerplates, code scripts, prompts, and related files sold on ScriptlyStore are digital assets. Upon successful purchase, Strivio Inc. grants you a non-exclusive, non-transferable, revocable license to use the downloaded asset in accordance with the specific license type selected at checkout:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Standard License:</strong> Allows use for personal projects or a single commercial project for a single client. Redistribution or resale of source files is prohibited.</li>
            <li><strong>Commercial License:</strong> Allows usage for multiple commercial projects and multi-client projects. Redistribution of source files remains strictly prohibited.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">5. Pricing & Payments</h2>
          <p>
            All prices listed on ScriptlyStore are in Indian Rupees (INR) or United States Dollars (USD), as indicated, and are subject to change without notice. 
          </p>
          <p>
            Payments are securely processed via <strong>Razorpay</strong>. By placing an order, you authorize us and our payment processor to charge the designated payment method for the total order amount. Strivio Inc. does not store or process cardholder or bank credentials on its servers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">6. Refunds & Cancellation</h2>
          <p>
            Due to the immediate delivery and downloadable nature of digital products, all purchases are non-refundable and final. Please review product details, documentation, and compatibility requirements carefully before purchasing. Refund exceptions are only handled under the strict guidelines specified in our <a href="/refund" className="underline hover:text-foreground">Cancellation & Refund Policy</a>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">7. Intellectual Property</h2>
          <p>
            All content on this website, including but not limited to text, design, graphics, logo, code, and interfaces, is the intellectual property of Strivio Inc. and is protected by copyright and intellectual property laws. Unauthorized duplication, extraction, or copying of website designs is strictly forbidden.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, Strivio Inc. and its affiliates shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our products or services, even if advised of the possibility of such damages.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">9. Governing Law & Jurisdiction</h2>
          <p>
            These Terms of Service and any transactions entered into on this website are governed by and construed in accordance with the laws of India. Any legal actions, disputes, or claims arising out of these terms shall be subject to the exclusive jurisdiction of the courts located in Gurugram, Haryana, India.
          </p>
        </section>

        <section className="space-y-4 border-t border-border/40 pt-10">
          <p className="text-xs italic">
            ScriptlyStore is a digital marketplace owned and operated by Strivio Inc. 
            For legal inquiries, contact mail@scriptly.store. 
            For support queries, please reach out to mail@scriptly.store or call us at +91 81783 85203.
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Registered Office:</strong> Strivio Inc., DLF Phase 3, Sector 24, Gurugram, Haryana - 122002, India.
          </p>
        </section>
      </div>
    </div>
  );
}
