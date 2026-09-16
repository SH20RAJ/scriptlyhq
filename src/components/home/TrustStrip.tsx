export default function TrustStrip() {
  const technologies = [
    { name: "Next.js", label: "App Router / Turbopack" },
    { name: "React 19", label: "Server Components" },
    { name: "Tailwind CSS", label: "Utility-First Styling" },
    { name: "TypeScript", label: "Strict Type Safety" },
    { name: "Node.js", label: "Modern Runtime" },
    { name: "Cloudflare", label: "Edge Workers & CDN" },
    { name: "Supabase", label: "Postgres & Auth" },
    { name: "Drizzle ORM", label: "Type-Safe Database" },
    { name: "PostgreSQL", label: "Relational Persistence" },
  ];

  return (
    <section className="border-b border-border/50 bg-secondary/10 py-6 sm:py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Built for developers. Used to ship real products.
            </p>
            <p className="text-[11px] text-muted-foreground/70">
              Battle-tested frameworks and production-ready stacks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {technologies.map((tech) => (
              <div
                key={tech.name}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/50 bg-background/80 text-xs font-semibold text-foreground shadow-2xs hover:border-border transition-colors"
                title={tech.label}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                <span>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
