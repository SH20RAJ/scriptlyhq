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
    previewGif: string | null;
    screenshots: string | null;
    videoUrl: string | null;
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
  const [uploading, setUploading] = useState<string | null>(null);

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
  const [previewGif, setPreviewGif] = useState(initialData?.previewGif || "");
  const [screenshots, setScreenshots] = useState(initialData?.screenshots || "");
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || "");
  const [fileUrl, setFileUrl] = useState(initialData?.fileUrl || "");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetSetter: (val: string) => void, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(fieldName);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const apiKey = "c0c864f0d9aadb0f7de371582b301397";
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        if (fieldName === "screenshots") {
          const current = screenshots ? screenshots.split(",").map(s => s.trim()) : [];
          targetSetter([...current, data.data.url].join(", "));
        } else {
          targetSetter(data.data.url);
        }
      } else {
        setError("Image upload failed: " + (data.error?.message || "Unknown error"));
      }
    } catch (err) {
      setError("Image upload failed. Please try again.");
    } finally {
      setUploading(null);
    }
  };

  const isEdit = !!initialData;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("featured", featured ? "true" : "false");
    formData.set("published", published ? "true" : "false");
    formData.set("thumbnail", thumbnailUrl);
    formData.set("previewGif", previewGif);
    formData.set("screenshots", screenshots);
    formData.set("videoUrl", videoUrl);
    formData.set("fileUrl", fileUrl);

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
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      
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
          disabled={isPending || !!uploading}
          className="inline-flex items-center space-x-2 px-5 py-2.5 text-sm font-bold text-black bg-white hover:bg-neutral-200 disabled:opacity-50 rounded-lg transition-all cursor-pointer"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Product Title *</label>
            <input type="text" name="title" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-black text-white focus:outline-none focus:border-neutral-600 transition-colors" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Slug URL</label>
            <input type="text" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated-if-empty" className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-black text-white focus:outline-none focus:border-neutral-600 transition-colors" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Category *</label>
              <select name="category" required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-black text-white focus:outline-none focus:border-neutral-600 transition-colors">
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Price (INR ₹) *</label>
              <input type="number" name="price" step="0.01" min="0" required value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-black text-white focus:outline-none focus:border-neutral-600 transition-colors" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Short Description *</label>
            <input type="text" name="shortDescription" required value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-black text-white focus:outline-none focus:border-neutral-600 transition-colors" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Full Description *</label>
            <textarea name="description" required rows={10} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-black text-white focus:outline-none focus:border-neutral-600 transition-colors" />
          </div>
        </div>

        {/* Right Column - Media & Settings */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/20 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-neutral-800 pb-2">Media Assets</h3>
            
            {/* Thumbnail */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase flex justify-between">
                Thumbnail URL *
                <span className="text-[10px] lowercase font-normal opacity-60">jpg/png/webp</span>
              </label>
              <div className="flex gap-2">
                <input type="url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-800 bg-black text-white text-sm focus:border-neutral-600 outline-none" />
                <div className="relative">
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setThumbnailUrl, "thumbnail")} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <button type="button" className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-colors">
                    {uploading === "thumbnail" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Preview GIF */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase flex justify-between">
                Preview GIF URL
                <span className="text-[10px] lowercase font-normal opacity-60">shown on card hover</span>
              </label>
              <div className="flex gap-2">
                <input type="url" value={previewGif} onChange={(e) => setPreviewGif(e.target.value)} className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-800 bg-black text-white text-sm focus:border-neutral-600 outline-none" />
                <div className="relative">
                  <input type="file" accept="image/gif,image/webp" onChange={(e) => handleImageUpload(e, setPreviewGif, "previewGif")} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <button type="button" className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-colors">
                    {uploading === "previewGif" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Screenshots */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase flex justify-between">
                Screenshots
                <span className="text-[10px] lowercase font-normal opacity-60">comma separated urls</span>
              </label>
              <div className="space-y-2">
                <textarea value={screenshots} onChange={(e) => setScreenshots(e.target.value)} placeholder="URL1, URL2, ..." rows={3} className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-black text-white text-sm focus:border-neutral-600 outline-none resize-none" />
                <div className="relative w-full">
                  <input type="file" accept="image/*" multiple onChange={(e) => handleImageUpload(e, setScreenshots, "screenshots")} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <button type="button" className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2">
                    {uploading === "screenshots" ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Upload className="w-3.5 h-3.5" /> Upload Screenshot</>}
                  </button>
                </div>
              </div>
            </div>

            {/* Video URL */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase">Video URL (YouTube/Direct)</label>
              <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-black text-white text-sm focus:border-neutral-600 outline-none" />
            </div>

            {/* Download URL */}
            <div className="space-y-2 pt-4 border-t border-neutral-800">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Product Download URL *</label>
              <input type="url" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} required placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-black text-white text-sm focus:border-neutral-600 outline-none" />
            </div>
          </div>

          {/* Visibility & Settings */}
          <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-neutral-300 uppercase">Featured</h4>
                <p className="text-[10px] text-neutral-500">Show in home spotlight</p>
              </div>
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-5 h-5 rounded accent-white cursor-pointer" />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-neutral-300 uppercase">Published</h4>
                <p className="text-[10px] text-neutral-500">Visible to public</p>
              </div>
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="w-5 h-5 rounded accent-white cursor-pointer" />
            </div>
            
            <div className="pt-4 border-t border-neutral-800 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase">Tags</label>
                <input type="text" name="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="nextjs, tailwind, auth" className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-black text-white text-sm focus:border-neutral-600 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase">Demo URL</label>
                <input type="url" name="demoUrl" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} placeholder="https://demo.example.com" className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-black text-white text-sm focus:border-neutral-600 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase">Version</label>
                <input type="text" name="version" value={version} onChange={(e) => setVersion(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-black text-white text-sm focus:border-neutral-600 outline-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
