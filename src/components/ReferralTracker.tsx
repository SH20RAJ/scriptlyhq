"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { recordReferralClickAction } from "@/lib/actions/affiliates";

function TrackerContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (!ref) return;

    // Prevent duplicate click tracking in the same browser session
    const trackingKey = `ref_tracked_${ref}_${pathname}`;
    if (sessionStorage.getItem(trackingKey)) return;

    recordReferralClickAction({
      ref,
      referrerUrl: typeof document !== "undefined" ? document.referrer : undefined,
    }).then((res) => {
      if (res.success) {
        sessionStorage.setItem(trackingKey, "true");
      }
    });
  }, [searchParams, pathname]);

  return null;
}

export default function ReferralTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerContent />
    </Suspense>
  );
}
