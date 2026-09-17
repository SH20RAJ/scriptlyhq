"use client";

import { useState } from "react";
import {
  createPaymentLinkAction,
  togglePaymentLinkActiveAction,
  deletePaymentLinkAction,
} from "@/lib/actions/payment-links";
import {
  Link2,
  Plus,
  ExternalLink,
  Copy,
  Check,
  Trash2,
  Eye,
  CheckCircle2,
  TrendingUp,
  Search,
  Code,
  Activity,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  Sliders,
  BarChart3,
  Lock,
  CreditCard,
  X,
  AlertTriangle,
  FileCode,
  Zap,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import { encodePaymentLinkPayload } from "@/lib/payments/link-encoder";

interface PaymentLinkItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  redirectUrl: string;
  active: boolean;
  views: number;
  conversions: number;
  totalEarned: number;
  createdAt: Date;
}

interface ActivityItem {
  id: string;
  linkId: string | null;
  type: string;
  orderId?: string | null;
  paymentId?: string | null;
  amount: number | null;
  payerEmail: string | null;
  payerName: string | null;
  payerPhone: string | null;
  metadata: string | null;
  createdAt: Date;
}

interface SeparateAnalytics {
  overall: {
    totalRevenue: number;
    totalPaidOrders: number;
    totalViews: number;
    totalCheckouts: number;
  };
  stored: {
    totalLinks: number;
    activeLinks: number;
    totalRevenue: number;
    totalConversions: number;
    totalViews: number;
    conversionRate: string;
  };
  dynamicPay: {
    totalRevenue: number;
    totalConversions: number;
    totalCheckoutStarts: number;
    totalViews: number;
    conversionRate: string;
    recentTransactions: Array<{
      id: string;
      orderId: string | null;
      paymentId: string | null;
      amount: number;
      payerEmail: string | null;
      payerName: string | null;
      payerPhone: string | null;
      redirectUrl: string | null;
      title: string | null;
      createdAt: Date;
    }>;
  };
}

