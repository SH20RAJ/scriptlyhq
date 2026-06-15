import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Razorpay Route Splits | ScriptlyStore",
  description: "Comprehensive developer and user documentation on automated payment splits, bank onboarding, and checkouts via Razorpay Route.",
};

export default function RouteGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
