import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ChatWidget } from "@/components/ChatWidget";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://hashim.dev"),
  title: "Hashim — I build AI agents and the backend that runs them",
  description:
    "Muhammed Hashim EA — software & AI engineer with 8+ years shipping production systems. I build AI agent platforms, real-time voice agents, and the backends behind them.",
  openGraph: {
    title: "Hashim — AI & Backend Engineer",
    description:
      "I build AI agent platforms, real-time voice agents, and the backends that run them. 8+ years.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrument.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ink font-sans text-cream selection:bg-marigold/30 selection:text-cream">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
