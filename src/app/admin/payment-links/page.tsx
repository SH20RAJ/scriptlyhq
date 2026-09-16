import { Metadata } from "next";
import { isAdmin } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { getAdminPaymentLinksAction, getPaymentLinkActivitiesAction } from "@/lib/actions/payment-links";
import AdminPaymentLinksManager from "@/components/admin/AdminPaymentLinksManager";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Payment Links & Instant Checkouts | Admin Console",
  description: "Create and track custom payment links with automated post-payment redirection.",
};

export default async function AdminPaymentLinksPage() {
  const authorized = await isAdmin();
  if (!authorized) {
    redirect("/");
  }

  const [links, activities] = await Promise.all([
    getAdminPaymentLinksAction(),
    getPaymentLinkActivitiesAction(50),
  ]);

  const headersList = await headers();
  const host = headersList.get("host") || "scriptly.store";
  const protocol = host.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <AdminPaymentLinksManager
        initialLinks={links}
        initialActivities={activities}
        origin={origin}
      />
    </div>
  );
}
