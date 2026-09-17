import { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, UserCheck } from "lucide-react";
import { CyberBackground } from "@/components/ui/CyberBackground";

export const metadata: Metadata = {
  title: "Account & Authentication | ScriptlyStore",
  description: "Secure account authentication and profile management on ScriptlyStore.",
};

interface AuthLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    stack?: string[];
  }>;
}

export default async function AuthLayout({ children, params }: AuthLayoutProps) {
  const resolvedParams = await params;
  const stack = resolvedParams.stack || [];
  const currentRoute = stack[0] || "";
  const isAccountSettings = currentRoute === "account-settings";

  if (isAccountSettings) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between relative overflow-hidden">
        <CyberBackground />

        <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 md:py-14 space-y-6 relative z-10">
          {/* Breadcrumb / Back Link */}
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Customer Inventory</span>
            </Link>

            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3" /> Hexclave Secured
            </span>
          </div>

          {/* Clean Header */}
          <div className="border-b border-border/40 pb-5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Account Settings
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Manage your developer profile, linked emails, multi-factor authentication, and active sessions.
            </p>
          </div>

          {/* Spacious Settings Surface */}
          <div className="rounded-3xl border border-border/50 bg-card/35 backdrop-blur-xl p-5 sm:p-8 shadow-sm overflow-hidden min-h-[500px]">
            <div className="hexclave-auth-container w-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Auth pages (sign-in, sign-up, forgot-password, etc.)
  const isSignUp = currentRoute === "sign-up";
  const isForgotPassword = currentRoute === "forgot-password";

  let title = "Welcome Back";
  let subtitle = "Sign in to access your digital assets and scripts";

  if (isSignUp) {
    title = "Create Account";
    subtitle = "Join ScriptlyStore to download and sell developer assets";
  } else if (isForgotPassword) {
    title = "Reset Password";
    subtitle = "Enter your email to receive recovery instructions";
  }

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background text-foreground">
      <CyberBackground />

      <div className="w-full max-w-[460px] z-10 space-y-6">
        <div className="rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-2">
              <div className="w-5 h-5 rounded-lg bg-primary shadow-sm" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">{title}</h1>
            <p className="text-xs text-muted-foreground font-medium">{subtitle}</p>
          </div>

          <div className="hexclave-auth-container">
            {children}
          </div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground font-bold tracking-wider uppercase">
          Cloud Authentication by ScriptlyStore
        </p>
      </div>
    </div>
  );
}
