import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Compass, Heart, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | ScriptHQ",
  description: "Learn about the mission and principles behind ScriptHQ.",
};

export default function AboutPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-16 md:py-24 space-y-16" id="about-page-root">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px] uppercase font-black tracking-[0.2em] border-primary/20 text-primary">
          Our Story
        </Badge>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground sm:leading-[1.1]">
          Building the Future <br />
          <span className="text-muted-foreground">of Digital Assets.</span>
        </h1>
        <p className="text-base text-muted-foreground font-medium leading-relaxed">
          ScriptHQ by Strivio is a curated digital products marketplace designed specifically for builders, developers, creators, and modern startups.
        </p>
      </div>

      {/* Grid of Values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <Card className="border-border/50 bg-card/30 rounded-3xl p-6 shadow-sm">
          <CardContent className="p-0 space-y-4">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-foreground tracking-tight">Our Mission</h3>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
              We help founders and developers launch products in hours instead of weeks. By aggregating top-tier SaaS templates, extensions, and ebooks, we streamline early startup execution.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/30 rounded-3xl p-6 shadow-sm">
          <CardContent className="p-0 space-y-4">
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-foreground tracking-tight">Curated Quality</h3>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
              We strictly vet every script, UI kit, and document. No junk, no outdated setups. Everything in our library compiles, runs, and is production-ready out-of-the-box.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/30 rounded-3xl p-6 shadow-sm">
          <CardContent className="p-0 space-y-4">
            <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-foreground tracking-tight">Builder First</h3>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
              We charge minimal commission fees to builders, providing creators and developers a clean channel to monetize their digital crafts and bootstrap SaaS kits.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/30 rounded-3xl p-6 shadow-sm">
          <CardContent className="p-0 space-y-4">
            <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-foreground tracking-tight">Strivio Network</h3>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
              ScriptHQ is backed by the Strivio network. We build and deploy modern developer boilerplates, tools, widgets, and instructional guides worldwide.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
