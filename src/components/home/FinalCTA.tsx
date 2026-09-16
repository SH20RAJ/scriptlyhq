import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FinalCTA() {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-background via-secondary/20 to-secondary/40">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-3xl border border-border/60 bg-card/85 backdrop-blur-md p-8 sm:p-14 text-center max-w-4xl mx-auto space-y-6 shadow-xl shadow-black/5">
          <div className="w-12 h-12 rounded-2xl bg-foreground text-background flex items-center justify-center mx-auto shadow-sm">
            <Terminal className="w-6 h-6" />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Your next product shouldn't start from zero.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Find the production codebase, UI system, or automation pipeline you need. Or monetize your existing assets and keep 95% of direct sales.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Button asChild size="lg" className="rounded-xl font-bold px-7">
              <Link href="/explore" className="flex items-center gap-2">
                <span>Explore Scriptly</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl font-bold px-7">
              <Link href="/creator">
                <span>Sell on Scriptly</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
