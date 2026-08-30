import { timeline } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

export function Timeline() {
  return (
    <section id="timeline" className="border-t border-line px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="03"
          eyebrow="The path"
          title="Eight years, from web dev to AI systems."
          intro="Steadily up the stack — from websites to distributed backends to the AI-agent platforms I build today."
        />

        <ol className="relative ml-1">
          {/* spine */}
          <span className="absolute left-[6px] top-2 bottom-2 w-px bg-line" aria-hidden />
          {timeline.map((t, i) => (
            <li key={`${t.org}-${i}`} className="relative pl-10 pb-10 last:pb-0">
              <Reveal delay={i * 0.04}>
                <span
                  className={`absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 ${
                    t.now
                      ? "border-marigold bg-marigold"
                      : "border-line bg-ink"
                  }`}
                  aria-hidden
                />
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-5">
                  <span className="shrink-0 font-mono text-sm text-marigold sm:w-28">{t.year}</span>
                  <div>
                    <h3 className="text-base font-medium text-cream">
                      {t.role}
                      {t.now && (
                        <span className="ml-2 rounded-full border border-teal/40 bg-teal/10 px-2 py-0.5 align-middle font-mono text-[10px] uppercase tracking-wider text-teal">
                          now
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-cream-dim">{t.org}</p>
                    {t.note && <p className="mt-1 text-sm text-cream-faint">{t.note}</p>}
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
