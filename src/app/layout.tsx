import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ScriptlyHQ | Landing Pages you can Buy, Customize, & Launch Fast",
  description: "Buy ready-made landing pages, customize them for your brand, or get a new one built from scratch. Premium, high-converting templates for SaaS, restaurants, clinics, dentists, gyms, salons, and local businesses.",
  keywords: [
    "landing page templates India",
    "buy landing page template",
    "custom landing page design",
    "website templates for restaurants",
    "website templates for clinics",
    "affordable landing page designer",
    "landing page agency India",
    "ScriptlyHQ",
    "strivio.world",
    "lead generation landing page"
  ],
  authors: [{ name: "ScriptlyHQ Team", url: "https://scriptlyhq.strivio.world" }],
  openGraph: {
    title: "ScriptlyHQ | Landing Pages you can Buy, Customize, & Launch Fast",
    description: "Ready-made landing pages or custom builds for local businesses, SaaS, creators, and clinics. Get customized launches in days.",
    url: "https://scriptlyhq.strivio.world",
    siteName: "ScriptlyHQ",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
