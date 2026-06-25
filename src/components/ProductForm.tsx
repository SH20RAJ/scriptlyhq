"use client";

import { useState, useTransition, useEffect } from "react";
import { createProductAction, updateProductAction } from "@/lib/actions/products";
import { uploadImageAction } from "@/lib/actions/upload";
import { uploadToGithubReleaseAction } from "@/lib/actions/github-releases";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Upload, Loader2, Info, Image as ImageIcon, Sparkles, Globe, FileUp, FileArchive, Video, Link as LinkIcon, HelpCircle, Settings, FileText } from "lucide-react";
import Link from "next/link";
import { marked } from "marked";
import { Tweet } from "react-tweet";
import { toast } from "sonner";

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
    redirectDownload?: boolean;
    personal?: boolean;
    views?: number;
    downloadsCount?: number;
    saves?: number;
    showStats?: boolean;
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
  const [personal, setPersonal] = useState(initialData?.personal || false);
  const [showStats, setShowStats] = useState(initialData?.showStats || false);
  const [views, setViews] = useState(initialData?.views?.toString() || "0");
  const [downloadsCount, setDownloadsCount] = useState(initialData?.downloadsCount?.toString() || "0");
  const [saves, setSaves] = useState(initialData?.saves?.toString() || "0");
  
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
  const [redirectDownload, setRedirectDownload] = useState(initialData ? (initialData.redirectDownload ?? true) : true);

  const isTweet = videoUrl?.includes("twitter.com") || videoUrl?.includes("x.com");
  const tweetId = isTweet ? videoUrl.match(/status\/(\d+)/)?.[1] : null;

  // Resolve video embed URLs for previews
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

    // Vimeo
    const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

    // Dailymotion
    const dmMatch = url.match(/(?:dailymotion\.com\/video\/|dai\.ly\/)([^&\s?]+)/);
    if (dmMatch) return `https://www.dailymotion.com/embed/video/${dmMatch[1]}`;

    // Return raw for other embedded targets
    if (url.includes("embed") || url.includes("player")) return url;

    return null;
  };

  const resolvedEmbedUrl = getEmbedUrl(videoUrl);
  const isDirectVideo = videoUrl && (videoUrl.endsWith(".mp4") || videoUrl.endsWith(".webm") || videoUrl.endsWith(".ogv"));

  // Load from localStorage on mount (only for New Product form)
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
        if (data.personal !== undefined) setPersonal(data.personal);
        if (data.isFree !== undefined) setIsFree(data.isFree);
        if (data.discountPercent !== undefined) setDiscountPercent(data.discountPercent);
        if (data.promoStart) setPromoStart(data.promoStart);
        if (data.promoEnd) setPromoEnd(data.promoEnd);
        if (data.redirectDownload !== undefined) setRedirectDownload(data.redirectDownload);
      }
    } catch (err) {
      console.error("Failed to load draft from localStorage:", err);
    }
  }, [isEdit]);

  // Save to localStorage when values change
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
      personal,
      isFree,
      discountPercent,
      promoStart,
      promoEnd,
      redirectDownload,
    };
    localStorage.setItem("scriptlystore_new_product_draft", JSON.stringify(data));
  }, [
    isEdit, title, slug, category, subcategory, price, shortDescription, 
    description, thumbnailUrl, previewGif, screenshots, videoUrl, 
    fileUrl, demoUrl, tags, version, featured, published, personal, 
    isFree, discountPercent, promoStart, promoEnd, redirectDownload
  ]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetSetter: (val: string) => void, fieldName: string, forceRelease = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(fieldName);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      let data;
      // Auto fallback to Release upload for files > 15MB or if forceRelease is true
      if (forceRelease || file.size > 15 * 1024 * 1024) {
        data = await uploadToGithubReleaseAction(formData);
      } else {
        data = await uploadImageAction(formData);
        if (data && 'error' in data) {
          console.warn("Standard upload failed, falling back to GitHub Release upload:", data.error);
          data = await uploadToGithubReleaseAction(formData);
        }
      }

      if (data && 'url' in data && data.url) {
        if (fieldName === "screenshots") {
          const current = screenshots ? screenshots.split(",").map(s => s.trim()) : [];
          targetSetter([...current, data.url].join(", "));
        } else {
          targetSetter(data.url);
        }
        toast.success("File uploaded successfully!");
      } else if (data && 'error' in data) {
        setError("Upload failed: " + data.error);
        toast.error("Upload failed: " + data.error);
      } else {
        setError("Upload failed: Unexpected response from server.");
      }
    } catch (err: any) {
      setError("Upload failed: " + (err.message || "Please try again."));
      toast.error("Upload failed: " + (err.message || "Please try again."));
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
    formData.set("personal", personal ? "true" : "false");
    formData.set("thumbnail", thumbnailUrl);
    formData.set("previewGif", previewGif);
    formData.set("screenshots", screenshots);
    formData.set("videoUrl", videoUrl);
    formData.set("fileUrl", fileUrl);
    formData.set("redirectDownload", redirectDownload ? "true" : "false");
    formData.set("subcategory", subcategory);
    formData.set("isFree", isFree ? "true" : "false");
    formData.set("discountPercent", isFree ? "0" : discountPercent);
    formData.set("promoStart", promoStart);
    formData.set("promoEnd", promoEnd);
    formData.set("showStats", showStats ? "true" : "false");
    formData.set("views", views);
    formData.set("downloadsCount", downloadsCount);
    formData.set("saves", saves);

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
          toast.success(isEdit ? "Product updated successfully!" : "Product listed successfully!");
          router.push(isCreatorConsole ? "/creator/products" : "/admin/products");
          router.refresh();
        } else {
          setError((result as any).error || "Action failed.");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      }
    });
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEdit) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  };

  // Filter subcategories for the selected category
  const filteredSubcategories = subcategories.filter(sub => sub.categoryId === category);

  return (
    <form onSubmit={handleSubmit} className="space-y-8 select-none max-w-6xl mx-auto px-4 py-8">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800 pb-6 gap-4">
        <div className="space-y-1">
          <Button asChild variant="ghost" size="sm" className="text-neutral-400 hover:text-white -ml-3">
            <Link href={isCreatorConsole ? "/creator/products" : "/admin/products"}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Catalog
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            {isEdit ? "Configure Product" : "Launch Digital Asset"}
            <Badge variant="outline" className="rounded-full text-[9px] uppercase px-3.5 py-0.5 border-neutral-700 bg-neutral-900/60 text-neutral-400">
              {isEdit ? "Edit Mode" : "New Draft"}
            </Badge>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Hire Me helper link */}
          <Link
            href="/hire-me"
            className="flex items-center gap-1.5 text-xs font-bold text-[#1CB0F6] hover:text-[#1CB0F6]/80 bg-[#1CB0F6]/10 border border-[#1CB0F6]/20 px-3.5 py-2 rounded-xl transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Hire Developer
          </Link>

          {/* Blogger post helper link */}
          <a
            href="https://www.blogger.com/blog/posts/446251549562029884"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 rounded-xl transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            Blogger Post
          </a>

          {!isEdit && (
            <Button
              type="submit"
              data-draft="true"
              variant="outline"
              disabled={isPending}
              className="rounded-xl font-bold uppercase tracking-wider text-[10px] h-10 border-neutral-800 hover:bg-neutral-900 cursor-pointer"
            >
              Save Draft
            </Button>
          )}
          
          <Button
            type="submit"
            disabled={isPending}
            className="rounded-xl font-bold uppercase tracking-wider text-[10px] bg-primary text-white hover:bg-primary/90 h-10 px-6 cursor-pointer"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {isEdit ? "Apply Updates" : "Publish Code"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-bold">
          {error}
        </div>
      )}

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Basic Details & Text Contents */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section A: Product Identification */}
          <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/10 space-y-6 backdrop-blur-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-neutral-800/60 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              General Details
            </h3>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Product Title *</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => handleTitleChange(e.target.value)} 
                placeholder="e.g. Fizzi - A 3D eCommerce landing page built with NextJS" 
                required 
                className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-neutral-700 transition-all font-semibold" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Static Slug (URL Path) *</label>
              <input 
                type="text" 
                value={slug} 
                onChange={(e) => setSlug(e.target.value)} 
                placeholder="fizzi-3d-ecommerce-landing-page" 
                required 
                className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-neutral-700 transition-all font-mono" 
              />
            </div>

            {/* Categorization Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Parent Category *</label>
                <select 
                  value={category} 
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSubcategory(""); // Reset subcategory on change
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-sm focus:outline-none focus:border-neutral-700 cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Subcategory (Optional)</label>
                <select 
                  value={subcategory} 
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-sm focus:outline-none focus:border-neutral-700 cursor-pointer"
                >
                  <option value="">No subcategory</option>
                  {filteredSubcategories.map((sub) => (
                    <option key={sub.id} value={sub.slug}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section B: Pricing, Payouts, License */}
          <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/10 space-y-6 backdrop-blur-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-neutral-800/60 pb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-500" />
              Pricing & Promotions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Price (USD) *</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  value={price} 
                  onChange={(e) => {
                    setPrice(e.target.value);
                    if (parseFloat(e.target.value) === 0) setIsFree(true);
                    else setIsFree(false);
                  }} 
                  placeholder="29.99" 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-sm focus:outline-none focus:border-neutral-700" 
                />
              </div>

              {!isCreatorConsole && (
                <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-800 bg-neutral-950/60">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-neutral-300 uppercase">First-Party / Personal</h4>
                    <p className="text-[9px] text-neutral-500">Listed under ScriptlyHQ directly</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={personal} 
                    onChange={(e) => setPersonal(e.target.checked)} 
                    className="w-4.5 h-4.5 rounded accent-primary cursor-pointer" 
                  />
                </div>
              )}
            </div>

            {/* Promotions Options */}
            <div className="border-t border-neutral-800/60 pt-5 space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-purple-400">Discounts & Limited Campaigns</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-800 bg-neutral-950/60">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-neutral-300 uppercase">Make Product Free</h4>
                    <p className="text-[9px] text-neutral-500">Customers bypass payments entirely</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={isFree} 
                    onChange={(e) => {
                      setIsFree(e.target.checked);
                      if (e.target.checked) setPrice("0.00");
                    }} 
                    className="w-4.5 h-4.5 rounded accent-white cursor-pointer" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Discount Percentage (%)</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    disabled={isFree} 
                    value={isFree ? "0" : discountPercent} 
                    onChange={(e) => setDiscountPercent(e.target.value)} 
                    placeholder="e.g. 20" 
                    className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-sm focus:outline-none focus:border-neutral-700 disabled:opacity-50" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Promo Start Date</label>
                  <input 
                    type="datetime-local" 
                    value={promoStart} 
                    onChange={(e) => setPromoStart(e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-sm focus:outline-none focus:border-neutral-700" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Promo End Date</label>
                  <input 
                    type="datetime-local" 
                    value={promoEnd} 
                    onChange={(e) => setPromoEnd(e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-sm focus:outline-none focus:border-neutral-700" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section C: Markdown & Descriptions */}
          <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/10 space-y-6 backdrop-blur-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-neutral-800/60 pb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#CE82FF]" />
              Descriptions & Documentation
            </h3>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Short Catchy Subtitle *</label>
              <input 
                type="text" 
                value={shortDescription} 
                onChange={(e) => setShortDescription(e.target.value)} 
                placeholder="High-converting tagline, displayed on dashboard cards" 
                required 
                className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-sm focus:outline-none focus:border-neutral-700" 
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Full Product Details * (Markdown)</label>
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
                  rows={10}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Markdown is supported... e.g. # Key Features, - Built-in authentication, etc."
                  required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-white focus:outline-none focus:ring-2 focus:ring-primary/45 transition-colors font-medium text-sm"
                />
              ) : (
                <div 
                  dangerouslySetInnerHTML={{ __html: marked.parse(description || "*No markdown typed yet.*") as string }} 
                  className="markdown-content w-full px-4 py-3 min-h-[240px] rounded-xl border border-neutral-800 bg-neutral-950 text-white overflow-y-auto font-medium text-sm leading-relaxed space-y-4"
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Media, Settings, Distribution */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Section D: Product Assets & File Package */}
          <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/10 space-y-6 backdrop-blur-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-neutral-800/60 pb-3 flex items-center gap-2">
              <FileUp className="w-4 h-4 text-amber-500" />
              Code Package & File Store
            </h3>

            {/* Private Package File ZIP URL */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                  <FileArchive className="w-3.5 h-3.5 text-neutral-300" />
                  Product ZIP Package *
                </label>
              </div>
              <div className="flex gap-2">
                <input 
                  type="url" 
                  value={fileUrl} 
                  onChange={(e) => setFileUrl(e.target.value)} 
                  placeholder="Private download URL (zip/tar/pdf)" 
                  required 
                  className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-xs outline-none focus:border-neutral-500" 
                />
                <div className="relative">
                  <input 
                    type="file" 
                    onChange={(e) => handleUpload(e, setFileUrl, "fileUrl", true)} // Force GitHub Release API upload
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                  <button 
                    type="button" 
                    className="px-3.5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-colors cursor-pointer flex items-center justify-center"
                    title="Upload private ZIP package via GitHub Releases API fallback"
                  >
                    {uploading === "fileUrl" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <span className="text-[9px] text-neutral-500 font-bold leading-normal block">
                Securely uploads file via private GitHub releases tag backup.
              </span>
            </div>

            {/* Secure Direct Download Redirect Option */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-800 bg-neutral-950/60">
              <div className="space-y-0.5 pr-2">
                <h4 className="text-xs font-bold text-neutral-300 uppercase">Redirect secure download</h4>
                <p className="text-[9px] text-neutral-500">Redirect directly to the package URL instead of streaming it</p>
              </div>
              <input 
                type="checkbox" 
                checked={redirectDownload} 
                onChange={(e) => setRedirectDownload(e.target.checked)} 
                className="w-4.5 h-4.5 rounded accent-white cursor-pointer" 
              />
            </div>

            {/* Demo Live Preview URL */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                <LinkIcon className="w-3.5 h-3.5 text-neutral-300" />
                Demo Live URL
              </label>
              <input 
                type="url" 
                value={demoUrl} 
                onChange={(e) => setDemoUrl(e.target.value)} 
                placeholder="https://demo.example.com" 
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-xs focus:border-neutral-500 outline-none font-medium" 
              />
            </div>
          </div>

          {/* Section E: Media & Video Embeds */}
          <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/10 space-y-6 backdrop-blur-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-neutral-800/60 pb-3 flex items-center gap-2">
              <Video className="w-4 h-4 text-cyan-400" />
              Media Showcase & Previews
            </h3>

            {/* Thumbnail URL */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase flex justify-between">
                Thumbnail Image URL *
                <span className="text-[9px] lowercase font-normal opacity-60">jpg/png/webp</span>
              </label>
              {thumbnailUrl && (
                <div className="relative w-28 h-20 rounded-xl border border-neutral-800 overflow-hidden bg-neutral-950/60 mb-2">
                  <img src={thumbnailUrl} alt="Thumbnail Preview" className="w-full h-full object-cover" loading="lazy" />
                </div>
              )}
              <div className="flex gap-2">
                <input 
                  type="url" 
                  value={thumbnailUrl} 
                  onChange={(e) => setThumbnailUrl(e.target.value)} 
                  placeholder="https://..." 
                  className="flex-1 px-4 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-xs focus:border-neutral-500 outline-none" 
                />
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleUpload(e, setThumbnailUrl, "thumbnail")} 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                  <button type="button" className="px-3.5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-colors cursor-pointer">
                    {uploading === "thumbnail" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Hover Preview GIF URL */}
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
                <input 
                  type="url" 
                  value={previewGif} 
                  onChange={(e) => setPreviewGif(e.target.value)} 
                  placeholder="https://..." 
                  className="flex-1 px-4 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-xs focus:border-neutral-500 outline-none" 
                />
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/gif,image/webp" 
                    onChange={(e) => handleUpload(e, setPreviewGif, "previewGif")} 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                  <button type="button" className="px-3.5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-colors cursor-pointer">
                    {uploading === "previewGif" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Video Previews */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-neutral-400 uppercase flex items-center gap-1">
                  Video Embed / Preview URL
                </label>
                {/* Info button with supported format descriptions */}
                <div className="relative group/tooltip">
                  <HelpCircle className="w-4 h-4 text-neutral-500 hover:text-neutral-300 cursor-pointer" />
                  <div className="absolute right-0 bottom-6 hidden group-hover/tooltip:block bg-neutral-950 text-neutral-300 border border-neutral-800 p-4 rounded-xl text-[10px] w-56 shadow-2xl z-50 leading-relaxed font-semibold">
                    <p className="font-bold text-white mb-1 uppercase tracking-wider text-[9px]">Supported Video Formats:</p>
                    <ul className="list-disc pl-3.5 space-y-1">
                      <li>YouTube URLs</li>
                      <li>Vimeo URLs</li>
                      <li>Dailymotion Videos</li>
                      <li>Twitter / X Status links</li>
                      <li>Direct video files (.mp4 / .webm)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <input 
                  type="url" 
                  value={videoUrl} 
                  onChange={(e) => setVideoUrl(e.target.value)} 
                  placeholder="https://youtube.com/watch?v=... or .mp4" 
                  className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-xs outline-none focus:border-neutral-500" 
                />
                <div className="relative">
                  <input 
                    type="file" 
                    accept="video/*" 
                    onChange={(e) => handleUpload(e, setVideoUrl, "videoUrl", true)} // Force GitHub Release API upload
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                  <button 
                    type="button" 
                    className="px-3.5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-colors cursor-pointer flex items-center justify-center"
                    title="Upload video via GitHub Releases API fallback"
                  >
                    {uploading === "videoUrl" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Video Embed Live Preview Box */}
              {videoUrl && (
                <div className="mt-4 rounded-xl border border-neutral-800 overflow-hidden bg-black/40 p-1.5 aspect-video flex items-center justify-center">
                  {resolvedEmbedUrl ? (
                    <iframe 
                      src={resolvedEmbedUrl} 
                      className="w-full h-full border-0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      allowFullScreen 
                    />
                  ) : isDirectVideo ? (
                    <video src={videoUrl} controls className="w-full h-full rounded-lg" />
                  ) : tweetId ? (
                    <div className="w-full h-full overflow-y-auto max-w-[320px]">
                      <Tweet id={tweetId} />
                    </div>
                  ) : (
                    <span className="text-[10px] text-neutral-500 font-bold">Preview format not supported directly inside form</span>
                  )}
                </div>
              )}
            </div>

            {/* Screenshots list manager */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase flex justify-between">
                Carousel Screenshots
                <span className="text-[9px] lowercase font-normal opacity-60">Comma-separated URLs</span>
              </label>
              <div className="space-y-2">
                <textarea 
                  value={screenshots} 
                  onChange={(e) => setScreenshots(e.target.value)} 
                  placeholder="URL1, URL2, ..." 
                  rows={3} 
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-xs focus:border-neutral-500 outline-none resize-none font-medium leading-relaxed" 
                />
                <div className="relative w-full">
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={(e) => handleUpload(e, setScreenshots, "screenshots")} 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                  <button type="button" className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer">
                    {uploading === "screenshots" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Upload className="w-3.5 h-3.5" /> Upload Screenshot</>}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section F: Publishing Config & Metadata */}
          <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/10 space-y-4 backdrop-blur-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-neutral-800/60 pb-3 flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-500" />
              Settings & Search Metadata
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

                <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-neutral-300 uppercase">Show Trust Stats</h4>
                    <p className="text-[9px] text-neutral-500">Show views, downloads, and saves counts on detail page</p>
                  </div>
                  <input type="checkbox" checked={showStats} onChange={(e) => setShowStats(e.target.checked)} className="w-4.5 h-4.5 rounded accent-white cursor-pointer" />
                </div>

                <div className="pt-4 border-t border-neutral-800 space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-[#1CB0F6]">Override Statistics</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-neutral-400 uppercase">Views</label>
                      <input 
                        type="number" 
                        value={views} 
                        onChange={(e) => setViews(e.target.value)} 
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-950 text-white text-xs outline-none" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-neutral-400 uppercase">Downloads</label>
                      <input 
                        type="number" 
                        value={downloadsCount} 
                        onChange={(e) => setDownloadsCount(e.target.value)} 
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-950 text-white text-xs outline-none" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-neutral-400 uppercase">Saves</label>
                      <input 
                        type="number" 
                        value={saves} 
                        onChange={(e) => setSaves(e.target.value)} 
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-950 text-white text-xs outline-none" 
                      />
                    </div>
                  </div>
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
                <label className="text-[10px] font-black text-neutral-400 uppercase">Build Version</label>
                <input type="text" name="version" value={version} onChange={(e) => setVersion(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-xs focus:border-neutral-500 outline-none font-mono font-medium" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
