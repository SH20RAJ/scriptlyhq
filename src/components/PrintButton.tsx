"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton() {
  return (
    <Button
      onClick={() => window.print()}
      size="sm"
      className="rounded-full h-10 px-6 font-bold uppercase tracking-widest text-[10px] shadow-lg hover:shadow-xl transition-all"
    >
      <Printer className="w-3.5 h-3.5 mr-2" />
      Print Invoice / Save PDF
    </Button>
  );
}
