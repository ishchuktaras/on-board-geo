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
  title: "GEO Optima | Generative Engine Optimization",
  description: "Optimalizujte svou značku pro umělou inteligenci. Zajistíme, aby vás ChatGPT, Perplexity a další LLM modely doporučovaly vašim zákazníkům.",
  keywords: ["GEO", "Generative Engine Optimization", "AI SEO", "LLM optimalizace", "marketingová agentura", "ChatGPT marketing"],
  authors: [{ name: "Taras Ishchuk" }],
  openGraph: {
    title: "GEO Optima | Budoucnost vyhledávání je AI",
    description: "Tradiční SEO umírá. Připravte svůj byznys na generativní vyhledávače.",
    url: "https://on-board-geo-eagn.vercel.app/",
    siteName: "GEO Optima",
    locale: "cs_CZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GEO Optima | Generative Engine Optimization",
    description: "Optimalizujte svou značku pro ChatGPT a Perplexity.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}