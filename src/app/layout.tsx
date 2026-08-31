import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ChatWidget } from "@/components/ChatWidget";
import { profile } from "@/lib/data";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const TITLE = "Hashim — AI & Backend Engineer";
const DESCRIPTION =
  "Muhammed Hashim EA — software & AI engineer with 8+ years shipping production systems. I build AI agent platforms, real-time voice agents, RAG, and the backends behind them. Available for freelance & consulting.";

export const metadata: Metadata = {
  metadataBase: new URL("https://hashim.dev"),
  title: {
    default: TITLE,
    template: "%s · Hashim",
  },
  description: DESCRIPTION,
  applicationName: "hashim.dev",
  keywords: [
    "Hashim",
    "Muhammed Hashim EA",
    "AI engineer",
    "backend engineer",
    "AI agents",
    "LLM orchestration",
    "RAG",
    "real-time voice agents",
    "Next.js",
    "TypeScript",
    "freelance AI engineer",
    "AI consultant Dubai",
  ],
  authors: [{ name: profile.name, url: "https://hashim.dev" }],
  creator: profile.name,
  publisher: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://hashim.dev",
    siteName: "hashim.dev",
    locale: "en_US",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@hashim_ea",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  alternateName: "Hashim",
  url: "https://hashim.dev",
  image: "https://hashim.dev/profile-image.png",
  jobTitle: "AI & Backend Engineer",
  description: DESCRIPTION,
  sameAs: [profile.linkedin, profile.x, profile.github],
  knowsAbout: [
    "AI agents",
    "LLM orchestration",
    "Retrieval-Augmented Generation",
    "Real-time voice agents",
    "Backend architecture",
    "Next.js",
    "TypeScript",
    "Python",
  ],
  worksFor: { "@type": "Organization", name: "Flowtrail AI", url: "https://flowtrail.ai" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrument.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ink font-sans text-cream selection:bg-marigold/30 selection:text-cream">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
