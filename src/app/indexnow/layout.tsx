import { Metadata } from "next";

export const metadata: Metadata = {
  title: "IndexNow Console",
  description: "Submit URLs to IndexNow for instant search engine indexing.",
  robots: { index: false, follow: false },
};

export default function IndexNowLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
