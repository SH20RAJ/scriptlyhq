"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    question: "What percentage of sales do I keep?",
    answer:
      "You keep 95% of all direct sales. Scriptly charges a transparent 5% platform fee to cover automated digital delivery, server infrastructure, and secure payment processing. If a sale comes through an approved affiliate from our network, the affiliate commission (configurable by you, typically 30%) is deducted, leaving 65% for you.",
  },
  {
    question: "How and when do I get paid?",
    answer:
      "Payouts are processed directly to your bank account via Razorpay Route or through our automated payouts system. You can configure your beneficiary bank details or UPI in the Creator Console settings.",
  },
  {
    question: "Do I retain the intellectual property of my code?",
    answer:
      "Yes, 100%. You retain full copyright and ownership of all your code, design assets, and documentation. You are merely granting purchasers a non-exclusive license to use your code to build their applications.",
  },
  {
    question: "What file formats can I sell on Scriptly?",
    answer:
      "You can sell ZIP packages of complete source repositories, standalone scripts (.py, .ts, .sh), Figma/UI component assets, database schemas, prompt packs, or private GitHub repository invite access.",
  },
  {
    question: "Can I list free products or lead magnets?",
    answer:
      "Absolutely. You can set any product price to ₹0 / Free. Free products are featured prominently across Scriptly's /free collection and help you build an audience of developers who often convert to your paid tools.",
  },
  {
    question: "What kind of support am I expected to provide to buyers?",
    answer:
      "Scriptly products are sold as developer assets. You are expected to provide code that works as described in your README. You are not obligated to build custom features or act as an on-call consultant, though answering bug reports or clarifying setup questions in your reviews will significantly boost your creator rating.",
  },
];

export default function CreatorFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 md:py-24 border-b border-border/40">
      <div className="max-w-4xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Everything you need to know about selling
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Straightforward answers for engineers looking to monetize their software.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-black text-sm text-foreground hover:text-primary transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180 text-primary"
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/20">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
