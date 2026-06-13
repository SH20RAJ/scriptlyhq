"use client";

import { useState, useTransition } from "react";
import { createProductAction, updateProductAction } from "../lib/actions/products";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, Loader2, Info } from "lucide-react";
import Link from "next/link";

interface ProductFormProps {
  categories: { id: string; name: string; slug: string }[];
  initialData?: {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    description: string;
    category: string;
    tags: string | null;
    thumbnail: string | null;
    fileUrl: string | null;
    demoUrl: string | null;
    price: number; // in paise
    version: string;
    featured: boolean;
    published: boolean;
  };
}

export default function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || categories[0]?.slug || "");
  const [tags, setTags] = useState(initialData?.tags || "");
  const [price, setPrice] = useState(initialData ? (initialData.price / 100).toString() : "");
  const [version, setVersion] = useState(initialData?.version || "1.0.0");
  const [demoUrl, setDemoUrl] = useState(initialData?.demoUrl || "");
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [published, setPublished] = useState(initialData ? initialData.published : true);
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnail || "");
  const [fileUrl, setFileUrl] = useState(initialData?.fileUrl || "");

  const isEdit = !!initialData;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("featured", featured ? "true" : "false");
    formData.set("published", published ? "true" : "false");

    startTransition(async () => {
      try {
        let result;
        if (isEdit && initialData) {
          result = await updateProductAction(initialData.id, formData);
        } else {
          result = await createProductAction(formData);
        }

        if (result.success) {
          router.push("/admin/products");
          router.refresh();
        }
      } catch (err: any) {
        console.error("Form submit error:", err);
        setError(err.message || "Something went wrong. Please check your inputs.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      
      {/* Action Header */}
      <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
        <Link
          href="/admin/products"
          className="inline-flex items-center text-sm text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to list
        </Link>
        
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center space-x-2 px-5 py-2.5 text-sm font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 disabled:scale-100 rounded-xl transition-all cursor-pointer"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isEdit ? "Update Product" : "Publish Product"}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-500/10 bg-rose-500/5 text-rose-400 text-sm flex items-center gap-2">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Title */}
        <div className="space-y-2 col-span-1">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Product Title *
          </label>
          <input
            type="text"
            name="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Next.js SaaS Boilerplate"
            className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/40 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Slug */}
        <div className="space-y-2 col-span-1">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
            <span>Slug URL</span>
            <span className="text-[10px] text-neutral-500 font-normal normal-case">
              (Auto-generated if empty)
            </span>
          </label>
          <input
            type="text"
            name="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. nextjs-saas-boilerplate"
            className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/40 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Category */}
        <div className="space-y-2 col-span-1">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Category *
          </label>
          <select
            name="category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/40 text-neutral-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug} className="bg-neutral-950">
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price (Rupees) */}
        <div className="space-y-2 col-span-1">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Price (INR ₹) *
          </label>
          <input
            type="number"
            name="price"
            step="0.01"
            min="0"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 499.00"
            className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/40 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Short Description */}
        <div className="space-y-2 col-span-2">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Short Tagline / Description *
          </label>
          <input
            type="text"
            name="shortDescription"
            required
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="A short tagline shown on the listings grid (1-2 sentences)"
            className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/40 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Full Description */}
        <div className="space-y-2 col-span-2">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Full Description Markdown / Copy *
          </label>
          <textarea
            name="description"
            required
            rows={8}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write details about features, dependencies, how to use it, etc."
            className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/40 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Tags */}
        <div className="space-y-2 col-span-2">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
            <span>Tags</span>
            <span className="text-[10px] text-neutral-500 font-normal normal-case">
              (Comma-separated list)
            </span>
          </label>
          <input
            type="text"
            name="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. nextjs, typescript, tailwind, auth"
            className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/40 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Version */}
        <div className="space-y-2 col-span-1">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Asset Version
          </label>
          <input
            type="text"
            name="version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="e.g. 1.0.0"
            className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/40 text-neutral-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Demo URL */}
        <div className="space-y-2 col-span-1">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Live Preview Demo URL
          </label>
          <input
            type="url"
            name="demoUrl"
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
            placeholder="https://example.com/demo"
            className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/40 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Thumbnail URL Input */}
        <div className="space-y-2 col-span-1 p-5 border border-neutral-900 bg-neutral-900/10 rounded-xl">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Thumbnail Image URL *
          </label>
          <input
            type="url"
            name="thumbnail"
            required
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            placeholder="https://example.com/thumbnail.jpg"
            className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/40 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Product Download URL Input */}
        <div className="space-y-2 col-span-1 p-5 border border-neutral-900 bg-neutral-900/10 rounded-xl">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Product Download URL (ZIP/File) *
          </label>
          <input
            type="url"
            name="fileUrl"
            required
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            placeholder="https://example.com/product.zip"
            className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/40 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Feature Switches */}
        <div className="flex items-center justify-between p-4 border border-neutral-900 bg-neutral-900/10 rounded-xl col-span-1">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Mark as Featured
            </h4>
            <p className="text-[10px] text-neutral-500">
              Pushes this item to the home page spotlight grid.
            </p>
          </div>
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="w-5 h-5 rounded accent-emerald-500 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between p-4 border border-neutral-900 bg-neutral-900/10 rounded-xl col-span-1">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Publish Status
            </h4>
            <p className="text-[10px] text-neutral-500">
              Make this item visible to general public browsing.
            </p>
          </div>
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-5 h-5 rounded accent-emerald-500 cursor-pointer"
          />
        </div>
      </div>
    </form>
  );
}
