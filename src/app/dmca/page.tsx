import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA Copyright Policy | ScriptlyStore",
  description: "Copyright infringement notification procedures under the DMCA for ScriptlyStore.",
};

export default function DmcaPage() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-20 space-y-12">
      <div className="space-y-4 border-b border-border/60 pb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-foreground">DMCA Copyright Policy</h1>
        <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Effective as of June 15, 2026</p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground font-medium leading-relaxed">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">1. Overview of Copyright Protection</h2>
          <p>
            ScriptlyStore ("Platform"), owned and operated by Strivio Inc., respects the intellectual property rights of others. We expect all creators and users to upload only materials they own or hold explicit permissions to distribute. In accordance with the Digital Millennium Copyright Act ("DMCA"), we respond promptly to notices of alleged copyright infringement.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">2. DMCA Takedown Notice Requirements</h2>
          <p>
            If you believe that any creator script, boilerplate, text description, or other media hosted on our website infringes upon your copyright, you may submit a formal notification to our Designated Copyright Agent. Your notice must include:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>A physical or electronic signature of the copyright owner or a person authorized to act on their behalf.</li>
            <li>Identification of the copyrighted work claimed to have been infringed (e.g. description or link to original work).</li>
            <li>Identification of the material that is claimed to be infringing, including the specific URL on ScriptlyStore where the material is located.</li>
            <li>Your contact details: name, address, telephone number, and email address.</li>
            <li>A statement that you have a good faith belief that the use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
            <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are the copyright owner or authorized to act on behalf of the owner.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">3. Safe Harbor Actions</h2>
          <p>
            Upon receipt of a valid and complete DMCA notice, we will:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Expeditiously remove or disable access to the allegedly infringing material.</li>
            <li>Notify the creator or user who uploaded the material that access has been disabled.</li>
            <li>Forward a copy of the notification to the uploader.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">4. Counter-Notification Procedure</h2>
          <p>
            If you believe your material was removed or disabled by mistake or misidentification, you may file a counter-notification with our copyright agent. To be valid, a counter-notice must be in writing and include:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Your physical or electronic signature.</li>
            <li>Identification of the material that has been removed or to which access has been disabled, and the location (URL) before removal.</li>
            <li>A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification.</li>
            <li>Your name, address, and telephone number.</li>
            <li>A statement that you consent to the jurisdiction of the Federal District Court for the judicial district in which your address is located (or Gurugram, India, if your address is outside the US), and that you will accept service of process from the person who provided the original DMCA notice.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">5. Repeat Infringer Policy</h2>
          <p>
            ScriptlyStore maintains a strict policy to terminate accounts and storefronts of creators or users who are deemed to be repeat infringers of copyright claims. Repeat infringers are users who have been verified as uploading infringing material more than twice.
          </p>
        </section>

        <section className="space-y-4 border-t border-border/40 pt-10">
          <h2 className="text-lg font-bold text-foreground">Contact Our Copyright Agent</h2>
          <p className="text-xs">
            Submit all DMCA notices or counter-notifications to:
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            Email: legal@scriptly.store<br />
            Address: Strivio Inc. Attn: Copyright Agent, DLF Phase 3, Sector 24, Gurugram, Haryana - 122002, India.
          </p>
        </section>
      </div>
    </div>
  );
}
