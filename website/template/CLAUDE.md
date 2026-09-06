# This app: a website on Hono

A business website that serves from this machine while it is being built
and, when published, is pre-rendered to HTML and shipped to the edge. The
skills that know how to work on it are in `.claude/skills/`: `website`
(build and run), `design` and `writing` (the taste bar), `clone-site`
(capture a site to rebuild it), `ship` (publish to the edge).

## Where things are

- `brand/` is the brand as a portable folder (`BRAND.md` is the contract):
  `brand.json` (facts, colours, fonts, logo), `voice.md`, `logo/`. When
  `brand/_mirror.md` exists the folder is a read-only mirror from the
  project's Company Brain: change brand facts there, never here.
- `styles/theme.css` is the website's design system as tokens: roles mapped
  onto the brand colours, the type scale, edges, rhythm. `DESIGN.md`
  explains every token, the composition rules, the refuse list, and holds
  the site's Identity block. Read it before designing.
- `src/pages/*.tsx` are the pages; `src/pages/index.ts` lists them.
  `src/layout.tsx` is the document (head, header, footer).
  `src/components/index.tsx` holds the shared pieces. `src/app.tsx` is the
  Hono app; `src/db.ts` is the database client (only when the app has one).
- `public/` is served as static files; `styles/input.css` is the stylesheet
  source, built to `public/site.css`.
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
- Colours and fonts come from `brand/brand.json`; what they are for is
  `styles/theme.css` with a row in `DESIGN.md`. Markup never carries a hex
  value or a Tailwind default colour; `npm run check` refuses both.
- Real content only. No invented customers, quotes, numbers, awards, or
  prices; reserve an honest slot when the material does not exist yet.
- Publishing to the web is the owner's action in the Task & Tool
  dashboard. Deploying to the edge does not make a private site public.
