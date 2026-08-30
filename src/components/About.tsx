import { skills, profile } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { Avatar } from "./Avatar";

export function About() {
  return (
    <section id="about" className="border-t border-line px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="01" eyebrow="About" title="Backend depth, meet applied AI." />

        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Reveal>
            <div className="mb-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <Avatar size={168} />
              <div>
                <p className="font-display text-2xl font-medium text-cream">{profile.name}</p>
                <p className="mt-1 text-cream-dim">{profile.role}</p>
              </div>
            </div>
            <div className="space-y-5 text-lg leading-relaxed text-cream-dim">
              <p>
                I&apos;m Hashim — a software engineer with {profile.years} years behind me. I started out
                building websites, grew into architecting distributed backends, and now build the AI
                systems and <span className="text-cream">pipelines</span> that do the work: agent
                platforms, automations, and the infrastructure that runs them.
              </p>
              <p>
                I&apos;m obsessed with turning slow, manual work into{" "}
                <span className="text-cream">automated pipelines</span>. I build multi-agent
                orchestration, RAG, and real-time voice systems for customers — and right now I&apos;m{" "}
                <span className="text-cream">automating my own software factory</span> the same way:
                building agents that plan, write, test, and review code, wired into CI/CD through MCP.
                The goal is simple — let the busywork run itself so I can focus on the systems that matter.
              </p>
              <p>
                I co-founded <span className="text-cream">Flowtrail AI</span> and I build in public —
                sharing the agents, automations, and pipelines I run every day. If you want to put AI to
                work in your product or your workflow, I can help you get it shipped.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-line bg-ink-card p-6 sm:p-8">
              <p className="eyebrow mb-6">Toolkit</p>
              <dl className="space-y-5">
                {skills.map((s) => (
                  <div key={s.group} className="grid grid-cols-[7rem_1fr] gap-3 border-b border-line-soft pb-4 last:border-0 last:pb-0">
                    <dt className="font-mono text-xs uppercase tracking-wider text-cream-faint">
                      {s.group}
                    </dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {s.items.map((it) => (
                        <span key={it} className="text-sm text-cream-dim">
                          {it}
                          <span className="text-cream-faint">{" · "}</span>
                        </span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
