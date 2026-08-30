"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { caseStudies, type CaseStudy } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const accents = {
  marigold: { text: "text-marigold", dot: "bg-marigold", border: "hover:border-marigold/50", glow: "rgba(232,163,61,0.14)" },
  teal: { text: "text-teal", dot: "bg-teal", border: "hover:border-teal/50", glow: "rgba(63,185,166,0.14)" },
  terracotta: { text: "text-terracotta", dot: "bg-terracotta", border: "hover:border-terracotta/50", glow: "rgba(224,125,90,0.14)" },
} as const;

export function CaseStudies() {
  const [active, setActive] = useState<CaseStudy | null>(null);

  return (
    <section id="work" className="border-t border-line px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="02"
          eyebrow="Selected work"
          title="Systems that shipped — and the numbers they moved."
          intro="Six builds across AI agents, real-time voice, data, and infrastructure. Each one ran in production."
        />

        <Reveal>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[210px]">
            <Tile cs={caseStudies[0]} big onOpen={setActive} className="md:col-span-2 md:row-span-2" />
            <Tile cs={caseStudies[1]} onOpen={setActive} />
            <Tile cs={caseStudies[2]} onOpen={setActive} />
            <Tile cs={caseStudies[3]} onOpen={setActive} />
            <Tile cs={caseStudies[4]} onOpen={setActive} />
            <Tile cs={caseStudies[5]} onOpen={setActive} />
          </div>
        </Reveal>
      </div>

      <Modal cs={active} onClose={() => setActive(null)} />
    </section>
  );
}

/* ---------------- Tile ---------------- */
function Tile({
  cs,
  big,
  onOpen,
  className = "",
}: {
  cs: CaseStudy;
  big?: boolean;
  onOpen: (cs: CaseStudy) => void;
  className?: string;
}) {
  const a = accents[cs.accent];
  return (
    <button
      onClick={() => onOpen(cs)}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-ink-card p-6 text-left transition-colors ${a.border} ${className}`}
    >
      {/* accent glow */}
      <span
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-70 blur-2xl"
        style={{ background: a.glow }}
        aria-hidden
      />

      {/* tag */}
      <div className="relative flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${a.dot}`} />
        <span className="font-mono text-[11px] uppercase tracking-wider text-cream-dim">{cs.tag}</span>
      </div>

      {big ? (
        <div className="relative mt-4 flex flex-1 flex-col">
          <h3 className="font-display text-3xl font-medium text-cream">{cs.name}</h3>
          <p className="mt-3 max-w-md leading-relaxed text-cream-dim">{cs.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {cs.stack.slice(0, 6).map((s) => (
              <span key={s} className="rounded-md border border-line-soft bg-ink-soft px-2.5 py-1 font-mono text-xs text-cream-dim">
                {s}
              </span>
            ))}
          </div>
          <div className="mt-auto flex items-end justify-between pt-6">
            <div>
              <div className={`font-display text-5xl font-medium ${a.text}`}>{cs.metric.value}</div>
              <div className="mt-1 text-xs text-cream-dim">{cs.metric.label}</div>
            </div>
            <span className="mb-1 text-sm text-cream-dim transition-colors group-hover:text-cream">
              View details →
            </span>
          </div>
        </div>
      ) : (
        <div className="relative mt-auto">
          <h3 className="font-display text-xl font-medium text-cream">{cs.name}</h3>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <div className={`font-display text-2xl font-medium ${a.text}`}>{cs.metric.value}</div>
              <div className="mt-0.5 text-[11px] text-cream-dim">{cs.metric.label}</div>
            </div>
            <span className="text-cream-faint transition-all group-hover:translate-x-0.5 group-hover:text-cream">→</span>
          </div>
        </div>
      )}
    </button>
  );
}

/* ---------------- Detail modal ---------------- */
function Modal({ cs, onClose }: { cs: CaseStudy | null; onClose: () => void }) {
  useEffect(() => {
    if (!cs) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [cs, onClose]);

  return (
    <AnimatePresence>
      {cs && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/80 p-4 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={cs.name}
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-line bg-ink-soft p-7 sm:p-9"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalBody cs={cs} onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ModalBody({ cs, onClose }: { cs: CaseStudy; onClose: () => void }) {
  const a = accents[cs.accent];
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${a.dot}`} />
            <span className="font-mono text-xs uppercase tracking-wider text-cream-dim">{cs.tag}</span>
          </div>
          <h3 className="mt-3 font-display text-3xl font-medium text-cream">{cs.name}</h3>
          <p className="mt-1 font-mono text-xs text-cream-faint">{cs.role}</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="shrink-0 rounded-full border border-line p-2 text-cream-dim transition-colors hover:border-cream-dim hover:text-cream"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="mt-6 flex items-end gap-4 border-y border-line-soft py-5">
        <div className={`font-display text-4xl font-medium ${a.text}`}>{cs.metric.value}</div>
        <div className="pb-1 text-sm text-cream-dim">{cs.metric.label}</div>
      </div>

      <p className="mt-6 leading-relaxed text-cream-dim">{cs.summary}</p>

      <ul className="mt-5 space-y-3">
        {cs.points.map((p, i) => (
          <li key={i} className="flex gap-3 text-sm leading-relaxed text-cream-dim">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${a.dot}`} />
            {p}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-2">
        {cs.stack.map((s) => (
          <span key={s} className="rounded-md border border-line-soft bg-ink-card px-2.5 py-1 font-mono text-xs text-cream-dim">
            {s}
          </span>
        ))}
      </div>

      {cs.url && (
        <a
          href={cs.url}
          target="_blank"
          rel="noreferrer"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-marigold px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
        >
          Visit {cs.name} ↗
        </a>
      )}
    </>
  );
}
