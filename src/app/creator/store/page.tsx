export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getOrCreateDbUser } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import StoreNameEditor from "@/components/StoreNameEditor";

export const metadata: Metadata = {
  title: "Store Branding | Creator Console",
  description: "Configure your public storefront name and developer identity.",
};

export default async function CreatorStorePage() {
  const user = await getOrCreateDbUser();
  if (!user) {
    redirect("/handler/sign-in?redirectTo=/creator/store");
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
          Storefront Branding
        </h1>
        <p className="text-xs text-muted-foreground font-medium mt-1">
          Customize your public store name and developer identity on the marketplace.
        </p>
      </div>

      {/* Editor Card */}
      <div className="max-w-2xl">
        <StoreNameEditor initialStoreName={user.storeName} />
      </div>

    </div>
  );
}
