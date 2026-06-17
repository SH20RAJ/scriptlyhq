"use client";

import { useState, useEffect, useTransition } from "react";
import { getSitemapUrlsAction, submitUrlsToIndexNowAction } from "../../lib/actions/indexnow";
import { Globe, RefreshCw, CheckCircle2, AlertTriangle, ExternalLink, List, FileText, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function IndexNowPage() {
  const [urls, setUrls] = useState<string[]>([]);
  const [loadingUrls, setLoadingUrls] = useState(true);
  const [errorUrls, setErrorUrls] = useState<string | null>(null);
  
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; message: string; count?: number } | null>(null);

  // Fetch URLs on load
  const loadUrls = async () => {
    setLoadingUrls(true);
    setErrorUrls(null);
    const res = await getSitemapUrlsAction();
    if (res.success && res.urls) {
      setUrls(res.urls);
    } else {
      setErrorUrls(res.error || "Failed to load URLs.");
    }
    setLoadingUrls(false);
  };

  useEffect(() => {
    loadUrls();
  }, []);

  const handleSubmit = () => {
    setResult(null);
    startTransition(async () => {
      const res = await submitUrlsToIndexNowAction();
      if (res.success) {
        setResult({
          success: true,
          message: `Successfully submitted ${res.count} URLs to IndexNow!`,
          count: res.count,
        });
      } else {
        setResult({
          success: false,
          message: res.error || "An error occurred during submission.",
        });
      }
    });
  };

  return (
    <div className="min-h-screen text-foreground relative py-12 md:py-20">
      <div className="container max-w-6xl mx-auto px-4 space-y-12">
        
        {/* Page Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
            <Globe className="w-4 h-4 animate-pulse text-primary" /> Instant Indexing
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground sm:leading-[1.1]">
            IndexNow Console
          </h1>
          <p className="text-muted-foreground font-medium text-sm md:text-base leading-relaxed">
            Notify search engines like Bing, Yandex, and Seznam instantly whenever pages are updated on <strong className="text-foreground">scriptly.store</strong>.
          </p>
        </div>

        {/* Console Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Submission Control */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-[2rem] border border-border bg-card/40 backdrop-blur-md space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full pointer-events-none" />
              
              <h3 className="text-xs font-black uppercase tracking-[0.25em] text-foreground border-b border-border pb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                IndexNow Configuration
              </h3>

              <div className="space-y-4 text-xs font-medium">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Target Host</label>
                  <div className="p-3 bg-muted border border-border/60 rounded-xl text-foreground font-mono">
                    scriptly.store
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Verification Key</label>
                  <div className="p-3 bg-muted border border-border/60 rounded-xl text-foreground font-mono truncate">
                    ba3534d2bbb246e2847d79cf7ec63a10
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Key Location URL</label>
                  <a 
                    href="https://scriptly.store/ba3534d2bbb246e2847d79cf7ec63a10.txt" 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-3 bg-muted border border-border/60 rounded-xl text-foreground font-mono hover:text-primary transition-colors flex items-center justify-between"
                  >
                    <span className="truncate">https://scriptly.store/ba3534...</span>
                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                  </a>
                </div>
              </div>

              {/* Action Trigger Button */}
              <button
                onClick={handleSubmit}
                disabled={isPending || loadingUrls || urls.length === 0}
                className="w-full inline-flex items-center justify-center space-x-2 px-6 py-4 text-xs font-bold uppercase tracking-widest text-black bg-white hover:bg-neutral-200 disabled:opacity-50 disabled:hover:bg-white rounded-2xl transition-all cursor-pointer shadow-lg shadow-white/5"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting URLs...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Submit {urls.length} URLs Now</span>
                  </>
                )}
              </button>

              {/* Results status banner */}
              {result && (
                <div className={`p-4 rounded-2xl border text-xs flex gap-3 items-start ${result.success ? "border-emerald-500/10 bg-emerald-500/5 text-emerald-400" : "border-rose-500/10 bg-rose-500/5 text-rose-400"}`}>
                  {result.success ? (
                    <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-bold uppercase tracking-wider mb-0.5">{result.success ? "Success" : "Submission Failed"}</h4>
                    <p className="opacity-90 leading-relaxed">{result.message}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Sitemap URLs Queue */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-[2rem] border border-border bg-card/40 backdrop-blur-md space-y-6 flex flex-col h-[500px]">
              
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-xs font-black uppercase tracking-[0.25em] text-foreground flex items-center gap-2">
                  <List className="w-4 h-4 text-primary" />
                  Sitemap URLs List ({urls.length})
                </h3>
                <button 
                  onClick={loadUrls} 
                  disabled={loadingUrls || isPending}
                  className="p-1 hover:text-primary text-muted-foreground transition-colors disabled:opacity-50"
                  title="Reload Sitemap Queue"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingUrls ? "animate-spin" : ""}`} />
                </button>
              </div>

              {/* URL list content */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-2.5 font-mono text-xs">
                {loadingUrls ? (
                  <div className="h-full flex items-center justify-center flex-col gap-2 text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span>Analyzing sitemap index...</span>
                  </div>
                ) : errorUrls ? (
                  <div className="h-full flex items-center justify-center flex-col gap-2 text-rose-400 p-6 text-center">
                    <AlertTriangle className="w-6 h-6 text-rose-400" />
                    <span>{errorUrls}</span>
                  </div>
                ) : urls.length === 0 ? (
                  <div className="h-full flex items-center justify-center flex-col gap-2 text-muted-foreground p-6 text-center">
                    <FileText className="w-6 h-6 text-muted-foreground/40" />
                    <span>No active catalog URLs found to submit.</span>
                  </div>
                ) : (
                  urls.map((url, index) => (
                    <div 
                      key={url} 
                      className="p-2.5 rounded-xl border border-border/30 bg-muted/40 hover:bg-muted/80 transition-colors flex items-center justify-between gap-4 group"
                    >
                      <span className="truncate font-semibold text-neutral-300 group-hover:text-white transition-colors">{url}</span>
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
