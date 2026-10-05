# This app: a website on Hono

A business website. It runs in **dev** on this machine while it is being
built, and in **production** on Cloudflare once deployed: pre-rendered to
HTML plus a small Worker. This
repository *is* the app: the site at the root, the skills that know how to
work on it in `.claude/skills/`, and `.taskandtool/setup.sh` for what the
machine needs (dependencies, the site reader, the `web` service). All of it
is the owner's to change.

Which skill to read, by what the owner asks:

- "build me a homepage", "build my site", a link to their business: `new-site`
- "change the look", "it looks generic", colours, fonts, a new logo: `design`
- a new page, the page plan, what a page should say: `pages`
- words and headlines: `writing`; the tells generated text falls into: `tropes`
- facts about the business (hours, phone, a new service), a crawl, a
  document, photos or logos sent in chat (`uploads/`, then `npm run images`): `brand`
- a blog post: the website skill's `posts.md`, with `writing`
- "help us rank for …": the website skill's `seo.md` ("Ranking for a search")
- "migrate", "rebuild", "redesign" a site they have: `migrate-site`; the
  cutover and the weekly audit: `launch-check`
- a form, a private `/admin`, a booking page, a report or chart: `forms`,
  `admin`, `booking`, `reports`, all on `data` (what they store is in the
  project's database, which the project's other apps read too)
- a small edit (a typo, a line), running, code, deploying: `website`; what production is:
  the platform's `deploy` skill

Read the one that fits the ask rather than working from memory.

## Commands

The work is in these scripts; run them rather than doing the same by hand.
Each prints what it did and what to read next.

```bash
npm run from-site -- <url>   # a first homepage's start, about a minute: reads their homepage, gallery and services page;
                             # writes the business note, the logo, their photos at web size, design tokens
                             # from their colours and fonts; prints what it wrote, kept, and what to read next
npm run parts                # what a page is built from: components and props, the classes, the page shape,
                             # the facts the notes hold, the photos and their sizes
npm run images -- <file>...  # photos into static/images/ at web size (<=2400px, ~300 KB); prints their pixels
npm run verify               # content, check, typecheck, test, build, proof, trace, lint: lists every failure at once
npm run shots [-- /path]     # the page at 1280 and 390 wide: uploads/<page>-<width>/overview.png (all of it, when
                             # longer than one image), then 01.png, 02.png … at full size;
                             # --first-screen, --width N
npm run show -- --from-shots # each page whole, one image per width, sent to the chat (without the flag it shoots again)
npm run system               # design/system.yaml -> styles/theme.css, DESIGN.md, src/fonts.ts; after any design change
npm test                     # the tests under src/ (a skill's tests arrive with its code)
npm run audit                # the crawler against dev: links, headings, alt text, titles
npm run deploy               # production, only when the owner asks (the website skill's checklist first)
```

The ones with options take `--help`. Before showing work: `npm run verify`, look at the
page with `npm run shots`, then `npm run show -- --from-shots`.

## Where things are

- `brand/` the brand as notes (`BRAND.md`), and `public/` the facts as notes
  with typed frontmatter (`FACTS.md`); the `brand` skill writes both. A fact
  lives in a note, once; `npm run content` compiles the notes for the pages.
- `design/system.yaml` the design system as one record; `npm run system`
  compiles it. Never edit `styles/theme.css`, `DESIGN.md` or `src/fonts.ts`
  by hand. Read `DESIGN.md` before designing.
- `src/site.ts` the name, tagline, logo, nav and real domain;
  `src/pages/*.tsx` the pages, listed in `src/pages/index.ts`;
  `src/layout.tsx` the head, header and footer; `src/components/` the shared
  pieces; `src/app.tsx` the Hono app.
- `site-map.md` the page plan; `raw/` a crawled site; `static/` files served
  as they are.

## The loop

- `npm run dev` is what the `web` service runs: Tailwind rebuilds the CSS
  and the server restarts on every change, so an edit is in dev on refresh.
  If the service is not running, re-run `bash ~/app/.taskandtool/setup.sh`
  (it is safe to run again).
- Commit at milestones. Never commit `dist/`, `build/`, `node_modules/`, or
  any credential.

## Rules

- Code in `src/` must run on Cloudflare (no Node built-ins, no filesystem,
  no per-request state); `src/server.ts` is the single exception. Files and
  heavy work happen at build time, on this machine.
- Colours and fonts live in `design/system.yaml`, set from the brand
  notes. Markup never carries a hex value or a Tailwind
  default colour; `npm run lint` refuses both.
- Real content only. No invented customers, quotes, numbers, awards, or
  prices; reserve an honest slot when the material does not exist yet.
