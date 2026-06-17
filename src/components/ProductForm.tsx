"use client";

import { useState, useTransition, useEffect } from "react";
import { createProductAction, updateProductAction } from "../lib/actions/products";
import { uploadImageAction } from "../lib/actions/upload";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, Loader2, Info, Image as ImageIcon, Sparkles, Globe, FileUp, Eye } from "lucide-react";
import Link from "next/link";
import { marked } from "marked";
import { Tweet } from "react-tweet";

interface ProductFormProps {
  categories: { id: string; name: string; slug: string }[];
  subcategories: { id: string; name: string; slug: string; categoryId: string }[];
  isCreatorConsole?: boolean;
  initialData?: {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    description: string;
    category: string;
    subcategory: string | null;
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
    isFree?: boolean;
    discountPercent?: number;
    promoStart?: Date | string | null;
    promoEnd?: Date | string | null;
  };
}

export default function ProductForm({ categories, subcategories, isCreatorConsole = false, initialData }: ProductFormProps) {
  const isEdit = !!initialData;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [descTab, setDescTab] = useState<"write" | "preview">("write");
  const [category, setCategory] = useState(initialData?.category || categories[0]?.slug || "");
  const [subcategory, setSubcategory] = useState(initialData?.subcategory || "");
  const [tags, setTags] = useState(initialData?.tags || "");
  const [price, setPrice] = useState(initialData ? (initialData.price / 100).toString() : "");
  const [version, setVersion] = useState(initialData?.version || "1.0.0");
  const [demoUrl, setDemoUrl] = useState(initialData?.demoUrl || "");
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [published, setPublished] = useState(initialData ? initialData.published : true);
  
  const [isFree, setIsFree] = useState(initialData?.isFree || false);
  const [discountPercent, setDiscountPercent] = useState(initialData?.discountPercent?.toString() || "0");
  
  const formatDateForInput = (dateVal: any) => {
    if (!dateVal) return "";
    try {
      const d = new Date(dateVal);
      const tzOffset = d.getTimezoneOffset() * 60000;
      return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
    } catch {
      return "";
    }
  };

  const [promoStart, setPromoStart] = useState(formatDateForInput(initialData?.promoStart));
  const [promoEnd, setPromoEnd] = useState(formatDateForInput(initialData?.promoEnd));
  
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnail || "");
  const [previewGif, setPreviewGif] = useState(initialData?.previewGif || "");
  const [screenshots, setScreenshots] = useState(initialData?.screenshots || "");
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || "");
  const [fileUrl, setFileUrl] = useState(initialData?.fileUrl || "");

  const isTweet = videoUrl?.includes("twitter.com") || videoUrl?.includes("x.com");
  const tweetId = isTweet ? videoUrl.match(/status\/(\d+)/)?.[1] : null;

  // Load from localStorage on mount (only for New Product form, i.e., isEdit is false)
  useEffect(() => {
    if (isEdit) return;
    try {
      const saved = localStorage.getItem("scriptlystore_new_product_draft");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.title) setTitle(data.title);
        if (data.slug) setSlug(data.slug);
        if (data.category) setCategory(data.category);
        if (data.subcategory) setSubcategory(data.subcategory);
        if (data.price) setPrice(data.price);
        if (data.shortDescription) setShortDescription(data.shortDescription);
        if (data.description) setDescription(data.description);
        if (data.thumbnailUrl) setThumbnailUrl(data.thumbnailUrl);
        if (data.previewGif) setPreviewGif(data.previewGif);
        if (data.screenshots) setScreenshots(data.screenshots);
        if (data.videoUrl) setVideoUrl(data.videoUrl);
        if (data.fileUrl) setFileUrl(data.fileUrl);
        if (data.demoUrl) setDemoUrl(data.demoUrl);
        if (data.tags) setTags(data.tags);
        if (data.version) setVersion(data.version);
        if (data.featured !== undefined) setFeatured(data.featured);
        if (data.published !== undefined) setPublished(data.published);
        if (data.isFree !== undefined) setIsFree(data.isFree);
        if (data.discountPercent !== undefined) setDiscountPercent(data.discountPercent);
        if (data.promoStart) setPromoStart(data.promoStart);
        if (data.promoEnd) setPromoEnd(data.promoEnd);
      }
    } catch (err) {
      console.error("Failed to load draft from localStorage:", err);
    }
  }, [isEdit]);

  // Save to localStorage when values change (only for New Product form, i.e., isEdit is false)
  useEffect(() => {
    if (isEdit) return;
    const data = {
      title,
      slug,
      category,
      subcategory,
      price,
      shortDescription,
      description,
      thumbnailUrl,
      previewGif,
      screenshots,
      videoUrl,
      fileUrl,
      demoUrl,
      tags,
      version,
      featured,
      published,
      isFree,
      discountPercent,
      promoStart,
      promoEnd,
    };
    localStorage.setItem("scriptlystore_new_product_draft", JSON.stringify(data));
  }, [
    isEdit,
    title,
    slug,
    category,
    subcategory,
    price,
    shortDescription,
    description,
    thumbnailUrl,
    previewGif,
    screenshots,
    videoUrl,
    fileUrl,
    demoUrl,
    tags,
    version,
    featured,
    published,
  ]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetSetter: (val: string) => void, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(fieldName);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const data = await uploadImageAction(formData);
      if (data && 'url' in data && data.url) {
        if (fieldName === "screenshots") {
          const current = screenshots ? screenshots.split(",").map(s => s.trim()) : [];
          targetSetter([...current, data.url].join(", "));
        } else {
          targetSetter(data.url);
        }
      } else if (data && 'error' in data) {
        setError("Image upload failed: " + data.error);
      } else {
        setError("Image upload failed: Unexpected response from server.");
      }
    } catch (err: any) {
      setError("Image upload failed: " + (err.message || "Please try again."));
    } finally {
      setUploading(null);
    }
  };



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const isDraft = submitter?.getAttribute("data-draft") === "true";

    const formData = new FormData(e.currentTarget);
    formData.set("title", title);
    formData.set("slug", slug);
    formData.set("shortDescription", shortDescription);
    formData.set("description", description);
    formData.set("category", category);
    formData.set("price", price);
    formData.set("version", version);
    formData.set("tags", tags);
    formData.set("demoUrl", demoUrl);
    formData.set("featured", featured ? "true" : "false");
    formData.set("published", isDraft ? "false" : (published ? "true" : "false"));
    formData.set("thumbnail", thumbnailUrl);
    formData.set("previewGif", previewGif);
    formData.set("screenshots", screenshots);
    formData.set("videoUrl", videoUrl);
    formData.set("fileUrl", fileUrl);
    formData.set("subcategory", subcategory);
    formData.set("isFree", isFree ? "true" : "false");
    formData.set("discountPercent", isFree ? "0" : discountPercent);
    formData.set("promoStart", promoStart);
    formData.set("promoEnd", promoEnd);

    startTransition(async () => {
      try {
        let result;
        if (isEdit && initialData) {
          result = await updateProductAction(initialData.id, formData);
        } else {
          result = await createProductAction(formData);
        }

        if (result.success) {
          if (!isEdit) {
            localStorage.removeItem("scriptlystore_new_product_draft");
          }
          router.push(isCreatorConsole ? "/dashboard/creator" : "/admin/products");
          router.refresh();
        }
      } catch (err: any) {
        console.error("Form submit error:", err);
        setError(err.message || "Something went wrong. Please check your inputs.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      
      {/* Action Header */}
      <div className="flex items-center justify-between border-b border-neutral-900 pb-5">
        <div className="flex items-center gap-6">
          <Link
            href={isCreatorConsole ? "/dashboard/creator" : "/admin/products"}
            className="inline-flex items-center text-sm font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to list
          </Link>

          {slug && (
            <Link
              href={`/products/${slug}`}
              target="_blank"
              className="inline-flex items-center text-sm font-semibold text-neutral-400 hover:text-white transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Product
            </Link>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <button
            type="submit"
            data-draft="true"
            disabled={isPending || !!uploading}
            className="inline-flex items-center space-x-2 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-400 border border-neutral-800 hover:text-white hover:bg-neutral-900 disabled:opacity-50 rounded-xl transition-all cursor-pointer"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileUp className="w-4 h-4" />
            )}
            <span>{(isEdit && initialData?.published) ? "Move to Draft" : "Save Draft"}</span>
          </button>

          <button
            type="submit"
            disabled={isPending || !!uploading}
            className="inline-flex items-center space-x-2 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-black bg-white hover:bg-neutral-200 disabled:opacity-50 rounded-xl transition-all cursor-pointer shadow-lg"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>
              {isCreatorConsole
                ? (isEdit ? "Update Submission" : "Submit for Approval")
                : (isEdit 
                    ? (initialData?.published ? "Update Product" : "Publish Now") 
                    : "Publish Product")}
            </span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-500/10 bg-rose-500/5 text-rose-400 text-xs flex items-center gap-2">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Two-Column Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Core Fields */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/10 space-y-6 backdrop-blur-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-neutral-800/60 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              Core Details
            </h3>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Product Title *</label>
              <input type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Next.js SaaS Kit" className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/5 focus:border-neutral-500 transition-colors" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Slug URL</label>
              <input type="text" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated-if-empty" className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/5 focus:border-neutral-500 transition-colors font-mono" />
            </div>

            {/* Category selection row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Category *</label>
                <select name="category" value={category} onChange={(e) => {
                  setCategory(e.target.value);
                  setSubcategory("");
                }} className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-sm focus:outline-none focus:border-neutral-500 cursor-pointer">
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Subcategory</label>
                <select name="subcategory" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-sm focus:outline-none focus:border-neutral-500 cursor-pointer">
                  <option value="">No Subcategory</option>
                  {subcategories
                    .filter((sub) => sub.categoryId === category || sub.categoryId === categories.find(c => c.slug === category)?.id)
                    .map((sub) => (
                      <option key={sub.id} value={sub.slug}>{sub.name}</option>
                    ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Price (USD $) *</label>
                <input type="number" name="price" step="0.01" min="0" disabled={isFree} value={isFree ? "0.00" : price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/5 focus:border-neutral-500 transition-colors disabled:opacity-50" />
              </div>
            </div>

            {/* Promotion / Free product options */}
            <div className="border-t border-neutral-800/60 pt-5 space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-purple-400">Promotions & Discounts</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-800 bg-neutral-950/60">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-neutral-300 uppercase">Make Product Free</h4>
                    <p className="text-[9px] text-neutral-500">Bypass checkout payment flows completely</p>
                  </div>
                  <input type="checkbox" checked={isFree} onChange={(e) => {
                    setIsFree(e.target.checked);
                    if (e.target.checked) setPrice("0.00");
                  }} className="w-4.5 h-4.5 rounded accent-white cursor-pointer" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Discount Percentage (%)</label>
                  <input type="number" min="0" max="100" name="discountPercent" disabled={isFree} value={isFree ? "0" : discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} placeholder="e.g. 20 (for 20% off)" className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/5 focus:border-neutral-500 transition-colors disabled:opacity-50" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Promotion Start Date (Optional)</label>
                  <input type="datetime-local" name="promoStart" value={promoStart} onChange={(e) => setPromoStart(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-sm focus:outline-none focus:border-neutral-500 cursor-pointer" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Promotion End Date (Optional)</label>
                  <input type="datetime-local" name="promoEnd" value={promoEnd} onChange={(e) => setPromoEnd(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-sm focus:outline-none focus:border-neutral-500 cursor-pointer" />
                </div>
              </div>
              <p className="text-[9px] text-neutral-500 leading-normal">
                Leave dates empty to apply the promotion permanently. If start/end dates are specified, the discount or free status will automatically activate and deactivate at those times.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/10 space-y-6 backdrop-blur-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-neutral-800/60 pb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" />
              Descriptions
            </h3>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Short Description *</label>
              <input type="text" name="shortDescription" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder="Keep it brief, shown on card views" className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/5 focus:border-neutral-500 transition-colors" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Full Description * (Markdown)</label>
                <div className="flex bg-neutral-900 border border-neutral-800 rounded-lg p-0.5 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setDescTab("write")}
                    className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${descTab === "write" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white"}`}
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setDescTab("preview")}
                    className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${descTab === "preview" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white"}`}
                  >
                    Preview
                  </button>
                </div>
              </div>
              {descTab === "write" ? (
                <textarea
                  name="description"
                  rows={10}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Markdown is supported... e.g. # Header, - Bullet Points"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-white focus:outline-none focus:ring-2 focus:ring-white/5 focus:border-neutral-500 transition-colors font-medium text-sm"
                />
              ) : (
                <div 
                  dangerouslySetInnerHTML={{ __html: marked.parse(description || "*No description typed yet.*") as string }} 
                  className="markdown-content w-full px-4 py-3 min-h-[240px] rounded-xl border border-neutral-800 bg-neutral-950 text-white overflow-y-auto font-medium text-sm"
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Media, Settings, Distribution */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/10 space-y-6 backdrop-blur-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-neutral-800/60 pb-3 flex items-center gap-2">
              <FileUp className="w-4 h-4 text-amber-500" />
              Media Assets
            </h3>
            
            {/* Thumbnail with visual preview */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase flex justify-between">
                Thumbnail URL *
                <span className="text-[9px] lowercase font-normal opacity-60">jpg/png/webp</span>
              </label>
              {thumbnailUrl && (
                <div className="relative w-28 h-20 rounded-xl border border-neutral-800 overflow-hidden bg-neutral-950/60 mb-2">
                  <img src={thumbnailUrl} alt="Thumbnail Preview" className="w-full h-full object-cover" loading="lazy" />
                </div>
              )}
              <div className="flex gap-2">
                <input type="url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://..." className="flex-1 px-4 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-xs focus:border-neutral-500 outline-none" />
                <div className="relative">
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setThumbnailUrl, "thumbnail")} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <button type="button" className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-colors cursor-pointer">
                    {uploading === "thumbnail" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Preview GIF with visual preview */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase flex justify-between">
                Preview GIF URL
                <span className="text-[9px] lowercase font-normal opacity-60">Hover card animation</span>
              </label>
              {previewGif && (
                <div className="relative w-28 h-20 rounded-xl border border-neutral-800 overflow-hidden bg-neutral-950/60 mb-2">
                  <img src={previewGif} alt="GIF Preview" className="w-full h-full object-cover" loading="lazy" />
                </div>
              )}
              <div className="flex gap-2">
                <input type="url" value={previewGif} onChange={(e) => setPreviewGif(e.target.value)} placeholder="https://..." className="flex-1 px-4 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-xs focus:border-neutral-500 outline-none" />
                <div className="relative">
                  <input type="file" accept="image/gif,image/webp" onChange={(e) => handleImageUpload(e, setPreviewGif, "previewGif")} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <button type="button" className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-colors cursor-pointer">
                    {uploading === "previewGif" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Screenshots */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase flex justify-between">
                Screenshots
                <span className="text-[9px] lowercase font-normal opacity-60">Comma-separated URLs</span>
              </label>
              <div className="space-y-2">
                <textarea value={screenshots} onChange={(e) => setScreenshots(e.target.value)} placeholder="URL1, URL2, ..." rows={3} className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-xs focus:border-neutral-500 outline-none resize-none font-medium" />
                <div className="relative w-full">
                  <input type="file" accept="image/*" multiple onChange={(e) => handleImageUpload(e, setScreenshots, "screenshots")} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <button type="button" className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer">
                    {uploading === "screenshots" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Upload className="w-3.5 h-3.5" /> Upload Screenshot</>}
                  </button>
                </div>
              </div>
            </div>

            {/* Video URL */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase">Video Embed URL</label>
              <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="e.g. https://youtube.com/watch?v=..." className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-xs focus:border-neutral-500 outline-none font-medium" />
              {tweetId && (
                <div className="mt-4 flex justify-center bg-black/20 rounded-2xl p-2 border border-neutral-800">
                  <div className="w-full max-w-[400px]">
                    <Tweet id={tweetId} />
                  </div>
                </div>
              )}
            </div>

            {/* Download URL */}
            <div className="space-y-2 pt-4 border-t border-neutral-800/80">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Product File Package URL *</label>
              <input type="url" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="Private download URL (zip/pdf)" className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-xs focus:border-neutral-500 outline-none font-medium" />
            </div>
          </div>

          {/* Settings & Publishing checkboxes */}
          <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/10 space-y-4 backdrop-blur-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-neutral-800/60 pb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              Settings & Tags
            </h3>

            {!isCreatorConsole ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-neutral-300 uppercase">Featured Spotlight</h4>
                    <p className="text-[9px] text-neutral-500">Spotlight this product on the home landing</p>
                  </div>
                  <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4.5 h-4.5 rounded accent-white cursor-pointer" />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-neutral-300 uppercase">Publicly Published</h4>
                    <p className="text-[9px] text-neutral-500">Allow customers to view and purchase this item</p>
                  </div>
                  <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="w-4.5 h-4.5 rounded accent-white cursor-pointer" />
                </div>
              </>
            ) : (
              <div className="p-4 rounded-xl border border-amber-500/10 bg-amber-500/5 text-amber-400 text-xs flex items-start gap-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-300 uppercase text-[10px] mb-1">Approval Moderation</h4>
                  <p className="text-[10px] leading-relaxed text-neutral-400">
                    To maintain library quality, all submitted scripts are saved as unlisted drafts and audited by Scriptly moderators before public release.
                  </p>
                </div>
              </div>
            )}
            
            <div className="pt-4 border-t border-neutral-800 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase">Search Tags</label>
                <input type="text" name="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="nextjs, tailwind, auth" className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-xs focus:border-neutral-500 outline-none font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase">Demo Live URL</label>
                <input type="url" name="demoUrl" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} placeholder="https://demo.example.com" className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-xs focus:border-neutral-500 outline-none font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase">Version Tag</label>
                <input type="text" name="version" value={version} onChange={(e) => setVersion(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-xs focus:border-neutral-500 outline-none font-mono font-medium" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
