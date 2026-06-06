"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { FAQS } from "@/data";

export default function FaqSection() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {FAQS.map((faq, index) => {
        const isOpen = activeFaq === index;
        return (
          <div
            key={index}
            className="rounded-2xl border border-white/5 bg-gray-900/20 overflow-hidden"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none transition-colors hover:bg-white/5"
            >
              <span className="font-semibold text-white text-sm sm:text-base">
                {faq.question}
              </span>
              {isOpen ? (
                <Minus className="h-4 w-4 text-brand-emerald shrink-0" />
              ) : (
                <Plus className="h-4 w-4 text-brand-indigo shrink-0" />
              )}
            </button>
            {isOpen && (
              <div className="px-6 pb-6 text-sm sm:text-base text-gray-400 border-t border-white/5 pt-4 leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
