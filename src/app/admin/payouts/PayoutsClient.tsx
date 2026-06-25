"use client";

import { useState, useTransition, useEffect } from "react";
import { recordPayoutAction } from "@/lib/actions/payouts";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Coins, DollarSign, Plus, Calendar, Mail, CheckCircle2, AlertCircle, Loader2, X, CreditCard, Search, Filter } from "lucide-react";

interface PayoutsClientProps {
  creators: {
    id: string;
    email: string;
    name: string | null;
    storeName: string | null;
    payoutMethod: string | null;
    paypalEmail: string | null;
    payoutDetails: string | null;
    grossSales: number;
    netEarning: number;
    totalPaid: number;
    unpaidBalance: number;
    productsCount: number;
  }[];
  payoutsHistory: {
    id: string;
    userId: string;
    userEmail: string;
    userStoreName: string | null;
    amount: number;
    payoutMethod: string | null;
    paypalEmail: string | null;
    payoutDetails: string | null;
    createdAt: string;
  }[];
}

export default function PayoutsClient({ creators, payoutsHistory }: PayoutsClientProps) {
  const [selectedCreator, setSelectedCreator] = useState<typeof creators[0] | null>(null);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [isPending, startTransition] = useTransition();

  // Creators search, filter & pagination state
  const [creatorSearch, setCreatorSearch] = useState("");
  const [creatorStatusFilter, setCreatorStatusFilter] = useState("all");
  const [creatorPage, setCreatorPage] = useState(1);
  const creatorsPerPage = 10;

  // Payout ledger search & pagination state
  const [ledgerSearch, setLedgerSearch] = useState("");
  const [ledgerPage, setLedgerPage] = useState(1);
  const ledgerPerPage = 5;

  useEffect(() => {
    setCreatorPage(1);
  }, [creatorSearch, creatorStatusFilter]);

  useEffect(() => {
    setLedgerPage(1);
  }, [ledgerSearch]);

  // Compute platform-wide totals
  const totalGross = creators.reduce((sum, c) => sum + c.grossSales, 0);
  const totalNetCreator = creators.reduce((sum, c) => sum + c.netEarning, 0);
  const totalPlatformFees = totalGross - totalNetCreator;
  const totalPaidOut = creators.reduce((sum, c) => sum + c.totalPaid, 0);
  const totalUnpaid = creators.reduce((sum, c) => sum + c.unpaidBalance, 0);

  const handleRecordPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCreator) return;

    const parsedAmount = parseFloat(payoutAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid payout amount.");
      return;
    }

    const amountCents = Math.round(parsedAmount * 100);

    startTransition(async () => {
      try {
        const res = await recordPayoutAction({
          userId: selectedCreator.id,
          amountCents,
        });

        if (res.success) {
          toast.success(`Recorded payout of $${parsedAmount.toFixed(2)} to ${selectedCreator.storeName || selectedCreator.email}`);
          setSelectedCreator(null);
          setPayoutAmount("");
        } else {
          toast.error("Failed to record payout transaction.");
        }
      } catch (err: any) {
        toast.error(err.message || "Something went wrong.");
      }
    });
  };

  // Filter & Paginate Creators
  const filteredCreators = creators.filter((c) => {
    const term = creatorSearch.toLowerCase();
    const matchesSearch =
      c.email.toLowerCase().includes(term) ||
      (c.name || "").toLowerCase().includes(term) ||
      (c.storeName || "").toLowerCase().includes(term);

    let matchesStatus = true;
    if (creatorStatusFilter === "balance") {
      matchesStatus = c.unpaidBalance > 0;
    } else if (creatorStatusFilter === "settled") {
      matchesStatus = c.unpaidBalance === 0;
    }

    return matchesSearch && matchesStatus;
  });

  const totalCreatorPages = Math.ceil(filteredCreators.length / creatorsPerPage);
  const displayCreatorPage = Math.min(creatorPage, Math.max(1, totalCreatorPages));
  const startCreatorIndex = (displayCreatorPage - 1) * creatorsPerPage;
  const paginatedCreators = filteredCreators.slice(startCreatorIndex, startCreatorIndex + creatorsPerPage);

  // Filter & Paginate Ledger Logs
  const filteredLedger = payoutsHistory.filter((p) => {
    const term = ledgerSearch.toLowerCase();
    return (
      p.userEmail.toLowerCase().includes(term) ||
      (p.userStoreName || "").toLowerCase().includes(term) ||
      (p.payoutMethod || "").toLowerCase().includes(term)
    );
  });

  const totalLedgerPages = Math.ceil(filteredLedger.length / ledgerPerPage);
  const displayLedgerPage = Math.min(ledgerPage, Math.max(1, totalLedgerPages));
  const startLedgerIndex = (displayLedgerPage - 1) * ledgerPerPage;
  const paginatedLedger = filteredLedger.slice(startLedgerIndex, startLedgerIndex + ledgerPerPage);

  return (
    <div className="space-y-8">
      {/* Stats Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-card/40 border-border/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-5">
            <CardTitle className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Total Gross Sales
            </CardTitle>
            <Coins className="w-4 h-4 text-purple-400" />
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-2xl font-black">${(totalGross / 100).toFixed(2)}</div>
            <p className="text-[9px] text-muted-foreground mt-1">Total platform revenue</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-5">
            <CardTitle className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Platform Cuts (5%)
            </CardTitle>
            <DollarSign className="w-4 h-4 text-pink-400" />
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-2xl font-black text-pink-500">${(totalPlatformFees / 100).toFixed(2)}</div>
            <p className="text-[9px] text-muted-foreground mt-1">Net platform service earnings</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-5">
            <CardTitle className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Creator Share (95%)
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-2xl font-black text-emerald-500">${(totalNetCreator / 100).toFixed(2)}</div>
            <p className="text-[9px] text-muted-foreground mt-1">Total developer share</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-5">
            <CardTitle className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Total Paid Out
            </CardTitle>
            <CreditCard className="w-4 h-4 text-blue-400" />
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-2xl font-black text-blue-500">${(totalPaidOut / 100).toFixed(2)}</div>
            <p className="text-[9px] text-muted-foreground mt-1">Settle manual payouts</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-purple-500/25 bg-purple-500/5 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-5">
            <CardTitle className="text-[10px] font-black uppercase tracking-wider text-purple-400">
              Unpaid Balance
            </CardTitle>
            <AlertCircle className="w-4 h-4 text-purple-400" />
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-2xl font-black text-purple-400">${(totalUnpaid / 100).toFixed(2)}</div>
            <p className="text-[9px] text-purple-400/80 mt-1">Remaining to distribute</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Creators Lists & historical ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Creator settlement sheet */}
        <div className="lg:col-span-8 space-y-6">
          {/* Creator balances search & filter panel */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={creatorSearch}
                onChange={(e) => setCreatorSearch(e.target.value)}
                placeholder="Search creator stores, emails, owners..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/60 bg-card/40 text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={creatorStatusFilter}
                onChange={(e) => setCreatorStatusFilter(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-border/60 bg-card/40 text-muted-foreground text-sm focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="all">All Creator Balances</option>
                <option value="balance">Has Outstanding Balance</option>
                <option value="settled">Fully Settled</option>
              </select>
            </div>
          </div>

          <Card className="bg-card/30 border-border/50 backdrop-blur-md rounded-2xl overflow-hidden">
            <CardHeader className="p-6">
              <CardTitle className="text-lg font-bold">Creator Balances</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredCreators.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground font-medium">
                  No matching creator balance profiles found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="border-border/40 hover:bg-transparent">
                        <TableHead className="font-bold text-xs uppercase tracking-wider text-foreground px-6 py-4">
                          Creator / Store
                        </TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider text-foreground px-6 py-4">
                          Revenue Stats (USD)
                        </TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider text-foreground px-6 py-4">
                          Payout Preference
                        </TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider text-foreground px-6 py-4">
                          Unpaid Balance
                        </TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider text-foreground px-6 py-4 text-right">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedCreators.map((c) => (
                        <TableRow key={c.id} className="border-border/40 hover:bg-muted/10 transition-colors">
                          <TableCell className="px-6 py-4 align-top">
                            <div className="space-y-1">
                              <div className="font-bold text-sm text-foreground">
                                {c.storeName || <span className="italic text-muted-foreground">Unnamed Store</span>}
                              </div>
                              <div className="flex flex-col gap-0.5 text-[10.5px] text-muted-foreground font-medium">
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-muted-foreground/60" />
                                  {c.email}
                                </span>
                                {c.name && <span>Owner: {c.name}</span>}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="px-6 py-4 align-top text-xs text-muted-foreground font-medium">
                            <div className="space-y-1">
                              <div>Gross: <span className="text-foreground font-semibold">${(c.grossSales / 100).toFixed(2)}</span></div>
                              <div>Net Share (95%): <span className="text-foreground font-semibold">${(c.netEarning / 100).toFixed(2)}</span></div>
                              <div>Paid: <span className="text-foreground font-semibold">${(c.totalPaid / 100).toFixed(2)}</span></div>
                            </div>
                          </TableCell>

                          <TableCell className="px-6 py-4 align-top text-xs text-muted-foreground font-medium">
                            <div className="space-y-1 max-w-[180px] truncate">
                              <div className="flex items-center gap-1.5">
                                <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wider px-1.5 h-4.5">
                                  {c.payoutMethod || "unspecified"}
                                </Badge>
                              </div>
                              {c.paypalEmail && <div className="text-[10px] truncate">PayPal: {c.paypalEmail}</div>}
                              {c.payoutDetails && <div className="text-[9px] text-muted-foreground/80 break-all leading-normal whitespace-pre-wrap">{c.payoutDetails}</div>}
                            </div>
                          </TableCell>

                          <TableCell className="px-6 py-4 align-top">
                            <span className={`text-sm font-black tabular-nums ${c.unpaidBalance > 0 ? "text-purple-400" : "text-muted-foreground"}`}>
                              ${(c.unpaidBalance / 100).toFixed(2)}
                            </span>
                          </TableCell>

                          <TableCell className="px-6 py-4 align-top text-right">
                            <Button
                              onClick={() => setSelectedCreator(c)}
                              disabled={c.unpaidBalance <= 0}
                              size="xs"
                              className="h-8 px-2.5 font-bold uppercase tracking-widest text-[9px] rounded-lg cursor-pointer bg-white text-black hover:bg-neutral-200 disabled:opacity-40"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Record Payout
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Creator Balances Pagination */}
                  {totalCreatorPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-border/40 bg-muted/10 text-xs font-semibold text-muted-foreground">
                      <div>
                        Showing <span className="text-foreground font-bold">{startCreatorIndex + 1}</span> to{" "}
                        <span className="text-foreground font-bold">
                          {Math.min(startCreatorIndex + creatorsPerPage, filteredCreators.length)}
                        </span>{" "}
                        of <span className="text-foreground font-bold">{filteredCreators.length}</span> creators
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={displayCreatorPage === 1}
                          onClick={() => setCreatorPage((p) => p - 1)}
                          className="px-3.5 py-2 rounded-xl border border-border/60 bg-card/40 text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted/30 transition-colors cursor-pointer"
                        >
                          Previous
                        </button>
                        <div className="flex items-center gap-1.5">
                          {[...Array(totalCreatorPages)].map((_, i) => {
                            const pageNum = i + 1;
                            if (
                              pageNum === 1 ||
                              pageNum === totalCreatorPages ||
                              (pageNum >= displayCreatorPage - 1 && pageNum <= displayCreatorPage + 1)
                            ) {
                              return (
                                <button
                                  key={pageNum}
                                  type="button"
                                  onClick={() => setCreatorPage(pageNum)}
                                  className={`w-8 h-8 rounded-xl border text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                                    displayCreatorPage === pageNum
                                      ? "border-primary/45 bg-primary/10 text-primary"
                                      : "border-border/60 bg-card/40 text-muted-foreground hover:border-neutral-700 hover:text-foreground"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            } else if (pageNum === displayCreatorPage - 2 || pageNum === displayCreatorPage + 2) {
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
                          disabled={displayCreatorPage === totalCreatorPages}
                          onClick={() => setCreatorPage((p) => p + 1)}
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

        {/* Historical payout transactions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Ledger Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={ledgerSearch}
              onChange={(e) => setLedgerSearch(e.target.value)}
              placeholder="Search payout ledger logs..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/60 bg-card/40 text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
            />
          </div>

          <Card className="bg-card/30 border-border/50 backdrop-blur-md rounded-2xl overflow-hidden">
            <CardHeader className="p-6">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                Payout Ledger
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              {filteredLedger.length === 0 ? (
                <p className="text-xs text-muted-foreground font-medium text-center py-6">
                  No matching payout transactions found.
                </p>
              ) : (
                <>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {paginatedLedger.map((p) => (
                      <div key={p.id} className="p-4 rounded-xl border border-neutral-900 bg-neutral-950/40 space-y-2 text-xs">
                        <div className="flex justify-between items-start">
                          <div className="space-y-0.5 flex-1 min-w-0 mr-2">
                            <span className="font-bold text-white block truncate">
                              {p.userStoreName || p.userEmail}
                            </span>
                            <span className="text-[10px] text-muted-foreground block truncate">{p.userEmail}</span>
                          </div>
                          <span className="font-black text-purple-400 font-mono flex-shrink-0">
                            -${(p.amount / 100).toFixed(2)}
                          </span>
                        </div>

                        <Separator className="border-neutral-900" />

                        <div className="flex justify-between items-center text-[10px] text-muted-foreground font-medium">
                          <div className="flex items-center gap-1 uppercase font-semibold">
                            <Badge variant="secondary" className="text-[8px] font-bold px-1 py-0 h-4 bg-muted/40">
                              {p.payoutMethod || "manual"}
                            </Badge>
                          </div>
                          <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Ledger Pagination */}
                  {totalLedgerPages > 1 && (
                    <div className="flex items-center justify-between gap-2 border-t border-border/40 pt-4 text-[10px] font-bold text-muted-foreground">
                      <button
                        type="button"
                        disabled={displayLedgerPage === 1}
                        onClick={() => setLedgerPage((p) => p - 1)}
                        className="px-2.5 py-1.5 rounded-lg border border-border/60 bg-card/40 text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted/30 transition-colors cursor-pointer uppercase text-[9px] tracking-wider"
                      >
                        Prev
                      </button>
                      <span>
                        PAGE {displayLedgerPage} OF {totalLedgerPages}
                      </span>
                      <button
                        type="button"
                        disabled={displayLedgerPage === totalLedgerPages}
                        onClick={() => setLedgerPage((p) => p + 1)}
                        className="px-2.5 py-1.5 rounded-lg border border-border/60 bg-card/40 text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted/30 transition-colors cursor-pointer uppercase text-[9px] tracking-wider"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Record Payout Dialog Modal overlay */}
      {selectedCreator && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl max-w-md w-full p-6 space-y-4 relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedCreator(null)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white rounded-full p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-black text-base uppercase tracking-wider text-white">Record Manual Payout</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Verify that you have already transferred funds to the creator via their preferred method before logging. This records the payout and reduces their unpaid balance.
            </p>

            <div className="p-3.5 rounded-xl bg-neutral-900/40 border border-neutral-800 space-y-2 text-xs">
              <div>
                <span className="text-muted-foreground">Store Name: </span>
                <span className="font-bold text-white">{selectedCreator.storeName || "Unnamed"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Email: </span>
                <span className="font-bold text-white">{selectedCreator.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Preferred Channel: </span>
                <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wider px-1.5 h-4.5 ml-1">
                  {selectedCreator.payoutMethod || "unspecified"}
                </Badge>
              </div>
              {selectedCreator.paypalEmail && (
                <div>
                  <span className="text-muted-foreground">PayPal Email: </span>
                  <span className="font-mono font-bold text-white">{selectedCreator.paypalEmail}</span>
                </div>
              )}
              {selectedCreator.payoutDetails && (
                <div>
                  <span className="text-muted-foreground">Payout Details: </span>
                  <p className="text-[10px] text-neutral-300 font-mono mt-1 bg-black/40 p-2 rounded-lg break-all leading-normal whitespace-pre-wrap">{selectedCreator.payoutDetails}</p>
                </div>
              )}
              <div className="border-t border-neutral-800 pt-2 flex justify-between">
                <span className="text-muted-foreground font-semibold">Maximum Unpaid Balance:</span>
                <span className="font-black text-purple-400">${(selectedCreator.unpaidBalance / 100).toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handleRecordPayout} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">
                  Amount to Mark Paid (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={(selectedCreator.unpaidBalance / 100).toFixed(2)}
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    placeholder="e.g. 50.00"
                    className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-xs focus:outline-none focus:border-neutral-500 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => setSelectedCreator(null)}
                  variant="outline"
                  className="flex-1 h-10 rounded-xl font-bold uppercase tracking-wider text-[10px] border-neutral-800 cursor-pointer text-neutral-300 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 h-10 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-white text-black hover:bg-neutral-200 cursor-pointer"
                >
                  {isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  ) : (
                    <Coins className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  Record Paid
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
