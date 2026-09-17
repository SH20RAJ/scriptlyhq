import { Metadata } from "next";
import { Inter } from "next/font/google";
import { HexclaveProvider, HexclaveTheme } from "@hexclave/next";
import Script from "next/script";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { stack } from "@/lib/stack";
import { CartProvider } from "@/components/CartContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import ReferralTracker from "@/components/ReferralTracker";
import { siteConfig } from "@/config/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — Premium Developer Marketplace`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "developer marketplace",
    "SaaS templates",
    "developer scripts",
    "automation tools",
    "open source boilerplate",
    "Next.js templates",
    "React components",
    "sell developer tools",
  ],
  metadataBase: new URL(siteConfig.url),
  manifest: "/manifest.json",
  alternates: {
    types: {
      "application/rss+xml": "/rss",
    },
  },
  openGraph: {
    title: `${siteConfig.name} — Premium Developer Marketplace`,
    description: siteConfig.description,
    type: "website",
    locale: "en_US",
    siteName: siteConfig.name,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — Developer Templates & Scripts`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Premium Developer Marketplace`,
    description: siteConfig.description,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  authors: [{ name: "Shaswat Raj", url: "https://github.com/SH20RAJ" }],
  creator: "Shaswat Raj",
  publisher: "ScriptlyStore",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteConfig.name,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#090D12" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": siteConfig.name,
              "url": siteConfig.url,
              "description": siteConfig.description,
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${siteConfig.url}/search?search={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="antialiased bg-background text-foreground min-h-screen flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <HexclaveProvider app={stack}>
            <HexclaveTheme>
              <CartProvider>
                <ReferralTracker />
                <Navbar />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </CartProvider>
            </HexclaveTheme>
          </HexclaveProvider>
        </ThemeProvider>
        <Script id="clarity-tracking" strategy="lazyOnload">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "x8jtg1lfg7");
          `}
        </Script>
      </body>
    </html>
  );
}
