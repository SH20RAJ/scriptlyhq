import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Compass, Heart, Shield, Terminal, ArrowRight, User } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us — Our Mission & Story | ScriptlyStore",
  description: "Discover how ScriptlyStore was founded to help developers bypass infrastructure setup, launch projects faster, and retain 95% of sales.",
  alternates: {
    canonical: "https://scriptly.store/about",
  },
};

export default function AboutPage() {
  const team = [
    {
      name: "Shaswat Raj",
      role: "Founder & Lead Architect",
      bio: "Full-stack engineer and product builder. Created ScriptlyStore to solve the repetitive pain of boilerplate setups for developers.",
      github: "https://github.com/shraj",
      twitter: "https://x.com/sh20raj"
    }
  ];

  return (
    <div className="container max-w-4xl mx-auto px-4 py-16 md:py-24 space-y-16" id="about-page-root">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px] uppercase font-black tracking-[0.2em] border-primary/20 text-primary">
          Our Vision
        </Badge>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground sm:leading-[1.1]">
          Accelerating Developer <br />
          <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">Startup Velocity.</span>
        </h1>
        <p className="text-base text-muted-foreground font-semibold leading-relaxed">
          ScriptlyStore is a curated digital marketplace designed specifically for builders, developers, and indie founders who value speed, aesthetics, and clean code.
        </p>
      </div>

      {/* Founder Story */}
      <section className="bg-card/45 border-2 border-border/80 rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-6">
        <div className="space-y-2">
          <Badge variant="secondary" className="rounded-full px-3 text-[9px] uppercase font-bold tracking-wider bg-primary/10 text-primary">
            How it Started
          </Badge>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
            Tired of Rebuilding the Plumbing
          </h2>
        </div>
        <div className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed space-y-4">
          <p>
            Like most developers, we had a directory full of unfinished side projects. Every time a new idea struck, we spent the first weekend configuring PostgreSQL connection pooling, coding auth routes, writing email triggers, and setting up payment webhooks.
          </p>
          <p>
            By the time we got to the actual product feature, the weekend was over and the initial excitement had faded. We realized developers shouldn't have to keep writing the same generic codebases.
          </p>
          <p>
            We built **ScriptlyStore** to act as a repository of production-ready boilerplates, high-converting landing pages, and serverless scripts. Our goal is to let developers skip the setup phase, launch in hours, and sell their own code keeping **95% of the revenue**.
          </p>
        </div>
      </section>

      {/* Grid of Values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <Card className="border-border/50 bg-card/30 rounded-[2rem] p-6 shadow-sm">
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

        <Card className="border-border/50 bg-card/30 rounded-[2rem] p-6 shadow-sm">
          <CardContent className="p-0 space-y-4">
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-foreground tracking-tight">Vetted Quality</h3>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
              We strictly vet every script, UI kit, and document. No junk, no outdated setups. Everything in our library compiles, runs, and is production-ready out-of-the-box.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/30 rounded-[2rem] p-6 shadow-sm">
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

        <Card className="border-border/50 bg-card/30 rounded-[2rem] p-6 shadow-sm">
          <CardContent className="p-0 space-y-4">
            <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-foreground tracking-tight">Global Network</h3>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
              ScriptlyStore is backed by a global network of solo builders. We construct and deploy modern developer boilerplates, tools, widgets, and instructional guides worldwide.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Team Section */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-3xl font-black tracking-tight text-foreground">Meet the Builders</h2>
          <p className="text-sm font-bold text-muted-foreground">
            The core engineers, designers, and growth guides keeping the engine running.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((t) => (
            <Card key={t.name} className="border-border/60 bg-card/45 rounded-[2rem] overflow-hidden shadow-sm hover:translate-y-[-4px] hover:shadow-md transition-all duration-200">
              <CardContent className="p-6 space-y-4 flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-border flex items-center justify-center text-muted-foreground">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-foreground leading-tight">{t.name}</h4>
                    <span className="text-[10px] font-black uppercase tracking-wider text-primary">{t.role}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                    {t.bio}
                  </p>
                </div>
                <div className="flex gap-4 pt-3 border-t border-border/30">
                  <a href={t.github} target="_blank" rel="noopener" className="text-[10px] font-black uppercase text-primary hover:underline">GitHub</a>
                  <a href={t.twitter} target="_blank" rel="noopener" className="text-[10px] font-black uppercase text-primary hover:underline">Twitter</a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

