# hashim.dev

Personal portfolio for Muhammed Hashim EA — AI & backend engineer.
Next.js 16 · React 19 · Tailwind v4 · Motion · Remotion.

## Run

```bash
npm run dev      # dev server (http://localhost:3000)
npm run build    # production build
npm start        # serve the build
```

## Structure

```
src/
  app/            layout, globals.css (design tokens), page.tsx, icon.svg
  lib/data.ts     ALL site content — edit here to update copy/case studies
  remotion/       AgentWorkshop.tsx — the animated hero composition
  components/     Nav, Hero, CaseStudies, Timeline, ContentHub, About, Contact, Footer
```

All colors, fonts, and spacing derive from the `@theme` tokens in
`src/app/globals.css`. Content lives in `src/lib/data.ts`.

## Deploy

Push to GitHub and import into Vercel (zero config for Next.js).
Point the `hashim.dev` domain at the Vercel project.
