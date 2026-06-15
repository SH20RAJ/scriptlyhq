"use client";

import { useState } from "react";
import { Play, Image as ImageIcon, Film, Eye } from "lucide-react";
import TweetEmbed from "./TweetEmbed";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ProductMediaSwitcherProps {
  videoUrl: string | null;
  previewGif: string | null;
  thumbnail: string | null;
  title: string;
}

export default function ProductMediaSwitcher({ videoUrl, previewGif, thumbnail, title }: ProductMediaSwitcherProps) {
  // Determine default tab based on priority: Video -> GIF -> Poster
  const hasVideo = !!videoUrl;
  const hasGif = !!previewGif;
  const hasPoster = !!thumbnail;

  const defaultTab = hasVideo ? "video" : hasGif ? "gif" : "poster";
  const [activeTab, setActiveTab] = useState<"video" | "gif" | "poster">(defaultTab);

  const isTweet = videoUrl?.includes("twitter.com") || videoUrl?.includes("x.com");
  const tweetId = isTweet ? videoUrl?.match(/status\/(\d+)/)?.[1] : null;

  return (
    <div className="space-y-6">
      {/* Main Media Display */}
      <div className="rounded-3xl border border-border/60 bg-black overflow-hidden shadow-2xl shadow-primary/5 transition-all">
        {activeTab === "video" && videoUrl && (
          tweetId ? (
            <div className="flex justify-center p-6 bg-neutral-950/40 min-h-[300px] items-center">
              <TweetEmbed id={tweetId} />
            </div>
          ) : (
            <AspectRatio ratio={16 / 9}>
              {videoUrl.split("?")[0].toLowerCase().endsWith(".mp4") || videoUrl.toLowerCase().includes(".mp4") ? (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                  poster={thumbnail || undefined}
                  preload="metadata"
                />
              ) : (
                <iframe
                  src={videoUrl.replace("watch?v=", "embed/").split("&")[0] + "?autoplay=1&mute=1"}
                  title={title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </AspectRatio>
          )
        )}

        {activeTab === "gif" && previewGif && (
          <AspectRatio ratio={16 / 9}>
            <img
              src={previewGif}
              alt={`${title} Preview GIF`}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </AspectRatio>
        )}

        {activeTab === "poster" && thumbnail && (
          <AspectRatio ratio={16 / 9}>
            <img
              src={thumbnail}
              alt={`${title} Poster`}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </AspectRatio>
        )}

        {!videoUrl && !previewGif && !thumbnail && (
          <AspectRatio ratio={16 / 9}>
            <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground font-black uppercase tracking-widest text-xs">
              No Media Available
            </div>
          </AspectRatio>
        )}
      </div>

      {/* Selector Thumbnails / Tabs */}
      <div className="flex flex-wrap items-center gap-3">
        {hasVideo && (
          <button
            type="button"
            onClick={() => setActiveTab("video")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "video"
                ? "bg-white text-black border-white shadow-lg"
                : "bg-neutral-900/40 text-neutral-400 border-neutral-800/80 hover:text-white hover:bg-neutral-950"
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            Watch Video
          </button>
        )}

        {hasGif && (
          <button
            type="button"
            onClick={() => setActiveTab("gif")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "gif"
                ? "bg-white text-black border-white shadow-lg"
                : "bg-neutral-900/40 text-neutral-400 border-neutral-800/80 hover:text-white hover:bg-neutral-950"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            View GIF
          </button>
        )}

        {hasPoster && (
          <button
            type="button"
            onClick={() => setActiveTab("poster")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "poster"
                ? "bg-white text-black border-white shadow-lg"
                : "bg-neutral-900/40 text-neutral-400 border-neutral-800/80 hover:text-white hover:bg-neutral-950"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Static Poster
          </button>
        )}
      </div>
    </div>
  );
}
