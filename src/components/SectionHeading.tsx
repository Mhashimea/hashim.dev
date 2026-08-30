import { Reveal } from "./Reveal";

export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
}: {
  index: string;
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="mb-12 max-w-2xl">
      <Reveal>
        <p className="eyebrow mb-4 flex items-center gap-3">
          <span className="text-cream-faint">{index}</span>
          <span className="h-px w-8 bg-line" />
          {eyebrow}
        </p>
        <h2 className="font-display text-3xl font-medium leading-tight text-cream sm:text-4xl">
          {title}
        </h2>
        {intro && <p className="mt-4 text-lg leading-relaxed text-cream-dim">{intro}</p>}
      </Reveal>
    </div>
  );
}
