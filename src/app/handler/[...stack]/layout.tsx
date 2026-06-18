import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to access your ScriptlyStore digital assets and downloads.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      
      <div className="w-full max-w-[440px] z-10">
        <div className="bg-neutral-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-3 shadow-2xl shadow-black/50">
          <div className="bg-neutral-900/80 border border-white/5 rounded-[2rem] overflow-hidden p-4 sm:p-8">
            <div className="mb-8 text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <div className="w-6 h-6 bg-emerald-400 rounded-lg shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Welcome Back</h1>
              <p className="text-sm text-neutral-400">Sign in to access your digital assets</p>
            </div>
            
            <div className="hexclave-auth-container">
              {children}
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-center text-xs text-neutral-500 font-medium tracking-wide uppercase">
          Secure Cloud Authentication by ScriptlyStore
        </p>
      </div>
    </div>
  );
}
