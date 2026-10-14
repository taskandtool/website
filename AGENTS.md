# This app: a website on Hono

A business website: dev on this machine while it is built, production on
Cloudflare (pre-rendered HTML plus a small Worker) once deployed. The
repository is the app: the site, its skills in `.claude/skills/`, and
`.taskandtool/setup.sh`; all of it is the owner's to change.

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
  and URLs: `migrate-site`; the cutover and the weekly audit: `cutover-check`
- "is it ready to go live": the website skill's checklist before each
  deploy; a migrated site also `cutover-check`
- a form, an order, a booking page, payments, `/admin`, customers' notes,
  a report or chart: `forms`, `booking`, `payments`, `admin`, `customers`,
  `reports`, all on `data`. An order or a paid appointment is a form with
  steps; `payments` adds the Stripe key and webhook.
- a small edit (a typo, a line), running, code, deploying: `website`; what production is:
  the platform's `deploy` skill

Read the one that fits the ask rather than working from memory.

## Commands

The work is in these scripts; run them rather than doing the same by hand or
writing a checker of your own. Each prints what it did and what to read next.
The machine's one browser is tt-crawl's (shots, check, audit); install no other.

```bash
npm run from-site -- <url>   # a first homepage's start (a minute): their facts, logo, photos, colours, fonts and proof
                             # into the notes and the record; prints what it wrote and what to read next
npm run parts                # what a page is built from: components, classes, facts, photos; read it, not the source
npm run images -- <file>...  # photos into static/images/ at web size (<=3000px, ~600 KB); prints their pixels
npm run verify               # content, check, typecheck, test, build, proof, trace, lint (design rules; each page's
                             # title, description, one h1): lists every failure at once
npm run shots [-- /path]     # the page at 1280 and 390 wide in uploads/<page>-<width>/ (--all: every page); prints which
                             # image to read first and any width where the page scrolls sideways
npm run show                 # each page whole, one image per width, sent to the chat (what shots took; --retake after a change)
npm run system               # design/system.yaml -> styles/theme.css, DESIGN.md, src/fonts.ts; after any design change
npm test                     # the tests in src/ (they arrive with the skills' code), test/ and the tropes skill
npm run audit                # the crawler against dev: broken links, headings, alt text, titles, images over 1.5 MB
tt-crawl check http://localhost:3000  # every page of the crawled old site answers here (200 or 301); the sitemap lists them
node scripts/forms.mjs list  # the project's forms and what came in; show, save, submissions: --help
npm run db:setup             # the forms, booking, payments and customers tables (dev and deploy run it)
npm run deploy               # production, only when the owner asks (the website skill's checklist first)
```

Each one with options takes `--help`. Before showing work: `npm run verify`,
`npm run shots`, then `npm run show`. For a small edit, fix it at its
source (the note, the brief or the page), then run the same three for that
page.

## Where things are

- `brand/` the brand as notes (`BRAND.md`), and `public/` the facts as notes
  with typed frontmatter (`FACTS.md`); the `brand` skill writes both. A fact
  lives in a note, once; `npm run content` compiles the notes for the pages.
- `design/system.yaml` the design system as one record; `npm run system`
  compiles it. Never edit `styles/theme.css`, `DESIGN.md` or `src/fonts.ts`
  by hand. Read `DESIGN.md` before designing.
- `src/site.ts` the tagline, logo, nav and real domain (the name and
  contact details come from `public/business.md`);
  `src/pages/*.tsx` the pages, listed in `src/pages/index.ts`.
- `src/business.tsx` mounts the forms, `/book`, Stripe's webhook and the
  private `/admin` (Submissions, Schedule, Services, Team), all on the
  project's database; without one, the forms and `/book` answer 404 and
  `/admin` says so. To change services, people, hours or time off for the
  owner, call the writes in `src/booking/hours.ts` (`createType`,
  `saveType`, `setHosts`, `createPerson`, `savePerson`, `addWindow`,
  `addTimeOff`) from a script; they return field errors.
  `src/{data,admin,forms,booking,payments,customers}` came from those
  skills and is this app's code to change.
- `site-map.md` the page plan; `raw/` a crawled site; `static/` files served
  as they are.

## The loop

- The `web` service runs `npm run dev`, so an edit is in dev on refresh;
  if it is not running, re-run `bash ~/app/.taskandtool/setup.sh`.
- Commit at milestones, never a credential (.gitignore keeps the build
  out). Pushing is the owner's call.

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
