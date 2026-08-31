"use client";

import { useEffect, useState } from "react";
import { nav, profile } from "@/lib/data";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-line bg-ink/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-md border border-marigold/50 bg-marigold/10 font-mono text-sm text-marigold">
            h
          </span>
          <span className="font-mono text-sm tracking-wide text-cream">hashim.dev</span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm text-cream-dim transition-colors hover:text-cream"
            >
              {n.label}
            </a>
          ))}
        </div>

        <a
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-marigold px-4 py-1.5 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
        >
          Connect
        </a>
      </nav>
    </header>
  );
}
