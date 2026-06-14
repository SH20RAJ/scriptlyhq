import { Metadata } from "next";
import { Mail, MapPin, ShieldCheck, HelpCircle, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Contact Us | ScriptlyStore",
  description: "Get in touch with customer support at ScriptlyStore.",
};

export default function ContactPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-16 md:py-24 space-y-16" id="contact-page-root">
      <div className="text-center space-y-4 max-w-xl mx-auto">
        <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px] uppercase font-black tracking-[0.2em] border-primary/20 text-primary">
          Support Desk
        </Badge>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground sm:leading-[1.1]">
          Get in Touch <br />
          <span className="text-muted-foreground">with ScriptlyStore.</span>
        </h1>
        <p className="text-base text-muted-foreground font-medium leading-relaxed">
          Need help with orders, payment validations, or builder tools? We are here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start max-w-3xl mx-auto">
        {/* Support coordinates */}
        <div className="space-y-8">
          <h2 className="text-xl font-bold text-foreground tracking-tight border-b border-border/40 pb-4">
            Merchant Coordinates
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Email</p>
                <a href="mailto:support@scriptly.store" className="text-sm font-bold text-foreground hover:underline">
                  support@scriptly.store
                </a>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Phone Support</p>
                <a href="tel:+918178385203" className="text-sm font-bold text-foreground hover:underline">
                  +91 81783 85203
                </a>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Headquarters</p>
                <p className="text-sm font-bold text-foreground">
                  Strivio Inc.<br />
                  DLF Phase 3, Sector 24<br />
                  Gurugram, Haryana - 122002
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Payment Safety</p>
                <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                  Razorpay encrypted checkouts and Hexclave authorization provide security for client data.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs list */}
        <div className="space-y-8 bg-card/30 border border-border/50 rounded-3xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-foreground tracking-tight border-b border-border/40 pb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-muted-foreground" />
            Quick FAQ
          </h2>
          <div className="space-y-6 text-sm font-medium text-muted-foreground">
            <div className="space-y-1">
              <h3 className="font-bold text-foreground text-sm">When will I get files after payment?</h3>
              <p className="text-xs leading-relaxed">Instantly! You will be redirected to download links immediately, and they will be saved permanently in your dashboard.</p>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-foreground text-sm">Can I request customization?</h3>
              <p className="text-xs leading-relaxed">Our templates are boilerplates. You can customize them or reach out to builders directly through contact coordinates.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
