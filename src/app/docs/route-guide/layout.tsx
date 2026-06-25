import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Razorpay Route Splits Guide",
  description: "Learn how ScriptlyStore uses Razorpay Route to dynamically split customer checkout payments for instant creator payouts.",
  alternates: {
    canonical: "https://scriptly.store/docs/route-guide",
  },
};

export default function RouteGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
