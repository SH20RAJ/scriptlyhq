import Link from "next/link";
import { ArrowRight, Sparkles, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreatorFinalCTA({
  isLoggedIn = false,
}: {
  isLoggedIn?: boolean;
}) {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-primary/10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Start Earning From Your Code
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-tight">
          Your next customer is searching for code you’ve already written.
        </h2>

        <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Don't wait for your project to be 100% finished. Package what works, list it on Scriptly, and turn your technical expertise into a recurring software income.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-[#58CC02] hover:bg-[#58CC02]/90 text-white font-black text-sm uppercase tracking-wider shadow-[0_4px_0_#46A302] active:translate-y-1 active:shadow-none transition-all"
          >
            <Link href={isLoggedIn ? "/creator/new" : "/handler/sign-in?redirectTo=/creator/new"}>
              Open Your Creator Store Now <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto h-12 px-6 rounded-2xl border-border/60 font-bold text-sm hover:bg-muted/40"
          >
            <Link href="/explore">
              <ShoppingBag className="w-4 h-4 mr-2" /> Explore Marketplace First
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
