---
description: "Build and run this business website: the Hono app in this repo, its pages, brand tokens, components, the dev loop on the machine, checks, and how to add pages, images, and forms. Use for any change to the site and when the owner says 'build my website', 'add a page', 'change the look'."
---

# Website

This app is a website on Hono: server-rendered JSX, Tailwind v4, no client
framework. It serves from this machine while it is being built and, when
published (the `ship` skill), every page is pre-rendered to HTML and shipped
to the edge with a small Worker behind it for anything dynamic. The owner's
CLAUDE.md in the app root says where things are; `DESIGN.md` and `brand/`
say how it should look and sound.

Before a substantial new page or a redesign, work through the `design` and
`writing` skills first: the brief, the voice card (`brand/voice.md`), three
directions, the content inventory. Build from real words and real material.
When the owner wants a copy of a site they point at, the `clone-site` skill
comes first. This skill is the mechanics.

## The loop on this machine

`npm run dev` is what the `web` service runs: Tailwind rebuilds
`public/site.css` and the server restarts on every change, so an edit shows
on the next refresh of the machine's URL. Check it is running before
starting work:

```bash
sprite-env services get web        # definition, status, restart_count
curl -s -o /dev/null -w '%{http_code}\n' localhost:3000/
```

If the service does not exist (the setup could not register it, or the app
was created another way), register it once; `/serving` has the mechanics:

```bash
sprite-env services create web \
  --cmd bash --args "-c,set -a; . /home/sprite/.env; set +a; exec npm run dev" \
  --dir /home/sprite/app --env "PORT=3000" --http-port 3000
```

Setup left the dependencies installed and the CSS built. If either is
missing (a fresh clone, a replaced machine), re-run it; it is idempotent:

```bash
bash ~/app/.claude/skills/website/setup.sh
```

Before showing work: `npm run check` (the brand notes present, DESIGN.md and
the theme in step, contrast of the brand pairs, page paths, the edge rule, and the refuse list: no hex or
default Tailwind colours, gradients, blur, tracking or leading overrides,
weights above 700, `animate-*`) and `npm run typecheck`. Then read the
page yourself at 390px and 1280px (the `design` skill's review gate).

## The shape

```
brand/            the brand as markdown notes (BRAND.md): positioning · voice · audience · visual-identity · do-and-dont · logo/
styles/theme.css  the design tokens: the brand's colours and fonts, their roles, type scale, edges, rhythm
DESIGN.md         the identity block, the rules the tokens serve, and "Updating from the brand"; read before designing
src/site.ts       the site's facts (name, tagline, contact, social, logo, fonts URL), the nav, the Page type
src/layout.tsx    the document: head (title, description, fonts), header, footer, render()
src/components/   Section, Eyebrow, Button; add shared pieces here
src/pages/*.tsx   one module per page: `page` (path, title, description) + `Body`
src/pages/index.ts  the list of pages, in nav order — a page exists once it is listed here
src/app.tsx       the Hono app: a GET per listed page, dynamic routes, the 404
src/db.ts         sql(env) on DATABASE_URL (Neon HTTP driver), only when the app has a database
src/server.ts     the machine entry (Node); src/worker.ts the edge entry
styles/input.css  the stylesheet source → public/site.css
public/           static files, served as-is: images, favicon, robots.txt
scripts/          dev.mjs · build.ts · check.mjs · deploy.py
```

## Adding a page

1. Create `src/pages/<name>.tsx` with the same shape as `home.tsx`: export
   `{ page, Body }`, where `page.path` starts with `/` and `page.description`
   is a real sentence about the page.
2. List it in `src/pages/index.ts`. That makes it a route here and a
   pre-rendered `dist/<name>.html` at publish, served at `/<name>`.
3. Put it in the header nav through `site.nav` in `src/site.ts` when it
   belongs there (at most four links; more go in a menu).
4. Build the page from `Section`, the type classes, and the tokens. The
   Tailwind default palette, shadows, radii, blurs, and animations are
   switched off in the theme, so only the site's tokens exist as classes;
   `npm run check` refuses the rest (`DESIGN.md`: Do's and Don'ts).

Nested paths work the same way: `/services/roofing` becomes
`dist/services/roofing.html`.

## The brand, the theme, and the site's facts

`brand/` is the brand as markdown notes (`BRAND.md`): positioning, voice,
audience, visual identity, do and don't, and `logo/`. The site never reads
them; you do. Setting the site from them is a fixed procedure, "Updating
from the brand" in `DESIGN.md`: colours and fonts into the brand block of
`styles/theme.css` and roles assigned (accent, night, inks; `npm run check`
measures contrast and fails a bad pair), the facts into `src/site.ts`
(name, tagline, contact, social, logo, fonts URL), then `DESIGN.md`'s
palette, type, and Identity block, then the pages. Do it on the first
real build and whenever the notes change, and say what changed.

Where the notes come from, in order of trust: the owner in chat; a Company
Brain in this project, whose `brain/brand` folder the owner mirrors onto
this app's `brand` folder (Settings → Mirrored folders, target path exactly
`brand`; `project_apps` in the bridge lists the siblings) so the brain owns
the notes and `brand/_mirror.md` marks them read-only here; a captured site
(`clone-site`) for a business that has one. Without a brain, fill the
starter notes yourself and keep them current.

