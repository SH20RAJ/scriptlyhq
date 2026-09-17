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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Start Earning From Your Code
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-tight">
          Your next customer is searching for code you’ve already written.
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Don't wait for your project to be 100% finished. Package what works, list it on Scriptly, and turn your engineering hours into a recurring software income.
        </p>

        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-[#58CC02] hover:bg-[#58CC02]/90 text-white font-black text-xs uppercase tracking-wider shadow-[0_4px_0_#46A302] active:translate-y-1 active:shadow-none transition-all"
          >
            <Link href={isLoggedIn ? "/creator/new" : "/handler/sign-in?redirectTo=/creator/new"}>
              Open Your Creator Store Now <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto h-12 px-6 rounded-2xl border-border/60 font-bold text-xs uppercase tracking-wider hover:bg-muted/30 text-foreground"
          >
            <Link href="/explore">
              <ShoppingBag className="w-4 h-4 mr-2" /> Explore Marketplace
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
