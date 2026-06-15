"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Coins,
  Landmark,
  User,
  Shield,
  Key,
  Sparkles,
  Building,
  Info,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  BookOpen
} from "lucide-react";
import Link from "next/link";

export default function RouteGuidePage() {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-16 md:py-24 space-y-12 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="space-y-4 border-b border-border/40 pb-10">
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="rounded-full px-3 py-1 text-[10px] uppercase font-black tracking-[0.2em] border-purple-500/20 text-purple-400 bg-purple-500/5"
          >
            Documentation
          </Badge>
          <Badge
            variant="outline"
            className="rounded-full px-3 py-1 text-[10px] uppercase font-black tracking-[0.2em] border-emerald-500/20 text-emerald-400 bg-emerald-500/5"
          >
            Razorpay Route Split Live
          </Badge>
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground sm:leading-[1.1] flex flex-col md:flex-row md:items-center gap-3">
          Razorpay Route Splits
          <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-xl">
            Developer & User Guide
          </span>
        </h1>
        <p className="text-lg text-muted-foreground font-medium max-w-3xl leading-relaxed">
          Learn how ScriptlyStore uses Razorpay Route to dynamically split customer checkout payments instantly. 
          Read instructions for creators, buyers, and administrators.
        </p>
      </div>

      {/* Grid Quick Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/40 bg-neutral-950/40 backdrop-blur-sm rounded-3xl p-5 hover:border-purple-500/20 transition-all duration-300">
          <CardHeader className="p-0 pb-3 flex flex-row items-center gap-3 space-y-0">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <CardTitle className="text-sm font-black uppercase tracking-wider text-white">95% Creator Share</CardTitle>
          </CardHeader>
          <CardContent className="p-0 text-xs text-muted-foreground leading-relaxed font-medium">
            ScriptlyStore maintains a builder-first pricing structure. You keep 95% of every transaction, with only a 5% flat platform charge.
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-neutral-950/40 backdrop-blur-sm rounded-3xl p-5 hover:border-purple-500/20 transition-all duration-300">
          <CardHeader className="p-0 pb-3 flex flex-row items-center gap-3 space-y-0">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Coins className="w-5 h-5" />
            </div>
            <CardTitle className="text-sm font-black uppercase tracking-wider text-white">Instant Routing</CardTitle>
          </CardHeader>
          <CardContent className="p-0 text-xs text-muted-foreground leading-relaxed font-medium">
            Say goodbye to monthly holdbacks. When customer checkouts are processed, your splits are automatically routed directly into your bank.
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-neutral-950/40 backdrop-blur-sm rounded-3xl p-5 hover:border-purple-500/20 transition-all duration-300">
          <CardHeader className="p-0 pb-3 flex flex-row items-center gap-3 space-y-0">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Shield className="w-5 h-5" />
            </div>
            <CardTitle className="text-sm font-black uppercase tracking-wider text-white">Secure Escrow</CardTitle>
          </CardHeader>
          <CardContent className="p-0 text-xs text-muted-foreground leading-relaxed font-medium">
            Transactions are managed under Razorpay's RBI-compliant nodal account mechanism, guaranteeing complete financial security.
          </CardContent>
        </Card>
      </div>

      {/* Tabs Documentation */}
      <Tabs defaultValue="creator" className="w-full space-y-8">
        <TabsList className="grid w-full grid-cols-3 bg-neutral-950 border border-border/40 p-1.5 rounded-2xl h-14">
          <TabsTrigger
            value="creator"
            className="rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer transition-all data-[state=active]:bg-neutral-900 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-border/40"
          >
            <Building className="w-3.5 h-3.5" />
            For Creators
          </TabsTrigger>
          <TabsTrigger
            value="buyer"
            className="rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer transition-all data-[state=active]:bg-neutral-900 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-border/40"
          >
            <User className="w-3.5 h-3.5" />
            For Buyers
          </TabsTrigger>
          <TabsTrigger
            value="admin"
            className="rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer transition-all data-[state=active]:bg-neutral-900 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-border/40"
          >
            <Key className="w-3.5 h-3.5" />
            For Admins
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Creators */}
        <TabsContent value="creator" className="space-y-6 outline-none focus:ring-0">
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground font-medium leading-relaxed">
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Landmark className="w-5 h-5 text-purple-400" />
              Onboarding & Direct Payout Settings
            </h3>
            
            <p>
              By leveraging **Razorpay Route**, ScriptlyStore has enabled a decentralized payout experience. 
              Instead of waiting for platform thresholds, earnings are split instantly during customer checkout. 
              Follow these simple steps to activate instant direct-bank payouts for your store.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex gap-4 items-start bg-neutral-950/40 p-5 rounded-2xl border border-border/30">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-500/10 text-purple-400 font-black text-xs flex-shrink-0">1</span>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">Submit Bank Account Details</h4>
                  <p className="text-xs">
                    Go to your <Link href="/dashboard/creator" className="text-purple-400 underline hover:text-purple-300">Creator Console</Link> and find the **Payout & Split Settings** editor. Select **Direct Bank (via Razorpay Route)** as your payout method. Fill in your Bank Name, Beneficiary Name, Account Number, and IFSC Code accurately.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start bg-neutral-950/40 p-5 rounded-2xl border border-border/30">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-500/10 text-purple-400 font-black text-xs flex-shrink-0">2</span>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">Verification & Account ID Creation</h4>
                  <p className="text-xs">
                    Once submitted, our administrators review your details and initiate sub-merchant account creation. Your store gets linked with a unique **Razorpay Linked Account ID** (e.g. `acc_Hsb82sJdh7s`). You can track this status directly inside your creator console settings.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start bg-neutral-950/40 p-5 rounded-2xl border border-border/30">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-500/10 text-purple-400 font-black text-xs flex-shrink-0">3</span>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">Automatic Splits</h4>
                  <p className="text-xs">
                    Whenever a buyer purchases your script, the system calculates the equivalent INR amount. It builds a checkout routing payload: 95% of your product price is transferred to your bank, while the platform collects a 5% commission. Payout releases are processed based on standard banking settlement cycles (typically T+2 business days).
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-amber-500/10 bg-amber-500/5 text-amber-400 text-xs flex gap-3.5 items-start mt-6">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-500" />
              <div className="space-y-1">
                <h4 className="font-bold text-amber-300 uppercase tracking-wide">Important KYC Compliance Details</h4>
                <p className="leading-relaxed text-neutral-400 font-medium">
                  Because payments are processed directly via banking partners, Razorpay requires that you comply with standard regulations. If the API automation returns compliance alerts, our administration will reach out to gather manual KYC details (like business name, address, or tax registration) to complete your account setup via the Razorpay dashboard.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Buyers */}
        <TabsContent value="buyer" className="space-y-6 outline-none focus:ring-0">
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground font-medium leading-relaxed">
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" />
              Secure Checkout & Instant Delivery
            </h3>
            
            <p>
              ScriptlyStore secures your transactions using enterprise-grade gateways. 
              When checking out on our platform, here is what you can expect as a buyer:
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex gap-4 items-start bg-neutral-950/40 p-5 rounded-2xl border border-border/30">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-500/10 text-purple-400 font-black text-xs flex-shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </span>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">PCI-DSS Compliant Payments</h4>
                  <p className="text-xs">
                    Your payments are fully handled via **Razorpay International**. Card details, net banking credentials, and UPI codes are never stored on ScriptlyStore servers. Your checkout process is protected with end-to-end SSL encryption.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start bg-neutral-950/40 p-5 rounded-2xl border border-border/30">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-500/10 text-purple-400 font-black text-xs flex-shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </span>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">Instant Access & Account Setup</h4>
                  <p className="text-xs">
                    Immediately upon successful checkout, you are redirected back to your customer dashboard. Your digital file downloads are unlocked instantly. If you are a new customer, a secure buyer account is automatically created using your checkout email.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start bg-neutral-950/40 p-5 rounded-2xl border border-border/30">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-500/10 text-purple-400 font-black text-xs flex-shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </span>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">Clear Licenses</h4>
                  <p className="text-xs">
                    Every code boilerplate, script, or prompt package you purchase comes with either a Standard or Commercial license. Review license limits in the footer. As all items are downloadable digital assets, checkouts are final and non-refundable unless corrupt files are verified.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Admins */}
        <TabsContent value="admin" className="space-y-6 outline-none focus:ring-0">
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground font-medium leading-relaxed">
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Key className="w-5 h-5 text-purple-400" />
              Administrative Routing Onboarding Fallback
            </h3>
            
            <p>
              For ScriptlyStore moderators, onboarding creators onto Razorpay Route can be completed using a hybrid automated or manual model.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex gap-4 items-start bg-neutral-950/40 p-5 rounded-2xl border border-border/30">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-500/10 text-purple-400 font-black text-xs flex-shrink-0">A</span>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">Automated API Onboarding (One-Click)</h4>
                  <p className="text-xs">
                    Navigate to `/admin/stores`. If a creator has saved their bank details, you will see an **Auto Route Onboard** button. Clicking this triggers the Razorpay Route Accounts API (`POST /v2/accounts`). It registers their email, business name, and bank details, automatically fetching and assigning a verified Linked Account ID (`acc_...`).
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start bg-neutral-950/40 p-5 rounded-2xl border border-border/30">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-500/10 text-purple-400 font-black text-xs flex-shrink-0">B</span>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">Manual Dashboard Onboarding Fallback</h4>
                  <p className="text-xs">
                    If the automated API request fails (due to regulatory warnings or complex business types):
                    1. Log into the official **Razorpay Dashboard**.
                    2. Go to **Route > Linked Accounts** and click **Add Account**.
                    3. Fill out the creator's bank details manually and save to generate an Account ID.
                    4. Copy the resulting `acc_...` ID.
                    5. Paste it in the creator's record on `/admin/stores` and click **Save** (disk icon).
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-blue-500/10 bg-blue-500/5 text-blue-400 text-xs flex gap-3.5 items-start mt-6">
              <Info className="w-5 h-5 flex-shrink-0 text-blue-500" />
              <div className="space-y-1">
                <h4 className="font-bold text-blue-300 uppercase tracking-wide">Developer Sandbox Notice</h4>
                <p className="leading-relaxed text-neutral-400 font-medium">
                  When testing under sandbox mode (`rzp_test_...` key prefix), Razorpay will mock all Route transfers. The server action automatically identifies mock credentials, generating virtual checkouts and logging test payouts to ensure seamless end-to-end flow evaluation.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Return link */}
      <div className="flex justify-start border-t border-border/40 pt-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-white transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Back to Marketplace Home
        </Link>
      </div>

    </div>
  );
}
