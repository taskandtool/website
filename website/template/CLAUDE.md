# This app: a website on Hono

A business website that serves from this machine while it is being built
and, when published, is pre-rendered to HTML and shipped to the edge. The
skills that know how to work on it are in `.claude/skills/`: `website`
(build and run), `design` and `writing` (the taste bar), `clone-site`
(capture a site to rebuild it), `ship` (publish to the edge).

## Where things are

- `brand/` is the brand as markdown notes (`BRAND.md`): positioning, voice,
  audience, visual identity, do and don't, and `logo/`. The site never
  reads them at runtime; you do, to set `styles/theme.css`, `src/site.ts`,
  and `DESIGN.md` from them ("Updating from the brand" in `DESIGN.md`).
  When `brand/_mirror.md` exists the folder is a read-only mirror from the
  project's Company Brain: brand facts change there, then get re-applied.
- `styles/theme.css` is the website's design system as tokens: the brand's
  colours and fonts, the roles they play, the type scale, edges, rhythm.
  `DESIGN.md` explains every token, the composition rules, the refuse list,
  and holds the site's Identity block. Read it before designing.
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
  Hono app; `src/db.ts` is the database client (only when the app has one).
- `static/` is served as static files; `styles/input.css` is the stylesheet
  source, built to `static/site.css`.
- `scripts/` holds the build, the dev loop, the checks, and the deploy hook.

## The loop

- `npm run dev` is what the `web` service runs: Tailwind rebuilds the CSS
  and the server restarts on every change, so an edit is live on refresh.
  If the service is not running, the `website` skill says how to register
  it (`/serving` has the mechanics).
- `npm run check` before showing work. `npm run build` to produce `dist/`
  and `build/worker.mjs`. `npm run deploy` publishes (the `ship` skill).
- Commit at milestones. Never commit `dist/`, `build/`, `node_modules/`, or
  any credential.

## Rules

- Edge-safe code only in `src/` (no Node built-ins, no filesystem, no
  per-request state); `src/server.ts` is the single exception. Files and
  heavy work happen at build time, on this machine.
- Colours and fonts live in `styles/theme.css` with a row in `DESIGN.md`,
  set from the brand notes. Markup never carries a hex value or a Tailwind
  default colour; `npm run check` refuses both.
- Real content only. No invented customers, quotes, numbers, awards, or
  prices; reserve an honest slot when the material does not exist yet.
- Publishing to the web is the owner's action in the Task & Tool
  dashboard. Deploying to the edge does not make a private site public.
