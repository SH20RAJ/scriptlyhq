import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { HexclaveProvider, HexclaveTheme } from "@hexclave/next";
import Script from "next/script";
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
	title: {
		default: "ScriptlyStore - Premium Digital Product Marketplace",
		template: "%s | ScriptlyStore",
	},
	description: "Discover and download high-quality Landing Pages, SaaS Templates, Ebooks, AI Prompts, UI Kits, and Development Scripts.",
	metadataBase: new URL("https://scriptly.store"),
	manifest: "/manifest.json",
	alternates: {
		types: {
			"application/rss+xml": "/rss",
		},
	},
	openGraph: {
		title: "ScriptlyStore - Premium Digital Product Marketplace",
		description: "Discover and download high-quality Landing Pages, SaaS Templates, Ebooks, AI Prompts, UI Kits, and Development Scripts.",
		type: "website",
		locale: "en_US",
		siteName: "ScriptlyStore",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "ScriptlyStore Premium Digital Product Marketplace",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "ScriptlyStore",
		description: "Premium Digital Product Marketplace",
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
	themeColor: "#000000",
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
};

import Navbar from "../components/Navbar";
import { stack } from "../lib/stack";
import { CartProvider } from "../components/CartContext";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="dark">
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950 text-neutral-50 min-h-screen flex flex-col`}>
				<HexclaveProvider app={stack}>
					<HexclaveTheme>
						<CartProvider>
							<Navbar />
							<main className="flex-1">
								{children}
							</main>
						</CartProvider>
					</HexclaveTheme>
				</HexclaveProvider>
				<Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
			</body>
		</html>
	);
}

