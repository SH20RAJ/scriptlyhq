import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Star, 
  ChevronRight, 
  Layers, 
  Code
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TEMPLATES } from "@/data";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const template = TEMPLATES.find((t) => t.id === resolvedParams.id);
  if (!template) return { title: "Template Not Found | ScriptlyHQ" };
  
  return {
    title: `${template.name} - Buy & Customize | ScriptlyHQ`,
    description: `${template.description} Best for ${template.bestFor}. Starting at ${template.price}.`,
    keywords: [
      `${template.category} website template`,
      `buy ${template.category} page`,
      `custom ${template.category} landing page`,
      "ScriptlyHQ template"
    ]
  };
}

export default async function TemplateDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const template = TEMPLATES.find((t) => t.id === resolvedParams.id);

  if (!template) {
    return (
      <div className="min-h-screen bg-[#030712] text-gray-100 flex flex-col bg-grid-pattern relative">
        <Navbar />
        <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-6 relative z-10">
          <h1 className="text-3xl font-extrabold text-white">Template Not Found</h1>
          <p className="text-gray-400">The template you are looking for does not exist or has been moved.</p>
          <Link
            href="/templates"
            className="inline-flex items-center text-sm font-semibold text-brand-emerald hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to templates
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Get other templates for the "Similar Templates" section
  const similarTemplates = TEMPLATES.filter((t) => t.id !== template.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 flex flex-col bg-grid-pattern relative">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 mb-8">
          <Link href="/templates" className="hover:text-white transition-colors">Templates</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gray-500">{template.category}</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-white truncate">{template.name}</span>
        </div>

        {/* Core Layout: Grid for Preview & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          
          {/* Left Column: Preview */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-white/10 p-2 bg-gray-900/50 backdrop-blur-sm shadow-2xl relative">
              <div className="absolute top-0 inset-x-0 h-8 rounded-t-2xl bg-gray-950/80 border-b border-white/5 flex items-center px-4 gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <div className="mx-auto w-32 sm:w-64 h-4 rounded bg-white/5 border border-white/5 text-[9px] text-gray-500 flex items-center justify-center font-mono truncate">
                  scriptlyhq.strivio.world/demo/{template.id}
                </div>
              </div>
              <div className="mt-8 rounded-xl overflow-hidden bg-gray-950 aspect-[4/3] relative">
                <Image 
                  src={template.previewImage}
                  alt={template.name}
                  fill
                  className="object-cover object-top hover:scale-[1.01] transition-transform duration-700"
                  priority
                />
              </div>
            </div>

            {/* Included Sections list */}
            <div className="glassmorphic p-8 rounded-2xl">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Layers className="h-5 w-5 text-brand-indigo" />
                Sections Included in Layout
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {template.includedSections.map((section, idx) => (
                  <li key={idx} className="flex items-start text-xs sm:text-sm text-gray-400">
                    <CheckCircle2 className="h-4 w-4 text-brand-emerald mr-2 shrink-0 mt-0.5" />
                    <span>{section}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Spec / Details & Buy Panel */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Main Info */}
            <div className="glassmorphic p-8 rounded-2xl space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-brand-indigo font-medium">
                    {template.category} Template
                  </span>
                  <div className="flex items-center gap-1 text-xs text-yellow-500">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-bold text-white">{template.rating}</span>
                    <span className="text-gray-500">({template.reviews} reviews)</span>
                  </div>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {template.name}
                </h1>
                <p className="text-xs text-gray-400 italic">
                  Best for: {template.bestFor}
                </p>
              </div>

              <div className="flex items-baseline gap-2 py-4 border-t border-b border-white/5">
                <span className="text-3xl font-black text-white">{template.price}</span>
                <span className="text-xs text-gray-500">One-time license cost</span>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed">
                {template.description}
              </p>

              {/* Action Funnel Buttons */}
              <div className="space-y-3 pt-4">
                <Link
                  href={`/contact?template=${template.id}&action=customize`}
                  className="w-full inline-flex items-center justify-center px-6 py-4 rounded-xl text-base font-semibold text-gray-950 bg-brand-emerald hover:bg-brand-emerald/90 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  Customize for my Business
                </Link>
                <Link
                  href={`/contact?template=${template.id}&action=buy`}
                  className="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  Buy Raw Template Only (Download)
                </Link>
              </div>

              <p className="text-center text-xs text-gray-500">
                Not sure? Send your business link and we will review compatibility.
              </p>
            </div>

            {/* Technical Specifications */}
            <div className="glassmorphic p-8 rounded-2xl space-y-4">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                What is included in the package
              </h3>
              <ul className="space-y-3">
                {template.whatIsIncluded.map((item, idx) => (
                  <li key={idx} className="flex items-start text-xs sm:text-sm text-gray-400">
                    <CheckCircle2 className="h-4 w-4 text-brand-indigo mr-2 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Chips */}
            <div className="glassmorphic p-6 rounded-2xl">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Code className="h-4 w-4" /> Tech Stack / Built With
              </h4>
              <div className="flex flex-wrap gap-2">
                {template.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-xs text-gray-300 font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Similar Templates Section */}
        <div className="border-t border-white/5 pt-20">
          <h2 className="text-2xl font-extrabold text-white tracking-tight mb-10">
            Similar templates you may like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {similarTemplates.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl border border-white/5 bg-gray-900/40 overflow-hidden flex flex-col justify-between glassmorphic-hover"
              >
                <div className="relative aspect-[4/3] bg-gray-950 border-b border-white/5 overflow-hidden">
                  <Image
                    src={item.previewImage}
                    alt={item.name}
                    fill
                    className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-gray-950/80 backdrop-blur-md text-gray-300 text-xs px-3 py-1 rounded-full border border-white/10">
                    {item.category}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-white group-hover:text-brand-indigo transition-colors truncate">
                      {item.name}
                    </h3>
                    <span className="text-sm font-extrabold text-brand-emerald">
                      {item.price}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-6 italic line-clamp-1">
                    Best for: {item.bestFor}
                  </p>
                  <Link
                    href={`/templates/${item.id}`}
                    className="w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
