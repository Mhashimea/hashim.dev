import { services, profile } from "@/lib/data";
import { Reveal } from "./Reveal";

export function Contact() {
  return (
    <section id="contact" className="border-t border-line px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          {/* pitch + CTA */}
          <div>
            <Reveal>
              <p className="eyebrow mb-4">Work with me</p>
              <h2 className="font-display text-4xl font-medium leading-[1.1] text-cream sm:text-5xl">
                Have an AI idea that needs to actually ship?
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-cream-dim">
                I take on a small number of freelance and consulting engagements — from a focused build
                to standing up your agent platform end to end. Let&apos;s connect.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-marigold px-6 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
                >
                  Connect on LinkedIn →
                </a>
                <a
                  href={`mailto:${profile.email}?subject=Project%20enquiry`}
                  className="rounded-full border border-line px-6 py-3 text-sm font-medium text-cream transition-colors hover:border-cream-dim"
                >
                  Email me
                </a>
              </div>
              <div className="mt-8 flex gap-5 text-sm text-cream-dim">
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-cream">
                  LinkedIn
                </a>
                <a href={profile.x} target="_blank" rel="noreferrer" className="hover:text-cream">
                  X
                </a>
                <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-cream">
                  GitHub
                </a>
                <a href={`mailto:${profile.email}`} className="hover:text-cream">
                  {profile.email}
                </a>
              </div>
            </Reveal>
          </div>

          {/* services */}
          <Reveal delay={0.15}>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
              {services.map((s) => (
                <div key={s.title} className="bg-ink-card p-6">
                  <h3 className="font-display text-lg font-medium text-cream">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream-dim">{s.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