Theme values that are not brand (the type scale, radii, rhythm, the
grounds) are yours: change them in `styles/theme.css` with the matching
row in `DESIGN.md`. Self-hosted fonts go in `public/fonts/` with
`@font-face` in `styles/input.css`. The dev service rebuilds the CSS on
every change; on a one-off run `npm run css`.

## Images and media

- Put images in `public/images/`, sized for the web (a hero image under
  300 KB; resize and convert with ffmpeg or Python's Pillow, whichever the
  machine has). Real `alt` text always.
- Video: a few MB, muted h264 mp4 plus webm, compressed here with ffmpeg;
  long-form video embeds from the owner's platform. Keep files over 100 MB
  out of git (`.gitignore`).
- Pre-rendered pages and everything in `public/` are served from the edge
  as static files after publishing; nothing is served live off this machine
  then.

## Interactivity, forms, and data

- Small client-side state (a menu, a tab, a toggle): a few lines of plain
  JavaScript in `public/js/`, or Alpine.js from a CDN `<script>` in the
  layout. Server round-trips (a filter, a search) can use htmx the same way.
  No client framework unless a view genuinely needs one.
- A form that stores submissions needs the project's database:
  `src/db.ts` gives `sql(c.env)` on `DATABASE_URL`. `forms.md` beside this
  file is the contact-form recipe (a `leads` table, a POST route, a
  honeypot, the thank-you page). If the app has no database, the owner
  adds managed Postgres in the app's Settings; `request_capability(
  "postgres", why)` from `tools/taskandtool.py` asks them.
- Dynamic routes go in `src/app.tsx` below the page loop. They must stay
  edge-safe: web-standard `Request`/`Response`, `fetch`, Web Crypto, the
  Neon HTTP driver. No Node built-ins, no filesystem, no SQLite, nothing
  kept between requests. `npm run check` flags Node imports.
- Sending email from a form: on this machine, `send_email` from
  `tools/taskandtool.py`; at the edge, a route that writes the lead to the
  database is enough, and a scheduled job (`/schedule-job`) or the CRM
  picks it up. Say which the site does.

## Git

The app is the owner's repository. Commit at milestones with plain
messages; never commit `dist/`, `build/`, `node_modules/`, `public/site.css`,
or any credential. Pushing to GitHub is the owner's call (CLAUDE.md: Git
etiquette).

## Off the platform

This site runs anywhere with Node 20: `npm install`, `npm run dev`. The
same repo deploys to the owner's own Cloudflare account with plain
`npx wrangler deploy` after `npm run build` (`wrangler.jsonc`). Nothing in
it depends on Task & Tool except `scripts/deploy.py`, which falls back to
wrangler off the platform.
