# This app: a website on Hono

A business website. It runs in **dev** on this machine while it is being
built, and in **production** on Cloudflare once deployed: pre-rendered to
HTML plus a small Worker. This
repository *is* the app: the site at the root, the skills that know how to
work on it in `.claude/skills/`, and `.taskandtool/setup.sh` for what the
machine needs (dependencies, the site reader, the `web` service). All of it
is the owner's to change.

"Build me a homepage", "build my site" or a link to the business: start
with the `new-site` skill.

The skills: `new-site` (a homepage first, then the whole site), `website`
(the mechanics: run, change, deploy), `pages` (the page plan and a brief per
page), `design` and `writing` (the taste bar), `brand` (the brand and fact
notes), `migrate-site` and `launch-check` (taking over an existing site and
keeping it audited), and the business skills `forms`, `admin`, `booking`
and `reports` on `data` (forms, the private `/admin`, a booking page,
reports; what they store is in the project's database, which the project's
other apps read too). The platform's
`deploy` skill says what production is. Read the one that fits the ask
rather than working from memory.

## Commands

The work is in these scripts; run them rather than doing the same by hand.
Each prints what it did and what to read next.

```bash
npm run from-site -- <url>   # a first homepage's start, ~20s: reads their homepage, gallery and services page;
                             # writes the business note, the logo, their photos at web size into static/images/,
                             # design tokens from their colours and fonts; prints what to read next
npm run parts                # what a page is built from: components and props, the classes, the page shape,
                             # the facts the notes hold, the photos and their sizes
npm run verify               # check, typecheck, build and lint in one call; stops at the first failure
npm run show [-- /path]      # whole-page screenshots at desktop and phone width, sent to the chat
npm run shots [-- /path]     # the same screenshots without sending them (uploads/<page>-<width>/01.png first)
npm run system               # design/system.yaml -> styles/theme.css + DESIGN.md, after any design change
npm run audit                # the crawler against dev: links, headings, alt text, titles
npm run deploy               # production, only when the owner asks (the website skill's checklist first)
```

Before showing work: `npm run verify`, look at the page with `npm run shots`,
then `npm run show`.

## Where things are

- `brand/` is the brand as markdown notes (`BRAND.md`): positioning, voice,
  audience, visual identity, do and don't, and `logo/`. The site never
  reads them at runtime; you do, to set `design/system.yaml` and
  `src/site.ts` from them ("What the AI sets from them" in `BRAND.md`).
  The `brand` skill writes them, and the facts in `public/`, from whatever
  the owner gives you: a crawl, a chat, a document, a social profile.
- `design/system.yaml` is the website's design system as one record: the
  brand's colours and fonts by role, the type scale, edges, rhythm, the
  rules with their reasons, and how each kind of content is laid out.
  `npm run system` compiles it into `styles/theme.css` (the classes) and
  `DESIGN.md` (the readable contract, with the site's Identity block); never
  edit those two by hand. Read `DESIGN.md` before designing. The record in
  the box is a neutral starting point, not a style.
- `public/` is the facts as notes with typed frontmatter (`FACTS.md`);
  `posts/` and `legal/` are the collections. `npm run content` turns them
  into `src/generated/content.json`, which the pages import; the build
  generates the JSON-LD, sitemap, robots, canonical tags, and validates
  `src/redirects.ts` from them. A fact lives in a note, once.
- `src/site.ts` is the site's identity: name, tagline, fonts to load,
  logo, nav, the real domain (`url`), tracking IDs; contact details come
  from the business note.
- `site-map.md` is the page plan and, for a migration, the ledger
  (`migrate-site` skill). `raw/` is a crawled site when there is one.
- `src/pages/*.tsx` are the pages; `src/pages/index.ts` lists them.
  `src/layout.tsx` is the document (head, header, footer).
  `src/components/index.tsx` holds the shared pieces. `src/app.tsx` is the
  Hono app. The database, when the app has one, is reached through the
  `data` skill's handle, copied into `src/data/`.
- `static/` is served as static files; `styles/input.css` is the stylesheet
  source, built to `static/site.css`.

## The loop

- `npm run dev` is what the `web` service runs: Tailwind rebuilds the CSS
  and the server restarts on every change, so an edit is in dev on refresh.
  If the service is not running, re-run `bash ~/app/.taskandtool/setup.sh`
  (idempotent) or register it by hand as the `website` skill says.
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
