# This app: a website on Hono

A business website. It runs in **dev** on this machine while it is being
built, and in **production** on Cloudflare once deployed, as pre-rendered
HTML plus a small Worker. This
repository *is* the app: the site at the root, the skills that know how to
work on it in `.claude/skills/`, and `.taskandtool/setup.sh` for what the
machine needs (dependencies, the site reader, the `web` service). All of it
is the owner's to change.

Which skill to read, by what the owner asks:

- "build me a homepage", "build my site", "redesign my site", a link to their
  business: `new-site` (a new site, homepage first, even when they have one)
- "change the look", "it looks generic", colours, fonts, a new logo: `design`
- a new page, the page plan, what a page should say, a page's code: `pages`
- words and headlines: `writing`; the tells of generated text: `tropes`
- facts about the business (hours, phone, a new service), a crawl, a
  document, photos or logos sent in chat (`uploads/`, then `npm run images`): `brand`
- a blog post: the website skill's `references/posts.md`, with `writing`
- "help us rank for …": the website skill's `references/seo.md` ("Ranking for a search")
- "migrate", "move", "clone" or "rebuild" a site they have, keeping its pages
  and URLs: `migrate-site`; the cutover and the weekly audit: `launch-check`
- "is it ready to go live": the website skill's checklist before each
  deploy; a migrated site also `launch-check`
- a form, a private `/admin`, a booking page, a report or chart: `forms`,
  `admin`, `booking`, `reports`, all on `data` (what they store is in the
  project's database, which the project's other apps read too)
- "take orders", "an order page", a form with steps, "a paid appointment
  with a few questions": `forms` (an order is a form: its items, a booking
  step, a payment step), then `payments` for the Stripe key and webhook
- "take payment", a deposit, a refund: `payments`, with `forms` or
  `booking` for what is paid for
- a small edit (a typo, a line), running, code, deploying: `website`; what production is:
  the platform's `deploy` skill

Read the one that fits the ask rather than working from memory.

## Commands

The work is in these scripts; run them rather than doing the same by hand.
Each prints what it did and what to read next.

```bash
npm run from-site -- <url>   # a first homepage's start (a minute): their facts, logo, photos, colours, fonts and proof
                             # into the notes and the record; prints what it wrote and what to read next
npm run parts                # what a page is built from: components, classes, facts, photos; read it, not the source
npm run images -- <file>...  # photos into static/images/ at web size (<=2400px, ~300 KB); prints their pixels
npm run verify               # content, check, typecheck, test, build, proof, trace, lint: lists every failure at once
npm run shots [-- /path]     # the page at 1280 and 390 wide in uploads/<page>-<width>/; prints which image to read first
npm run show -- --from-shots # each page whole, one image per width, sent to the chat (without the flag it shoots again)
npm run system               # design/system.yaml -> styles/theme.css, DESIGN.md, src/fonts.ts; after any design change
npm test                     # the tests: the skills' in src/ (they arrive with the code), the scripts' in test/, tropes'
npm run audit                # the crawler against dev: links, headings, alt text, titles
node scripts/forms.mjs list  # the project's forms and what came in; show, save, submissions: --help
npm run db:setup             # the forms, booking and payments tables (dev start and deploy run it)
npm run deploy               # production, only when the owner asks (the website skill's checklist first)
```

Each one with options takes `--help`. Before showing work, run `npm run verify`,
look at the page with `npm run shots`, then run `npm run show -- --from-shots`.
For a small edit, fix it at its source (the note, the brief or the page), then
run the same three for that page.

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
- `src/business.tsx` mounts forms (with booking and payment steps), `/book`,
  Stripe's webhook and the private `/admin`, all on the project's database;
  until it has one, the forms and `/book` answer 404 and `/admin` tells the
  team so. The code under
  `src/data`, `admin`, `forms`, `booking`, `payments` belongs to those
  skills and is refreshed from them.
- `site-map.md` the page plan; `raw/` a crawled site; `static/` files served
  as they are.

## The loop

- `npm run dev` is what the `web` service runs: Tailwind rebuilds the CSS
  and the server restarts on every change, so an edit is in dev on refresh.
  If the service is not running, re-run `bash ~/app/.taskandtool/setup.sh`
  (it is safe to run again).
- Commit at milestones. Never commit `dist/`, `build/`, `node_modules/`, or
  any credential. Pushing to GitHub is the owner's call.

## Rules

- Code the Worker reaches from `src/worker.ts` must run on Cloudflare (no
  Node built-ins, no filesystem, no per-request state); `src/server.ts`, a
  skill's command code and tests are machine only (`npm run check`). Files and
  heavy work happen at build time, on this machine.
- Colours and fonts live in `design/system.yaml`, set from the brand
  notes. Markup never carries a hex value or a Tailwind
  default colour; `npm run lint` refuses both.
- Real content only. No invented customers, quotes, numbers, awards, or
  prices; reserve an honest slot when the material does not exist yet.
  `npm run trace` fails on a number or quote the notes do not hold.
