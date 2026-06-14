import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Licenses | ScriptlyStore",
  description: "Terms and details of our commercial and personal licenses.",
};

export default function LicensesPage() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-20 space-y-12" id="licenses-page-root">
      <div className="space-y-4 border-b border-border/60 pb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-foreground">Product Licenses</h1>
        <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Last updated June 13, 2026</p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground font-medium leading-relaxed">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">1. Commercial License</h2>
          <p>
            All premium templates, boilerplates, prompts, and scripts purchased on ScriptlyStore come with a standard commercial license. Under this license:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>You may build unlimited personal or commercial projects using the code assets.</li>
            <li>You may customize, restructure, and modify the source code files to suit your requirements.</li>
            <li>You can sell SaaS applications or services built using these assets.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">2. Restrictions</h2>
          <p>
            You are strictly prohibited from performing the following actions:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>**Redistribution**: You cannot resell, redistribute, sub-license, or share the original ZIP package or source files directly, even for free or inside a larger builder bundle.</li>
            <li>**Marketplace Re-hosting**: You cannot host the templates or files on another marketplace to compete directly with ScriptlyStore.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">3. Attribution</h2>
          <p>
            Attribution back to ScriptlyStore or Strivio inside your compiled frontend applications is optional and not required. The source code is entirely yours to run and deploy.
          </p>
        </section>

        <section className="space-y-4 border-t border-border/40 pt-10">
          <p className="text-xs italic">
            Questions? Contact mail@scriptly.store.
          </p>
        </section>
      </div>
    </div>
  );
}
