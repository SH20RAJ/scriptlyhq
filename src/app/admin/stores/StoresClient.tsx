"use client";

import { useState, useEffect } from "react";
import { updateCreatorRazorpayAccountIdAction, registerRazorpayRouteAccountAction } from "@/lib/actions/route";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, Save, Loader2, Sparkles, Building, CheckCircle2, XCircle, Search, Filter } from "lucide-react";
import Link from "next/link";

interface CreatorType {
  id: string;
  email: string;
  name: string | null;
  storeName: string | null;
  role: string;
  razorpayAccountId: string | null;
  bankName: string | null;
  bankAccountName: string | null;
  bankAccountNumber: string | null;
  bankIfsc: string | null;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
  productsList: string;
  createdAt: string;
}

export default function StoresClient({ initialCreators }: { initialCreators: CreatorType[] }) {
  const [creators, setCreators] = useState(initialCreators);
  const [accountInputs, setAccountInputs] = useState<Record<string, string>>(
    initialCreators.reduce((acc, c) => ({ ...acc, [c.id]: c.razorpayAccountId || "" }), {})
  );
  
  const [pendingMap, setPendingMap] = useState<Record<string, boolean>>({});
  const [autoPendingMap, setAutoPendingMap] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const handleManualSave = (userId: string) => {
    const accId = accountInputs[userId] || "";
    setPendingMap((prev) => ({ ...prev, [userId]: true }));

    startTransition(async () => {
      try {
        const res = await updateCreatorRazorpayAccountIdAction(userId, accId);
        if (res.success) {
          toast.success("Razorpay Account ID updated successfully!");
          setCreators((prev) =>
            prev.map((c) => (c.id === userId ? { ...c, razorpayAccountId: accId || null } : c))
          );
        } else {
          toast.error("Failed to save account ID.");
        }
      } catch (err: any) {
        toast.error(err.message || "Something went wrong.");
      } finally {
        setPendingMap((prev) => ({ ...prev, [userId]: false }));
      }
    });
  };

  const handleAutoRegister = (userId: string) => {
    setAutoPendingMap((prev) => ({ ...prev, [userId]: true }));

    startTransition(async () => {
      try {
        const res = await registerRazorpayRouteAccountAction(userId);
        if (res.success && res.accountId) {
          toast.success(`Registered successfully! Account ID: ${res.accountId}`);
          setAccountInputs((prev) => ({ ...prev, [userId]: res.accountId }));
          setCreators((prev) =>
            prev.map((c) => (c.id === userId ? { ...c, razorpayAccountId: res.accountId } : c))
          );
        }
      } catch (err: any) {
        toast.error(err.message || "Auto-onboarding failed. Please configure manually.");
      } finally {
        setAutoPendingMap((prev) => ({ ...prev, [userId]: false }));
      }
    });
  };

  const startTransition = (fn: () => Promise<void>) => {
    fn();
  };

  const filteredCreators = creators.filter((c) => {
    const term = search.toLowerCase();
    const matchesSearch =
      c.email.toLowerCase().includes(term) ||
      (c.name || "").toLowerCase().includes(term) ||
      (c.storeName || "").toLowerCase().includes(term);

    const hasBankDetails = !!c.bankAccountNumber && !!c.bankIfsc;
    const isRouteConnected = !!c.razorpayAccountId && c.razorpayAccountId.startsWith("acc_");
    
    let matchesStatus = true;
    if (statusFilter === "route_connected") {
      matchesStatus = isRouteConnected;
    } else if (statusFilter === "route_pending") {
      matchesStatus = !isRouteConnected && hasBankDetails;
    } else if (statusFilter === "bank_missing") {
      matchesStatus = !hasBankDetails;
    }

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCreators.length / itemsPerPage);
  const displayPage = Math.min(currentPage, Math.max(1, totalPages));
  const startIndex = (displayPage - 1) * itemsPerPage;
  const paginatedCreators = filteredCreators.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stores, emails, owners..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/60 bg-card/40 text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-border/60 bg-card/40 text-muted-foreground text-sm focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="all">All Store Statuses</option>
            <option value="route_connected">Step 3: Route Connected</option>
            <option value="route_pending">Step 2: Bank Setup Complete</option>
            <option value="bank_missing">Step 1: Bank Setup Missing</option>
          </select>
        </div>
      </div>

      <Card className="bg-card/30 border-border/50 backdrop-blur-md rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          {filteredCreators.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-sm font-medium">
              No matching stores or creator profiles found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-border/40 hover:bg-transparent">
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-foreground px-6 py-4">
                      Store & Owner
                    </TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-foreground px-6 py-4">
                      Bank Details
                    </TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-foreground px-6 py-4">
                      Route Onboarding Status
                    </TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-foreground px-6 py-4">
                      Catalog Items
                    </TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-foreground px-6 py-4 text-right">
                      Review Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCreators.map((c) => {
                    const hasBankDetails = !!c.bankAccountNumber && !!c.bankIfsc;
                    const isSavedPending = pendingMap[c.id] || false;
                    const isAutoPending = autoPendingMap[c.id] || false;
                    const isRouteConnected = !!c.razorpayAccountId && c.razorpayAccountId.startsWith("acc_");

                    return (
                      <TableRow
                        key={c.id}
                        className="border-border/40 hover:bg-muted/10 transition-colors"
                      >
                        {/* Store & Owner Column */}
                        <TableCell className="px-6 py-5 align-top">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              {c.storeName ? (
                                <span className="font-black text-foreground">
                                  {c.storeName}
                                </span>
                              ) : (
                                <span className="font-bold text-muted-foreground italic">
                                  Unnamed Store
                                </span>
                              )}
                              <Badge
                                variant="outline"
                                className="text-[9px] font-bold uppercase tracking-wider h-5"
                              >
                                {c.role}
                              </Badge>
                            </div>
                            <div className="flex flex-col gap-0.5 text-xs text-muted-foreground font-medium">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5 text-muted-foreground/60" />
                                {c.email}
                              </span>
                              {c.name && <span>Owner: {c.name}</span>}
                            </div>
                          </div>
                        </TableCell>

                        {/* Bank Details Column */}
                        <TableCell className="px-6 py-5 align-top">
                          {hasBankDetails ? (
                            <div className="space-y-1 p-2.5 rounded-lg border border-neutral-900 bg-neutral-950/40 text-xs text-neutral-300 font-medium">
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-400 uppercase tracking-wide">
                                <Building className="w-3 h-3" />
                                {c.bankName || "Bank Transfer"}
                              </div>
                              <div>Name: <span className="text-white font-bold">{c.bankAccountName}</span></div>
                              <div className="font-mono">A/C: {c.bankAccountNumber}</div>
                              <div className="font-mono text-[10px] text-muted-foreground">IFSC: {c.bankIfsc}</div>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground/60 font-medium italic">
                              No bank details saved
                            </span>
                          )}
                        </TableCell>

                        {/* Route Onboarding Status Column */}
                        <TableCell className="px-6 py-5 align-top">
                          <div className="space-y-3">
                            {/* Stepper Steps visual checklist */}
                            <div className="space-y-1.5 text-[10px] font-bold uppercase tracking-wider">
                              <div className="flex items-center gap-1 text-neutral-400">
                                {c.storeName ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5 text-neutral-600 flex-shrink-0" />
                                )}
                                <span className={c.storeName ? "text-emerald-400" : "text-neutral-500"}>
                                  Step 1: Store Setup
                                </span>
                              </div>

                              <div className="flex items-center gap-1 text-neutral-400">
                                {hasBankDetails ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5 text-neutral-600 flex-shrink-0" />
                                )}
                                <span className={hasBankDetails ? "text-emerald-400" : "text-neutral-500"}>
                                  Step 2: Bank Credentials
                                </span>
                              </div>

                              <div className="flex items-center gap-1 text-neutral-400">
                                {isRouteConnected ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5 text-neutral-600 flex-shrink-0" />
                                )}
                                <span className={isRouteConnected ? "text-emerald-400" : "text-neutral-500"}>
                                  Step 3: Linked Account ID
                                </span>
                              </div>
                            </div>

                            {/* Account ID manual save form / Auto Route onboarding triggers */}
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={accountInputs[c.id]}
                                  onChange={(e) =>
                                    setAccountInputs((prev) => ({ ...prev, [c.id]: e.target.value }))
                                  }
                                  placeholder="e.g. acc_Hsb82sJdh7"
                                  className="px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-950 text-white text-xs font-mono w-44 outline-none focus:border-neutral-600"
                                />
                                <Button
                                  onClick={() => handleManualSave(c.id)}
                                  disabled={isSavedPending}
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8 rounded-lg border-neutral-800 hover:bg-neutral-800 text-white cursor-pointer"
                                >
                                  {isSavedPending ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Save className="w-3.5 h-3.5" />
                                  )}
                                </Button>
                              </div>

                              {/* Auto onboarding button */}
                              {!c.razorpayAccountId && hasBankDetails && (
                                <Button
                                  onClick={() => handleAutoRegister(c.id)}
                                  disabled={isAutoPending}
                                  size="xs"
                                  className="h-7 px-2.5 font-bold uppercase tracking-widest text-[8.5px] rounded-lg cursor-pointer bg-purple-500 hover:bg-purple-400 text-white border-0 shadow-lg shadow-purple-500/10 flex items-center gap-1"
                                >
                                  {isAutoPending ? (
                                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                                  ) : (
                                    <Sparkles className="w-2.5 h-2.5" />
                                  )}
                                  Auto Route Onboard
                                </Button>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        {/* Listings Catalog Column */}
                        <TableCell className="px-6 py-5 align-top">
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              {c.approvedCount > 0 && (
                                <Badge className="text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                  {c.approvedCount} Approved
                                </Badge>
                              )}
                              {c.pendingCount > 0 && (
                                <Badge className="text-[9px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                  {c.pendingCount} Pending
                                </Badge>
                              )}
                              {c.rejectedCount > 0 && (
                                <Badge className="text-[9px] font-bold bg-destructive/15 text-destructive border border-destructive/30">
                                  {c.rejectedCount} Rejected
                                </Badge>
                              )}
                              {c.approvedCount === 0 && c.pendingCount === 0 && c.rejectedCount === 0 && (
                                <span className="text-xs text-muted-foreground/60 font-medium">
                                  No items listed
                                </span>
                              )}
                            </div>
                            {c.productsList && (
                              <div className="text-[10px] text-muted-foreground font-medium max-w-xs line-clamp-2 leading-relaxed">
                                {c.productsList}
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* Review Actions Column */}
                        <TableCell className="px-6 py-5 align-top text-right">
                          <div className="flex flex-col gap-2 items-end justify-start">
                            {c.storeName && (
                              <Button
                                asChild
                                variant="default"
                                size="xs"
                                className="h-8 px-2.5 font-bold uppercase tracking-widest text-[9px] bg-white text-black hover:bg-neutral-200 rounded-lg cursor-pointer flex items-center justify-center w-full"
                              >
                                <Link href={`/stores/${c.id}`} target="_blank">
                                  View Store
                                </Link>
                              </Button>
                            )}
                            <Button
                              asChild
                              variant="outline"
                              size="xs"
                              className="h-8 px-2.5 font-bold uppercase tracking-widest text-[9px] border-border/60 rounded-lg cursor-pointer w-full"
                            >
                              <Link href={`/admin/products?search=${encodeURIComponent(c.storeName || c.email)}`}>
                                View Products
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-border/40 bg-muted/10 text-xs font-semibold text-muted-foreground">
                  <div>
                    Showing <span className="text-foreground font-bold">{startIndex + 1}</span> to{" "}
                    <span className="text-foreground font-bold">
                      {Math.min(startIndex + itemsPerPage, filteredCreators.length)}
                    </span>{" "}
                    of <span className="text-foreground font-bold">{filteredCreators.length}</span> creators
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={displayPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                      className="px-3.5 py-2 rounded-xl border border-border/60 bg-card/40 text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-1.5">
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= displayPage - 1 && pageNum <= displayPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              type="button"
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-8 h-8 rounded-xl border text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                                displayPage === pageNum
                                  ? "border-primary/45 bg-primary/10 text-primary"
                                  : "border-border/60 bg-card/40 text-muted-foreground hover:border-neutral-700 hover:text-foreground"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (pageNum === displayPage - 2 || pageNum === displayPage + 2) {
                          return (
                            <span key={pageNum} className="text-muted-foreground/60 px-1 select-none">
                              •••
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>
                    <button
                      type="button"
                      disabled={displayPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className="px-3.5 py-2 rounded-xl border border-border/60 bg-card/40 text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
