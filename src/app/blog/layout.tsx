import Link from "next/link";
import { Footer } from "@/components/Footer";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-4 focus:z-50 focus:bg-ink focus:p-3">Skip to content</a>
      <header className="border-b border-line px-6">
        <nav aria-label="Blog navigation" className="mx-auto flex h-20 max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3 font-mono text-sm"><span className="grid h-7 w-7 place-items-center rounded-md border border-marigold/50 bg-marigold/10 text-marigold">h</span>hashim.dev</Link>
          <div className="flex items-center gap-6 text-sm"><Link href="/blog" className="text-marigold">Writing</Link><Link href="/#about" className="text-cream-dim hover:text-cream">About</Link></div>
        </nav>
      </header>
      {children}
      <Footer />
    </>
  );
}
