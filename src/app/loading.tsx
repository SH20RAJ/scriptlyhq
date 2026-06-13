import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-neutral-950/70 backdrop-blur-md z-50 transition-all duration-300">
      <div className="flex flex-col items-center gap-4 p-8 rounded-3xl border border-neutral-800/80 bg-neutral-900/40 shadow-2xl">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-12 h-12 rounded-full border-2 border-primary/20 animate-pulse" />
          <Loader2 className="w-8 h-8 animate-spin text-neutral-200" />
        </div>
        <p className="text-[10px] uppercase font-black tracking-[0.25em] text-neutral-400 animate-pulse">
          Loading Library
        </p>
      </div>
    </div>
  );
}
