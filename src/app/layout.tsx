import { Metadata } from "next";
import { HexclaveProvider, HexclaveTheme } from "@hexclave/next";
import Script from "next/script";
import "@/app/globals.css";

export const metadata: Metadata = {
	title: {
		default: "ScriptlyStore - Premium Digital Products, Templates & Developer Scripts",
		template: "%s | ScriptlyStore",
	},
	description: "Ship 10x faster with ready-to-use SaaS templates, automation scripts, browser extensions, AI prompts, and digital tools. Sell your code & keep 95% of sales!",
	keywords: [
		"digital products marketplace",
		"SaaS templates",
		"source code marketplace",
		"developer scripts",
		"automation tools",
		"Chrome extensions",
		"AI prompts",
		"sell digital products",
		"developer side hustles",
		"make money programming"
	],
	metadataBase: new URL("https://scriptly.store"),
	manifest: "/manifest.json",
	alternates: {
		types: {
			"application/rss+xml": "/rss",
		},
	},
	openGraph: {
		title: "ScriptlyStore - Premium Digital Products, Templates & Developer Scripts",
		description: "Get instant access to ready-to-use SaaS templates, automation scripts, browser extensions, and AI prompts. Sell your code and keep 95% of sales!",
		type: "website",
		locale: "en_US",
		siteName: "ScriptlyStore",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "ScriptlyStore - Premium Digital Products, Templates & Developer Scripts",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "ScriptlyStore - Premium Digital Products, Templates & Developer Scripts",
		description: "Get instant access to ready-to-use SaaS templates, automation scripts, browser extensions, and AI prompts. Sell your code and keep 95% of sales!",
		images: ["/og-image.png"],
	},
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: "ScriptlyStore",
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
	themeColor: "#58CC02",
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogNavbar from "@/components/BlogNavbar";
import BlogFooter from "@/components/BlogFooter";
import { headers } from "next/headers";
import { stack } from "@/lib/stack";
import { CartProvider } from "@/components/CartContext";
import { ThemeProvider } from "@/components/ThemeProvider";

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const headersList = await headers();
	const pathname = headersList.get("x-pathname") || "";
	const isBlog = pathname.startsWith("/blog");

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800;900&family=Varela+Round&display=swap" rel="stylesheet" />
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "WebSite",
							"name": "ScriptlyStore",
							"url": "https://scriptly.store",
							"description": "Ready-to-use SaaS templates, developer scripts, design assets, and digital tools.",
							"potentialAction": {
								"@type": "SearchAction",
								"target": "https://scriptly.store/search?search={search_term_string}",
								"query-input": "required name=search_term_string"
							}
						})
					}}
				/>
			</head>
			<body className="antialiased bg-background text-foreground min-h-screen flex flex-col transition-colors duration-200">
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<HexclaveProvider app={stack}>
						<HexclaveTheme>
							<CartProvider>
								{isBlog ? <BlogNavbar /> : <Navbar />}
								<main className="flex-1">
									{children}
								</main>
								{isBlog ? <BlogFooter /> : <Footer />}
							</CartProvider>
						</HexclaveTheme>
					</HexclaveProvider>
				</ThemeProvider>
				<Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
				<Script id="clarity-tracking" strategy="afterInteractive">
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

