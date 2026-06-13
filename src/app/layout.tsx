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
	title: "ScriptlyHQ - Premium Digital Product Marketplace",
	description: "Discover and download high-quality Landing Pages, SaaS Templates, Ebooks, AI Prompts, UI Kits, and Development Scripts.",
	openGraph: {
		title: "ScriptlyHQ - Premium Digital Product Marketplace",
		description: "Discover and download high-quality Landing Pages, SaaS Templates, Ebooks, AI Prompts, UI Kits, and Development Scripts.",
		type: "website",
		locale: "en_US",
		siteName: "ScriptlyHQ",
	},
};

import Navbar from "../components/Navbar";
import { stack } from "../lib/stack";

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
						<Navbar />
						<main className="flex-1">
							{children}
						</main>
					</HexclaveTheme>
				</HexclaveProvider>
				<Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
			</body>
		</html>
	);
}

