import { Metadata } from "next";
import ClientHome from "@/components/ClientHome";

export const metadata: Metadata = {
  title: "ScriptlyStore - Premium Digital Products, Templates & Developer Scripts",
  description: "Ship 10x faster with ready-to-use SaaS templates, automation scripts, browser extensions, AI prompts, and digital tools. Sell your code & keep 95% of sales!",
  alternates: {
    canonical: "https://scriptly.store",
  },
};

interface PageProps {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    search?: string;
    priceType?: "all" | "free" | "paid";
    sortBy?: "newest" | "rating" | "price_asc" | "price_desc";
    page?: string;
  }>;
}

export default function Page({ searchParams }: PageProps) {
  return <ClientHome searchParams={searchParams} />;
}