export default function AdminPaymentLinksManager({
  initialLinks,
  initialActivities,
  initialAnalytics,
  origin,
}: {
  initialLinks: PaymentLinkItem[];
  initialActivities: ActivityItem[];
  initialAnalytics: SeparateAnalytics;
  origin: string;
}) {
  const [links, setLinks] = useState<PaymentLinkItem[]>(initialLinks);
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  const [analytics, setAnalytics] = useState<SeparateAnalytics>(initialAnalytics);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Per-Link Analytics Modal
  const [selectedLinkForAnalytics, setSelectedLinkForAnalytics] = useState<PaymentLinkItem | null>(null);

  // New Link Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [description, setDescription] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Encoded Link Generator State
  const [encTitle, setEncTitle] = useState("Architecture Review");
  const [encPrice, setEncPrice] = useState("1499");
  const [encRedirect, setEncRedirect] = useState("https://scriptly.store/explore");
  const [encDesc, setEncDesc] = useState("1-on-1 private architecture walkthrough session");
  const [encSign, setEncSign] = useState(true);
  const [encKey, setEncKey] = useState("");
  const [encMode, setEncMode] = useState<"signed" | "keyed" | "plain">("signed");
  const [copiedEnc, setCopiedEnc] = useState(false);
  const [copiedUnlocked, setCopiedUnlocked] = useState(false);

  // Calculate live Base64 or Key-Encrypted token
  const generatedToken = encodePaymentLinkPayload(
    {
      title: encTitle || "Product",
      price: parseFloat(encPrice) || 100,
      redirectUrl: encRedirect || "https://scriptly.store",
      description: encDesc || undefined,
    },
    {
      sign: encMode === "signed",
      encryptionKey: encMode === "keyed" && encKey.trim() ? encKey.trim() : undefined,
    }
  );

  const encodedUrlPreview = `${origin}/pay?data=${generatedToken}`;
  const unlockedUrlPreview =
    encMode === "keyed" && encKey.trim()
      ? `${origin}/pay?data=${generatedToken}&key=${encodeURIComponent(encKey.trim())}`
      : encodedUrlPreview;

  const sampleSchemaJson = JSON.stringify(
    {
      title: encTitle || "Architecture Review",
      price: parseFloat(encPrice) || 1499,
      redirectUrl: encRedirect || "https://scriptly.store/explore",
      description: encDesc || "1-on-1 private architecture walkthrough session",
      currency: "INR",
    },
    null,
    2
  );

  const formatINR = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);

  const filteredLinks = links.filter((l) =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.redirectUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = parseFloat(price);
    if (!title || !numPrice || !redirectUrl) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createPaymentLinkAction({
        title,
        price: numPrice,
        redirectUrl,
        description: description || undefined,
        customSlug: customSlug || undefined,
      });

      if (res.success && res.link) {
        toast.success("Payment link created!");
        setLinks([res.link, ...links]);
        setTitle("");
        setPrice("");
        setRedirectUrl("");
        setDescription("");
        setCustomSlug("");
        setIsDialogOpen(false);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create payment link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      await togglePaymentLinkActiveAction(id, !current);
      setLinks(links.map((l) => (l.id === id ? { ...l, active: !current } : l)));
      toast.success(!current ? "Link activated" : "Link paused");
    } catch (err: any) {
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async (id: string, linkTitle: string) => {
    if (!confirm(`Are you sure you want to delete payment link "${linkTitle}"?`)) return;
    try {
      await deletePaymentLinkAction(id);
      setLinks(links.filter((l) => l.id !== id));
      toast.success("Payment link removed.");
    } catch (err: any) {
      toast.error("Failed to delete link.");
    }
  };

  const copyToClipboard = (text: string, slugKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSlug(slugKey);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  // Activity list for the currently selected link modal
  const linkSpecificActivities = selectedLinkForAnalytics
    ? activities.filter((a) => a.linkId === selectedLinkForAnalytics.id)
    : [];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-black uppercase text-xs tracking-wider mb-1">
            <Link2 className="w-4 h-4" /> Direct Commerce Engine
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
            Payment Links & Instant Checkouts
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Create permanent stored links, or generate tamper-proof Base64 encoded links for instant payment collection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="rounded-xl text-xs font-bold gap-1.5 border-border/60">
            <a href="/docs/api/payment-links" target="_blank">
              <Code className="w-3.5 h-3.5" /> API & Encoder Docs
            </a>
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#58CC02] hover:bg-[#58CC02]/90 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_3px_0_#46A302] active:translate-y-px active:shadow-none transition-all gap-1.5">
                <Plus className="w-4 h-4" /> Create Permanent Link
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg rounded-2xl bg-card/95 backdrop-blur-2xl border-border/60 p-6">
              <DialogHeader>
                <DialogTitle className="text-lg font-black tracking-tight">Create Payment Link</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleCreateLink} className="space-y-4 mt-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                    Title / Product Name <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Next.js Architecture Audit"
                    className="rounded-xl h-10 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                      Price (INR ₹) <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      type="number"
                      step="1"
                      min="1"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. 999"
                      className="rounded-xl h-10 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                      Custom Slug (Optional)
                    </label>
                    <Input
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value)}
                      placeholder="e.g. arch-audit"
                      className="rounded-xl h-10 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                    Redirect URL (Destination After Payment) <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="url"
                    required
                    value={redirectUrl}
                    onChange={(e) => setRedirectUrl(e.target.value)}
                    placeholder="https://cal.com/your-username/call or https://drive.google.com/..."
                    className="rounded-xl h-10 text-sm"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Buyer will be automatically redirected to this URL upon successful payment.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                    Description (Optional)
                  </label>
                  <Textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Includes 45-minute private code walkthrough and recording."
                    className="rounded-xl text-xs resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsDialogOpen(false)}
                    className="rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#58CC02] hover:bg-[#58CC02]/90 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_3px_0_#46A302] active:translate-y-px active:shadow-none"
                  >
                    {isSubmitting ? "Creating..." : "Save Link"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Global KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-md space-y-1 shadow-sm">
          <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#58CC02]" /> Overall Volume
          </span>
          <p className="text-2xl font-black text-foreground">{formatINR(analytics.overall.totalRevenue)}</p>
          <p className="text-[10px] text-muted-foreground">{analytics.overall.totalPaidOrders} total paid checkouts</p>
        </div>

        <div className="p-5 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-md space-y-1 shadow-sm">
          <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-primary" /> Stored Links Volume
          </span>
          <p className="text-2xl font-black text-foreground">{formatINR(analytics.stored.totalRevenue)}</p>
          <p className="text-[10px] text-muted-foreground">{analytics.stored.totalConversions} paid orders ({analytics.stored.conversionRate}%)</p>
        </div>

        <div className="p-5 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-md space-y-1 shadow-sm">
          <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-[#1CB0F6]" /> Dynamic /pay Volume
          </span>
          <p className="text-2xl font-black text-foreground">{formatINR(analytics.dynamicPay.totalRevenue)}</p>
          <p className="text-[10px] text-muted-foreground">{analytics.dynamicPay.totalConversions} paid orders ({analytics.dynamicPay.conversionRate}%)</p>
        </div>

        <div className="p-5 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-md space-y-1 shadow-sm">
          <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-purple-400" /> Total Impressions
          </span>
          <p className="text-2xl font-black text-foreground">{analytics.overall.totalViews}</p>
          <p className="text-[10px] text-muted-foreground">{analytics.overall.totalCheckouts} checkouts launched</p>
        </div>
      </div>

      {/* Main Workspace Tabs */}
      <Tabs defaultValue="links" className="w-full">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <TabsList className="bg-muted/40 p-1 rounded-xl border border-border/50 flex-wrap h-auto">
            <TabsTrigger value="links" className="rounded-lg text-xs font-bold gap-1.5 py-2">
              <Link2 className="w-3.5 h-3.5" /> All Payment Links ({links.length})
            </TabsTrigger>
            <TabsTrigger value="dynamic_analytics" className="rounded-lg text-xs font-bold gap-1.5 py-2">
              <CreditCard className="w-3.5 h-3.5 text-[#58CC02]" /> /pay Dynamic Analytics ({analytics.dynamicPay.totalConversions})
            </TabsTrigger>
            <TabsTrigger value="encoder" className="rounded-lg text-xs font-bold gap-1.5 py-2">
              <Lock className="w-3.5 h-3.5 text-amber-500" /> Encoded Link Creator
            </TabsTrigger>
            <TabsTrigger value="activities" className="rounded-lg text-xs font-bold gap-1.5 py-2">
              <Activity className="w-3.5 h-3.5" /> Activity Stream ({activities.length})
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full lg:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search links..."
              className="pl-9 h-9 rounded-xl text-xs bg-card/40 border-border/50"
            />
          </div>
        </div>

        {/* Tab 1: Payment Links Table with Analytics Button */}
        <TabsContent value="links" className="mt-0">
          <div className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/20 text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                    <th className="py-3 px-4">Link Details</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Redirect Destination</th>
                    <th className="py-3 px-4">Performance</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredLinks.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-muted-foreground">
                        <div className="w-10 h-10 rounded-xl bg-muted/40 flex items-center justify-center mx-auto mb-2 text-muted-foreground">
                          <Link2 className="w-5 h-5" />
                        </div>
                        <p className="font-bold">No payment links found</p>
                        <p className="text-[11px]">Click "Create Permanent Link" above to get started.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredLinks.map((link) => {
                      const hostedUrl = `${origin}/pay/${link.slug}`;
                      const priceFormatted = formatINR(link.price / 100);

                      return (
                        <tr key={link.id} className="hover:bg-muted/10 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5">
                              <p className="font-black text-foreground text-sm flex items-center gap-1.5">
                                {link.title}
                              </p>
                              <p className="font-mono text-[10px] text-muted-foreground">
                                /pay/{link.slug}
                              </p>
                              {link.description && (
                                <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-xs">
                                  {link.description}
                                </p>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-black text-foreground">
                            {priceFormatted}
                          </td>

                          <td className="py-3.5 px-4">
                            <a
                              href={link.redirectUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline max-w-[200px] truncate"
                            >
                              <span className="truncate">{link.redirectUrl}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="text-[11px]">
                                <span className="font-black text-foreground">{link.views}</span>{" "}
                                <span className="text-muted-foreground">views</span>
                              </div>
                              <span>•</span>
                              <div className="text-[11px]">
                                <span className="font-black text-emerald-500">{link.conversions}</span>{" "}
                                <span className="text-muted-foreground">paid</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Switch
                                checked={link.active}
                                onCheckedChange={() => handleToggleActive(link.id, link.active)}
                              />
                              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                {link.active ? "Active" : "Paused"}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* View Link Analytics Button */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedLinkForAnalytics(link)}
                                className="h-8 px-2.5 rounded-lg text-[11px] font-bold gap-1 border-primary/30 text-primary hover:bg-primary/10"
                                title="View analytics for this link"
                              >
                                <BarChart3 className="w-3 h-3" /> Analytics
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(hostedUrl, link.slug)}
                                className="h-8 px-2.5 rounded-lg text-[11px] font-bold gap-1 border-border/50"
                              >
                                {copiedSlug === link.slug ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-500" /> Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" /> Copy
                                  </>
                                )}
                              </Button>

                              <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground"
                              >
                                <a href={hostedUrl} target="_blank" rel="noreferrer" title="Open payment page">
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(link.id, link.title)}
                                className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-rose-500"
                                title="Delete link"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Separate Analytics for https://scriptly.store/pay */}
        <TabsContent value="dynamic_analytics" className="mt-0 space-y-6">
          <div className="p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-xl shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#58CC02] flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" /> Dynamic Checkouts Telemetry
                </span>
                <h3 className="text-lg font-black text-foreground">
                  Payments Processed via https://scriptly.store/pay
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Real-time analytics for all transactions completed using on-the-fly Base64 encoded links and dynamic URL parameters.
                </p>
              </div>

              <Button asChild size="sm" variant="outline" className="rounded-xl text-xs font-bold gap-1.5 border-border/60">
                <a href={encodedUrlPreview} target="_blank" rel="noreferrer">
                  Test /pay Live <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </Button>
            </div>

            {/* Dynamic /pay KPI Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-background/60 border border-border/40 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  Dynamic Revenue
                </span>
                <p className="text-2xl font-black text-foreground">{formatINR(analytics.dynamicPay.totalRevenue)}</p>
                <p className="text-[10px] text-emerald-500 font-bold">100% via /pay</p>
              </div>

              <div className="p-4 rounded-xl bg-background/60 border border-border/40 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  Paid Orders
                </span>
                <p className="text-2xl font-black text-foreground">{analytics.dynamicPay.totalConversions}</p>
                <p className="text-[10px] text-muted-foreground">Successful fulfillments</p>
              </div>

              <div className="p-4 rounded-xl bg-background/60 border border-border/40 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  Checkout Launches
                </span>
                <p className="text-2xl font-black text-foreground">{analytics.dynamicPay.totalCheckoutStarts}</p>
                <p className="text-[10px] text-muted-foreground">{analytics.dynamicPay.totalViews} page impressions</p>
              </div>

              <div className="p-4 rounded-xl bg-background/60 border border-border/40 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  Conversion Rate
                </span>
                <p className="text-2xl font-black text-emerald-500">{analytics.dynamicPay.conversionRate}%</p>
                <p className="text-[10px] text-muted-foreground">Paid vs checkouts started</p>
              </div>
            </div>

            {/* Transactions Table for /pay */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                Recent /pay Completed Transactions
              </h4>

              {analytics.dynamicPay.recentTransactions.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground rounded-xl border border-border/40 bg-background/40">
                  <CreditCard className="w-6 h-6 mx-auto mb-2 opacity-40" />
                  <p className="font-bold text-xs">No dynamic payments recorded yet</p>
                  <p className="text-[11px] mt-0.5">When customers complete checkout at /pay?data=..., their orders will display here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border/40">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/30 border-b border-border/40 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="py-2.5 px-3">Title & Payer</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Redirect Target</th>
                        <th className="py-2.5 px-3">Order & Payment ID</th>
                        <th className="py-2.5 px-3 text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30 bg-background/40">
                      {analytics.dynamicPay.recentTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-muted/10">
                          <td className="py-3 px-3">
                            <p className="font-bold text-foreground">{tx.title || "Dynamic Checkout"}</p>
                            <p className="text-[11px] text-muted-foreground">
                              {tx.payerEmail || "No email"} {tx.payerName ? `(${tx.payerName})` : ""}
                            </p>
                          </td>
                          <td className="py-3 px-3 font-black text-emerald-500 text-sm">
                            {formatINR(tx.amount)}
                          </td>
                          <td className="py-3 px-3 max-w-[180px] truncate">
                            {tx.redirectUrl ? (
                              <a
                                href={tx.redirectUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-primary hover:underline truncate"
                              >
                                <span className="truncate">{tx.redirectUrl}</span>
                                <ExternalLink className="w-3 h-3 shrink-0" />
                              </a>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="py-3 px-3 font-mono text-[10px] text-muted-foreground">
                            <div>{tx.orderId || "—"}</div>
                            <div className="text-foreground/70">{tx.paymentId || "—"}</div>
                          </td>
                          <td className="py-3 px-3 text-right text-[11px] text-muted-foreground">
                            <div>{formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true })}</div>
                            <div className="text-[9px] opacity-70">{format(new Date(tx.createdAt), "MMM d, yyyy HH:mm")}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Encoded Link Creator Tool */}
        <TabsContent value="encoder" className="mt-0">
          <div className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-xl p-6 shadow-sm space-y-6">
            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Tamper-Proof Link Engine
              </span>
              <h3 className="text-lg font-black text-foreground">Base64 Encoded Payment Link Tool</h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                Generate an encoded link that conceals price and destination parameters behind a cryptographic signature. Buyers cannot alter the price in the URL without invalidating checkout.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                  Product / Service Title
                </label>
                <Input
                  value={encTitle}
                  onChange={(e) => setEncTitle(e.target.value)}
                  placeholder="e.g. Code Review & Architecture Audit"
                  className="rounded-xl h-10 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                  Price (INR ₹)
                </label>
                <Input
                  type="number"
                  value={encPrice}
                  onChange={(e) => setEncPrice(e.target.value)}
                  placeholder="e.g. 1499"
                  className="rounded-xl h-10 text-sm"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                  Redirect Destination URL (Post-Payment)
                </label>
                <Input
                  value={encRedirect}
                  onChange={(e) => setEncRedirect(e.target.value)}
                  placeholder="https://cal.com/booking or https://drive.google.com/..."
                  className="rounded-xl h-10 text-sm"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                  Description (Optional)
                </label>
                <Input
                  value={encDesc}
                  onChange={(e) => setEncDesc(e.target.value)}
                  placeholder="Short explanation displayed on the checkout card"
                  className="rounded-xl h-10 text-sm"
                />
              </div>
            </div>

            {/* Protection Mode Selection */}
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                Payload Encoding & Security Mode
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setEncMode("signed")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    encMode === "signed"
                      ? "border-[#58CC02] bg-[#58CC02]/10 text-foreground"
                      : "border-border/50 bg-card/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-black text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#58CC02]" /> HMAC Signed
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Tamper-proof Base64. Price cannot be altered.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setEncMode("keyed")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    encMode === "keyed"
                      ? "border-amber-500 bg-amber-500/10 text-foreground"
                      : "border-border/50 bg-card/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-black text-xs">
                    <Lock className="w-3.5 h-3.5 text-amber-500" /> Key-Encrypted
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    AES-256-GCM. Unlocks only with your secret key.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setEncMode("plain")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    encMode === "plain"
                      ? "border-sky-500 bg-sky-500/10 text-foreground"
                      : "border-border/50 bg-card/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-black text-xs">
                    <Code className="w-3.5 h-3.5 text-sky-500" /> Plain Base64
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Standard Base64 JSON schema. No signature required.
                  </p>
                </button>
              </div>
            </div>

            {/* Custom Encryption Key Input (if Keyed Mode) */}
            {encMode === "keyed" && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> Custom Passphrase / Decryption Key
                  </label>
                  <span className="text-[10px] font-mono text-muted-foreground">AES-256-GCM</span>
                </div>
                <Input
                  type="text"
                  value={encKey}
                  onChange={(e) => setEncKey(e.target.value)}
                  placeholder="Enter secret key (e.g. secret_pass_2026 or customer PIN)..."
                  className="rounded-xl h-10 text-sm bg-background/90 border-amber-500/40"
                />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Only buyers who possess this key can unlock the payment checkout. You can also append <code className="font-mono text-foreground font-bold">&key={encKey || "YOUR_KEY"}</code> to bypass the key prompt automatically.
                </p>
              </div>
            )}

            {/* Live Generated URL Output */}
            <div className="p-5 rounded-2xl bg-muted/40 border border-border/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-500" /> Encoded Checkout URL
                </span>
                <span className="text-[10px] text-emerald-500 font-bold">
                  {encMode === "keyed" ? "AES-256-GCM Protected" : "Zero Parameters Exposed"}
                </span>
              </div>

              <div className="p-3 bg-background/90 rounded-xl border border-border/60 font-mono text-xs text-foreground break-all select-all">
                {encodedUrlPreview}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(encodedUrlPreview);
                    setCopiedEnc(true);
                    toast.success("Payment URL copied!");
                    setTimeout(() => setCopiedEnc(false), 2000);
                  }}
                  className="bg-[#58CC02] hover:bg-[#58CC02]/90 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_3px_0_#46A302] active:translate-y-px active:shadow-none"
                >
                  {copiedEnc ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Encoded Link
                    </>
                  )}
                </Button>

                <Button asChild variant="outline" className="rounded-xl text-xs font-bold border-border/60">
                  <a href={encodedUrlPreview} target="_blank" rel="noreferrer">
                    Test Checkout Card <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                  </a>
                </Button>

                {encMode === "keyed" && encKey.trim() && (
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(unlockedUrlPreview);
                      setCopiedUnlocked(true);
                      toast.success("Pre-unlocked URL copied to clipboard!");
                      setTimeout(() => setCopiedUnlocked(false), 2000);
                    }}
                    variant="secondary"
                    className="rounded-xl text-xs font-bold"
                  >
                    {copiedUnlocked ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1.5" /> Copied Unlocked Link
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-3.5 h-3.5 mr-1.5" /> Copy Pre-Unlocked Link (&key=...)
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Underlying JSON Schema Preview */}
            <div className="p-4 rounded-xl bg-card/40 border border-border/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-primary" /> Underlying Payload Schema (Raw JSON)
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">base64 encoded into ?data=</span>
              </div>
              <pre className="p-3 rounded-lg bg-background/80 border border-border/50 font-mono text-[11px] text-muted-foreground overflow-x-auto">
                {sampleSchemaJson}
              </pre>
            </div>
          </div>
        </TabsContent>

        {/* Tab 4: Raw Activity Stream */}
        <TabsContent value="activities" className="mt-0">
          <div className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-foreground">Global Activity Stream</h3>
                <p className="text-[11px] text-muted-foreground">Telemetry stream across stored and dynamic payment links.</p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                Live Feed
              </span>
            </div>

            {activities.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Activity className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="font-bold text-xs">No activities recorded yet</p>
                <p className="text-[11px]">Events will appear here as visitors interact with links.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {activities.map((act) => {
                  let badge = (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-muted text-muted-foreground">
                      {act.type}
                    </span>
                  );

                  if (act.type === "payment_success") {
                    badge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Paid
                      </span>
                    );
                  } else if (act.type === "checkout_initiated") {
                    badge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-sky-500/10 text-sky-500 border border-sky-500/20">
                        Checkout
                      </span>
                    );
                  } else if (act.type === "view") {
                    badge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-muted text-muted-foreground">
                        View
                      </span>
                    );
                  } else if (act.type === "payment_failed") {
                    badge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-500/10 text-rose-500 border border-rose-500/20">
                        Failed
                      </span>
                    );
                  }

                  const formattedAmount = act.amount ? formatINR(act.amount / 100) : null;

                  return (
                    <div key={act.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        {badge}
                        <div>
                          <p className="font-bold text-foreground">
                            {act.payerEmail || (act.linkId ? `Link ID: ${act.linkId}` : "Dynamic /pay Checkout")}
                            {act.payerName && <span className="font-normal text-muted-foreground ml-1.5">({act.payerName})</span>}
                          </p>
                          {act.metadata && (
                            <p className="text-[10px] text-muted-foreground font-mono truncate max-w-sm">
                              {act.metadata}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right flex items-center gap-4">
                        {formattedAmount && (
                          <span className="font-black text-foreground text-sm">
                            {formattedAmount}
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground font-semibold">
                          {formatDistanceToNow(new Date(act.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Per-Link Analytics Modal */}
      {selectedLinkForAnalytics && (
        <Dialog open={Boolean(selectedLinkForAnalytics)} onOpenChange={(open) => !open && setSelectedLinkForAnalytics(null)}>
          <DialogContent className="max-w-2xl rounded-2xl bg-card/95 backdrop-blur-2xl border-border/60 p-6 space-y-6">
            <DialogHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5" /> Link Analytics & Telemetry
                </span>
                <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-mono text-muted-foreground">
                  ID: {selectedLinkForAnalytics.id}
                </span>
              </div>
              <DialogTitle className="text-xl font-black tracking-tight">
                {selectedLinkForAnalytics.title}
              </DialogTitle>
              <p className="text-xs text-muted-foreground font-mono truncate">
                {origin}/pay/{selectedLinkForAnalytics.slug}
              </p>
            </DialogHeader>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-background/80 border border-border/40 space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Price</span>
                <p className="text-lg font-black text-foreground">{formatINR(selectedLinkForAnalytics.price / 100)}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-background/80 border border-border/40 space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Total Views</span>
                <p className="text-lg font-black text-foreground">{selectedLinkForAnalytics.views}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-background/80 border border-border/40 space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Conversions</span>
                <p className="text-lg font-black text-emerald-500">{selectedLinkForAnalytics.conversions}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-background/80 border border-border/40 space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Revenue</span>
                <p className="text-lg font-black text-foreground">{formatINR(selectedLinkForAnalytics.totalEarned / 100)}</p>
              </div>
            </div>

            {/* Funnel Progress */}
            <div className="p-4 rounded-xl bg-muted/20 border border-border/40 space-y-2">
              <div className="flex justify-between text-xs font-black">
                <span>Conversion Rate</span>
                <span className="text-emerald-500">
                  {selectedLinkForAnalytics.views > 0
                    ? ((selectedLinkForAnalytics.conversions / selectedLinkForAnalytics.views) * 100).toFixed(1)
                    : "0.0"}%
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      selectedLinkForAnalytics.views > 0
                        ? (selectedLinkForAnalytics.conversions / selectedLinkForAnalytics.views) * 100
                        : 0
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{selectedLinkForAnalytics.views} impressions</span>
                <span>{selectedLinkForAnalytics.conversions} paid buyers</span>
              </div>
            </div>

            {/* Destination URL */}
            <div className="p-3 rounded-xl bg-muted/30 border border-border/40 text-xs flex items-center justify-between">
              <div className="truncate pr-2">
                <span className="text-muted-foreground">Redirects to: </span>
                <span className="font-bold text-foreground truncate">{selectedLinkForAnalytics.redirectUrl}</span>
              </div>
              <a href={selectedLinkForAnalytics.redirectUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline shrink-0">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Link-specific recent activity */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                Link Activity History ({linkSpecificActivities.length})
              </h4>
              {linkSpecificActivities.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">No specific activity recorded yet.</p>
              ) : (
                <div className="max-h-48 overflow-y-auto divide-y divide-border/30 rounded-xl border border-border/40 bg-background/50 p-2">
                  {linkSpecificActivities.map((act) => (
                    <div key={act.id} className="py-2 px-2 flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground uppercase text-[10px] px-2 py-0.5 rounded bg-muted">
                        {act.type}
                      </span>
                      <span className="text-muted-foreground truncate max-w-xs text-[11px]">
                        {act.payerEmail || act.orderId || "Anonymous view"}
                      </span>
                      <span className="text-muted-foreground text-[10px]">
                        {formatDistanceToNow(new Date(act.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLinkForAnalytics(null)}
                className="rounded-xl text-xs font-bold"
              >
                Close
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-[#58CC02] hover:bg-[#58CC02]/90 text-white font-black text-xs uppercase tracking-wider rounded-xl"
              >
                <a href={`${origin}/pay/${selectedLinkForAnalytics.slug}`} target="_blank" rel="noreferrer">
                  Open Checkout Page <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
