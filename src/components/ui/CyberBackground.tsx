import React from "react";

/**
 * Minimal, high-performance ambient grid background.
 * Zero client-side JavaScript execution, no Framer Motion infinite CPU loops.
 */
export const CyberBackground = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-50 pointer-events-none select-none overflow-hidden"
    >
      {/* Subtle clean developer grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    </div>
  );
};
