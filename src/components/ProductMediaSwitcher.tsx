"use client";

import { useState } from "react";
import { Play, Image as ImageIcon, Film, Eye } from "lucide-react";
import TweetEmbed from "./TweetEmbed";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";

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
  const [isPlaying, setIsPlaying] = useState(false);

  const isTweet = videoUrl?.includes("twitter.com") || videoUrl?.includes("x.com");
  const tweetId = isTweet ? videoUrl?.match(/status\/(\d+)/)?.[1] : null;

  const handleTabChange = (tab: "video" | "gif" | "poster") => {
    setActiveTab(tab);
    if (tab !== "video") {
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Media Display */}
      <div className="rounded-3xl border border-border/60 bg-black overflow-hidden shadow-2xl shadow-primary/5 transition-all">
        {activeTab === "video" && videoUrl && (
          tweetId ? (
            <div className="flex justify-center p-6 bg-neutral-950/40 min-h-[300px] items-center">
              <TweetEmbed id={tweetId} />
            </div>
          ) : !isPlaying ? (
            <AspectRatio ratio={16 / 9}>
              <div 
                className="absolute inset-0 w-full h-full cursor-pointer group overflow-hidden"
                onClick={() => setIsPlaying(true)}
              >
                {/* Poster / Thumbnail Background */}
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={`${title} video poster`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                ) : (
                  <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center" />
                )}
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
                
                {/* Play Button Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/95 text-white flex items-center justify-center shadow-xl shadow-primary/20 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                    <Play className="w-7 h-7 fill-white translate-x-0.5" />
                  </div>
                </div>

                {/* Badge Overlay */}
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-primary animate-pulse" />
                  <span>Click to watch preview</span>
                </div>
              </div>
            </AspectRatio>
          ) : (
            <AspectRatio ratio={16 / 9}>
              {videoUrl.split("?")[0].toLowerCase().endsWith(".mp4") || videoUrl.toLowerCase().includes(".mp4") ? (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="absolute inset-0 w-full h-full object-cover"
                  poster={thumbnail || undefined}
                  preload="auto"
                />
              ) : (
                <iframe
                  src={videoUrl.replace("watch?v=", "embed/").split("&")[0] + "?autoplay=1"}
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
          <Button
            variant={activeTab === "video" ? "default" : "outline"}
            onClick={() => handleTabChange("video")}
            className="cursor-pointer font-bold h-10 rounded-xl px-5"
          >
            <Play className="w-3.5 h-3.5 mr-1" />
            Watch Video
          </Button>
        )}

        {hasGif && (
          <Button
            variant={activeTab === "gif" ? "default" : "outline"}
            onClick={() => handleTabChange("gif")}
            className="cursor-pointer font-bold h-10 rounded-xl px-5"
          >
            <Film className="w-3.5 h-3.5 mr-1" />
            View GIF
          </Button>
        )}

        {hasPoster && (
          <Button
            variant={activeTab === "poster" ? "default" : "outline"}
            onClick={() => handleTabChange("poster")}
            className="cursor-pointer font-bold h-10 rounded-xl px-5"
          >
            <ImageIcon className="w-3.5 h-3.5 mr-1" />
            Static Poster
          </Button>
        )}
      </div>
    </div>
  );
}
