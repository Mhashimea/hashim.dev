import { profile } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const channels = [
  {
    label: "LinkedIn",
    handle: "hashim-ea",
    meta: `${profile.followers} followers`,
    href: profile.linkedin,
    accent: "text-teal",
  },
  {
    label: "X",
    handle: "@hashim_ea",
    meta: "Building in public",
    href: profile.x,
    accent: "text-marigold",
  },
  {
    label: "GitHub",
    handle: "Mhashimea",
    meta: "Open source & experiments",
    href: profile.github,
    accent: "text-cream",
  },
  {
    label: "Blog",
    handle: "Notes on building agents",
    meta: "Coming soon",
    href: "#contact",
    accent: "text-terracotta",
    soon: true,
  },
  {
    label: "YouTube",
    handle: "Build-in-public",
    meta: "Coming soon",
    href: "#contact",
    accent: "text-teal",
    soon: true,
  },
];

export function ContentHub() {
  return (
    <section id="writing" className="border-t border-line px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="04"
          eyebrow="In public"
          title="I build in the open."
          intro="I automate my own software factory and share what works — agents, MCP, voice, and the messy production details in between."
        />
        <div className="flex flex-wrap justify-center gap-4">
          {channels.map((c, i) => (
            <Reveal
              key={c.label}
              delay={i * 0.05}
              className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)]"
            >
              <a
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                className="group flex h-full flex-col justify-between rounded-2xl border border-line bg-ink-card p-6 transition-colors hover:border-cream-dim/40"
              >
                <div className="flex items-center justify-between">
                  <span className={`font-display text-xl font-medium ${c.accent}`}>{c.label}</span>
                  <span className="text-cream-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    {c.soon ? "" : "↗"}
                  </span>
                </div>
                <div className="mt-10">
                  <p className="font-mono text-sm text-cream">{c.handle}</p>
                  <p className="mt-1 text-xs text-cream-dim">{c.meta}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
