"use client";

import { useState, useEffect } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ProductScreenshotsProps {
  screenshots: string[];
  productTitle: string;
}

export default function ProductScreenshots({ screenshots, productTitle }: ProductScreenshotsProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const openModal = (index: number) => {
    setActiveIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setActiveIndex(null);
    document.body.style.overflow = "";
  };

  const nextImage = () => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % screenshots.length);
  };

  const prevImage = () => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex - 1 + screenshots.length) % screenshots.length);
  };

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex]);

  // Clean up overflow style on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!screenshots || screenshots.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Grid view of screenshots */}
      <div className="grid grid-cols-3 gap-4">
        {screenshots.map((src, i) => (
          <AspectRatio
            key={i}
            ratio={16 / 9}
            className="rounded-xl border border-border/40 bg-muted overflow-hidden group cursor-zoom-in shadow-sm"
            onClick={() => openModal(i)}
          >
            <img
              src={src}
              alt={`${productTitle} screenshot ${i + 1}`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </AspectRatio>
        ))}
      </div>

      {/* Fullscreen Lightbox Overlay */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-center items-center select-none animate-in fade-in duration-200"
          onClick={closeModal}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors cursor-pointer p-3 rounded-full hover:bg-white/10 z-50 border border-white/10 bg-black/20"
            onClick={(e) => {
              e.stopPropagation();
              closeModal();
            }}
            aria-label="Close preview"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Arrow Navigation */}
          {screenshots.length > 1 && (
            <button
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors cursor-pointer p-4 rounded-full hover:bg-white/10 z-50 border border-white/10 bg-black/20"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              aria-label="Previous screenshot"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Screenshot container */}
          <div
            className="relative max-w-[85vw] max-h-[80vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={screenshots[activeIndex]}
              alt={`${productTitle} screenshot ${activeIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200"
            />
          </div>

          {/* Right Arrow Navigation */}
          {screenshots.length > 1 && (
            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors cursor-pointer p-4 rounded-full hover:bg-white/10 z-50 border border-white/10 bg-black/20"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              aria-label="Next screenshot"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Bottom indicator */}
          <div className="absolute bottom-6 text-white/50 text-xs font-semibold tracking-widest uppercase">
            {activeIndex + 1} / {screenshots.length}
          </div>
        </div>
      )}
    </div>
  );
}
