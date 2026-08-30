"use client";

import { Player } from "@remotion/player";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { AgentWorkshop, WORKSHOP } from "@/remotion/AgentWorkshop";
import { profile, stats } from "@/lib/data";
import { Avatar } from "./Avatar";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [l1, l2] = profile.headline.split("\n");

  return (
    <section id="top" className="relative overflow-hidden px-6 pt-28 pb-16 md:pt-36">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.02fr_1fr] lg:gap-8">
        {/* left — thesis */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="mb-6 flex items-center gap-3">
            <Avatar size={46} ring={false} />
            <span className="text-sm text-cream-dim">
              Hi, I&apos;m <span className="font-medium text-cream">Hashim</span> 👋
            </span>
          </motion.div>

          <motion.p variants={item} className="eyebrow mb-6 flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal" />
            AI &amp; Backend Engineer
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display text-[2.6rem] font-medium leading-[1.04] text-cream sm:text-6xl"
          >
            {l1}
            <br />
            <span className="relative inline-block">
              {l2}
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="10"
                viewBox="0 0 300 10"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M2 7 C 80 2, 220 2, 298 6"
                  stroke="#e8a33d"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p variants={item} className="mt-8 max-w-md text-lg leading-relaxed text-cream-dim">
            {profile.sub}
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="rounded-full bg-marigold px-6 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
            >
              Let&apos;s build something →
            </a>
            <a
              href="#work"
              className="rounded-full border border-line px-6 py-3 text-sm font-medium text-cream transition-colors hover:border-cream-dim"
            >
              See the work
            </a>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-8 flex items-center gap-2 text-sm text-cream-dim"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
            </span>
            Available for select freelance &amp; consulting
          </motion.div>
        </motion.div>

        {/* right — the signature animated workshop */}
        <motion.figure
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="overflow-hidden rounded-[26px] border border-marigold/25 bg-ink-soft p-2 shadow-2xl shadow-black/40">
            <div className="aspect-[1200/720] w-full overflow-hidden rounded-[18px]">
              {mounted ? (
                <Player
                  component={AgentWorkshop}
                  durationInFrames={WORKSHOP.durationInFrames}
                  fps={WORKSHOP.fps}
                  compositionWidth={WORKSHOP.width}
                  compositionHeight={WORKSHOP.height}
                  autoPlay
                  loop
                  clickToPlay={false}
                  acknowledgeRemotionLicense
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <div className="h-full w-full animate-pulse bg-ink-card" />
              )}
            </div>
          </div>
          <figcaption className="mt-3 text-center font-mono text-xs text-cream-faint">
            my studio — delegating the busywork to a few good agents
          </figcaption>
        </motion.figure>
      </div>

      {/* stats strip */}
      <div className="mx-auto mt-16 max-w-6xl border-t border-line pt-8">
        <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="font-display text-3xl font-medium text-cream md:text-4xl">{s.value}</dt>
              <dd className="mt-1 text-sm text-cream-dim">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
