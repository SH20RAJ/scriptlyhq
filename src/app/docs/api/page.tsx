import Link from "next/link";
import { ArrowLeft, Book, Code, Globe, Zap, Info } from "lucide-react";

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <div className="max-w-4xl mx-auto px-6 py-20">
        
        <Link 
          href="/"
          className="inline-flex items-center text-sm font-semibold text-neutral-400 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to marketplace
        </Link>

        <header className="space-y-4 mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
            Public API Reference
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
            Build with Scriptly Data
          </h1>
          <p className="text-xl text-neutral-400 font-medium max-w-2xl leading-relaxed">
            Integrate our marketplace products and blog feed directly into your applications using our public JSON endpoints.
          </p>
        </header>

        <div className="space-y-20">
          
          {/* Products API Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 border-b border-neutral-900 pb-4">
              <Zap className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-black uppercase tracking-tight">Products JSON Feed</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-neutral-400 leading-relaxed font-medium">
                Retrieve all published and approved products from the ScriptlyStore. Supports filtering by category, featured status, and limit.
              </p>
              
              <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 font-mono text-sm break-all">
                <span className="text-emerald-400 font-bold">GET</span> https://scriptly.store/api/products.json
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500">Query Parameters</h3>
                <div className="grid gap-3">
                  {[
                    { param: "limit", desc: "Limit the number of results (e.g., ?limit=10)" },
                    { param: "category", desc: "Filter by category slug (e.g., ?category=saas-templates)" },
                    { param: "subcategory", desc: "Filter by subcategory slug" },
                    { param: "slug", desc: "Fetch a specific product by slug" },
                    { param: "featured", desc: "Set to 'true' to get featured products only" },
                  ].map((item) => (
                    <div key={item.param} className="flex flex-col md:flex-row md:items-center gap-2 p-3 rounded-xl border border-neutral-800/50 bg-neutral-900/20">
                      <code className="text-amber-400 font-bold text-xs bg-amber-400/5 px-2 py-1 rounded-md">{item.param}</code>
                      <span className="text-neutral-500 text-xs">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Blog API Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 border-b border-neutral-900 pb-4">
              <Book className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-black uppercase tracking-tight">Blog JSON Feed</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-neutral-400 leading-relaxed font-medium">
                Fetch the latest blog posts, guides, and tutorials from the ScriptlyStore blog.
              </p>
              
              <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 font-mono text-sm break-all">
                <span className="text-emerald-400 font-bold">GET</span> https://scriptly.store/api/blog.json
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500">Query Parameters</h3>
                <div className="grid gap-3">
                  {[
                    { param: "limit", desc: "Number of posts to return" },
                    { param: "category", desc: "Filter by blog category" },
                    { param: "slug", desc: "Fetch a single post by slug" },
                  ].map((item) => (
                    <div key={item.param} className="flex flex-col md:flex-row md:items-center gap-2 p-3 rounded-xl border border-neutral-800/50 bg-neutral-900/20">
                      <code className="text-blue-400 font-bold text-xs bg-blue-400/5 px-2 py-1 rounded-md">{item.param}</code>
                      <span className="text-neutral-500 text-xs">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Response Format */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 border-b border-neutral-900 pb-4">
              <Code className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-black uppercase tracking-tight">Response Format</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-neutral-400 leading-relaxed font-medium">
                All endpoints return a standardized JSON structure including a success flag and the requested data array.
              </p>
              
              <pre className="p-6 rounded-2xl border border-neutral-800 bg-neutral-950 font-mono text-[11px] overflow-x-auto text-neutral-300 leading-relaxed">
{`{
  "success": true,
  "count": 1,
  "products": [
    {
      "id": "nextjs-saas-kit",
      "title": "Premium Next.js SaaS Starter",
      "slug": "nextjs-saas-kit",
      "priceFormatted": "49.00",
      "effectivePriceFormatted": "39.20",
      "isFree": false,
      "thumbnail": "https://...",
      "storeName": "Scriptly Store",
      "url": "https://scriptly.store/products/nextjs-saas-kit",
      ...
    }
  ]
}`}
              </pre>
            </div>
          </section>

          <section className="p-8 rounded-3xl border border-neutral-800 bg-neutral-900/10 backdrop-blur-sm">
            <div className="flex gap-4">
              <Info className="w-6 h-6 text-emerald-500 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="text-sm font-black uppercase tracking-widest">Rate Limiting & CORS</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Our public API supports Cross-Origin Resource Sharing (CORS) allowing you to fetch data directly from client-side React/Vue applications. While we don't require API keys yet, please use these endpoints responsibly.
                </p>
              </div>
            </div>
          </section>

        </div>

        <footer className="mt-20 pt-12 border-t border-neutral-900 text-center">
          <p className="text-neutral-500 text-xs font-medium">
            &copy; 2026 ScriptlyStore API. All rights reserved.
          </p>
        </footer>

      </div>
    </div>
  );
}
