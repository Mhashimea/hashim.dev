import { profile } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-line px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="grid h-6 w-6 place-items-center rounded-md border border-marigold/50 bg-marigold/10 font-mono text-xs text-marigold">
            h
          </span>
          <span className="font-mono text-sm text-cream-dim">
            hashim.dev — {profile.role}
          </span>
        </div>
        <p className="font-mono text-xs text-cream-faint">
          Built with Next.js, Remotion &amp; Tailwind · © 2026 {profile.name}
        </p>
      </div>
    </footer>
  );
}
