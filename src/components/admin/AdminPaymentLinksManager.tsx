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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

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
  amount: number | null;
  payerEmail: string | null;
  payerName: string | null;
  payerPhone: string | null;
  metadata: string | null;
  createdAt: Date;
}

export default function AdminPaymentLinksManager({
  initialLinks,
  initialActivities,
  origin,
}: {
  initialLinks: PaymentLinkItem[];
  initialActivities: ActivityItem[];
  origin: string;
}) {
  const [links, setLinks] = useState<PaymentLinkItem[]>(initialLinks);
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // New Link Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [description, setDescription] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Generator State
  const [genTitle, setGenTitle] = useState("Consulting Call");
  const [genPrice, setGenPrice] = useState("1500");
  const [genRedirect, setGenRedirect] = useState("https://meet.google.com/abc-def-ghi");
  const [genDesc, setGenDesc] = useState("1-on-1 Architecture Review Session");
  const [copiedGen, setCopiedGen] = useState(false);

  const dynamicUrlPreview = `${origin}/pay?title=${encodeURIComponent(genTitle)}&price=${genPrice}&redirect=${encodeURIComponent(genRedirect)}${genDesc ? `&desc=${encodeURIComponent(genDesc)}` : ""}`;

  // Metrics
  const totalLinks = links.length;
  const totalViews = links.reduce((sum, l) => sum + (l.views || 0), 0);
  const totalConversions = links.reduce((sum, l) => sum + (l.conversions || 0), 0);
  const totalRevenue = links.reduce((sum, l) => sum + (l.totalEarned || 0), 0) / 100;
  const conversionRate = totalViews > 0 ? ((totalConversions / totalViews) * 100).toFixed(1) : "0.0";

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
            Create payment links with instant post-payment redirection. Or generate links on-the-fly via encoded URLs and open REST API.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="rounded-xl text-xs font-bold gap-1.5 border-border/60">
            <a href="/docs/api/payment-links" target="_blank">
              <Code className="w-3.5 h-3.5" /> API & URL Docs
            </a>
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#58CC02] hover:bg-[#58CC02]/90 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_3px_0_#46A302] active:translate-y-px active:shadow-none transition-all gap-1.5">
                <Plus className="w-4 h-4" /> Create Payment Link
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

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-md space-y-1 shadow-sm">
          <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-primary" /> Active Links
          </span>
          <p className="text-2xl font-black text-foreground">{totalLinks}</p>
          <p className="text-[10px] text-muted-foreground">Managed payment links</p>
        </div>

        <div className="p-5 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-md space-y-1 shadow-sm">
          <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#1CB0F6]" /> Total Views
          </span>
          <p className="text-2xl font-black text-foreground">{totalViews}</p>
          <p className="text-[10px] text-muted-foreground">Checkout page impressions</p>
        </div>

        <div className="p-5 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-md space-y-1 shadow-sm">
          <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Conversions
          </span>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-foreground">{totalConversions}</p>
            <span className="text-xs font-bold text-emerald-500">{conversionRate}%</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Paid orders fulfilled</p>
        </div>

        <div className="p-5 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-md space-y-1 shadow-sm">
          <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#58CC02]" /> Revenue Collected
          </span>
          <p className="text-2xl font-black text-foreground">
            {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(totalRevenue)}
          </p>
          <p className="text-[10px] text-muted-foreground">Lifetime volume through links</p>
        </div>
      </div>

      {/* Main Workspace Tabs */}
      <Tabs defaultValue="links" className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <TabsList className="bg-muted/40 p-1 rounded-xl border border-border/50">
            <TabsTrigger value="links" className="rounded-lg text-xs font-bold gap-1.5">
              <Link2 className="w-3.5 h-3.5" /> All Payment Links ({links.length})
            </TabsTrigger>
            <TabsTrigger value="activities" className="rounded-lg text-xs font-bold gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Live Activity Log ({activities.length})
            </TabsTrigger>
            <TabsTrigger value="generator" className="rounded-lg text-xs font-bold gap-1.5">
              <Sliders className="w-3.5 h-3.5" /> Dynamic URL Generator
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search links..."
              className="pl-9 h-9 rounded-xl text-xs bg-card/40 border-border/50"
            />
          </div>
        </div>

        {/* Tab 1: Payment Links Table */}
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
                        <p className="text-[11px]">Click "Create Payment Link" above to get started.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredLinks.map((link) => {
                      const hostedUrl = `${origin}/pay/${link.slug}`;
                      const priceFormatted = new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: link.currency || "INR",
                        maximumFractionDigits: 0,
                      }).format(link.price / 100);

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
                                    <Copy className="w-3 h-3" /> Copy Link
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

        {/* Tab 2: Activity Feed */}
        <TabsContent value="activities" className="mt-0">
          <div className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-foreground">Recent Customer Activities</h3>
                <p className="text-[11px] text-muted-foreground">Real-time log of views, checkout initiations, and completed transactions.</p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                Live Telemetry
              </span>
            </div>

            {activities.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Activity className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="font-bold text-xs">No activities recorded yet</p>
                <p className="text-[11px]">When customers visit or pay via links, events will appear here.</p>
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
                        <CheckCircle2 className="w-3 h-3" /> Payment Success
                      </span>
                    );
                  } else if (act.type === "checkout_initiated") {
                    badge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-sky-500/10 text-sky-500 border border-sky-500/20">
                        Checkout Started
                      </span>
                    );
                  } else if (act.type === "view") {
                    badge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-muted text-muted-foreground">
                        Page View
                      </span>
                    );
                  } else if (act.type === "payment_failed") {
                    badge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-500/10 text-rose-500 border border-rose-500/20">
                        Failed
                      </span>
                    );
                  }

                  const formattedAmount = act.amount
                    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(act.amount / 100)
                    : null;

                  return (
                    <div key={act.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        {badge}
                        <div>
                          <p className="font-bold text-foreground">
                            {act.payerEmail || (act.linkId ? `Link ID: ${act.linkId}` : "Dynamic Checkout")}
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

        {/* Tab 3: Dynamic Encoded URL Generator */}
        <TabsContent value="generator" className="mt-0">
          <div className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-xl p-6 shadow-sm space-y-6">
            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Zero-Setup Instant Checkout
              </span>
              <h3 className="text-lg font-black text-foreground">Dynamic URL Encoder</h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                Encode your product title, price, and redirect destination directly into the URL. Anyone can create this link on the fly without database pre-registration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Title / Purpose</label>
                <Input
                  value={genTitle}
                  onChange={(e) => setGenTitle(e.target.value)}
                  placeholder="e.g. VIP Consultation"
                  className="rounded-xl h-10 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Price (INR ₹)</label>
                <Input
                  type="number"
                  value={genPrice}
                  onChange={(e) => setGenPrice(e.target.value)}
                  placeholder="e.g. 1500"
                  className="rounded-xl h-10 text-sm"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Redirect Destination URL</label>
                <Input
                  value={genRedirect}
                  onChange={(e) => setGenRedirect(e.target.value)}
                  placeholder="https://your-app.com/success or calendar booking link"
                  className="rounded-xl h-10 text-sm"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Description (Optional)</label>
                <Input
                  value={genDesc}
                  onChange={(e) => setGenDesc(e.target.value)}
                  placeholder="Short line shown to the buyer on the checkout card"
                  className="rounded-xl h-10 text-sm"
                />
              </div>
            </div>

            {/* Live Generated URL Output */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                  Ready-to-Share Dynamic URL
                </span>
                <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> No Login Required
                </span>
              </div>

              <div className="p-3 bg-background/80 rounded-lg border border-border/60 font-mono text-xs text-foreground break-all select-all">
                {dynamicUrlPreview}
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(dynamicUrlPreview);
                    setCopiedGen(true);
                    toast.success("Dynamic checkout URL copied!");
                    setTimeout(() => setCopiedGen(false), 2000);
                  }}
                  className="bg-[#58CC02] hover:bg-[#58CC02]/90 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_3px_0_#46A302] active:translate-y-px active:shadow-none"
                >
                  {copiedGen ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1.5" /> Copied Link
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Dynamic Link
                    </>
                  )}
                </Button>

                <Button asChild variant="outline" className="rounded-xl text-xs font-bold">
                  <a href={dynamicUrlPreview} target="_blank" rel="noreferrer">
                    Test Pay Page Now <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
