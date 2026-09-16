import { Code2, CheckCircle2, ShieldCheck, Download, GitBranch, Terminal } from "lucide-react";

interface QualityPillar {
  title: string;
  description: string;
  icon: any;
}

const QUALITY_PILLARS: QualityPillar[] = [
  {
    title: "Built for Real Projects",
    description: "Architected around current production frameworks (Next.js 15+, React 19, Tailwind) with clean modular abstractions.",
    icon: Code2,
  },
  {
    title: "Clear Tech Compatibility",
    description: "Exact framework versions, package dependencies, runtime requirements, and environment setups stated upfront.",
    icon: Terminal,
  },
  {
    title: "Transparent Licensing",
    description: "Every purchase includes a clear commercial license. Use the code in client projects and proprietary SaaS apps without recurring royalty fees.",
    icon: ShieldCheck,
  },
  {
    title: "Instant Digital Access",
    description: "Digital assets become available immediately upon payment. Download the uncompiled source ZIP right from your browser.",
    icon: Download,
  },
  {
    title: "Versioned Assets",
    description: "Explicit semantic versioning (e.g. v1.2.0) with changelogs so you know which bug fixes and upgrades are included.",
    icon: GitBranch,
  },
  {
    title: "Developer-First Details",
    description: "Live interactive demos, interface screenshots, complete README instructions, and environment variable samples.",
    icon: CheckCircle2,
  },
];

export default function QualitySection() {
  return (
    <section className="py-16 sm:py-24 border-b border-border/50 bg-secondary/10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            Quality Assurance & Standards
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Not just templates. <br />
            <span className="text-muted-foreground">A shortcut to shipping.</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Every codebase on Scriptly is engineered for real production workloads—not disposable toys or bloated multipurpose themes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {QUALITY_PILLARS.map((pillar) => {
            const IconComp = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="p-6 rounded-3xl border border-border/50 bg-card/60 backdrop-blur-md space-y-3 hover:bg-card hover:border-border transition-colors"
              >
                <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-foreground">
                  <IconComp className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-foreground tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
